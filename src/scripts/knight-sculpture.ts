import {
  BufferGeometry,
  ConeGeometry,
  DoubleSide,
  ExtrudeGeometry,
  Group,
  LatheGeometry,
  Mesh,
  Object3D,
  Raycaster,
  Shape,
  SphereGeometry,
  Vector2,
  Vector3,
} from "three";

/**
 * Turns the faceted horse bust (public/models/knight-bust.glb) into a
 * geometric knight sculpture: a tapered stem on a two-tier disc base, pointed
 * ears, a crest of curved flame-like mane fins that flow back and down the
 * neck, and bead eyes. Everything here is in the bust's own units (about 0.1
 * tall, Y up, muzzle facing -Z, mane along +Z).
 */

/** Two stacked discs with soft chamfers, plus a broad stem rising into the neck. */
const BASE_PROFILE: Array<[number, number]> = [
  [0, 0],
  [0.0322, 0],
  [0.0328, 0.0012],
  [0.0328, 0.0072],
  [0.032, 0.0084],
  [0.0276, 0.0084],
  [0.0276, 0.0142],
  [0.0266, 0.0154],
  [0.0188, 0.0154],
  [0.0158, 0.022],
  [0.0136, 0.03],
  [0.0124, 0.038],
  [0, 0.038],
];

/**
 * One mane fin: a curved flame blade (length along +X) whose tip curls up,
 * like the carved locks of a geometric horse sculpture.
 */
function finShape(length: number, width: number): Shape {
  const s = new Shape();
  s.moveTo(0, -width * 0.5);
  s.lineTo(length * 0.34, -width * 0.66);
  s.lineTo(length * 0.68, -width * 0.48);
  s.lineTo(length, width * 0.38); // tip curls upward
  s.lineTo(length * 0.62, width * 0.22);
  s.lineTo(length * 0.28, width * 0.5);
  s.lineTo(0, width * 0.5);
  s.closePath();
  return s;
}

const ray = new Raycaster();

/** Distance along a ray to the bust surface, or null when it misses. */
function hit(
  bust: Mesh,
  origin: [number, number, number],
  dir: [number, number, number],
): number | null {
  ray.set(new Vector3(...origin), new Vector3(...dir));
  const hits = ray.intersectObject(bust, false);
  return hits.length ? hits[0].distance : null;
}

/** Back of the neck at height y: cast from behind towards the muzzle. */
function backOfNeck(bust: Mesh, y: number): number | null {
  const d = hit(bust, [0, y, 1], [0, 0, -1]);
  return d === null ? null : 1 - d;
}

/** Front of the neck at height y: cast from in front towards the mane. */
function frontOfNeck(bust: Mesh, y: number): number | null {
  const d = hit(bust, [0, y, -1], [0, 0, 1]);
  return d === null ? null : -1 + d;
}

/** Outer side of the head at (y, z): cast from the side towards the centre. */
function sideOfHead(bust: Mesh, y: number, z: number): number {
  const d = hit(bust, [1, y, z], [-1, 0, 0]);
  return d === null ? 0.008 : 1 - d;
}

export type SculptureParts = {
  /** Meshes that need smooth shading (the turned base). */
  smooth: Mesh[];
  /** Meshes that keep their own material and get no contour (eyes). */
  accents: Object3D[];
  dispose: () => void;
};

