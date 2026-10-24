// Karakter Goys + batu loncatan (WISEWIRES) + topeng (BRI) + angkat kantong, scroll cepet, meledak (skill).
// Mekanik: begitu section kecapai, scroll dikunci dan animasinya jalan sendiri (berbasis waktu),
// kecuali section skill: progres cuma naik kalo scroll-nya cepet.
import * as THREE from "three";
import { scene, view, load, normalize, worldToScreen, screenToWorld, clamp, seg, ease, outBack, lerp, V, REDUCE } from "./stage.js?v=r17";
import { makeGlow } from "./glow.js?v=r17";
import { SKILLS } from "./copy.js?v=r17";
import { T } from "./text.js?v=r17";
import { positionTag } from "./tags.js?v=r17";
import { setCapture, goTo } from "./scroll.js?v=r17";

export const st = { ready: false };
const parts = {};
let goys, batu, topeng, dasi, BURST_ITEMS = {};
const HOT = ["esp32", "pensil", "arsitektur", "sendal_hermes"];
const hotGlow = Object.fromEntries(HOT.map(n => [n, makeGlow()]));
const tagEl = document.getElementById("tag");

/* chip skill buat ledakan (ga semua 160+, cukup sampel biar ga berat) */
const CHIP_SAMPLE = SKILLS.filter((_, i) => i % 3 === 0).slice(0, 48);
const chips = CHIP_SAMPLE.map(([n, g]) => { const d = document.createElement("div"); d.className = "chip " + g; d.textContent = n; document.body.appendChild(d); return d; });
const hotTags = Object.fromEntries(HOT.map(n => { const d = document.createElement("div"); d.className = "tag sm"; document.body.appendChild(d); return [n, d]; }));
function hotTagText() { HOT.forEach(n => { const [a, b] = T().skill.hot[n]; hotTags[n].innerHTML = `${a}<small>${b}</small>`; }); }
addEventListener("modechange", () => { hotTagText(); sumTags(); });

export async function loadStory() {
  const names = ["goys", "batu", "topeng", "dasi", "laptop", "rambu", "sendal_jepit", ...HOT];
  const urls = n => n === "goys" ? "../assets/goys.glb" : n === "laptop" ? "../assets/laptop.glb" : `../assets/items/${n}.glb`;
  const got = await Promise.all(names.map(n => load(urls(n))));
  got.forEach((g, i) => {
    const n = names[i];
    if (n === "goys") {
      goys = new THREE.Group(); goys.add(g); scene.add(goys); goys.visible = false;
      g.traverse(o => { if (["Head", "ArmL", "ArmR", "LegL", "LegR", "Torso"].includes(o.name)) parts[o.name] = o; });
      for (const k in parts) parts[k].userData.r0 = parts[k].rotation.clone();
      return;
    }
    const w = normalize(g); w.scale.setScalar(0); scene.add(w);
    w.traverse(o => { if (o.isMesh && o.material.emissiveIntensity > 1) o.material.emissiveIntensity = .9; });
    if (n === "batu") batu = w; else if (n === "topeng") topeng = w; else if (n === "dasi") dasi = w; else BURST_ITEMS[n] = w;
  });
  BURST_ITEMS.topeng = topeng; BURST_ITEMS.batu = batu;
  hotTagText(); sumTags(); initBurst(); st.ready = true;
}

