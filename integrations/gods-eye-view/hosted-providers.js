import { celestrakProxy, rocketLaunchesProxy } from './server/providers/space.js';
import { adsbLolProxy } from './server/providers/aircraft/adsb-lol.js';
import { adsbdbProxy } from './server/providers/aircraft/enrichment.js';
import { normalizeAdsbLolPointResponse } from './src/data/adsbLolFallback.js';
import { terrainHeightsProxy } from './server/providers/terrain.js';
import { overpassProxy } from './server/providers/overpass.js';
import { militaryInstallationsProxy } from './server/providers/military-installations.js';
import { geocodeProxy } from './server/providers/regional/place.js';
import { weatherEffectsProxy } from './server/providers/regional/weather-effects.js';
import { radioBrowserProxy } from './server/providers/radio.js';
import { gbfsProxy } from './server/providers/gbfs.js';
import { transitProxy } from './server/providers/transit.js';
import { weatherProxy } from './server/providers/weather.js';
import { cycloneProxy } from './server/providers/cyclones.js';
import { windProxy } from './server/providers/wind.js';
import { firePerimetersProxy } from './server/providers/firePerimeters.js';

const flightCache = new Map();
const pendingFlights = new Map();
async function regionalFlights(req, res) {
  const query = new URL(req.url || '/', 'http://localhost').searchParams;
  const lat = Number(query.get('lat') ?? -20.5386);
  const lon = Number(query.get('lon') ?? -47.4008);
  if (!Number.isFinite(lat) || !Number.isFinite(lon) || Math.abs(lat) > 90 || Math.abs(lon) > 180) {
    res.writeHead(400); res.end('Invalid coordinates'); return;
  }
  const key = `${lat.toFixed(1)},${lon.toFixed(1)}`;
  let entry = flightCache.get(key);
  if (!entry || Date.now() - entry.at > 15000) {
    if (!pendingFlights.has(key)) {
      pendingFlights.set(key, (async () => {
        const response = await fetch(`https://api.adsb.lol/v2/point/${lat.toFixed(1)}/${lon.toFixed(1)}/250`, {
          signal: AbortSignal.timeout(18000),
          headers: { 'User-Agent': 'ThiagoLab-GodsEyeView/1.0' },
        });
        if (!response.ok) throw new Error('Flight provider unavailable');
        const fresh = { at: Date.now(), body: normalizeAdsbLolPointResponse(await response.json()) };
        if (flightCache.size > 64) flightCache.delete(flightCache.keys().next().value);
        flightCache.set(key, fresh);
        return fresh;
      })().finally(() => pendingFlights.delete(key)));
    }
    try { entry = await pendingFlights.get(key); } catch {
      if (!entry) { res.writeHead(503, { 'Content-Type': 'application/json' }); res.end(JSON.stringify({ error: 'Flight provider unavailable' })); return; }
    }
  }
  res.writeHead(200, {
    'Content-Type': 'application/json', 'Cache-Control': 'no-store',
    'X-Feed-Source': 'adsb.lol', 'X-Flight-Source': 'adsb.lol',
    'X-Flight-Coverage': 'regional snapshot within 250 nautical miles',
    'X-Feed-Cache': Date.now() - entry.at > 15000 ? 'STALE' : 'HIT',
    'X-Feed-Age-Ms': String(Date.now() - entry.at),
  });
  res.end(JSON.stringify(entry.body));
}

/** Install only providers that work in a request-scoped hosted environment. */
export function installHostedProviders(middlewares) {
  middlewares.use('/api/flights', async (req, res, next) => {
    if (new URL(req.url || '/', 'http://localhost').pathname !== '/') return next();
    await regionalFlights(req, res);
  });
  // Local credentials, OAuth login, persistent AIS sockets and paid APIs are not exposed.
  middlewares.use('/api/setup/status', (_req, res) => {
    res.writeHead(404, { 'Content-Type': 'application/json' });
    res.end(JSON.stringify({ enabled: false }));
  });
  for (const plugin of [
    celestrakProxy(), rocketLaunchesProxy(), adsbLolProxy(), adsbdbProxy(),
    terrainHeightsProxy(), overpassProxy(), militaryInstallationsProxy(),
    geocodeProxy(), weatherEffectsProxy(), radioBrowserProxy(), gbfsProxy(),
    transitProxy(), weatherProxy(), cycloneProxy(), windProxy(), firePerimetersProxy(),
  ]) plugin.configureServer({ middlewares });
  middlewares.use((_req, res) => {
    res.writeHead(503, { 'Content-Type': 'application/json' });
    res.end(JSON.stringify({ unavailable: true, configured: false, code: 'HOSTED_CAPABILITY_UNAVAILABLE', error: 'This capability is not configured in the hosted version.' }));
  });
}
