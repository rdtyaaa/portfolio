// Orkestrasi: layout stop, loop animasi section 1-3 (kenalan, pilih mode, kenapa kantong).
import * as THREE from "three";
import { scene, camera, render, resize, view, load, normalize, screenToWorld, worldToScreen, hit, bloom,
         clamp, seg, ease, outBack, lerp, V, REDUCE } from "./stage.js?v=r17";
import { pocket, loadPocket, updatePocket, mouth } from "./pocket.js?v=r17";
import { makeGlow } from "./glow.js?v=r17";
import { setStops } from "./scroll.js?v=r17";
import { ch, loadChapters, updateChapters } from "./chapters.js?v=r17";
import { st, loadStory, updateStory, skillState, setSkillY, fitMobileScene } from "./story.js?v=r17";
import { state, T, renderText } from "./text.js?v=r17";
import { arrangeMobile, activateComposition } from "./composition.js?v=r17";

renderText();
const $ = s => document.querySelector(s);
const loadingEl = $("#loading"); loadingEl.textContent = T().ui.loading;
camera.position.set(0, 1.6, 9); camera.lookAt(0, 0.2, 0);

/* ---------- section & stop ---------- */
const secs = [...document.querySelectorAll(".sec")];
const S = Object.fromEntries(secs.map(s => [s.dataset.sec, s]));
const dots = $(".dots"); dots.innerHTML = secs.map(() => "<i></i>").join("");
let stopY = {};
function layout() {
  resize();
  camera.fov = view.mobile ? 44 : 32; camera.updateProjectionMatrix();
  const span = s => s.offsetHeight - view.H, at = (n, f) => Math.round(S[n].offsetTop + span(S[n]) * f);
  const max = document.documentElement.scrollHeight - view.H;
  stopY = { hero0: 0, hero1: at("hero", 0.6), mode: at("mode", 0.5), why: at("why", 0.6),
            uni: at("uni", 0.62), btn0: at("btn", 0.36), btn1: at("btn", 0.62), btn2: at("btn", 0.8), btn3: at("btn", 1),
            ww: at("ww", 0.5), bri: at("bri", 0.5), sk: S.skill.offsetTop, about: S.about.offsetTop, contact: Math.min(S.contact.offsetTop, max) };
  // Keep camera waypoints, but travel through the complete QA turn in one gesture.
  setStops(Object.entries(stopY).filter(([k]) => !["btn1", "btn2", "btn3"].includes(k)).map(([, y]) => y), { from: stopY.btn0, to: stopY.ww, turnEnd: stopY.btn3 });
  setSkillY(stopY.sk, stopY);
  window.__stops = Object.values(stopY);
  arrangeMobile(secs);
}
addEventListener("resize", layout); layout();
addEventListener("textrender", () => requestAnimationFrame(layout));
document.fonts.ready.then(layout);
/** progress 0..1 dalam section (0 = baru nempel, 1 = mau lepas) */
const prog = (n, y) => clamp((y - S[n].offsetTop) / Math.max(S[n].offsetHeight - view.H, 1));

/* ---------- pose kantong per stop (posisi layar, skala) ---------- */
const P = () => view.mobile
  ? { hero0: [.5, .3, .9], hero1: [.5, .3, .9], mode: [.5, 1.25, 0], why: [.5, .32, .7], uni: [.5, .4, .8],
      btn0: [.5, 1.3, 0], btn1: [.5, 1.3, 0], btn2: [.5, 1.3, 0], btn3: [.5, 1.3, 0],
      ww: [.5, 1.3, 0], bri: [.5, 1.3, 0], sk: [.5, 1.3, 0], about: [.5, 1.3, 0], contact: [.5, 1.3, 0] }
  : { hero0: [.7, .58, 1.15], hero1: [.7, .58, 1.15], mode: [.5, 1.3, 0], why: [.27, .62, 1.1], uni: [.72, .68, 1.0],
      btn0: [.72, 1.3, 0], btn1: [.72, 1.3, 0], btn2: [.72, 1.3, 0], btn3: [.72, 1.3, 0],
      ww: [.72, 1.3, 0], bri: [.72, 1.3, 0], sk: [.5, 1.3, 0], about: [.5, 1.3, 0], contact: [.5, 1.3, 0] };
