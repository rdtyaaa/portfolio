# Yoga Raditya · Portfolio

A personal, scroll-driven portfolio about QA, learning, and building things for fun.

Three copy modes: Goys, Yoga Raditya, and Yoga (EN). The 3D pocket holds knowledge and experience collected along the way.

## Run locally

From this repository directory:

```bash
python -m http.server 8765
```

Open `http://localhost:8765/web/`.

## Structure

- `web/`: active HTML, CSS, and JavaScript modules
- `assets/`: self-contained GLB models used by the website
- `index.html`: renders the portfolio directly at the public root; `<base href="./web/">` preserves the shared module, stylesheet, and model paths

Three.js is pinned in the import map. Fonts and Three.js load from their external providers, so an internet connection is needed.

## Hosting

GitHub Pages publishes the `main` branch from the repository root. No package install or build step is required.
