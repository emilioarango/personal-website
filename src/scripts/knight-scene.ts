import {
  AmbientLight,
  Box3,
  BufferGeometry,
  Color,
  DirectionalLight,
  EdgesGeometry,
  Float32BufferAttribute,
  Group,
  HemisphereLight,
  LineBasicMaterial,
  LineSegments,
  MathUtils,
  Mesh,
  Object3D,
  MeshBasicMaterial,
  MeshPhysicalMaterial,
  PCFSoftShadowMap,
  PerspectiveCamera,
  PlaneGeometry,
  PMREMGenerator,
  PointLight,
  Points,
  PointsMaterial,
  Scene,
  ShadowMaterial,
  Vector2,
  Vector3,
  WebGLRenderer,
} from "three";
import { RoomEnvironment } from "three/examples/jsm/environments/RoomEnvironment.js";
import { buildKnight } from "./knight-model";

export type KnightSceneHandles = {
  destroy: () => void;
  reset: () => void;
};

type Options = {
  canvas: HTMLCanvasElement;
  reducedMotion: boolean;
  onReady?: () => void;
  onError?: (error: unknown) => void;
};

/** Continuous yaw while idle (~one full turn every 35s). */
const IDLE_SPEED = 0.18;
/** With Reduce Motion on, keep a gentle turn (~one per 2 min) but no float. */
const IDLE_SPEED_REDUCED = 0.05;
/** Gentle vertical float, in model-height units (the knight is 1 tall). */
const BOB_AMPLITUDE = 0.022;
const BOB_SPEED = 0.077;
const REST_AZIMUTH = 0.55;
const REST_POLAR = 0.1;
const IDLE_RESUME_MS = 900;
const DRAG_SENSITIVITY = 0.0055;
const KEY_STEP = 0.12;
const DAMPING = 0.086;
const MAX_POLAR = Math.PI * 0.2;
const MIN_POLAR = -Math.PI * 0.07;
const TOUCH_SLOP = 10;

