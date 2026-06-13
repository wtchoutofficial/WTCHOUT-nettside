import * as THREE from "three";

// Brand grading (from the art direction brief):
// acid #C0FC24 · DUSK ember #C04A1E / amber #E89A3C · DAWN deep teal #14534A
export const DUSK = {
  fog: new THREE.Color("#2b1c10"),
  leaf: new THREE.Color("#16240f"),
  shaft: new THREE.Color("#c0fc24").lerp(new THREE.Color("#e89a3c"), 0.2),
  dust: new THREE.Color("#e8c97a"),
};

export const DAWN = {
  fog: new THREE.Color("#0c2823"),
  leaf: new THREE.Color("#0c1f1c"),
  shaft: new THREE.Color("#c0fc24").lerp(new THREE.Color("#14534a"), 0.2),
  dust: new THREE.Color("#bfe9dd"),
};

// One uniform object shared by every material in the scene — JungleScene
// mutates `.value` once per frame and all shaders see it.
export function createSharedUniforms() {
  return {
    uTime: { value: 0 },
    uScroll: { value: 0 },
    uMood: { value: 0 }, // 0 = dusk, 1 = dawn (animated)
    uCamY: { value: 6 },
    uFogColor: { value: DUSK.fog.clone() },
    uFogNear: { value: 6 },
    uFogFar: { value: 28 },
    uDuskLeaf: { value: DUSK.leaf },
    uDawnLeaf: { value: DAWN.leaf },
    uShaftDusk: { value: DUSK.shaft },
    uShaftDawn: { value: DAWN.shaft },
    uDustDusk: { value: DUSK.dust },
    uDustDawn: { value: DAWN.dust },
  };
}

export type SharedUniforms = ReturnType<typeof createSharedUniforms>;

// Deterministic RNG so the jungle layout is identical on every mount.
export function mulberry32(seed: number) {
  let a = seed >>> 0;
  return () => {
    a |= 0;
    a = (a + 0x6d2b79f5) | 0;
    let t = Math.imul(a ^ (a >>> 15), 1 | a);
    t = (t + Math.imul(t ^ (t >>> 7), 61 | t)) ^ t;
    return ((t ^ (t >>> 14)) >>> 0) / 4294967296;
  };
}
