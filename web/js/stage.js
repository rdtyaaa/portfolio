// Panggung 3D bersama: renderer, kamera, bloom, loader, utilitas.
import * as THREE from "three";
import { GLTFLoader } from "three/addons/loaders/GLTFLoader.js";
import { EffectComposer } from "three/addons/postprocessing/EffectComposer.js";
import { RenderPass } from "three/addons/postprocessing/RenderPass.js";
import { UnrealBloomPass } from "three/addons/postprocessing/UnrealBloomPass.js";
import { OutputPass } from "three/addons/postprocessing/OutputPass.js";

export const clamp = (x, a = 0, b = 1) => Math.min(b, Math.max(a, x));
export const seg = (x, a, b) => clamp((x - a) / (b - a));
export const ease = t => t * t * (3 - 2 * t);
export const easeIO = t => t < .5 ? 4 * t * t * t : 1 - Math.pow(-2 * t + 2, 3) / 2;
export const outBack = t => { const c = 1.9; return 1 + (c + 1) * Math.pow(t - 1, 3) + c * Math.pow(t - 1, 2); };
export const lerp = (a, b, t) => a + (b - a) * t;
export const V = (x = 0, y = 0, z = 0) => new THREE.Vector3(x, y, z);
export const REDUCE = matchMedia("(prefers-reduced-motion: reduce)").matches;

const canvas = document.getElementById("stage");
export const renderer = new THREE.WebGLRenderer({ canvas, antialias: true });
renderer.setPixelRatio(Math.min(devicePixelRatio, 2));
renderer.toneMapping = THREE.ACESFilmicToneMapping;
export const scene = new THREE.Scene();
scene.background = new THREE.Color("#13110e");
export const camera = new THREE.PerspectiveCamera(32, 1, 0.1, 200);
const composer = new EffectComposer(renderer);
composer.addPass(new RenderPass(scene, camera));
export const bloom = new UnrealBloomPass(new THREE.Vector2(1, 1), 0.7, 0.5, 0.92);
composer.addPass(bloom);
composer.addPass(new OutputPass());
export const render = () => composer.render();

scene.add(new THREE.HemisphereLight(0xfff1e0, 0x2a1a10, 0.9));
const key = new THREE.DirectionalLight(0xffe9d2, 2.2); key.position.set(-3, 5, 6); scene.add(key);
const rim = new THREE.DirectionalLight(0xff7a3d, 1.6); rim.position.set(4, 2, -3); scene.add(rim);

export const view = { W: 1, H: 1, mobile: false };
export function resize() {
  view.W = innerWidth; view.H = innerHeight; view.mobile = view.W < 760;
  renderer.setSize(view.W, view.H, false); composer.setSize(view.W, view.H); bloom.setSize(view.W, view.H);
  camera.aspect = view.W / view.H; camera.updateProjectionMatrix();
}

const loader = new GLTFLoader();
export const load = url => new Promise((res, rej) => loader.load(url, g => res(g.scene), undefined, rej));

/** bungkus model: pivot di tengah bounding box, userData.base = skala biar dimensi max = 1 */
export function normalize(root) {
  const box = new THREE.Box3().setFromObject(root), size = box.getSize(V()), c = box.getCenter(V());
  root.position.sub(c);
  const g = new THREE.Group(); g.add(root); g.userData.base = 1 / Math.max(size.x, size.y, size.z);
  return g;
}

const ray = new THREE.Raycaster(), tmp = V();
/** titik dunia di bidang z=planeZ di bawah piksel layar */
export function screenToWorld(px, py, planeZ = 0, out = V()) {
  ray.setFromCamera({ x: px / view.W * 2 - 1, y: -(py / view.H) * 2 + 1 }, camera);
  ray.ray.intersectPlane(new THREE.Plane(V(0, 0, 1), -planeZ), out); return out;
}
export function worldToScreen(v) { tmp.copy(v).project(camera); return { x: (tmp.x + 1) / 2 * view.W, y: (1 - tmp.y) / 2 * view.H }; }
export function hit(obj, e) {
  ray.setFromCamera({ x: e.clientX / view.W * 2 - 1, y: -(e.clientY / view.H) * 2 + 1 }, camera);
  return ray.intersectObject(obj, true).length > 0;
}