export function addSculptureParts(
  bust: Group,
  eyeMaterial: Mesh["material"],
): SculptureParts {
  const geometries: BufferGeometry[] = [];
  const smooth: Mesh[] = [];
  const accents: Object3D[] = [];

  let surface: Mesh | null = null;
  bust.traverse((child) => {
    if (!surface && child instanceof Mesh) surface = child;
  });
  if (!surface) return { smooth, accents, dispose: () => {} };
  const head: Mesh = surface;
  // Raycasts need world matrices and both faces of the (open) bust.
  bust.updateMatrixWorld(true);
  const sided = head.material as { side: number };
  const previousSide = sided.side;
  sided.side = DoubleSide;
  const positions = head.geometry.getAttribute("position").array;

  // Base and stem.
  const baseGeometry = new LatheGeometry(
    BASE_PROFILE.map(([r, y]) => new Vector2(r, y)),
    72,
  );
  geometries.push(baseGeometry);
  const base = new Mesh(baseGeometry);
  bust.add(base);
  smooth.push(base);

  // Top of the head: highest vertex, used to seat the ears and the mane start.
  let topY = 0;
  let topZ = 0;
  for (let i = 0; i < positions.length; i += 3) {
    if (positions[i + 1] > topY) {
      topY = positions[i + 1];
      topZ = positions[i + 2];
    }
  }

  // Pointed, faceted ears: broad at the base, flattened front to back, set
  // into the top of the head and tipped slightly outward and forward.
  const earGeometry = new ConeGeometry(0.0056, 0.0135, 4, 1);
  earGeometry.translate(0, 0.0062, 0);
  geometries.push(earGeometry);
  const earHalf = sideOfHead(head, topY - 0.007, topZ) * 0.7;
  for (const s of [1, -1]) {
    const ear = new Mesh(earGeometry);
    ear.position.set(s * earHalf, topY - 0.0075, topZ + 0.0005);
    ear.rotation.set(-0.3, Math.PI / 4, s * -0.26);
    ear.scale.set(1, 1, 0.48);
    bust.add(ear);
  }

  // Mane: a central crest flanked by two splayed rows. Fins start above the
  // poll sweeping up and back, then flow down the neck, longest at the top.
  const rows = [
    { x: 0, yaw: 0, count: 6, scale: 1, lift: 0 },
    { x: 0.0042, yaw: 0.11, count: 5, scale: 0.86, lift: -0.0045 },
    { x: -0.0042, yaw: -0.11, count: 5, scale: 0.86, lift: -0.0045 },
  ];
  const top = topY - 0.004;
  const bottom = 0.052;
  for (const row of rows) {
    for (let i = 0; i < row.count; i++) {
      const t = i / (row.count - 1); // 0 = poll, 1 = low on the neck
      const y = top - t * (top - bottom) + row.lift;
      const back = backOfNeck(head, y);
      const front = frontOfNeck(head, y);
      if (back === null || front === null) continue;
      // Seat the root inside the neck, but never deep enough to show in front.
      const inset = Math.min(0.006, (back - front) * 0.18);
      const length = (0.032 - 0.012 * t) * row.scale;
      const width = (0.0125 - 0.004 * t) * row.scale;
      const geometry = new ExtrudeGeometry(finShape(length, width), {
        depth: 0.0022,
        bevelEnabled: false,
      });
      geometry.translate(0, 0, -0.0011);
      geometries.push(geometry);
      const fin = new Mesh(geometry);
      fin.rotation.y = -Math.PI / 2; // blade length now points +Z (backwards)
      const pivot = new Object3D();
      pivot.position.set(row.x, y, back - inset);
      // Flow: about +35 degrees at the poll, down to -70 degrees low on the neck.
      pivot.rotation.order = "YXZ";
      pivot.rotation.x = -(0.6 - 1.82 * t);
      pivot.rotation.y = row.yaw;
      pivot.add(fin);
      bust.add(pivot);
    }
  }

  // Glossy bead eyes set into each side of the head.
  const eyeY = topY - 0.0185;
  const eyeZ = topZ - 0.0075;
  const side = sideOfHead(head, eyeY, eyeZ);
  const eyeGeometry = new SphereGeometry(0.0021, 16, 12);
  geometries.push(eyeGeometry);
  for (const s of [1, -1]) {
    const eye = new Mesh(eyeGeometry, eyeMaterial);
    eye.position.set(s * (side - 0.0006), eyeY, eyeZ);
    eye.scale.set(0.7, 0.85, 1.2);
    bust.add(eye);
    accents.push(eye);
  }

  sided.side = previousSide;

  return {
    smooth,
    accents,
    dispose: () => geometries.forEach((g) => g.dispose()),
  };
}