function projectedBox(objects, pocketPose = null) {
  const box = new THREE.Box3();
  for (const obj of objects) {
    if (!obj || !obj.visible || obj.scale.x < .001) continue;
    obj.updateWorldMatrix(true, true); box.union(new THREE.Box3().setFromObject(obj));
  }
  if (pocketPose && pocketPose.scale > .001) {
    const r = pocketPose.scale * .9;
    box.expandByPoint(pocketPose.pos.clone().add(V(-r, -r, -r)));
    box.expandByPoint(pocketPose.pos.clone().add(V(r, r, r)));
  }
  if (box.isEmpty()) return null;
  const points = [];
  for (const x of [box.min.x, box.max.x]) for (const y of [box.min.y, box.max.y]) for (const z of [box.min.z, box.max.z]) points.push(worldToScreen(V(x,y,z)));
  return { left:Math.min(...points.map(p=>p.x)), right:Math.max(...points.map(p=>p.x)), top:Math.min(...points.map(p=>p.y)), bottom:Math.max(...points.map(p=>p.y)) };
}
export function fitMobileScene(objects, pocketPose = null, dock = false) {
  const r = document.getElementById("mobile-stage").getBoundingClientRect();
  const slot = {left:r.left+8,right:r.right-8,top:r.top+8,bottom:r.bottom-8};
  for (let i=0;i<3;i++) {
    const b = projectedBox(objects,pocketPose); if (!b) break;
    const w=b.right-b.left,h=b.bottom-b.top;
    const scale=Math.min(1,(slot.right-slot.left)/Math.max(w,1),(slot.bottom-slot.top)/Math.max(h,1));
    const cx=(b.left+b.right)/2,cy=(b.top+b.bottom)/2;
    const tx=clamp(cx,slot.left+w*scale/2,slot.right-w*scale/2),ty=lerp(clamp(cy,slot.top+h*scale/2,slot.bottom-h*scale/2),slot.bottom-h*scale/2,Number(dock));
    const from=screenToWorld(cx,cy),to=screenToWorld(tx,ty);
    for (const obj of objects) {
      if (!obj || !obj.visible || obj.scale.x<.001) continue;
      obj.position.sub(from).multiplyScalar(scale).add(to);obj.scale.multiplyScalar(scale);
    }
    if (pocketPose) { pocketPose.pos.sub(from).multiplyScalar(scale).add(to);pocketPose.scale*=scale; }
  }
  return {slot,bounds:projectedBox(objects,pocketPose)};
}
function showStoryTag(text, point) {
  tagEl.className="tag story-tag";tagEl.textContent=text;tagEl.style.transition="none";tagEl.style.opacity=1;
  positionTag(tagEl, point);
}

/* ---------- pose karakter ---------- */
function pose(o) {
  const set = (n, x = 0, z = 0) => { const p = parts[n]; if (!p) return; p.rotation.set(p.userData.r0.x + x, p.userData.r0.y, p.userData.r0.z + z); };
  set("LegL", o.legL || 0); set("LegR", o.legR || 0);
  set("ArmL", o.armL || 0, o.armLz || 0); set("ArmR", o.armR || 0, o.armRz || 0);
  set("Head", o.head || 0, o.headZ || 0);
}
const walk = (t, amt) => ({ legL: Math.sin(t) * .6 * amt, legR: -Math.sin(t) * .6 * amt, armL: -Math.sin(t) * .5 * amt, armR: Math.sin(t) * .5 * amt });
const idlePose = t => ({ armL: Math.sin(t * 2) * .06, armR: -Math.sin(t * 2) * .06, head: Math.sin(t * 1.3) * .07, headZ: Math.sin(t * .9) * .05 });
/* muka di koordinat kepala (glTF: depan +Z) */
const faceAt = (zOff = 0.47) => parts.Head.localToWorld(V(0, 0.42, zOff));

