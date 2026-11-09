import {
  AmbientLight,
  Box3,
  Color,
  DirectionalLight,
  EdgesGeometry,
  Group,
  HemisphereLight,
  LineBasicMaterial,
  LineSegments,
  MathUtils,
  Mesh,
  MeshStandardMaterial,
  PerspectiveCamera,
  Scene,
  Sphere,
  Vector2,
  Vector3,
  WebGLRenderer,
} from "three";
import { GLTFLoader } from "three/examples/jsm/loaders/GLTFLoader.js";

export type KnightSceneHandles = {
  destroy: () => void;
  reset: () => void;
};

type Options = {
  canvas: HTMLCanvasElement;
  modelUrl: string;
  reducedMotion: boolean;
  onReady?: () => void;
  onError?: (error: unknown) => void;
};

/** Slow continuous yaw while idle (~one full turn every ~14s). */
const IDLE_SPEED = 0.45;
const IDLE_RESUME_MS = 900;
const DRAG_SENSITIVITY = 0.0055;
const KEY_STEP = 0.12;
const DAMPING = 0.086;
const MAX_POLAR = Math.PI * 0.22;
const MIN_POLAR = -Math.PI * 0.08;
const TOUCH_SLOP = 10;

export async function createKnightScene(
  options: Options,
): Promise<KnightSceneHandles | null> {
  const { canvas, modelUrl, reducedMotion, onReady, onError } = options;

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

  const camera = new PerspectiveCamera(35, 1, 0.05, 40);
  const root = new Group();
  scene.add(root);

  const ambient = new AmbientLight(0xffffff, 0.18);
  const hemi = new HemisphereLight(0xe6e8ec, 0x08080a, 0.62);
  const key = new DirectionalLight(0xffffff, 1.55);
  key.position.set(2.6, 3.4, 2.0);
  const fill = new DirectionalLight(0xc4c8d0, 0.42);
  fill.position.set(-2.4, 1.4, 1.6);
  const rim = new DirectionalLight(0xf5f6f8, 1.05);
  rim.position.set(-1.4, 2.6, -2.8);
  const kick = new DirectionalLight(0xd8dbe0, 0.28);
  kick.position.set(0.2, -0.4, 2.2);
  scene.add(ambient, hemi, key, fill, rim, kick);

  const pointer = new Vector2();
  const velocity = new Vector2();
  let polar = 0.06;
  let azimuth = 0.55;
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

  const bodyMaterial = new MeshStandardMaterial({
    color: new Color("#09090b"),
    metalness: 0.12,
    roughness: 0.78,
    envMapIntensity: 0.25,
  });

  const edgeMaterial = new LineBasicMaterial({
    color: new Color("#eceff3"),
    transparent: true,
    opacity: 0.22,
    depthWrite: false,
  });

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
  }

  function frameCamera() {
    root.updateWorldMatrix(true, true);
    const sphere = new Box3()
      .setFromObject(root)
      .getBoundingSphere(new Sphere());
    const fov = MathUtils.degToRad(camera.fov);
    // Sphere is rotation-invariant around this pivot; generous margin avoids crops.
    const dist = (sphere.radius * 2.05) / Math.sin(fov / 2);
    camera.position.set(dist * 0.26, sphere.center.y, dist);
    camera.lookAt(sphere.center.x, sphere.center.y, sphere.center.z);
    camera.near = Math.max(0.05, dist / 100);
    camera.far = dist * 20;
    camera.updateProjectionMatrix();
  }

  function applyMaterials(object: Group) {
    object.traverse((child) => {
      if (!(child instanceof Mesh)) return;
      child.material = bodyMaterial;
      child.castShadow = false;
      child.receiveShadow = false;

      // Selective contours for Staunton mane/groove detail without a dense mesh.
      const edges = new EdgesGeometry(child.geometry, 24);
      const lines = new LineSegments(edges, edgeMaterial);
      lines.renderOrder = 2;
      child.add(lines);
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
    targetAzimuth.current = 0.55;
    targetPolar.current = 0.06;
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

    if (!interacting && !reducedMotion && !idlePaused) {
      // Drive yaw directly so idle spin is obvious from first paint.
      azimuth += IDLE_SPEED * dt;
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
    const loader = new GLTFLoader();
    const gltf = await loader.loadAsync(modelUrl);
    if (disposed) return null;
    const model = gltf.scene;
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
