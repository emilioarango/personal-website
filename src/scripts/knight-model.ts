import {
  BufferGeometry,
  ExtrudeGeometry,
  Group,
  LatheGeometry,
  Mesh,
  MeshBasicMaterial,
  Shape,
  Vector2,
} from "three";

/**
 * A modern, faceted chess knight built from primitives: an octagonal turned
 * base (lathe) and a chamfered horse head extruded from a silhouette, then
 * tapered so the muzzle and ears narrow like a carved piece. Flat planes and
 * hard creases give crisp edge contours, in the same geometric language as
 * the 3MILIONAIRE pyramid.
 *
 * Units: roughly 1 tall, head facing +X. The scene normalises size anyway.
 */

type Point = [number, number];

/** Turned base profile as (radius, height) pairs, bottom to top. */
const BASE_PROFILE: Point[] = [
  [0, 0],
  [0.29, 0],
  [0.29, 0.038],
  [0.258, 0.052],
  [0.258, 0.075],
  [0.21, 0.095],
  [0.178, 0.135],
  [0.155, 0.2],
  [0.15, 0.25],
  [0.19, 0.27],
  [0.19, 0.3],
  [0.15, 0.32],
  [0, 0.32],
];

/** Horse-head silhouette facing +X, traced from the back of the neck. */
const HEAD_OUTLINE: Point[] = [
  [-0.15, 0.31],
  [-0.178, 0.44],
  [-0.168, 0.56],
  [-0.13, 0.67],
  [-0.075, 0.775], // poll
  [-0.06, 0.86],
  [-0.03, 0.965], // rear ear tip
  [0.005, 0.87],
  [0.03, 0.89],
  [0.075, 0.995], // front ear tip
  [0.09, 0.865],
  [0.145, 0.825], // brow
  [0.225, 0.735],
  [0.29, 0.64], // nose bridge
  [0.322, 0.575],
  [0.318, 0.53], // muzzle
  [0.285, 0.515],
  [0.29, 0.5], // nostril notch
  [0.245, 0.48], // mouth
  [0.2, 0.47], // chin
  [0.135, 0.495],
  [0.075, 0.535], // jaw angle
  [0.035, 0.505], // throat
  [0.055, 0.43],
  [0.115, 0.37], // chest
  [0.15, 0.31],
];

/** Chevron mane fins riding the back of the neck. */
const MANE_OUTLINE: Point[] = [
  [-0.125, 0.4],
  [-0.222, 0.445],
  [-0.162, 0.49],
  [-0.226, 0.55],
  [-0.158, 0.585],
  [-0.205, 0.655],
  [-0.12, 0.685],
  [-0.15, 0.755],
  [-0.072, 0.775],
  [-0.06, 0.73],
  [-0.1, 0.61],
  [-0.115, 0.48],
];

/** Angular eye slit set into the cheek. */
const EYE_OUTLINE: Point[] = [
  [0.112, 0.765],
  [0.185, 0.748],
  [0.132, 0.733],
];

const HEAD_DEPTH = 0.15;
const HEAD_BEVEL = 0.034;

/** Fraction of full thickness at a point in the profile: muzzle and ears narrow. */
function taperAt(x: number, y: number): number {
  const muzzle = Math.min(1, Math.max(0, (x - 0.04) / 0.28));
  const ears = Math.min(1, Math.max(0, (y - 0.8) / 0.2));
  return (1 - 0.42 * muzzle) * (1 - 0.35 * ears);
}

function shapeFrom(points: Point[]): Shape {
  const shape = new Shape();
  points.forEach(([x, y], i) =>
    i === 0 ? shape.moveTo(x, y) : shape.lineTo(x, y),
  );
  shape.closePath();
  return shape;
}

function extrudeCentered(
  points: Point[],
  depth: number,
  bevel: number,
): ExtrudeGeometry {
  const geometry = new ExtrudeGeometry(shapeFrom(points), {
    depth,
    bevelEnabled: bevel > 0,
    bevelThickness: bevel,
    bevelSize: bevel * 0.85,
    bevelSegments: 1, // single chamfer = faceted, not rounded
    curveSegments: 1,
  });
  geometry.translate(0, 0, -depth / 2);
  return geometry;
}

/** Scale each vertex's depth by the profile taper, carving the slab into a head. */
function applyTaper(geometry: BufferGeometry) {
  const pos = geometry.getAttribute("position");
  for (let i = 0; i < pos.count; i++) {
    pos.setZ(i, pos.getZ(i) * taperAt(pos.getX(i), pos.getY(i)));
  }
  pos.needsUpdate = true;
  geometry.computeVertexNormals();
}

export type KnightModel = {
  group: Group;
  /** Meshes that keep their own material and get no contour (eye slits). */
  accents: Mesh[];
  dispose: () => void;
};

export function buildKnight(): KnightModel {
  const group = new Group();
  const accents: Mesh[] = [];

  // Eight radial segments: octagonal facets, like the pyramid's hard planes.
  const base = new Mesh(
    new LatheGeometry(
      BASE_PROFILE.map(([r, y]) => new Vector2(r, y)),
      8,
    ),
  );
  base.rotation.y = Math.PI / 8;
  group.add(base);

  const headGeometry = extrudeCentered(HEAD_OUTLINE, HEAD_DEPTH, HEAD_BEVEL);
  applyTaper(headGeometry);
  group.add(new Mesh(headGeometry));

  const maneGeometry = extrudeCentered(
    MANE_OUTLINE,
    HEAD_DEPTH * 0.4,
    HEAD_BEVEL * 0.6,
  );
  group.add(new Mesh(maneGeometry));

  // Eye slits follow the tapered cheek surface on each side and glow softly.
  const eyeMaterial = new MeshBasicMaterial({ color: 0xf2f4f8 });
  const cheekHalf = HEAD_DEPTH / 2 + HEAD_BEVEL;
  for (const side of [1, -1]) {
    const eyeGeometry = extrudeCentered(EYE_OUTLINE, 0.004, 0);
    const pos = eyeGeometry.getAttribute("position");
    for (let i = 0; i < pos.count; i++) {
      const surface = cheekHalf * taperAt(pos.getX(i), pos.getY(i));
      pos.setZ(i, side * (surface + 0.002 + pos.getZ(i)));
    }
    pos.needsUpdate = true;
    const eye = new Mesh(eyeGeometry, eyeMaterial);
    group.add(eye);
    accents.push(eye);
  }

  return {
    group,
    accents,
    dispose: () => eyeMaterial.dispose(),
  };
}