export async function createKnightScene(
  options: Options,
): Promise<KnightSceneHandles | null> {
  const { canvas, reducedMotion, onReady, onError } = options;

  if (!window.WebGLRenderingContext) {
    onError?.(new Error("WebGL unavailable"));
    return null;
  }

  let renderer: WebGLRenderer;
  try {
    renderer = new WebGLRenderer({
      canvas,
      antialias: true,
      alpha: true,
      powerPreference: "high-performance",
    });
  } catch (error) {
    onError?.(error);
    return null;
  }

  const scene = new Scene();
  scene.background = null;

  // Lighter-weight scene on phones and coarse pointers: no shadows, fewer motes.
  const lowPower =
    window.innerWidth < 720 || window.matchMedia("(pointer: coarse)").matches;

  const camera = new PerspectiveCamera(42, 1, 0.05, 40);
  const root = new Group();
  scene.add(root);

  // Procedural studio environment so highlights read on the near-black body.
  const pmrem = new PMREMGenerator(renderer);
  const envScene = new RoomEnvironment();
  const envTexture = pmrem.fromScene(envScene, 0.04).texture;
  scene.environment = envTexture;
  scene.environmentIntensity = 0.45;
  envScene.dispose();
  pmrem.dispose();

  renderer.shadowMap.enabled = !lowPower;
  renderer.shadowMap.type = PCFSoftShadowMap;

  // Pyramid-style rig in neutral silver-white: cool key, soft fill, pulsing rim.
  const ambient = new AmbientLight(0xffffff, 0.12);
  const hemi = new HemisphereLight(0xe6e8ec, 0x08080a, 0.45);
  const key = new DirectionalLight(0xeef2ff, 1.9);
  key.position.set(3.2, 4.4, 3.0);
  key.castShadow = !lowPower;
  key.shadow.mapSize.set(1024, 1024);
  key.shadow.camera.near = 0.5;
  key.shadow.camera.far = 14;
  key.shadow.camera.left = key.shadow.camera.bottom = -2.2;
  key.shadow.camera.right = key.shadow.camera.top = 2.2;
  key.shadow.bias = -0.0004;
  const fill = new DirectionalLight(0xaeb6c8, 0.55);
  fill.position.set(-3.0, 1.6, 1.4);
  const rim = new PointLight(0xffffff, 1.4, 8, 2);
  rim.position.set(0, -0.7, -1.6);
  const crown = new PointLight(0xdfe6ff, 1.6, 6, 2);
  crown.position.set(0, 1.5, 1.2);
  scene.add(ambient, hemi, key, fill, rim, crown);
  scene.add(key.target);

  // Shadow catcher + faint baseline under the knight (set to the model's base).
  const ground = new Mesh(
    new PlaneGeometry(14, 14),
    new ShadowMaterial({ opacity: 0.55 }),
  );
  ground.rotation.x = -Math.PI / 2;
  ground.receiveShadow = true;
  const baseline = new Mesh(
    new PlaneGeometry(2.6, 0.004),
    new MeshBasicMaterial({
      color: 0xeceff3,
      opacity: 0.18,
      transparent: true,
      depthWrite: false,
    }),
  );
  baseline.rotation.x = -Math.PI / 2;
  scene.add(ground, baseline);

  // Drifting motes, as on the pyramid, kept faint and monochrome.
  const moteCount = lowPower ? 36 : 90;
  const motePositions = new Float32Array(moteCount * 3);
  for (let i = 0; i < moteCount; i++) {
    motePositions[i * 3] = (Math.random() - 0.5) * 4.4;
    motePositions[i * 3 + 1] = (Math.random() - 0.5) * 2.2;
    motePositions[i * 3 + 2] = (Math.random() - 0.5) * 4.4;
  }
  const moteGeometry = new BufferGeometry();
  moteGeometry.setAttribute(
    "position",
    new Float32BufferAttribute(motePositions, 3),
  );
  const moteMaterial = new PointsMaterial({
    color: 0xeceff3,
    size: 0.011,
    opacity: 0.4,
    transparent: true,
    depthWrite: false,
  });
  const motes = new Points(moteGeometry, moteMaterial);
  scene.add(motes);

  const pointer = new Vector2();
  const velocity = new Vector2();
  let polar = REST_POLAR;
  let azimuth = REST_AZIMUTH;
  const targetPolar = { current: polar };
  const targetAzimuth = { current: azimuth };
  let dragging = false;
  let interacting = false;
  let idlePaused = false;
  let idleResumeTimer = 0;
  let frame = 0;
  let visible = true;
  let pageVisible = document.visibilityState === "visible";
  let disposed = false;
  let touchAxis: "none" | "rotate" | "scroll" = "none";
  let touchStartX = 0;
  let touchStartY = 0;
  let lastTime = performance.now();
  let clock = 0;

  // Faceted obsidian: flat-shaded planes with a clearcoat, still monochrome.
  const bodyMaterial = new MeshPhysicalMaterial({
    color: new Color("#0b0b0e"),
    metalness: 0.35,
    roughness: 0.4,
    clearcoat: 0.7,
    clearcoatRoughness: 0.32,
    flatShading: true,
  });

  // Crisp silver-white contour plus a wider, fainter pass for a soft glow.
  const edgeMaterial = new LineBasicMaterial({
    color: new Color("#e4e8ef"),
    transparent: true,
    opacity: 0.65,
    depthWrite: false,
  });
  const glowMaterial = new LineBasicMaterial({
    color: new Color("#cfd6e4"),
    transparent: true,
    opacity: 0.12,
    depthWrite: false,
  });

  // Horizontal sweep radius of the (height-normalised) model as it yaws.
  let radiusXZ = 0.35;

  function fitModel(object: Group) {
    const box = new Box3().setFromObject(object);
    const size = box.getSize(new Vector3());
    // Normalize by height so Staunton proportions stay predictable in frame.
    object.scale.setScalar(1 / (size.y || 1));

    // Pivot at the geometric center so yaw/pitch keep the silhouette in-sphere.
    // (Rotating around the base was swinging the head out of frame.)
    box.setFromObject(object);
    const center = box.getCenter(new Vector3());
    object.position.sub(center);

    // Seat the ground and baseline just under the base (bob never touches them).
    const baseY = -0.5 - 0.1;
    radiusXZ = Math.hypot(size.x, size.z) / (2 * (size.y || 1));
    ground.position.y = baseY;
    baseline.position.y = baseY + 0.01;
  }

  function frameCamera() {
    const vFov = MathUtils.degToRad(camera.fov);
    const hFov = 2 * Math.atan(Math.tan(vFov / 2) * camera.aspect);
    // The knight is 1 tall. Fill most of the hero height on wide screens, and
    // cap by the yaw sweep width so it never clips on a phone.
    const fillV = camera.aspect > 1 ? 0.74 : 0.62;
    const distV = 0.5 / Math.tan(vFov / 2) / fillV;
    const distH = radiusXZ / Math.tan(hFov / 2) / 0.9;
    const dist = Math.max(distV, distH) + radiusXZ * 0.5;
    // Slightly raised camera, aimed a touch low, like the pyramid.
    camera.position.set(0, dist * 0.14, dist);
    camera.lookAt(0, -0.03, 0);
    camera.near = Math.max(0.05, dist / 100);
    camera.far = dist * 20;
    camera.updateProjectionMatrix();
  }

  const knight = buildKnight();
  const accents = new Set<Object3D>(knight.accents);

  function applyMaterials(object: Group) {
    object.traverse((child) => {
      if (!(child instanceof Mesh) || accents.has(child)) return;
      child.material = bodyMaterial;
      child.castShadow = !lowPower;
      child.receiveShadow = false;

      // Hard creases only: every facet boundary reads as a clean contour.
      const edges = new EdgesGeometry(child.geometry, 20);
      const lines = new LineSegments(edges, edgeMaterial);
      lines.renderOrder = 2;
      const glow = new LineSegments(edges, glowMaterial);
      glow.scale.setScalar(1.006);
      glow.renderOrder = 1;
      child.add(glow, lines);
    });
  }

  function pauseIdle() {
    idlePaused = true;
    window.clearTimeout(idleResumeTimer);
  }

  function scheduleIdleResume() {
    window.clearTimeout(idleResumeTimer);
    idleResumeTimer = window.setTimeout(() => {
      idlePaused = false;
    }, IDLE_RESUME_MS);
  }

  function setSize() {
    // Use the canvas's laid-out box (includes CSS bleed), not the smaller frame.
    const rect = canvas.getBoundingClientRect();
    const width = Math.max(1, Math.floor(rect.width));
    const height = Math.max(1, Math.floor(rect.height));
    const dpr = Math.min(window.devicePixelRatio || 1, width < 720 ? 1.5 : 2);
    renderer.setPixelRatio(dpr);
    renderer.setSize(width, height, false);
    camera.aspect = width / height;
    camera.updateProjectionMatrix();
  }

  function clampTargets() {
    targetPolar.current = MathUtils.clamp(
      targetPolar.current,
      MIN_POLAR,
      MAX_POLAR,
    );
  }

  function applyOrientation() {
    root.rotation.order = "YXZ";
    root.rotation.y = azimuth;
    root.rotation.x = polar;
  }

  function resetOrientation() {
    targetAzimuth.current = REST_AZIMUTH;
    targetPolar.current = REST_POLAR;
    velocity.set(0, 0);
    interacting = false;
    pauseIdle();
    scheduleIdleResume();
  }

  function tick(now: number) {
    if (disposed) return;
    frame = requestAnimationFrame(tick);
    const dt = Math.min(0.05, (now - lastTime) / 1000);
    lastTime = now;

    if (!pageVisible) return;
    clock += dt;

    if (!interacting && !idlePaused) {
      // Always turn on its own, like the pyramid; slower under Reduce Motion.
      azimuth += (reducedMotion ? IDLE_SPEED_REDUCED : IDLE_SPEED) * dt;
      targetAzimuth.current = azimuth;
    } else {
      targetAzimuth.current += velocity.x;
      targetPolar.current += velocity.y;
      clampTargets();
      velocity.multiplyScalar(1 - Math.min(1, DAMPING * (60 * dt)));
      azimuth += (targetAzimuth.current - azimuth) * Math.min(1, 10 * dt);
      polar += (targetPolar.current - polar) * Math.min(1, 10 * dt);
    }

    applyOrientation();
    if (!reducedMotion) {
      root.position.y =
        Math.sin(clock * BOB_SPEED * Math.PI * 2) * BOB_AMPLITUDE;
      motes.rotation.y = clock * 0.04;
      motes.rotation.x = clock * 0.015;
      rim.intensity = 1.1 + Math.sin(clock * 0.72) * 0.5;
    }
    if (visible) renderer.render(scene, camera);
  }

  function onPointerDown(event: PointerEvent) {
    if (event.pointerType === "touch") return;
    if (event.button !== 0) return;
    dragging = true;
    interacting = true;
    pauseIdle();
    canvas.setPointerCapture(event.pointerId);
    pointer.set(event.clientX, event.clientY);
  }

  function onPointerMove(event: PointerEvent) {
    if (event.pointerType === "touch") return;
    if (!dragging) return;
    const dx = event.clientX - pointer.x;
    const dy = event.clientY - pointer.y;
    pointer.set(event.clientX, event.clientY);
    targetAzimuth.current += dx * DRAG_SENSITIVITY;
    targetPolar.current += dy * DRAG_SENSITIVITY;
    clampTargets();
    velocity.set(dx * DRAG_SENSITIVITY * 0.35, dy * DRAG_SENSITIVITY * 0.35);
  }

  function onPointerUp(event: PointerEvent) {
    if (event.pointerType === "touch") return;
    dragging = false;
    interacting = false;
    scheduleIdleResume();
    try {
      canvas.releasePointerCapture(event.pointerId);
    } catch {
      /* already released */
    }
  }

  function onTouchStart(event: TouchEvent) {
    if (event.touches.length !== 1) return;
    const touch = event.touches[0];
    touchAxis = "none";
    touchStartX = touch.clientX;
    touchStartY = touch.clientY;
    pointer.set(touch.clientX, touch.clientY);
  }

  function onTouchMove(event: TouchEvent) {
    if (event.touches.length !== 1) return;
    const touch = event.touches[0];
    const dx = touch.clientX - pointer.x;
    const dy = touch.clientY - pointer.y;
    const totalX = touch.clientX - touchStartX;
    const totalY = touch.clientY - touchStartY;

    if (touchAxis === "none") {
      if (Math.hypot(totalX, totalY) < TOUCH_SLOP) return;
      touchAxis =
        Math.abs(totalX) > Math.abs(totalY) * 1.15 ? "rotate" : "scroll";
      if (touchAxis === "rotate") {
        interacting = true;
        pauseIdle();
      }
    }

    if (touchAxis !== "rotate") return;
    event.preventDefault();
    pointer.set(touch.clientX, touch.clientY);
    // Prefer yaw; damp pitch to reduce scroll-trap feel.
    targetAzimuth.current += dx * DRAG_SENSITIVITY;
    targetPolar.current += dy * DRAG_SENSITIVITY * 0.35;
    clampTargets();
    velocity.set(dx * DRAG_SENSITIVITY * 0.3, dy * DRAG_SENSITIVITY * 0.1);
  }

  function onTouchEnd() {
    const wasRotating = touchAxis === "rotate";
    touchAxis = "none";
    interacting = false;
    if (wasRotating) scheduleIdleResume();
  }

  function onKeyDown(event: KeyboardEvent) {
    const keys = new Set([
      "ArrowLeft",
      "ArrowRight",
      "ArrowUp",
      "ArrowDown",
      "Home",
    ]);
    if (!keys.has(event.key)) return;
    event.preventDefault();
    interacting = true;
    pauseIdle();
    if (event.key === "ArrowLeft") targetAzimuth.current -= KEY_STEP;
    if (event.key === "ArrowRight") targetAzimuth.current += KEY_STEP;
    if (event.key === "ArrowUp") targetPolar.current -= KEY_STEP * 0.7;
    if (event.key === "ArrowDown") targetPolar.current += KEY_STEP * 0.7;
    if (event.key === "Home") resetOrientation();
    clampTargets();
  }

  function onKeyUp(event: KeyboardEvent) {
    if (
      event.key === "ArrowLeft" ||
      event.key === "ArrowRight" ||
      event.key === "ArrowUp" ||
      event.key === "ArrowDown"
    ) {
      interacting = false;
      scheduleIdleResume();
    }
  }

  const resizeObserver = new ResizeObserver(() => {
    setSize();
    if (root.children.length > 0) frameCamera();
  });
  if (canvas.parentElement) resizeObserver.observe(canvas.parentElement);

  const intersectionObserver = new IntersectionObserver(
    (entries) => {
      visible = entries.some((entry) => entry.isIntersecting);
    },
    { threshold: 0.01 },
  );
  // Observe the frame, not the canvas — canvas starts `hidden` and may never
  // report intersection until after idle would have been skipped.
  const observeTarget = canvas.parentElement ?? canvas;
  intersectionObserver.observe(observeTarget);
  visible = true;

  const onVisibility = () => {
    pageVisible = document.visibilityState === "visible";
  };

  canvas.addEventListener("pointerdown", onPointerDown);
  window.addEventListener("pointermove", onPointerMove);
  window.addEventListener("pointerup", onPointerUp);
  canvas.addEventListener("touchstart", onTouchStart, { passive: true });
  canvas.addEventListener("touchmove", onTouchMove, { passive: false });
  canvas.addEventListener("touchend", onTouchEnd, { passive: true });
  canvas.addEventListener("touchcancel", onTouchEnd, { passive: true });
  canvas.addEventListener("keydown", onKeyDown);
  canvas.addEventListener("keyup", onKeyUp);
  document.addEventListener("visibilitychange", onVisibility);

  setSize();
  applyOrientation();
  frame = requestAnimationFrame(tick);

  try {
    const model = knight.group;
    applyMaterials(model);
    fitModel(model);
    root.add(model);
    // Unhide first so layout/bleed metrics are real, then frame the camera.
    onReady?.();
    setSize();
    frameCamera();
    requestAnimationFrame(() => {
      setSize();
      frameCamera();
    });
  } catch (error) {
    onError?.(error);
    destroy();
    return null;
  }

  function destroy() {
    if (disposed) return;
    disposed = true;
    window.clearTimeout(idleResumeTimer);
    cancelAnimationFrame(frame);
    resizeObserver.disconnect();
    intersectionObserver.disconnect();
    canvas.removeEventListener("pointerdown", onPointerDown);
    window.removeEventListener("pointermove", onPointerMove);
    window.removeEventListener("pointerup", onPointerUp);
    canvas.removeEventListener("touchstart", onTouchStart);
    canvas.removeEventListener("touchmove", onTouchMove);
    canvas.removeEventListener("touchend", onTouchEnd);
    canvas.removeEventListener("touchcancel", onTouchEnd);
    canvas.removeEventListener("keydown", onKeyDown);
    canvas.removeEventListener("keyup", onKeyUp);
    document.removeEventListener("visibilitychange", onVisibility);
    bodyMaterial.dispose();
    edgeMaterial.dispose();
    glowMaterial.dispose();
    moteGeometry.dispose();
    moteMaterial.dispose();
    ground.geometry.dispose();
    (ground.material as ShadowMaterial).dispose();
    baseline.geometry.dispose();
    (baseline.material as MeshBasicMaterial).dispose();
    envTexture.dispose();
    knight.dispose();
    root.traverse((child) => {
      if (child instanceof Mesh) {
        child.geometry.dispose();
      }
      if (child instanceof LineSegments) {
        child.geometry.dispose();
      }
    });
    renderer.dispose();
  }

  return {
    destroy,
    reset: resetOrientation,
  };
}
