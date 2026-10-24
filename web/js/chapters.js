// Section kuliah (laptop ngebul) + BTN (rambu, terus kamera zoom ke papan QA, belok kanan, turun).
// Barang ini hidup di "dunia" (bukan nempel kantong); kamera yang gerak.
import * as THREE from "three";
import { scene, camera, view, load, normalize, worldToScreen, clamp, seg, ease, outBack, lerp, V } from "./stage.js?v=r17";
import { makeGlow, SOFT } from "./glow.js?v=r17";
import { mouth } from "./pocket.js?v=r17";
import { T } from "./text.js?v=r17";
import { positionTag } from "./tags.js?v=r17";

export const ch = { laptop: null, rambu: null, ready: false, refreshMobileFX };
function refreshMobileFX(t) {
  const it=ch.laptop;if(!it||it.scale.x<.001)return;
  const pos=it.position,size=it.scale.x;
  gLap.set(pos,size*.9,.4,t);
  steam.forEach((st,i)=>{
    const ph=(t*.45+i/steam.length)%1;
    st.position.copy(pos).add(V((.15+Math.sin(ph*6+i)*.12)*size,(.45+ph*.8)*size,-.1));
    st.scale.setScalar((.25+ph*.55)*size);st.material.opacity=.32*Math.sin(ph*Math.PI);
  });
}
const gLap = makeGlow(), gRam = makeGlow();
const steam = [...Array(5)].map(() => {
  const s = new THREE.Sprite(new THREE.SpriteMaterial({ map: SOFT, color: 0xd8cfc2, transparent: true, depthWrite: false, opacity: 0 }));
  scene.add(s); return s;
});
const tagEl = document.getElementById("tag");

/* jalur panah QA: dari papan QA lurus ke kanan, belok, turun (kamera ngikutin) */
const trail = new THREE.Group(); scene.add(trail);
const chevMat = new THREE.MeshStandardMaterial({ color: "#8fb3a3", emissive: "#8fb3a3", emissiveIntensity: 0.35, roughness: 0.6 });
const chevGeo = (() => { const sh = new THREE.Shape(); sh.moveTo(-0.12, 0.11); sh.lineTo(0.02, 0.11); sh.lineTo(0.14, 0); sh.lineTo(0.02, -0.11); sh.lineTo(-0.12, -0.11); sh.lineTo(0, 0); sh.closePath();
  return new THREE.ExtrudeGeometry(sh, { depth: 0.04, bevelEnabled: true, bevelSize: 0.012, bevelThickness: 0.012, bevelSegments: 2 }); })();
const TRAIL_PTS = (() => {                 // relatif ke papan QA
  const pts = [], R = 0.9;
  for (let x = 0.75; x < 4.2 - R; x += 0.38) pts.push([x, 0, 0]);
  for (let a = 0; a <= 1.0001; a += 0.25) pts.push([4.2 - R + Math.sin(a * Math.PI / 2) * R, -R + Math.cos(a * Math.PI / 2) * R, -a * Math.PI / 2]);
  for (let y = -R - 0.38; y > -5.6; y -= 0.38) pts.push([4.2, y, -Math.PI / 2]);
  return pts;
})();
const chevs = TRAIL_PTS.map(() => { const m = new THREE.Mesh(chevGeo, chevMat); trail.add(m); return m; });
const endTxt = document.createElement("div"); endTxt.className = "tag turn"; document.body.appendChild(endTxt);

export async function loadChapters() {
  const [lap, ram] = await Promise.all([load("../assets/laptop.glb"), load("../assets/items/rambu.glb")]);
  ch.laptop = normalize(lap); ch.rambu = normalize(ram);
  for (const w of [ch.laptop, ch.rambu]) {
    w.scale.setScalar(0); scene.add(w);
    w.traverse(o => { if (o.isMesh && o.material.emissiveIntensity > 1) o.material.emissiveIntensity = .9; });
  }
  // cari papan QA di model rambu: mesh paling kanan (x terbesar) di bagian atas
  ch.ready = true;
}

/* titik dunia buat rambu & jalur kamera */
const SIGN = V(0, 0.2, 0);                    // posisi rambu di dunia
const QA_LOCAL = V(0.3, 0.33, 0.02);          // kira-kira papan QA, relatif ke tengah rambu (unit model = 1)

/**
 * qUni, qBtn: progress 0..1 section. pocketPose dipake buat ngeluarin laptop dari kantong.
 * Return: { camPos, camLook, pocketVis, pocketFx } — main.js nerapin ke kamera & kantong.
 */