/* ---------- ledakan: fisika + tumpukan (barang ga saling tembus, numpuk di lantai) ---------- */
let rnd = 7; const rand = () => (rnd = (rnd * 16807) % 2147483647) / 2147483647;
let BURST = [];
function initBurst() {
  BURST = [...Object.keys(BURST_ITEMS).map(n => ({ kind: "item", name: n, r: 0.36 })), ...chips.map(el => ({ kind: "chip", el, r: 0.14 }))];
  BURST.forEach(b => { b.v0 = V((rand() - .5) * 12, 6 + rand() * 7, (rand() - .5) * 1.2); b.w0 = V((rand() - .5) * 14, (rand() - .5) * 14, (rand() - .5) * 14); b.p = V(); b.rot = V(); });
}
let simCache = { key: "", frames: [] };
/* simulasi sekali per ukuran layar, disimpen per frame -> scrub/replay murah & deterministik */
function bakeBurst(origin, floorY, wallX) {
  const key = [origin.x, origin.y, floorY, wallX].map(v => v.toFixed(2)).join();
  if (simCache.key === key) return;
  const dt = 1 / 60, N = 60 * 4, P = BURST.map(b => ({ p: origin.clone(), v: b.v0.clone(), w: b.w0.clone(), rot: V(), r: b.r, rest: false }));
  const frames = [];
  for (let f = 0; f <= N; f++) {
    frames.push(P.map(q => [q.p.x, q.p.y, q.p.z, q.rot.x, q.rot.y, q.rot.z]));
    for (const q of P) {
      if (q.rest) continue;
      q.v.y -= 22 * dt; q.p.addScaledVector(q.v, dt); q.rot.addScaledVector(q.w, dt);
      if (q.p.y < floorY + q.r) { q.p.y = floorY + q.r; q.v.y *= -0.38; q.v.x *= 0.72; q.v.z *= 0.6; q.w.multiplyScalar(0.55); if (Math.abs(q.v.y) < 0.7) { q.v.y = 0; if (q.v.length() < 0.25) q.rest = true; } }
      if (Math.abs(q.p.x) > wallX - q.r) { q.p.x = Math.sign(q.p.x) * (wallX - q.r); q.v.x *= -0.5; }
      q.p.z = clamp(q.p.z, -0.6, 1.2);
    }
    // tabrakan antar barang (bola sederhana): dorong keluar, yang di atas numpuk
    for (let i = 0; i < P.length; i++) for (let j = i + 1; j < P.length; j++) {
      const a = P[i], b = P[j], d = a.p.clone().sub(b.p), L = d.length(), m = a.r + b.r;
      if (L > 0 && L < m) {
        const n = d.divideScalar(L), push = (m - L) / 2;
        a.p.addScaledVector(n, push); b.p.addScaledVector(n, -push);
        const rv = a.v.clone().sub(b.v).dot(n);
        if (rv < 0) { a.v.addScaledVector(n, -rv * 0.6); b.v.addScaledVector(n, rv * 0.6); a.rest = b.rest = false; }
      }
    }
  }
  simCache = { key, frames };
}

/* ---------- elemen DOM bab skill ---------- */
const $ = s => document.querySelector(s);
const introEl = $(".intro"), flipEl = $(".flip"), metaEl = $(".meta"), catEl = $(".flip .cat"), nameEl = $(".flip .name"),
      cntEl = $(".cnt"), gf = $(".gf"), gp = $(".gp"), preEl = $(".pre"), speedEl = $(".speed"),
      spTxt = $(".sp-txt"), spBar = $(".sp-bar i"), skK = $(".sk-k");
function sumTags() { $(".sum-tags").innerHTML = T().skill.sum.tags.map(x => `<span>${x}</span>`).join(""); }
const clkMe = $("#clkMe"), clkTeam = $("#clkTeam");

/* ---------- momen kekunci per section (jalan sendiri begitu stop kecapai) ---------- */
export const motion = { ww: { value: 0, goal: 0, duration: 3.6 }, bri: { value: 0, goal: 0, duration: 3.4 } };
function advanceMotion(flags, dt) {
  for (const name of ["ww", "bri"]) {
    const m = motion[name];
    if (!flags[name]) continue; // Rewind when the scene is visible, not while it is offscreen.
    const step = dt / (m.goal < m.value ? 1.4 : m.duration);
    m.value += Math.sign(m.goal - m.value) * Math.min(Math.abs(m.goal - m.value), step);
  }
}



/* ---------- energi kantong (section skill): cuma naik kalo scroll cepet ---------- */
const sk = { energy: 0, speed: 0, armed: false, burstT: -1, sumOn: false, sumAt: 0, lastIn: 0, lastIdx: -1, armT: undefined, burstProgress: 0, rewind: false, autoShown: false };
const N = SKILLS.length;
let skY = -1, storyStops = {};
export const setSkillY = (y, stops = {}) => { skY = y; storyStops = stops; };
addEventListener("navigate", ({ detail }) => {
  for (const name of ["ww", "bri"]) {
    const y = storyStops[name];
    if (detail.dir > 0 && detail.to >= y && detail.from <= y + 6) motion[name].goal = 1;
    // Returning to a scene holds its last pose. Rewind only when swiping UP out of it.
    if (detail.dir < 0 && Math.abs(detail.to - y) < 6) motion[name].goal = motion[name].value;
    else if (detail.dir < 0 && detail.from >= y - 6 && detail.to < y - 6) motion[name].goal = 0;
  }
  if (detail.dir < 0 && sk.burstT >= 0 && detail.to <= skY + 6 && detail.from >= skY - 6) {
    sk.rewind = true; sk.sumOn = false;
  }
});
const CHARGE_EFFORT = .75;
const FAST = 28;            // ~px per frame yang dianggap "cepet"
setCapture((delta, kind) => {
  if (skY < 0 || Math.abs(scrollY - skY) > 6) return false;          // cuma aktif pas nempel di section skill
  if (delta < 0 || sk.rewind) return false;
  if (sk.burstT >= 0) {
    const gap = performance.now() - sk.lastIn; sk.lastIn = performance.now();
    return gap < 240; // Consume the charging swipe's tail, but never lock a fresh gesture.
  }
  const now = performance.now(), dt = clamp(now - sk.lastIn, 4, 400); sk.lastIn = now;
  const v = Math.min(Math.abs(delta), 240) / dt * 16;                      // ~px per frame
  sk.speed = lerp(sk.speed, v, 0.25);
  // pelan: nambah dikit banget; cepet: lumayan. Arah balik = turun.
  const fast = clamp(sk.speed / FAST, 0, 1.6);
  const gain = (0.0007 + 0.0022 * Math.pow(fast, 1.8)) * Math.min(Math.abs(delta), 240) / 80;
  sk.energy = clamp(sk.energy + Math.sign(delta) * gain / CHARGE_EFFORT);
  return true;
});

