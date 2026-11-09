import {
  BufferGeometry,
  CubicBezierCurve,
  ExtrudeGeometry,
  Group,
  LatheGeometry,
  Mesh,
  MeshPhysicalMaterial,
  Object3D,
  Shape,
  SphereGeometry,
  Vector2,
} from "three";
import { mergeVertices } from "three/examples/jsm/utils/BufferGeometryUtils.js";

/**
 * A classic Staunton chess knight built from primitives: a smoothly turned
 * base (lathe) and a horse head extruded from a curved silhouette with rounded
 * bevels, plus a smooth mane crest and small polished eyes.
 *
 * Units: roughly 1 tall, head facing +X. The scene normalises size anyway.
 */

type Point = [number, number];

/** Turned base profile as (radius, height), bottom to top: foot, bead, waist, collar. */
const BASE_PROFILE: Point[] = [
  [0, 0],
  [0.296, 0],
  [0.304, 0.008],
  [0.306, 0.02],
  [0.3, 0.032],
  [0.284, 0.04],
  [0.288, 0.05],
  [0.286, 0.062],
  [0.272, 0.07],
  [0.248, 0.076],
  [0.222, 0.088],
  [0.197, 0.108],
  [0.178, 0.135],
  [0.166, 0.168],
  [0.161, 0.2],
  [0.163, 0.226],
  [0.176, 0.24],
  [0.198, 0.25],
  [0.208, 0.26],
  [0.208, 0.272],
  [0.198, 0.282],
  [0.176, 0.29],
  [0.162, 0.3],
  [0.156, 0.312],
  [0.15, 0.32],
  [0, 0.32],
];

/** Back of the neck, shared by the head outline and the mane crest. */
const NECK_BACK = [
  new CubicBezierCurve(
    new Vector2(-0.14, 0.31),
    new Vector2(-0.172, 0.42),
    new Vector2(-0.17, 0.6),
    new Vector2(-0.11, 0.74),
  ),
  new CubicBezierCurve(
    new Vector2(-0.11, 0.74),
    new Vector2(-0.095, 0.78),
    new Vector2(-0.08, 0.81),
    new Vector2(-0.072, 0.84),
  ),
];

/** Classic Staunton profile facing +X: small ear, long face, open jaw. */
function headShape(): Shape {
  const s = new Shape();
  s.moveTo(-0.14, 0.31);
  for (const c of NECK_BACK) {
    s.bezierCurveTo(c.v1.x, c.v1.y, c.v2.x, c.v2.y, c.v3.x, c.v3.y);
  }
  // Ear: a small, softly pointed tip, then down into the forehead.
  s.bezierCurveTo(-0.066, 0.89, -0.05, 0.94, -0.035, 0.955);
  s.bezierCurveTo(-0.02, 0.935, -0.008, 0.89, 0.0, 0.862);
  s.quadraticCurveTo(0.03, 0.875, 0.08, 0.862);
  // Long face: the nose line runs forward and down at about 45 degrees.
  s.bezierCurveTo(0.15, 0.83, 0.25, 0.73, 0.32, 0.65);
  // Rounded muzzle, small mouth notch, chin.
  s.bezierCurveTo(0.36, 0.61, 0.365, 0.555, 0.33, 0.537);
  s.quadraticCurveTo(0.305, 0.53, 0.295, 0.548);
  s.quadraticCurveTo(0.285, 0.52, 0.25, 0.515);
  // Lower jaw sweeps back, throat dips, chest flows down to the collar.
  s.bezierCurveTo(0.19, 0.515, 0.13, 0.55, 0.1, 0.585);
  s.bezierCurveTo(0.05, 0.565, 0.035, 0.5, 0.055, 0.45);
  s.bezierCurveTo(0.085, 0.4, 0.135, 0.37, 0.14, 0.31);
  s.lineTo(-0.14, 0.31);
  return s;
}

/** Smooth crest along the back of the neck, thinning out at both ends. */
function maneShape(): Shape {
  const samples = 48;
  const outer: Vector2[] = [];
  const inner: Vector2[] = [];
  const total = NECK_BACK.length;
  for (let i = 0; i <= samples; i++) {
    const u = 0.12 + (i / samples) * 0.76; // skip the very base and the ear
    const seg = Math.min(total - 1, Math.floor(u * total));
    const t = u * total - seg;
    const curve = NECK_BACK[seg];
    const p = curve.getPoint(t);
    const tangent = curve.getTangent(t);
    // Outward normal (towards the back of the horse, -X side).
    const n = new Vector2(-tangent.y, tangent.x);
    if (n.x > 0) n.negate();
    const taper = Math.sin((i / samples) * Math.PI); // thin at both ends
    outer.push(p.clone().addScaledVector(n, 0.024 * taper));
    inner.push(p.clone().addScaledVector(n, -0.03 * taper - 0.004));
  }
  const s = new Shape();
  s.moveTo(outer[0].x, outer[0].y);
  outer.slice(1).forEach((p) => s.lineTo(p.x, p.y));
  inner.reverse().forEach((p) => s.lineTo(p.x, p.y));
  s.closePath();
  return s;
}

/** Extrude, centre on Z, then weld so normals shade smoothly. */
function sculpt(shape: Shape, depth: number, bevel: number): BufferGeometry {
  let geometry: BufferGeometry = new ExtrudeGeometry(shape, {
    depth,
    bevelEnabled: true,
    bevelThickness: bevel,
    bevelSize: bevel * 0.8,
    bevelSegments: 5,
    curveSegments: 18,
  });
  geometry.translate(0, 0, -depth / 2);
  geometry.deleteAttribute("normal");
  geometry.deleteAttribute("uv");
  geometry = mergeVertices(geometry, 1e-5);
  geometry.computeVertexNormals();
  return geometry;
}

export type KnightModel = {
  group: Group;
  /** Objects that keep their own material and get no contour (eyes). */
  accents: Object3D[];
  dispose: () => void;
};

const HEAD_DEPTH = 0.13;
const HEAD_BEVEL = 0.034;

export function buildKnight(): KnightModel {
  const group = new Group();
  const accents: Object3D[] = [];

  group.add(
    new Mesh(
      new LatheGeometry(
        BASE_PROFILE.map(([r, y]) => new Vector2(r, y)),
        72,
      ),
    ),
  );

  group.add(new Mesh(sculpt(headShape(), HEAD_DEPTH, HEAD_BEVEL)));
  group.add(new Mesh(sculpt(maneShape(), HEAD_DEPTH * 0.42, 0.016)));

  // Small polished eyes set into each cheek.
  const eyeMaterial = new MeshPhysicalMaterial({
    color: 0x030304,
    metalness: 0.2,
    roughness: 0.12,
    clearcoat: 1,
  });
  const eyeGeometry = new SphereGeometry(1, 20, 12);
  const [ex, ey] = [0.115, 0.785];
  const cheek = HEAD_DEPTH / 2 + HEAD_BEVEL;
  for (const side of [1, -1]) {
    const eye = new Mesh(eyeGeometry, eyeMaterial);
    eye.scale.set(0.028, 0.017, 0.012);
    eye.position.set(ex, ey, side * (cheek - 0.002));
    eye.rotation.z = -0.35;
    group.add(eye);
    accents.push(eye);
  }

  return {
    group,
    accents,
    dispose: () => {
      eyeGeometry.dispose();
      eyeMaterial.dispose();
    },
  };
}
