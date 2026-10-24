// One gesture per chapter; a fresh gesture or reversal can interrupt navigation.
// Only downward input at the unburst pocket is captured to build energy.
import { clamp, easeIO, view } from "./stage.js?v=r17";

let stops = [], capture = null, target = null, animation = 0;
let acc = 0, lastW = -Infinity, lastDir = 0, lastMagnitude = 0, consumed = false, qaRoute = null;
export const setStops = (list, qa = null) => { stops = list; qaRoute = qa; };
export const setCapture = fn => { capture = fn; };

function animateTo(y) {
  const id = ++animation, y0 = scrollY, dy = y - y0;
  const isQA = qaRoute && Math.abs(y0 - qaRoute.from) < 8 && Math.abs(y - qaRoute.to) < 8;
  const dur = isQA ? 8000 : clamp(Math.abs(dy) / view.H * 780, 850, 4200), t0 = performance.now();
  target = y;
  dispatchEvent(new CustomEvent("navigate", { detail: { from: y0, to: y, dir: Math.sign(dy) } }));
  (function step(now) {
    if (id !== animation) return;
    const t = clamp((now - t0) / dur);
    let travel = easeIO(t);
    if (isQA) {
      // Spend six seconds on the visible QA turn, not on waiting before the zoom.
      const turn = clamp((qaRoute.turnEnd - y0) / dy), phase = clamp(t / .75);
      travel = t <= .75 ? turn * (.8 * phase + .2 * easeIO(phase))
        : turn + (1 - turn) * easeIO((t - .75) / .25);
    }
    scrollTo(0, y0 + dy * travel);
    if (t < 1) requestAnimationFrame(step);
    else { target = null; dispatchEvent(new CustomEvent("arrive", { detail: { y } })); }
  })(t0);
}
export function go(dir) {
  if (target !== null && Math.sign(target - scrollY) === dir) return;
  const y = scrollY;
  const s = dir > 0 ? stops.find(s => s > y + 4) : [...stops].reverse().find(s => s < y - 4);
  if (s !== undefined) animateTo(s);
}
export const goTo = y => { consumed = true; lastW = performance.now(); animateTo(y); };

function input(delta, kind) {
  if (!delta) return;
  const now = performance.now(), dir = Math.sign(delta), gap = now - lastW, magnitude = Math.abs(delta);
  // Slow rendering can spread a single decaying trackpad tail across long event gaps.
  const decayingTail = consumed && magnitude < lastMagnitude * .98;
  const freshSwipe = gap > 1500 || (gap > 240 && !decayingTail) || (gap > 80 && magnitude > lastMagnitude * 1.8);
  if (dir !== lastDir || freshSwipe || kind === "key") {
    acc = 0; consumed = false;
  }
  lastW = now; lastDir = dir; lastMagnitude = magnitude;
  if (target === null && capture && capture(delta, kind)) { acc = 0; return; }
  // One physical swipe includes its momentum after arrival; only a new swipe re-arms navigation.
  if (consumed) return;
  if (target !== null && Math.sign(target - scrollY) === dir) return;
  acc += delta;
  if (Math.abs(acc) > (kind === "touch" ? 30 : 24)) {
    go(Math.sign(acc)); acc = 0; consumed = true;
  }
}

function panelCanScroll(target, delta) {
  const panel = target?.closest?.("[data-scroll-panel]");
  if (view.mobile || !panel || panel.inert) return false;
  return delta > 0 ? panel.scrollTop + panel.clientHeight < panel.scrollHeight - 2 : delta < 0 && panel.scrollTop > 2;
}
addEventListener("wheel", e => {
  if (e.ctrlKey || panelCanScroll(e.target, e.deltaY)) return;
  e.preventDefault();
  input(e.deltaY * (e.deltaMode === 1 ? 33 : e.deltaMode === 2 ? view.H : 1), "wheel");
}, { passive: false });
addEventListener("keydown", e => {
  if (e.target?.closest?.("input, textarea, select, [contenteditable=true]")) return;
  const d = { ArrowDown: 1, PageDown: 1, " ": e.shiftKey ? -1 : 1, ArrowUp: -1, PageUp: -1 }[e.key];
  if (!d || (e.key === " " && e.target?.closest?.("button, a"))) return;
  e.preventDefault(); input(d * 120, "key");
});
let ty = null;
addEventListener("touchstart", e => { ty = e.touches[0].clientY; lastW = -Infinity; }, { passive: true });
addEventListener("touchmove", e => {
  if (ty === null || e.touches.length !== 1) return;
  const y = e.touches[0].clientY, delta = (ty - y) * 2.2; ty = y;
  if (panelCanScroll(e.target, delta)) return;
  e.preventDefault(); input(delta, "touch");
}, { passive: false });
addEventListener("touchend", () => { ty = null; });
addEventListener("touchcancel", () => { ty = null; });
