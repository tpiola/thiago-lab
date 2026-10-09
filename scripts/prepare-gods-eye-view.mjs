import { cp, readFile, rm, writeFile } from 'node:fs/promises';
import { resolve } from 'node:path';

const root = resolve('vendor/gods-eye-view');
const path = (file) => resolve(root, file);
const pkg = JSON.parse(await readFile(path('package.json'), 'utf8'));
pkg.exports['./hosted-providers'] = './hosted-providers.js';
await writeFile(path('package.json'), JSON.stringify(pkg, null, 2) + '\n');
await cp(resolve('integrations/gods-eye-view/hosted-providers.js'), path('hosted-providers.js'));

// Exclude non-commercial datasets before any browser assets are built.
await rm(path('public/events/bhote-koshi-2026'), { recursive: true, force: true });
await rm(path('src/data/local_data/telegeography_submarine_cables'), { recursive: true, force: true });
await writeFile(path('src/data/bhoteKoshiFloodPath.js'), '// Restricted event data excluded from the hosted integration.\nexport const BHOTE_KOSHI_FLOOD_PATH = Object.freeze([]);\n');
let catalog = await readFile(path('src/app/constructCatalog.js'), 'utf8');
catalog = catalog
  .replace("import { createBhoteKoshiEventLayer } from '../data/bhoteKoshiEvent.js';\n", '')
  .replace("import { createBhoteKoshiLocatorLayer } from '../data/bhoteKoshiLocator.js';\n", '')
  .replace('        createBhoteKoshiEventLayer(),\n        createBhoteKoshiLocatorLayer({\n          boundaryResolver: nepalBoundaryResolver,\n        }),\n', '')
  .replace('      metadata,\n    );', "      metadata.filter((entry) => !entry.id.startsWith('bhote-koshi')),\n    );");
await writeFile(path('src/app/constructCatalog.js'), catalog);
await writeFile(path('src/layers/submarineCables/bundledSource.js'), `
// TeleGeography non-commercial data is deliberately excluded.
export function createBundledCableSource() {
  const empty = () => ({ type: 'FeatureCollection', features: [] });
  return { label: 'Not configured', fetch: async () => ({ cables: empty(), landingPoints: empty() }) };
}
`);
let recipes = await readFile(path('src/scenes/recipes.js'), 'utf8');
const start = recipes.indexOf("import { expandNepalEvidencePack }");
const marker = 'const EVENT_RECIPES = [BHOTE_KOSHI_NEPAL_BOOTSTRAP_RECIPE].filter(Boolean);';
if (start >= 0) {
  const end = recipes.indexOf(marker);
  if (end < start) throw new Error('Pinned scene recipes no longer match the integration');
  recipes = recipes.slice(0, start) + 'const EVENT_RECIPES = [];' + recipes.slice(end + marker.length);
}
recipes = recipes.replace('export const SCENE_APPEND_RECIPES = BHOTE_KOSHI_NEPAL_APPEND_RECIPE\n  ? [BHOTE_KOSHI_NEPAL_APPEND_RECIPE]\n  : [];', 'export const SCENE_APPEND_RECIPES = [];');
await writeFile(path('src/scenes/recipes.js'), recipes);
console.log('Pinned globe integration prepared.');
