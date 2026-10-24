// Teks & mode bahasa: isi [data-k], toggle tombol mode, event "modechange".
import { COPY } from "./copy.js?v=r17";

export const state = { mode: localStorage.getItem("goys-mode3") || "goys" };
export const T = () => COPY[state.mode];
const get = (o, p) => p.split(".").reduce((a, k) => a?.[k], o);

export function renderText() {
  const c = T();
  document.documentElement.lang = state.mode === "en" ? "en" : "id";
  document.querySelectorAll("[data-k]").forEach(el => { const v = get(c, el.dataset.k); if (typeof v === "string") el.textContent = matchMedia("(max-width:760px)").matches ? (c.compact?.[el.dataset.k] ?? v) : v; });
  document.querySelectorAll("[data-mode]").forEach(b => b.setAttribute("aria-pressed", b.dataset.mode === state.mode));
  document.querySelectorAll(".mcards button").forEach(b => b.dataset.badge = c.mode.picked);
  document.getElementById("active-mode-label").textContent = document.querySelector(`.modes [data-mode="${state.mode}"]`).textContent;
  document.querySelector(".mode-toggle").setAttribute("aria-label", state.mode === "en" ? "Change language mode" : "Ganti mode bahasa");
  const needs = document.getElementById("needs");
  if (needs) needs.innerHTML = c.why.list.map(t => `<li>${t}</li>`).join("");
  const jobs = document.getElementById("jobs");
  if (jobs) jobs.innerHTML = c.uni.jobs.rows.map(([a, b], i) => `<div class="row" style="transition-delay:${i * 90}ms"><span>${a}</span><span>${b}</span></div>`).join("");
  const eng = document.getElementById("eng");
  if (eng) eng.innerHTML = c.ww.eng.rows.map(([a, b]) => `<div class="row"><span>${a}</span><span>${b}</span></div>`).join("");
  const projects = document.getElementById("side-projects");
  if (projects) {
    projects.replaceChildren(...c.skill.sum.projects.map((p, i) => {
      const card = document.createElement("a");
      card.className = "side-project"; card.href = p.url; card.target = "_blank"; card.rel = "noopener noreferrer";
      const number = document.createElement("span"); number.className = "project-number"; number.textContent = String(i + 1).padStart(2, "0");
      const kind = document.createElement("small"); kind.textContent = p.kind;
      const title = document.createElement("h3"); title.textContent = p.title;
      const body = document.createElement("p"); body.textContent = p.body;
      const link = document.createElement("span"); link.className = "project-link"; link.textContent = c.skill.sum.projectLink + " ↗";
      card.append(number, kind, title, body, link); return card;
    }));
  }
  termI = 0;
  dispatchEvent(new Event("textrender"));
}

/* terminal kuliah: ngetik terus, ngulang */
let termI = 0;
setInterval(() => {
  const el = document.getElementById("term"); if (!el || !el.closest(".pin").classList.contains("act")) return;
  const full = T().uni.term.join("\n"), n = full.length;
  termI = termI > n + 40 ? 0 : termI + 1;
  el.innerHTML = full.slice(0, Math.min(termI, n)).replace(/&/g, "&amp;").replace(/</g, "&lt;") + '<span class="cur"></span>';
}, 45);
const modeToggle = document.querySelector(".mode-toggle");
const modeControl = document.querySelector(".mode-control");
function closeModes() { modeControl.classList.remove("open"); modeToggle.setAttribute("aria-expanded", "false"); }
modeToggle.addEventListener("click", () => {
  const open = modeToggle.getAttribute("aria-expanded") !== "true";
  modeToggle.setAttribute("aria-expanded", String(open)); modeControl.classList.toggle("open", open);
});
addEventListener("click", e => { if (!modeControl.contains(e.target)) closeModes(); });
addEventListener("keydown", e => {
  if (e.key === "Escape" && modeToggle.getAttribute("aria-expanded") === "true") { closeModes(); modeToggle.focus(); }
});
addEventListener("navigate", closeModes);
matchMedia("(max-width:760px)").addEventListener("change", closeModes);
document.querySelectorAll("[data-mode]").forEach(b => b.addEventListener("click", () => {
  closeModes();
  if (b.closest(".modes") && matchMedia("(max-width:760px)").matches) modeToggle.focus();
  if (state.mode === b.dataset.mode) return;
  state.mode = b.dataset.mode; localStorage.setItem("goys-mode3", state.mode); renderText();
  dispatchEvent(new Event("modechange"));
  if (b.closest(".mcards")) { b.classList.remove("flash"); void b.offsetWidth; b.classList.add("flash"); }
}));

// reveal per section
const io = new IntersectionObserver(es => es.forEach(e => {
  e.target.querySelectorAll(".rv").forEach((el, i) => { el.style.transitionDelay = (i * 70) + "ms"; el.classList.toggle("on", e.isIntersecting); });
  e.target.classList.toggle("act", e.intersectionRatio > 0.6);
}), { threshold: [0, 0.15, 0.6, 1] });
document.querySelectorAll(".pin").forEach(p => io.observe(p));
matchMedia("(max-width:760px)").addEventListener("change", renderText);
