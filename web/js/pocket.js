// Kantong felt + resleting. API: pocket.group, pocket.update(state, t)
import * as THREE from "three";
import { scene, load, clamp, ease, lerp, V } from "./stage.js?v=r17";

export const pocket = { group: new THREE.Group(), inner: new THREE.Group(), ready: false, stitches: [], glowMats: [] };
const G = pocket.group; G.add(pocket.inner); scene.add(G);
const mouthLight = new THREE.PointLight(0xff8a45, 6, 6, 1.6); mouthLight.position.set(0, 0.25, 0.1); G.add(mouthLight);

/* ---------- resleting: 2 tutup felt + gigi + slider di mulut kantong ---------- */
const ZP = 2.6, wU = u => Math.pow(Math.max(1 - Math.pow(Math.abs(u), ZP), 0), 1 / ZP);
const ZF = u => 0.31 * wU(u), ZB = u => -0.078 * wU(u), ZM = u => 0.116 * wU(u);
const MY = 0.556, NZ = 56, NT = 34;
const zipper = new THREE.Group(); pocket.inner.add(zipper);
const lidMat = new THREE.MeshPhysicalMaterial({ color: "#e3d8c2", roughness: 1, sheen: 1, sheenColor: new THREE.Color("#fff6e6"), side: THREE.DoubleSide });
function strip() {
  const g = new THREE.BufferGeometry(); g.setAttribute("position", new THREE.BufferAttribute(new Float32Array((NZ + 1) * 6), 3));
  const idx = []; for (let i = 0; i < NZ; i++) { const a = i * 2; idx.push(a, a + 2, a + 1, a + 1, a + 2, a + 3); } g.setIndex(idx); return g;
}
const lidF = new THREE.Mesh(strip(), lidMat), lidB = new THREE.Mesh(strip(), lidMat); zipper.add(lidF, lidB);
const teeth = new THREE.InstancedMesh(new THREE.BoxGeometry(0.026, 0.02, 0.034),
  new THREE.MeshStandardMaterial({ color: "#e2b85a", metalness: 0.6, roughness: 0.35 }), NT * 2);
zipper.add(teeth);
const slider = new THREE.Group(); zipper.add(slider);
slider.add(new THREE.Mesh(new THREE.BoxGeometry(0.12, 0.05, 0.09), new THREE.MeshStandardMaterial({ color: "#d8d0c0", metalness: 0.85, roughness: 0.3 })));
const tabPivot = new THREE.Group(); tabPivot.position.set(0, 0.015, 0.045); slider.add(tabPivot);
const tab = new THREE.Mesh(new THREE.BoxGeometry(0.06, 0.014, 0.17), new THREE.MeshStandardMaterial({ color: "#ff7a3d", roughness: .6 }));
tab.position.z = 0.085; tabPivot.add(tab);
const dummy = new THREE.Object3D();

function updateZipper(zip, jig, t) {
  zipper.visible = zip < 0.995; if (!zipper.visible) return;
  const sx = lerp(-0.62, 1.25, zip), open = x => ease(clamp((sx - x) / 0.24));
  for (const [mesh, edge, side] of [[lidF, ZF, 1], [lidB, ZB, -1]]) {
    const p = mesh.geometry.attributes.position.array;
    for (let i = 0; i <= NZ; i++) {
      const u = -1 + 2 * i / NZ, x = 0.85 * u, w = wU(u), o = open(x);
      p.set([x, MY, edge(u)], i * 6);
      p.set([x, MY + 0.028 * w * (1 - o), lerp(ZM(u), edge(u) - side * 0.012 * w, o)], i * 6 + 3);
    }
    mesh.geometry.attributes.position.needsUpdate = true; mesh.geometry.computeVertexNormals();
  }
  for (let k = 0; k < NT; k++) {
    const u = -0.93 + 1.86 * k / (NT - 1), x = 0.85 * u, w = wU(u), o = open(x);
    for (const side of [1, -1]) {
      const z0 = ZM(u) + side * 0.011, z1 = side > 0 ? ZF(u) - 0.014 : ZB(u) + 0.014;
      dummy.position.set(x + side * 0.0085, MY + 0.03 * w * (1 - o) + 0.005, lerp(z0, z1, o));
      dummy.scale.setScalar(w > 0.2 ? 1 - o * 0.6 : 0); dummy.updateMatrix();
      teeth.setMatrixAt(k * 2 + (side > 0 ? 0 : 1), dummy.matrix);
    }
  }
  teeth.instanceMatrix.needsUpdate = true;
  const xs = clamp(sx, -0.62, 0.8) + jig * Math.sin(t * 40) * 0.03, us = xs / 0.85;
  slider.position.set(xs, MY + 0.03 * wU(us) + 0.016, ZM(us)); slider.rotation.y = jig * Math.sin(t * 33) * 0.2;
  tabPivot.rotation.x = 0.9 + Math.sin(t * 2.2) * 0.08 + jig * Math.sin(t * 27) * 0.5;
}

export async function loadPocket() {
  const k = await load("../assets/kantong.glb");
  k.traverse(o => {
    if (!o.isMesh) return;
    const m = o.material;
    if (/felt/.test(m.name)) o.material = new THREE.MeshPhysicalMaterial({ color: m.color, roughness: 1, sheen: 1, sheenRoughness: 0.6, sheenColor: new THREE.Color("#fff6e6") });
    if (/glow/.test(m.name)) { m.userData.base = 6; pocket.glowMats.push(m); }
    if (/void/.test(m.name) && !/glow/.test(m.name)) { m.emissive = new THREE.Color("#ff6a2a"); m.userData.base = 0.25; pocket.glowMats.push(m); }
    if (/Jahitan/.test(o.name) || /Jahitan/.test(o.parent?.name)) pocket.stitches.push({ o, base: o.position.clone() });
  });
  k.position.y = 0.55; pocket.inner.add(k); pocket.ready = true;
}

/** mulut kantong (dunia) */
export const mouth = (y = 0.55) => pocket.group.localToWorld(V(0, y, 0));

/**
 * pose: { pos, scale, sx, sy, rz, ry, lift, jit, glow, zip, jig }
 */
export function updatePocket(p, t) {
  G.visible = p.scale > 0.001;
  G.position.copy(p.pos); G.position.y += (p.lift || 0) * 0.1;
  pocket.inner.position.y = p.lift || 0;
  G.scale.set(p.sx * p.scale, p.sy * p.scale, (p.sx * 0.5 + 0.5) * p.scale);
  G.rotation.set(0.12, p.ry, p.rz);
  for (const { o, base } of pocket.stitches) o.position.set(base.x + (Math.random() - .5) * .03 * p.jit, base.y + (Math.random() - .5) * .03 * p.jit, base.z);
  for (const m of pocket.glowMats) m.emissiveIntensity = m.userData.base * p.glow;
  mouthLight.intensity = 6 * p.glow;
  updateZipper(p.zip, p.jig, t);
}