export function updateChapters(qUni, qBtn, inUni, inBtn, t, pk) {
  const out = { cam: null, fx: { glow: 1, rz: 0, sx: 0, sy: 0 }, pocketFade: 1 };
  tagEl.style.opacity = 0;
  if (!ch.ready) return out;
  const M = view.mobile;

  /* ---------- kuliah: laptop nyembur dari kantong, ngambang, ngebul ---------- */
  {
    const it = ch.laptop, s = it.userData.base;
    const rummage = seg(qUni, 0.0, 0.18), squash = seg(qUni, 0.18, 0.27), shoot = seg(qUni, 0.27, 0.45);
    const leave = inBtn ? 1 : 0;
    if (inUni && qUni < 0.45) {
      out.fx.rz += Math.sin(t * 18) * 0.07 * rummage * (1 - squash);
      out.fx.sx += 0.14 * ease(squash) * (1 - shoot) - 0.1 * Math.sin(shoot * Math.PI);
      out.fx.sy += -0.18 * ease(squash) * (1 - shoot) + 0.16 * Math.sin(shoot * Math.PI);
      out.fx.glow = 1 + 2.5 * squash;
    }
    const vis = inUni && qUni > 0.27 && !leave;
    if (!vis) { it.scale.setScalar(0); gLap.set(V(), 0, 0, t); steam.forEach(x => x.material.opacity = 0); }
    else {
      const m = mouth(), e = outBack(shoot), idle = shoot;
      const above = m.clone().add(V(M ? 0 : -0.15, M ? 1.05 : 1.2, 0.4));
      const pos = m.clone().lerp(above, e);
      pos.y += Math.sin(t * 1.3) * 0.07 * idle;
      pos.x += Math.sin(t * 61) * 0.008 * idle; pos.y += Math.cos(t * 53) * 0.008 * idle;   // getar kipas
      it.position.copy(pos); it.scale.setScalar(s * lerp(0.25, M ? 1.2 : 1.5, e));
      it.rotation.set(0.35 + (1 - shoot) * 2.2, -0.5 + Math.sin(t * 0.6) * 0.25 + (1 - shoot) * 4, 0.1 * Math.sin(t * 0.9));
      gLap.set(pos, s * 1.4, seg(shoot, 0.4, 1), t);
      steam.forEach((st, i) => {
        const ph = (t * 0.45 + i / steam.length) % 1;
        st.position.copy(pos).add(V(0.15 + Math.sin(ph * 6 + i) * 0.12, 0.45 + ph * 0.8, -0.1));
        st.scale.setScalar(0.25 + ph * 0.55); st.material.opacity = 0.42 * Math.sin(ph * Math.PI) * idle;
      });
      if (qUni > 0.45) {
        const sp = worldToScreen(pos.clone().add(V(0.75, -0.3, 0)));
        tagEl.className = "tag"; tagEl.textContent = T().uni.tag; tagEl.style.opacity = 1;
        positionTag(tagEl, sp, outBack(seg(qUni, .45, .55)), -4 + Math.sin(t * 1.4) * 3);
      }
    }
  }

  /* ---------- BTN: rambu berdiri di dunia; kamera nyamperin, zoom ke QA, belok kanan, turun ---------- */
  {
    const it = ch.rambu, s = it.userData.base * (M ? 1.3 : 2.4);
    const appear = inBtn ? ease(seg(qBtn, 0.0, 0.12)) : 0;
    it.visible = appear > 0.001;
    // rambu muncul dari bawah (numbuh), muter kayak undian dulu terus berhenti di QA
    const spin = seg(qBtn, 0.05, 0.3);
    it.position.copy(SIGN).add(V(M ? 0 : -2.3, (M ? 1.4 : 0) + (appear - 1) * 1.5, 0));
    it.scale.setScalar(s * appear);
    it.rotation.set(0, -0.15 + Math.pow(1 - spin, 3) * Math.PI * 6 + Math.sin(t * 1.4) * 0.05 * spin, 0.02 * Math.sin(t * 2));
    gRam.set(it.position.clone().add(V(0, 0.4, 0)), s * 0.9, appear * (1 - seg(qBtn, 0.45, 0.6)) * 0.7, t);

    // kamera: 0-.45 diem (baca teks), .45-.68 zoom ke papan QA, .68-.84 belok kanan (pan ngikut panah), .84-1 turun
    const qa = it.localToWorld(QA_LOCAL.clone());
    // jalur panah: nyala berurutan pas kamera mulai zoom, terus "ngalir"
    const grow = seg(qBtn, 0.38, 0.95);
    trail.visible = inBtn && appear > 0.5 && qBtn > 0.36;
    chevs.forEach((c, i) => {
      const [x, y, r] = TRAIL_PTS[i], on = clamp(grow * chevs.length * 1.15 - i);
      c.position.set(qa.x + x, qa.y + y, qa.z - 0.02); c.rotation.set(0, 0, r);
      c.scale.setScalar(ease(on) * (1 + 0.18 * Math.max(0, Math.sin(t * 5 - i * 0.6))));
    });
    endTxt.style.opacity = 0;
    if (inBtn && qBtn > 0.9) {
      const sp = { x: view.W * 0.5 + 40, y: view.H * 0.55 };
      endTxt.textContent = T().btn.next || "Surabaya ↓"; endTxt.style.opacity = seg(qBtn, 0.9, 0.97);
      positionTag(endTxt, sp);
    }
    if (inBtn) {
      const base = { pos: V(0, 1.6, 9), look: V(0, 0.2, 0) };
      const zoom = { pos: qa.clone().add(V(-0.25, 0.05, 2.2)), look: qa.clone() };
      const right = { pos: qa.clone().add(V(3.2, 0.05, 2.2)), look: qa.clone().add(V(4.2, 0, 0)) };
      const down = { pos: qa.clone().add(V(3.4, -4.5, 2.6)), look: qa.clone().add(V(4.2, -5.2, 0)) };
      const z = ease(seg(qBtn, 0.36, 0.64)), r = ease(seg(qBtn, 0.64, 0.82)), d = ease(seg(qBtn, 0.82, 1));
      const P = base.pos.clone().lerp(zoom.pos, z).lerp(right.pos, r).lerp(down.pos, d);
      const L = base.look.clone().lerp(zoom.look, z).lerp(right.look, r).lerp(down.look, d);
      out.cam = { pos: P, look: L };
      out.textFade = 1 - seg(qBtn, 0.42, 0.52);
      if (qBtn > 0.3 && qBtn < 0.5) {
        const sp = worldToScreen(qa.clone().add(V(0.5, 0.25, 0)));
        tagEl.className = "tag turn"; tagEl.textContent = T().btn.turn; tagEl.style.opacity = 1;
        positionTag(tagEl, sp, outBack(seg(qBtn, .3, .38)), -3);
      }
      out.pocketFade = 1 - seg(qBtn, 0.0, 0.1);           // kantong mundur, panggung buat rambu
    }
  }
  return out;
}
