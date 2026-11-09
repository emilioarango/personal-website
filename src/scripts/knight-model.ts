import {
  BufferGeometry,
  ExtrudeGeometry,
  Float32BufferAttribute,
  Group,
  LatheGeometry,
  Line,
  LineBasicMaterial,
  LineLoop,
  Mesh,
  MeshBasicMaterial,
  Object3D,
  Shape,
  Vector2,
} from "three";

/**
 * A modern, blocky chess knight built from primitives, in the same hard-edged
 * language as the 3MILIONAIRE pyramid: a square stepped plinth (a four-sided
 * lathe, like the pyramid's base) and a horse head extruded from a silhouette
 * drawn only with straight, square and 45-degree cuts. Tech details are thin
 * glowing traces: a circuit line on each cheek ending at a slit eye, a spine
 * ridge for the mane, and a light band around the plinth.
 *
 * Units: roughly 1 tall, head facing +X. The scene normalises size anyway.
 */

type Point = [number, number];

/** Square stepped plinth as (radius, height); four lathe segments make it square. */
const BASE_PROFILE: Point[] = [
  [0, 0],
  [0.36, 0],
  [0.36, 0.055],
  [0.31, 0.055],
  [0.31, 0.1],
  [0.235, 0.13],
  [0.205, 0.255],
  [0.265, 0.27],
  [0.265, 0.315],
  [0.21, 0.315],
  [0.21, 0.33],
  [0, 0.33],
];

/** Blocky horse head facing +X: only vertical, horizontal and 45-degree edges. */
const HEAD_OUTLINE: Point[] = [
  [-0.15, 0.32],
  [-0.15, 0.6], // back of neck
  [-0.07, 0.76], // back of head
  [-0.07, 0.9], // rear of ear
  [0.015, 0.9], // ear top
  [0.015, 0.835],
  [0.1, 0.835], // crown
  [0.265, 0.67], // 45-degree face plane
  [0.265, 0.56], // squared muzzle
  [0.16, 0.56],
  [0.16, 0.585], // mouth notch
  [0.085, 0.585],
  [0.035, 0.535], // jaw to throat
  [0.035, 0.47],
  [0.135, 0.37], // chest
  [0.135, 0.32],
];

/** Mane: a stepped spine ridge set into the back of the neck. */
const MANE_OUTLINE: Point[] = [
  [-0.12, 0.38],
  [-0.185, 0.38],
  [-0.185, 0.6],
  [-0.105, 0.76],
  [-0.06, 0.76],
  [-0.12, 0.64],
];

/** Rectangular eye slit. */
const EYE_OUTLINE: Point[] = [
  [0.085, 0.745],
  [0.15, 0.745],
  [0.15, 0.765],
  [0.085, 0.765],
];

/** Circuit trace on the cheek, ending at the eye. */
const CHEEK_TRACE: Point[] = [
  [-0.09, 0.42],
  [-0.09, 0.6],
  [0.0, 0.69],
  [0.0, 0.755],
  [0.075, 0.755],
];

const HEAD_DEPTH = 0.17;
const HEAD_BEVEL = 0.014;

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
    bevelSize: bevel,
    bevelSegments: 1, // single chamfer: crisp, machined edges
    curveSegments: 1,
  });
  geometry.translate(0, 0, -depth / 2);
  return geometry;
}

function polyline(points: Point[], z: number): BufferGeometry {
  const geometry = new BufferGeometry();
  geometry.setAttribute(
    "position",
    new Float32BufferAttribute(
      points.flatMap(([x, y]) => [x, y, z]),
      3,
    ),
  );
  return geometry;
}

export type KnightModel = {
  group: Group;
  /** Objects that keep their own material and get no contour (glow details). */
  accents: Object3D[];
  dispose: () => void;
};

export function buildKnight(): KnightModel {
  const group = new Group();
  const accents: Object3D[] = [];
  const disposables: Array<{ dispose: () => void }> = [];

  // Four radial segments, turned 45 degrees: a square plinth, like the pyramid.
  const base = new Mesh(
    new LatheGeometry(
      BASE_PROFILE.map(([r, y]) => new Vector2(r, y)),
      4,
    ),
  );
  base.rotation.y = Math.PI / 4;
  group.add(base);

  group.add(new Mesh(extrudeCentered(HEAD_OUTLINE, HEAD_DEPTH, HEAD_BEVEL)));
  group.add(
    new Mesh(extrudeCentered(MANE_OUTLINE, HEAD_DEPTH * 0.45, HEAD_BEVEL)),
  );

  const glowMaterial = new MeshBasicMaterial({ color: 0xf4f6fa });
  const traceMaterial = new LineBasicMaterial({
    color: 0xf4f6fa,
    transparent: true,
    opacity: 0.85,
  });
  disposables.push(glowMaterial, traceMaterial);

  // Eye slit and cheek circuit on each side, just proud of the surface.
  const cheek = HEAD_DEPTH / 2 + HEAD_BEVEL + 0.0015;
  for (const side of [1, -1]) {
    const eyeGeometry = extrudeCentered(EYE_OUTLINE, 0.003, 0);
    eyeGeometry.translate(0, 0, side * cheek);
    const eye = new Mesh(eyeGeometry, glowMaterial);
    const trace = new Line(polyline(CHEEK_TRACE, side * cheek), traceMaterial);
    group.add(eye, trace);
    accents.push(eye, trace);
  }

  // Light band around the plinth step (square, matching the lathe's faces).
  const half = 0.31 * Math.SQRT1_2 + 0.002;
  const band = new LineLoop(
    polyline(
      [
        [-half, -half],
        [half, -half],
        [half, half],
        [-half, half],
      ],
      0,
    ),
    traceMaterial,
  );
  // polyline() lays points in XY; swing the loop flat onto the step.
  band.rotation.x = -Math.PI / 2;
  band.position.y = 0.1;
  group.add(band);
  accents.push(band);

  return {
    group,
    accents,
    dispose: () => disposables.forEach((d) => d.dispose()),
  };
}
