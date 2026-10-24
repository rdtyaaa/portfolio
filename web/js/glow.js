// Glow ala barang ajaib keluar: sinar muter + kerlip bintang di belakang barang.
import * as THREE from "three";
import { scene, V } from "./stage.js?v=r17";

function canvasTex(draw, size = 512) {
  const c = document.createElement("canvas"); c.width = c.height = size;
  const g = c.getContext("2d"); g.translate(size / 2, size / 2); draw(g, size / 2);
  const t = new THREE.CanvasTexture(c); t.colorSpace = THREE.SRGBColorSpace; return t;
}
const RAY = canvasTex((g, R) => {
  for (let i = 0; i < 18; i++) {
    g.save(); g.rotate(i / 18 * Math.PI * 2); const len = R * (i % 2 ? 0.78 : 0.98);
    const grd = g.createLinearGradient(0, 0, len, 0); grd.addColorStop(0, "rgba(255,214,160,.6)"); grd.addColorStop(1, "rgba(255,150,70,0)");
    g.fillStyle = grd; g.beginPath(); g.moveTo(0, -R * .05); g.lineTo(len, -2); g.lineTo(len, 2); g.lineTo(0, R * .05); g.fill(); g.restore();
  }
  const r = g.createRadialGradient(0, 0, 0, 0, 0, R * .7);
  r.addColorStop(0, "rgba(255,240,210,1)"); r.addColorStop(.3, "rgba(255,170,90,.55)"); r.addColorStop(1, "rgba(255,120,50,0)");
  g.fillStyle = r; g.beginPath(); g.arc(0, 0, R * .7, 0, Math.PI * 2); g.fill();
});
const STAR = canvasTex((g, R) => {
  const r = g.createRadialGradient(0, 0, 0, 0, 0, R * .35); r.addColorStop(0, "rgba(255,255,240,1)"); r.addColorStop(1, "rgba(255,200,140,0)");
  g.fillStyle = r; g.beginPath(); g.arc(0, 0, R * .35, 0, Math.PI * 2); g.fill();
  g.fillStyle = "rgba(255,245,225,.95)";
  for (const a of [0, Math.PI / 2]) { g.save(); g.rotate(a); g.beginPath(); g.moveTo(-R, 0); g.quadraticCurveTo(0, -R * .07, R, 0); g.quadraticCurveTo(0, R * .07, -R, 0); g.fill(); g.restore(); }
}, 128);
export const SOFT = canvasTex((g, R) => {
  const r = g.createRadialGradient(0, 0, 0, 0, 0, R); r.addColorStop(0, "rgba(255,255,255,.9)"); r.addColorStop(1, "rgba(255,255,255,0)");
  g.fillStyle = r; g.beginPath(); g.arc(0, 0, R, 0, Math.PI * 2); g.fill();
}, 128);

const add = (map, color) => new THREE.SpriteMaterial({ map, color, blending: THREE.AdditiveBlending, depthWrite: false, transparent: true, opacity: 0 });

export function makeGlow() {
  const g = new THREE.Group(), ray = new THREE.Sprite(add(RAY, 0xffa060)); g.add(ray);
  const sparks = [...Array(8)].map(() => {
    const s = new THREE.Sprite(add(STAR, 0xffe2b8));
    s.userData = { a: Math.random() * 6.28, r: .5 + Math.random() * .55, ph: Math.random() * 6.28, sp: 1.6 + Math.random() * 2.4 };
    g.add(s); return s;
  });
  g.visible = false; scene.add(g);
  return {
    set(pos, size, amt, t) {
      g.visible = amt > 0.01; if (!g.visible) return;
      g.position.copy(pos).add(V(0, 0, -0.45));
      ray.scale.setScalar(size * 2.3 * (0.94 + 0.06 * Math.sin(t * 2.2)));
      ray.material.opacity = amt * 0.6; ray.material.rotation = t * 0.22;
      for (const s of sparks) {
        const u = s.userData, tw = Math.max(0, Math.sin(t * u.sp + u.ph));
        s.position.set(Math.cos(u.a + t * .25) * u.r * size * 1.25, Math.sin(u.a + t * .25) * u.r * size * 1.05, 0.7);
        s.scale.setScalar(size * 0.26 * (0.35 + tw)); s.material.opacity = amt * tw;
      }
    }
  };
}
