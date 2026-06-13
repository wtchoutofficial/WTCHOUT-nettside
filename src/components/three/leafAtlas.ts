import * as THREE from "three";
import { mulberry32 } from "./palettes";

// 4×4 atlas of jungle-leaf-cluster silhouettes, white on transparent.
// Shapes only need to read as foliage in silhouette — the shader does all
// tinting, so the atlas stays grade-agnostic.
const CELLS = 4;

function frondFan(ctx: CanvasRenderingContext2D, rng: () => number, s: number) {
  const fronds = 6 + Math.floor(rng() * 4);
  for (let i = 0; i < fronds; i++) {
    const angle = -Math.PI / 2 + (i / (fronds - 1) - 0.5) * (1.6 + rng() * 0.5);
    const len = s * (0.55 + rng() * 0.35);
    const width = s * (0.045 + rng() * 0.04);
    const bend = (rng() - 0.5) * s * 0.25;
    ctx.save();
    ctx.rotate(angle);
    ctx.beginPath();
    ctx.moveTo(0, 0);
    ctx.quadraticCurveTo(len * 0.5, -width + bend * 0.2, len, bend);
    ctx.quadraticCurveTo(len * 0.5, width + bend * 0.2, 0, 0);
    ctx.fill();
    ctx.restore();
  }
}

function broadLeaf(ctx: CanvasRenderingContext2D, rng: () => number, s: number) {
  const leaves = 2 + Math.floor(rng() * 3);
  for (let i = 0; i < leaves; i++) {
    const angle = -Math.PI / 2 + (rng() - 0.5) * 1.8;
    const len = s * (0.5 + rng() * 0.3);
    const width = s * (0.16 + rng() * 0.12);
    ctx.save();
    ctx.rotate(angle);
    ctx.beginPath();
    ctx.moveTo(0, 0);
    ctx.bezierCurveTo(len * 0.25, -width, len * 0.8, -width * 0.7, len, 0);
    ctx.bezierCurveTo(len * 0.8, width * 0.7, len * 0.25, width, 0, 0);
    ctx.fill();
    // Central notch to suggest a split leaf
    ctx.globalCompositeOperation = "destination-out";
    ctx.beginPath();
    ctx.moveTo(len * 0.35, 0);
    ctx.quadraticCurveTo(len * 0.65, -width * 0.08, len * 1.02, 0);
    ctx.quadraticCurveTo(len * 0.65, width * 0.08, len * 0.35, 0);
    ctx.fill();
    ctx.globalCompositeOperation = "source-over";
    ctx.restore();
  }
}

function fernArc(ctx: CanvasRenderingContext2D, rng: () => number, s: number) {
  const arcs = 3 + Math.floor(rng() * 3);
  for (let i = 0; i < arcs; i++) {
    const angle = -Math.PI / 2 + (rng() - 0.5) * 2.0;
    const len = s * (0.45 + rng() * 0.3);
    const leaflets = 8 + Math.floor(rng() * 6);
    ctx.save();
    ctx.rotate(angle);
    for (let j = 1; j <= leaflets; j++) {
      const t = j / leaflets;
      const x = len * t;
      const y = len * 0.25 * t * t; // arc droop
      const ll = s * 0.09 * (1 - t * 0.6);
      const lw = s * 0.018;
      for (const side of [-1, 1]) {
        ctx.beginPath();
        ctx.ellipse(x, y + side * lw * 2, ll, lw, side * 0.6, 0, Math.PI * 2);
        ctx.fill();
      }
    }
    ctx.restore();
  }
}

export function createLeafAtlas(isMobile: boolean): THREE.CanvasTexture {
  const size = isMobile ? 512 : 1024;
  const cell = size / CELLS;
  const canvas = document.createElement("canvas");
  canvas.width = size;
  canvas.height = size;
  const ctx = canvas.getContext("2d")!;
  ctx.fillStyle = "#fff";

  const rng = mulberry32(1337);
  const drawers = [frondFan, broadLeaf, fernArc];

  for (let cy = 0; cy < CELLS; cy++) {
    for (let cx = 0; cx < CELLS; cx++) {
      ctx.save();
      // Cluster origin low in the cell so shapes grow upward
      ctx.translate(cx * cell + cell / 2, cy * cell + cell * 0.78);
      ctx.beginPath();
      ctx.rect(-cell / 2, -cell * 0.78, cell, cell);
      ctx.clip();
      const draw = drawers[(cy * CELLS + cx) % drawers.length];
      draw(ctx, rng, cell);
      ctx.restore();
    }
  }

  const tex = new THREE.CanvasTexture(canvas);
  tex.anisotropy = 4;
  return tex;
}

export const ATLAS_CELLS = CELLS;