function poseAt(y) {
  const keys = Object.keys(stopY), p = P();
  let k = 0; while (k < keys.length - 2 && y >= stopY[keys[k + 1]]) k++;
  const a = keys[k], b = keys[k + 1], t = ease(seg(y, stopY[a], stopY[b]));
  return p[a].map((v, i) => lerp(v, p[b][i], t));
}

/* ---------- barang buat section "kenapa kantong" ---------- */
const WHY_ITEMS = ["esp32", "sendal_hermes", "pensil"];
const items = {}, glows = {};
const tmpPos = V();

/* ---------- interaksi kantong di hero ---------- */
const bubble = document.createElement("div"); bubble.className = "bubble"; document.body.appendChild(bubble);
let clickT = -9, clickClosed = false, bubbleTxt = "", peek = null;
const canvas = $("#stage");
canvas.addEventListener("pointermove", e => { canvas.style.cursor = pocket.ready && heroish() && hit(pocket.group, e) ? "pointer" : ""; });
canvas.addEventListener("click", e => {
  if (!pocket.ready || !heroish() || !hit(pocket.group, e)) return;
  clickT = clock.elapsedTime; clickClosed = zipNow < 0.9;
  const h = T().hero; bubbleTxt = clickClosed ? h.closed : h.bubble[Math.floor(Math.random() * h.bubble.length)];
  peek = clickClosed ? null : WHY_ITEMS[Math.floor(Math.random() * WHY_ITEMS.length)];
});
const heroish = () => sy < stopY.hero1 + view.H * 0.3;

/* ---------- loop ---------- */
const clock = new THREE.Clock(), testY = /#y=([\d.]+)/.exec(location.hash);
let sy = scrollY, zipNow = 0, jumpT = -9, wasOpen = false, ready = false;
const hintEl = $("#hint"), modesEl = $(".modes"), needsEl = () => [...document.querySelectorAll("#needs li")];
const BG = { hero: new THREE.Color("#13110e"), mode: new THREE.Color("#0f0d0b"), why: new THREE.Color("#170f09"),
             uni: new THREE.Color("#19120b"), btn: new THREE.Color("#0f1612"), ww: new THREE.Color("#0c1418"),
             bri: new THREE.Color("#0b1222"), skill: new THREE.Color("#170d07"), about: new THREE.Color("#15130f"), contact: new THREE.Color("#13110e") };
const CAM0 = { pos: V(0, 1.6, 9), look: V(0, 0.2, 0) }, camLook = CAM0.look.clone();
const btnCol = $("#btncol");
let qaExitCam = null;

