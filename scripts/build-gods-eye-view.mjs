import { build } from 'vite';
import { cp, mkdir, readFile, writeFile } from 'node:fs/promises';
import { resolve } from 'node:path';
import { createBrowserViteConfig } from '../vendor/gods-eye-view/build/vite.js';

const root = resolve('vendor/gods-eye-view');
const outDir = resolve('public/gods-eye-view/app');
const base = '/gods-eye-view/app/';
const config = createBrowserViteConfig({
  command: 'build',
  // Credentials are optional; public deployments start with keyless imagery.
  googleApiKey: process.env.GEV_PUBLIC_GOOGLE_MAPS_KEY,
  cesiumToken: process.env.GEV_PUBLIC_CESIUM_ION_TOKEN,
  mapillaryToken: process.env.GEV_PUBLIC_MAPILLARY_TOKEN,
});
// Preserve Cesium's bundling hooks; own its asset copy for an absolute output path.
config.plugins[1].closeBundle = undefined;
config.plugins.push({
  name: 'thiago-lab-globe-paths',
  transform(code, id) {
    if (!id.startsWith(root) || !id.endsWith('.js')) return null;
    return {
      code: code
        .replace(/(["'`])\/api\//g, '$1/api/gods-eye-view/')
        .replace(/(["'`])\/models\//g, `$1${base}models/`),
      map: null,
    };
  },
});
await build({
  ...config, root, base, configFile: false,
  build: { ...config.build, outDir, emptyOutDir: true },
});
await cp(resolve('node_modules/cesium/Build/Cesium'), resolve(outDir, 'cesium'), { recursive: true });
await mkdir(resolve(outDir, 'credits'), { recursive: true });
for (const file of ['LICENSE', 'DATA_SOURCES.md', 'THIRD_PARTY_NOTICES.md']) {
  await cp(resolve(root, file), resolve(outDir, 'credits', file));
}
let html = await readFile(resolve(outDir, 'index.html'), 'utf8');
html = html.replace('<title>God\'s Eye View</title>', '<title>God\'s Eye View | Thiago Lab</title>');
html = html.replace('</head>', `<link rel="stylesheet" href="${base}hosted.css" /></head>`);
await writeFile(resolve(outDir, 'index.html'), html);
await writeFile(resolve(outDir, 'hosted.css'), `
/* Hosted-only controls are omitted; the underlying public globe remains intact. */
#gev-voice-control, #key-setup-chip,
[data-layer-id="bhote-koshi-2026"], [data-layer-id="bhote-koshi-locator"],
[data-layer-id="local-submarine-cables"] { display: none !important; }
`);
console.log('God\'s Eye View built for /gods-eye-view.');