export function skillState() { return sk; }
window.__sk = sk;

/**
 * flags: section aktif. at: {ww, bri, sk} = lagi nempel di stop section itu.
 * Return: { pocket: pose kantong kalo dipegang karakter, camY }
 */
export function updateStory(f, at, t, dt) {
  const out = { pocket: null };
  if (!st.ready) return out;
  const M = view.mobile, CH = M ? 0.7 : 0.85;
  advanceMotion(f, dt);
  if (sk.rewind && !f.about && !f.contact) {
    sk.burstProgress = Math.max(0, sk.burstProgress - dt * 4);
    if (sk.burstProgress === 0) {
      Object.assign(sk, { energy: 0, speed: 0, burstT: -1, sumOn: false, rewind: false, lastIdx: -1, armT: t - .9, autoShown: false });
    }
  } else if (sk.burstT >= 0) sk.burstProgress = Math.min(4, sk.burstProgress + dt);

  /* reset tampilan default tiap frame */
  goys.visible = f.ww || f.bri || f.sk || f.about || f.contact;
  batu.scale.setScalar(0); topeng.scale.setScalar(0); dasi.scale.setScalar(0);
  for (const n in BURST_ITEMS) if (n !== "batu" && n !== "topeng") BURST_ITEMS[n].scale.setScalar(0);
  chips.forEach(c => c.style.opacity = 0); HOT.forEach(n => { hotTags[n].style.opacity = 0; hotGlow[n].set(V(), 0, 0, t); });
  [introEl, flipEl, metaEl, speedEl].forEach(e => e.style.opacity = 0); preEl.classList.remove("on");
  if (!goys.visible) return out;
  goys.scale.setScalar(CH);

  /* ---------- WISEWIRES: kunci, jatoh ke batu, jongkok, lompat (otomatis) ---------- */
  if (f.ww) {
    const mm = clkMe && (Math.floor(t * 4) % 60), pad = x => String(x).padStart(2, "0");
    clkMe.innerHTML = `23<i>:</i>${pad(mm)}`; clkTeam.innerHTML = `08<i>:</i>${pad(mm)}`;
    const k = REDUCE ? motion.ww.goal : motion.ww.value;
    const base = screenToWorld(view.W * (M ? .5 : .62), view.H * (M ? .33 : .76));
    const stoneX = base.x - (M ? 0.5 : 0.7), stoneY = base.y - 0.2;
    const landX = base.x + (M ? 0.55 : 1.25), landY = stoneY - 0.05;
    if (M) { /* mobile: lompatan lebih rendah biar ga kepotong atas */ }
    const press = Math.max(0, Math.sin(clamp((k - 0.3) / 0.14) * Math.PI));
    batu.position.set(stoneX, stoneY - press * 0.18 + Math.sin(t * 1.5) * 0.04 * (1 - press), 0);
    batu.rotation.set(0.25, -0.5 + Math.sin(t * 0.5) * 0.08, 0);
    batu.scale.setScalar(batu.userData.base * 1.25);
    // karakter: dari atas layar (nyambung panah turun), jatoh ke batu, jongkok, lompat, mendarat
    const fall = ease(seg(k, 0.0, 0.3)), crouch = Math.sin(clamp((k - 0.3) / 0.16) * Math.PI);
    const jump = seg(k, 0.46, 0.78), land = Math.sin(clamp((k - 0.78) / 0.1) * Math.PI);
    const top = stoneY + 0.28;
    let x = stoneX, y = lerp(top + 6, top, fall);
    if (jump > 0) { x = lerp(stoneX, landX, ease(jump)); y = lerp(top, landY, jump) + Math.sin(jump * Math.PI) * (M ? 0.7 : 1.3); }
    goys.position.set(x, y - crouch * 0.12 - land * 0.08, 0.4);
    const air = jump > 0 && jump < 1;
    goys.rotation.set(0, -0.35 + (jump >= 1 ? Math.sin(t * .5) * 0.1 : 0), air ? -Math.sin(jump * Math.PI) * 0.25 : 0);
    pose(air ? { legL: -0.9, legR: 0.5, armL: -2.6, armR: -2.4, armLz: .3, armRz: -.3, head: -0.15 }
       : fall < 1 ? { armL: -2.8 * (1 - fall), armR: -2.8 * (1 - fall), legL: .3 * (1 - fall), legR: -.3 * (1 - fall) }
       : jump >= 1 ? { ...idlePose(t), legL: land * .5, legR: land * .5 }
       : { legL: crouch * .6, legR: crouch * .6, armL: crouch * .8, armR: crouch * .8 });
    goys.scale.set(CH * (1 + (crouch + land) * .06), CH * (1 - (crouch + land) * .12), CH);
    if (M) st.visual = fitMobileScene([goys,batu], null, true);
    showStoryTag(T().ww.tag, worldToScreen(batu.position.clone().add(V(.5,-.1,0))));
  }

  /* ---------- BRI: kunci, jalan masuk, dasi + topeng terbang ke muka, jadi kaku (otomatis) ---------- */
  if (f.bri) {
    const k = REDUCE ? motion.bri.goal : motion.bri.value;
    goys.visible = k > 0;
    const spot = screenToWorld(view.W * (M ? .5 : .36), view.H * (M ? .32 : .72));
    const walkIn = ease(seg(k, 0.0, 0.3)), tieOn = ease(seg(k, 0.3, 0.48)), maskOn = ease(seg(k, 0.5, 0.78));
    const settle = Math.sin(clamp((k - 0.78) / 0.12) * Math.PI);
    goys.position.set(lerp(spot.x - 3, spot.x, walkIn), spot.y + (walkIn < 1 ? Math.abs(Math.sin(t * 9)) * 0.06 : 0), 0.4);
    goys.rotation.set(0, lerp(1.2, 0.2, walkIn), 0);
    const stiff = maskOn;
    pose(walkIn < 1 ? walk(t * 9, 1)
         : { armL: lerp(Math.sin(t * 2) * .06, 0, stiff), armR: lerp(-Math.sin(t * 2) * .06, 0, stiff) - tieOn * (1 - maskOn) * 1.2,
             head: lerp(Math.sin(t * 1.3) * .07, 0.03 + Math.sin(t * 1.1) * 0.02, stiff) - settle * .1, headZ: (1 - stiff) * Math.sin(t * .9) * .05 });
    // dasi: muncul dari atas, nempel ke dada
    const chest = parts.Torso ? parts.Torso.localToWorld(V(0, 0.82, 0.24)) : goys.position.clone();
    const tieFrom = chest.clone().add(V(0.6, 1.4, 0.4));
    dasi.position.copy(tieFrom.lerp(chest, tieOn)); dasi.rotation.set(0, goys.rotation.y + (1 - tieOn) * 4, 0);
    dasi.scale.setScalar(dasi.userData.base * 0.42 * CH * Math.min(1, k * 8));
    // topeng: muncul gede di samping, muter, terbang nempel ke muka (pelat kotak, pas muka)
    const face = faceAt(0.47), hover = goys.position.clone().add(V(M ? 0.55 : 1.4, M ? 0.9 : 1.8, 0.6));
    const app = ease(seg(k, 0.36, 0.5));
    const p = hover.clone().lerp(face, maskOn); p.y += Math.sin(t * 1.5) * 0.06 * (1 - maskOn);
    topeng.position.copy(p);
    topeng.rotation.set(0, goys.rotation.y + (1 - maskOn) * (Math.sin(t * .8) * .4 + 6.28 * (1 - app)), 0);
    topeng.scale.setScalar(topeng.userData.base * lerp(1.4 * app, 0.86 * CH, maskOn) * (1 + settle * 0.06));
    if (M) st.visual = fitMobileScene([goys,topeng,dasi], null, true);
    showStoryTag(T().bri.tag, worldToScreen(faceAt().add(V(.5,.15,0))));
  }

  /* ---------- skill: copot topeng, angkat kantong, ISI ENERGI (harus scroll cepet), meledak (kekunci), popup ---------- */
  if (f.sk || f.about || f.contact) {
    // Preserve the burst across the summary and contact; only upward replay resets it.
    sk.speed *= Math.pow(0.04, dt);                 // kecepatan luruh kalo berhenti
    if (sk.burstT < 0 && sk.speed < 3) sk.energy = Math.max(0, sk.energy - dt * 0.004);   // diem lama: bocor dikit
    if (f.sk && sk.energy >= 1 && sk.burstT < 0) { sk.burstT = t; sk.burstProgress = 0; sk.autoShown = false; }
    if (f.sk && sk.burstT >= 0 && !sk.rewind && !sk.autoShown && sk.burstProgress >= 1.5 && Number.isFinite(storyStops.about)) {
      sk.autoShown = true; goTo(storyStops.about);
    }
    if (sk.burstT >= 0 && !sk.rewind && !sk.sumOn && sk.burstProgress > 2.4) { sk.sumOn = true; sk.sumAt = performance.now(); }

    const spot = screenToWorld(view.W * .5, view.H * (M ? .86 : .93));
    const exploded = sk.burstT >= 0;
    const bt = sk.burstProgress;
    const e = sk.energy, enterK = at.sk || f.contact ? 1 : 0;
    goys.position.set(spot.x, spot.y, 0.4); goys.rotation.set(0, 0.15 + Math.sin(t * .5) * .05, 0);
    // karakter: abis meledak, ilang (kecilin + puff)
    const vanish = exploded ? ease(clamp(bt / 0.35)) : 0;
    goys.visible = !f.about && !f.contact && vanish < 1;
    const lift = ease(clamp((t - (sk.armT ??= t)) / 0.9)) * enterK;
    if (!at.sk && !exploded) sk.armT = t;
    // topeng copot & dilempar
    const off = lift;
    if (off < 1 && !f.about && !f.contact) {
      topeng.position.copy(faceAt(0.47)).add(V(off * 2.6, off * 1.3 - off * off * 4, off));
      topeng.rotation.set(off * 5, off * 3, off * 2); topeng.scale.setScalar(topeng.userData.base * 0.86 * CH * (1 - off));
    }
    const tension = ease(Math.min(1, e * 1.05)), shake = REDUCE ? 0 : tension * tension;
    pose({ armL: -2.9 * lift + Math.sin(t * 30) * .08 * shake, armR: -2.9 * lift - Math.sin(t * 27) * .08 * shake, armLz: .25 * lift, armRz: -.25 * lift,
           legL: Math.sin(t * 25) * .05 * shake, legR: -Math.sin(t * 25) * .05 * shake, head: -0.35 * lift });
    goys.scale.set(CH * (1 + .05 * shake) * (1 - vanish), CH * (1 - .07 * shake) * (1 - vanish) , CH * (1 - vanish));
    const above = V(spot.x, spot.y + 2.55 * CH, 0.4);
    const pp = { pos: above.clone(), scale: (M ? .55 : .62) * lerp(0.3, 1, lift), sx: 1 + 0.3 * tension, sy: 1 + 0.24 * tension,
                 rz: Math.sin(t * 34) * .12 * shake, ry: -.2 + Math.sin(t * 23) * .15 * shake, glow: 0.7 + 1.6 * tension, jit: shake };
    // HUD: nama skill ganti-gantian sesuai energi, meter, & indikator kecepatan
    const idx = Math.min(N - 1, Math.floor(N * e));
    const show = f.sk && !exploded && lift > 0.5;
    introEl.style.opacity = f.sk && !exploded ? 1 : 0;
    flipEl.style.opacity = metaEl.style.opacity = speedEl.style.opacity = show ? 1 : 0;
    skK.style.opacity = exploded ? 0 : 1;
    if (show && idx !== sk.lastIdx) {
      const [n, g] = SKILLS[idx]; nameEl.textContent = n; catEl.textContent = T().skill.cats[g];
      nameEl.classList.remove("bump"); void nameEl.offsetWidth; nameEl.classList.add("bump"); sk.lastIdx = idx;
    }
    const cap = Math.round(e * 150);
    cntEl.textContent = `${idx + 1} / ${N}`; gp.textContent = cap + "%"; gf.style.width = Math.min(100, cap / 1.5) + "%";
    gf.style.background = cap > 120 ? "var(--accent)" : cap > 80 ? "var(--mustard)" : "var(--sage)";
    const sp01 = clamp(sk.speed / FAST / 1.4);
    spBar.style.width = (sp01 * 100) + "%";
    const fast = sk.speed > FAST * 0.75;
    speedEl.classList.toggle("fast", fast); speedEl.classList.toggle("slow", !fast);
    spTxt.textContent = fast ? T().skill.go : T().skill.faster;
    // barang ngulik ngintip pas skill-nya muncul
    if (show) {
      const itn = SKILLS[idx][2];
      for (const n of HOT) {
        const it = BURST_ITEMS[n]; it.userData.pop = lerp(it.userData.pop || 0, itn === n ? 1 : 0, 0.15);
        const pop = it.userData.pop; if (pop < 0.01) continue;
        const pos = above.clone().add(V((M ? 0.4 : 1.2) * pop, 0.9 * pop + Math.sin(t * 2) * .05, 0.4));
        it.position.copy(pos); it.rotation.set(.5, t * 1.2, Math.sin(t * 1.7) * .15); it.scale.setScalar(it.userData.base * pop * (M ? .7 : 1));
        hotGlow[n].set(pos, it.userData.base, pop, t);
      }
    }
    preEl.classList.toggle("on", show && e > 0.9);
    // meledak: kekunci, barang berceceran, kantong tinggal (karakter ilang), terus popup kesimpulan
    if (exploded) {
      const after = ease(clamp(bt / 0.5));
      Object.assign(pp, { sx: lerp(1.6, .98, after), sy: lerp(1.5, .82, after), rz: .2 * after, jit: 0, glow: lerp(4, 0.8, ease(clamp(bt / 1.6))), scale: (M ? .55 : .62) });
      pp.pos.y = lerp(above.y, spot.y + 0.35, ease(clamp((bt - 0.2) / 0.7)));        // kantong jatoh ke lantai
      const fl = screenToWorld(view.W / 2, view.H * .97).y, wl = Math.abs(screenToWorld(view.W * .02, view.H / 2).x);
      bakeBurst(above.clone().add(V(0, .3, 0)), fl, wl);
      const fr = simCache.frames[Math.min(simCache.frames.length - 1, Math.floor(bt * 60))];
      const grow = ease(clamp(bt / 0.25)), dim = f.contact || f.about ? 0.18 : 1;
      BURST.forEach((b, i) => {
        const [x, y, z, rx, ry, rz] = fr[i];
        if (b.kind === "item") {
          const it = BURST_ITEMS[b.name]; it.position.set(x, y, z); it.rotation.set(rx, ry, rz);
          it.scale.setScalar(it.userData.base * (M ? .6 : .78) * grow);
          if (hotGlow[b.name]) hotGlow[b.name].set(it.position, it.userData.base * .8, .45 * grow * dim, t);
        } else {
          const s2 = worldToScreen(V(x, y, z)); b.el.style.opacity = grow * dim;
          b.el.style.transform = `translate(${s2.x}px,${s2.y}px) translate(-50%,-50%) rotate(${(rz * 12) % 50 - 25}deg)`;
        }
      });
      const tagsOn = clamp((bt - 1.6) / 0.5) * (sk.sumOn || f.contact ? 0 : 1);
      HOT.forEach(n => {
        const s2 = worldToScreen(BURST_ITEMS[n].position.clone().add(V(.3, .35, 0)));
        hotTags[n].style.opacity = tagsOn; hotTags[n].style.transform = `translate(${s2.x}px,${s2.y}px) rotate(-5deg)`;
      });
      // The summary now lives in the next full section and is never timer-hidden.
    }
    if (M && f.sk && !exploded) st.visual = fitMobileScene([goys,topeng],pp);
    st.burstVisible = exploded && BURST_ITEMS.esp32.scale.x > .001;
    out.pocket = pp;
  }
  return out;
}