function frame() {
  requestAnimationFrame(frame);
  const dt = Math.min(clock.getDelta(), 1), t = clock.elapsedTime;
  sy += (scrollY - sy) * (REDUCE || testY ? 1 : 1 - Math.exp(-9 * dt));
  if (!ready) { render(); return; }

  const qh = prog("hero", sy), qm = prog("mode", sy), qw = prog("why", sy), qu = prog("uni", sy), qb = prog("btn", sy);
  const near = y => Math.abs(scrollY - y) < 6 && Math.abs(sy - y) < 30;          // lagi nempel di stop
  const cur = secs.reduce((b, s, i) => s.offsetTop - view.H * .5 <= sy ? i : b, 0);
  [...dots.children].forEach((d, i) => d.classList.toggle("on", i === cur));
  scene.background.lerp(BG[secs[cur].dataset.sec] || BG.hero, 0.08);
  modesEl.classList.toggle("glow", cur === 1);
  document.body.dataset.chapter = secs[cur].dataset.sec;
  activateComposition(secs[cur]);

  // ---- pose dasar + idle napas
  const [ax, ay, sc] = poseAt(sy), anchor = screenToWorld(view.W * ax, view.H * ay);
  const p = { pos: tmpPos.lerp(anchor, 0.18).clone(), scale: sc, sx: 1, sy: 1, rz: Math.sin(t * .7) * .03, ry: -.25 + Math.sin(t * .4) * .12,
              lift: Math.sin(t * 1.1) * .05, jit: 0, glow: 1, zip: 1, jig: 0 };
  p.sy += Math.sin(t * 1.6) * .022; p.sx -= Math.sin(t * 1.6) * .013;

  // ---- hero: resleting kebuka, terus ngecil, loncat, goyang
  const zip = ease(seg(qh, 0.05, 0.5)); zipNow = zip; p.zip = zip;
  if (zip > 0.97 && !wasOpen) { wasOpen = true; jumpT = t; }
  if (zip < 0.5) wasOpen = false;
  const jt = t - jumpT;
  if (jt >= 0 && jt < 1.6) {
    const a = seg(jt, 0, .28), b = seg(jt, .28, .62), c = seg(jt, .62, .78), d = seg(jt, .78, 1.6);
    const shrink = Math.sin(a * Math.PI / 2) * (1 - b);
    p.sx *= 1 - .18 * shrink + .1 * Math.sin(c * Math.PI); p.sy *= 1 - .26 * shrink + .16 * Math.sin(b * Math.PI) - .18 * Math.sin(c * Math.PI);
    p.lift += Math.sin(b * Math.PI) * .75;
    p.rz += Math.sin(d * Math.PI * 6) * .16 * (1 - d); p.ry += Math.sin(d * Math.PI * 4) * .25 * (1 - d);
  }
  p.glow *= lerp(0.06, 1, zip);
  hintEl.innerHTML = zip < .5 ? `${T().ui.unzip} <b aria-hidden="true"><svg viewBox="0 0 16 20" fill="none"><path d="M8 3v13m-4-4 4 4 4-4" stroke="currentColor" stroke-width="1.5" stroke-linecap="round" stroke-linejoin="round"/></svg></b>` : T().ui.click;

  // ---- klik: ngubek kayak mau ngeluarin barang
  const ct = t - clickT;
  if (ct >= 0 && ct < 1.6) {
    const env = Math.sin(clamp(ct / 1.6) * Math.PI);
    p.rz += Math.sin(t * 22) * .09 * env * (clickClosed ? .5 : 1); p.sx += Math.sin(t * 15) * .05 * env; p.sy += Math.cos(t * 13) * .06 * env;
    p.jig = clickClosed ? Math.max(0, 1 - ct / .8) : 0;
    if (!clickClosed) p.glow = Math.max(p.glow, 1 + 3 * env);
  }
  if (ct >= 0 && ct < 2.2) {
    const sp = worldToScreen(mouth(1.2));
    bubble.textContent = bubbleTxt; bubble.style.opacity = ct < 1.9 ? 1 : 0;
    bubble.style.transform = `translate(${sp.x}px,${sp.y}px) translate(-50%,-100%) scale(${outBack(seg(ct, 0, .3))})`;
  } else bubble.style.opacity = 0;

  // ---- why: daftar kebutuhan nongol, barang keluar satu-satu (pasangan "butuh → bikin")
  needsEl().forEach((li, i) => li.classList.toggle("on", cur === 2 && qw > 0.05 + i * 0.07));
  for (let i = 0; i < WHY_ITEMS.length; i++) {
    const n = WHY_ITEMS[i], it = items[n], s = it.userData.base;
    const out = cur === 2 ? ease(seg(qw, 0.12 + i * 0.14, 0.24 + i * 0.14)) : 0;
    if (out > 0 && out < 1) { p.rz += Math.sin(t * 20) * .05 * (1 - out); p.glow = Math.max(p.glow, 1 + 2 * Math.sin(out * Math.PI)); }
    let show = out, pos;
    if (peek === n && ct >= 0 && ct < 1.6) {                         // ngintip pas diklik di hero
      const up = Math.sin(clamp((ct - .35) / 1) * Math.PI);
      pos = mouth(.45).add(V(0, up * .55, .1)); show = Math.min(1, up * 2) * .8;
      it.rotation.set(.4, t * 2, Math.sin(t * 9) * .2);
    } else {
      const m = mouth(), fan = [[-0.35, 1.3], [0.75, 1.05], [1.45, 0.25]][i];
      const dst = m.clone().add(V(view.mobile ? (i - 1) * .9 : fan[0], view.mobile ? .6 : fan[1], .3));
      pos = m.clone().lerp(dst, outBack(out)); pos.y += Math.sin(t * 1.3 + i * 2) * .06 * out;
      it.rotation.set(.45 + (1 - out) * 2, -.4 + Math.sin(t * .6 + i) * .3 + (1 - out) * 4, Math.sin(t * .9 + i) * .08);
    }
    it.position.copy(pos); it.scale.setScalar(s * (view.mobile ? .58 : .95) * show);
    glows[n].set(pos, s * .9, (peek === n ? 0 : out) * (view.mobile ? .3 : 1), t + i);
  }
  if (peek && !(ct >= 0 && ct < 1.6)) peek = null;

  // ---- kuliah + BTN (barang di dunia, kamera gerak)
  const cx = updateChapters(qu, qb, cur === 3, cur === 4, t, p);
  p.rz += cx.fx.rz; p.sx += cx.fx.sx; p.sy += cx.fx.sy; p.glow = Math.max(p.glow, cx.fx.glow);
  p.scale *= cx.pocketFade;
  // kamera: dari ujung panah turun (BTN) nyambung ke batu
  let camT = cx.cam || CAM0;
  if (cur === 4 && cx.cam) qaExitCam = { pos: cx.cam.pos.clone(), look: cx.cam.look.clone() };
  if (cur === 5) {
    // nerusin gerak turun dari ujung panah: kamera dateng dari atas, ngerem pas nyampe stop
    const arrive = ease(seg(sy, S.btn.offsetTop + S.btn.offsetHeight - view.H, stopY.ww));
    const from = qaExitCam || CAM0;
    camT = { pos: from.pos.clone().lerp(CAM0.pos, arrive), look: from.look.clone().lerp(CAM0.look, arrive) };
  }
  const cl = 1 - Math.exp(-(cur === 5 || cur === 4 ? 12 : 9) * dt);
  camera.position.lerp(camT.pos, testY ? 1 : cl); camLook.lerp(camT.look, testY ? 1 : cl); camera.lookAt(camLook);
  btnCol.style.opacity = cur === 4 ? (cx.textFade ?? 1) : 1;

  // ---- WISEWIRES, BRI, skill (karakter)
  const sx_ = updateStory({ ww: cur === 5, bri: cur === 6, sk: cur === 7, about: cur === 8, contact: cur === 9 },
                          { ww: near(stopY.ww), bri: near(stopY.bri), sk: near(stopY.sk) }, t, dt);
  if (sx_.pocket) {
    const pp = sx_.pocket;
    Object.assign(p, { pos: pp.pos, scale: pp.scale, sx: pp.sx, sy: pp.sy, rz: pp.rz, ry: pp.ry, glow: pp.glow, jit: pp.jit, lift: 0, zip: 1 });
    tmpPos.copy(pp.pos);
  }


  updatePocket(p, t);
  if (view.mobile && [0, 2, 3].includes(cur)) {
    const objects = [pocket.group, ...(cur === 2 ? Object.values(items) : []), ...(cur === 3 ? [ch.laptop] : [])];
    const dock = cur !== 0 ? 1 : 1 - (jt >= 0 && jt < 1.6 ? Math.sin(jt / 1.6 * Math.PI) : 0);
    window.__compositionVisual = fitMobileScene(objects, null, dock);
    tmpPos.copy(pocket.group.position);
    if (cur === 2) WHY_ITEMS.forEach((n,i) => {
      const it=items[n],amt=it.scale.x/it.userData.base;
      glows[n].set(it.position,it.scale.x*1.2,Math.min(.3,amt*.5),t+i);
    });
    if (cur === 3) ch.refreshMobileFX(t);
  }
  bloom.strength = .5 + .08 * Math.min(p.glow, 4);
  render();
}

/* ---------- load ---------- */
Promise.all([loadPocket(), loadChapters(), loadStory(), ...WHY_ITEMS.map(n => load(`../assets/items/${n}.glb`).then(g => {
  const w = normalize(g); w.scale.setScalar(0); scene.add(w); items[n] = w; glows[n] = makeGlow();
  w.traverse(o => { if (o.isMesh && o.material.emissiveIntensity > 1) o.material.emissiveIntensity = .9; });
}))]).then(() => {
  ready = true; loadingEl.remove();
  if (testY) { history.scrollRestoration = "manual"; scrollTo(0, +testY[1] * (document.body.scrollHeight - innerHeight)); }
  tmpPos.copy(screenToWorld(view.W * P().hero0[0], view.H * P().hero0[1]));
}).catch(e => { loadingEl.textContent = "gagal load 3D: buka lewat buka.bat"; console.error(e); });
addEventListener("modechange", () => { if (loadingEl.isConnected) loadingEl.textContent = T().ui.loading; });
frame();
