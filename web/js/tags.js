// Keep object labels in the viewport and clear of the mobile reading area.
import { view, clamp } from "./stage.js?v=r17";
export function positionTag(el, point, scale = 1, angle = 0) {
  const width = document.documentElement.clientWidth || view.W;
  const w = el.offsetWidth, h = el.offsetHeight;
  if (view.mobile) {
    const slot = document.getElementById("mobile-stage").getBoundingClientRect();
    const header = document.querySelector(".bar").getBoundingClientRect();
    const chapter = document.body.dataset.chapter;
    const reading = document.querySelector(`#${chapter} .col`);
    const top = Math.max(64, header.bottom + 10);
    const bottom = Math.min(view.H - h - 24, reading ? reading.getBoundingClientRect().top - h - 12 : view.H - h - 24);
    const x = clamp((width - w) / 2, 24, Math.max(24, width - w - 24));
    const preferred = chapter === "uni" && reading ? reading.getBoundingClientRect().top - h - 18 : slot.bottom + 8;
    const y = clamp(preferred, top, Math.max(top, bottom));
    el.style.transform = `translate(${x}px,${y}px)`;
    el.style.transition = "none";
  } else {
    const pad = 32;
    const x = clamp(point.x, pad, Math.max(pad, width - w - pad));
    const y = clamp(point.y, 74, Math.max(74, view.H - h - pad));
    el.style.transform = `translate(${x}px,${y}px) rotate(${angle}deg) scale(${scale})`;
  }
}
