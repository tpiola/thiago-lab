import L from 'leaflet';
import 'leaflet/dist/leaflet.css';
import * as satellite from 'satellite.js';

const css = document.createElement('style');
css.textContent = `
*{box-sizing:border-box}html,body,#map{width:100%;height:100%;margin:0}body{font-family:Inter,Arial,sans-serif;background:#0b151c;color:#dceae2}#map{position:absolute;inset:0;background:#192c35}.leaflet-container{font-family:Inter,Arial,sans-serif}.leaflet-control-attribution{font-size:9px}.leaflet-control-zoom a{background:#13211d;color:#cce7da;border-color:#355148}#panel{position:absolute;z-index:800;left:18px;top:18px;width:286px;max-height:calc(100% - 80px);overflow:auto;background:#0b171bea;border:1px solid #66867955;border-radius:6px;padding:20px;box-shadow:0 8px 30px #0004;backdrop-filter:blur(14px)}.kicker{font-family:monospace;font-size:10px;letter-spacing:.12em;color:#94c5af;margin:0}h2{font-size:23px;letter-spacing:-.03em;line-height:1.1;margin:12px 0}.intro{font-size:12px;line-height:1.6;color:#9fb6ac}.switches{display:grid;gap:14px;border-top:1px solid #ffffff20;padding-top:16px;margin-top:18px}.switches label{font-size:13px;display:flex;align-items:center;gap:10px;cursor:pointer}.switches input{accent-color:#96d9b7;width:17px;height:17px}#feed-status,#layer-status{font-size:11px;color:#a5c5b5;line-height:1.5}.note{font-size:10px;color:#91a69c;line-height:1.6}summary{font-size:12px;cursor:pointer;padding:8px 0}form label{font-size:11px}.search-row{display:flex;gap:6px;margin-top:8px}input:not([type=checkbox]){min-width:0;flex:1;background:#14272c;border:1px solid #527063;color:#e9f5ec;padding:9px;border-radius:3px}button{cursor:pointer;border:1px solid #729987;border-radius:3px;padding:9px;background:#17382b;color:#d6f1e0}#retry{width:100%;font-size:11px;margin-top:6px}.flight-icon,.sat-icon{color:#a1edd0;text-shadow:0 1px 4px #000;font-size:22px;text-align:center}.sat-icon{color:#f5d386}.leaflet-popup-content-wrapper,.leaflet-popup-tip{background:#12231c;color:#d9eee2}.leaflet-popup-content{font-size:12px;line-height:1.6}.leaflet-tooltip{background:#13231d;color:#d5eddf;border-color:#456456;font-size:10px}
@media(max-width:640px){#panel{left:10px;top:auto;bottom:30px;width:calc(100% - 20px);max-height:36%;padding:12px 14px}h2{font-size:19px;margin:8px 0}.switches{display:flex;flex-wrap:wrap;gap:12px;margin-top:10px;padding-top:10px}.switches label{font-size:11px}.intro{margin:6px 0;font-size:11px}.note{display:none}.leaflet-control-zoom{margin-right:10px!important}}
`;
document.head.append(css);
const status = document.getElementById('feed-status');
const layerStatus = document.getElementById('layer-status');
const map = L.map('map', { zoomControl: false }).setView([-20.5386, -47.4008], 10);
L.control.zoom({ position: 'topright' }).addTo(map);
const imagery = L.tileLayer('https://server.arcgisonline.com/ArcGIS/rest/services/World_Imagery/MapServer/tile/{z}/{y}/{x}', {
  attribution: 'Tiles © Esri — Source: Esri, Maxar, Earthstar Geographics, and the GIS User Community', maxZoom: 19,
}).addTo(map);
let failedTiles = 0;
imagery.on('tileerror', () => {
  if (++failedTiles === 4) {
    map.removeLayer(imagery);
    L.tileLayer('https://tile.openstreetmap.org/{z}/{x}/{y}.png', { attribution: '© <a href="https://www.openstreetmap.org/copyright">OpenStreetMap</a> contributors', maxZoom: 19 }).addTo(map);
  }
});
const flights = L.layerGroup().addTo(map);
const quakes = L.layerGroup();
const satellites = L.layerGroup();
const switches = Object.fromEntries(['flights', 'earthquakes', 'satellites'].map(id => [id, document.getElementById(id)]));
let flightRequest;
let flightTimer;
let orbitalRecords = [];
const safe = value => String(value ?? '—').replace(/[&<>"']/g, ch => ({'&':'&amp;','<':'&lt;','>':'&gt;','"':'&quot;',"'":'&#39;'}[ch]));
async function updateFlights() {
  clearTimeout(flightTimer);
  if (!switches.flights.checked) { flights.clearLayers(); return; }
  flightRequest?.abort();
  const controller = new AbortController(); flightRequest = controller;
  const center = map.getCenter();
  try {
    const response = await fetch(`/api/flights?lat=${center.lat.toFixed(4)}&lon=${center.lng.toFixed(4)}`, { signal: controller.signal });
    if (!response.ok) throw new Error('feed');
    const data = await response.json();
    if (controller !== flightRequest || !switches.flights.checked) return;
    flights.clearLayers();
    let count = 0;
    for (const row of data.states || []) {
      if (!Number.isFinite(row[5]) || !Number.isFinite(row[6])) continue;
      const icon = L.divIcon({ className: 'flight-icon', html: `<span style="display:block;transform:rotate(${Number(row[10]) || 0}deg)">↑</span>`, iconSize: [24,24] });
      const label = safe(row[1]?.trim() || row[0]);
      L.marker([row[6], row[5]], { icon }).bindTooltip(label).bindPopup(`<strong>${label}</strong><br>Altitude: ${Math.round(row[7] || 0).toLocaleString('pt-BR')} m<br>Velocidade: ${Math.round((row[9] || 0) * 3.6)} km/h<br>Fonte: adsb.lol`).addTo(flights); count++;
    }
    status.textContent = `${count} voos · adsb.lol · ${response.headers.get('x-feed-cache') === 'STALE' ? 'dados em cache' : 'última consulta ' + new Date().toLocaleTimeString('pt-BR')}`;
  } catch(error) {
    if (error.name !== 'AbortError') status.textContent = 'Voos indisponíveis nesta consulta. Nova tentativa em 15 s.';
  } finally {
    if (controller === flightRequest && switches.flights.checked) flightTimer = setTimeout(updateFlights, 15000);
  }
}
async function updateQuakes() {
  if (!switches.earthquakes.checked) { map.removeLayer(quakes); return; }
  quakes.addTo(map);
  try {
    const response = await fetch('https://earthquake.usgs.gov/earthquakes/feed/v1.0/summary/all_day.geojson');
    if (!response.ok) throw new Error('feed');
    const data = await response.json(); quakes.clearLayers();
    for (const event of data.features || []) {
      const [lon, lat] = event.geometry.coordinates;
      L.circleMarker([lat, lon], { radius: Math.max(4, (event.properties.mag || 0) * 2), color: '#fbb77e', weight: 1, fillOpacity: .6 }).bindPopup(`<strong>Magnitude ${safe(event.properties.mag)}</strong><br>${safe(event.properties.place)}<br>Fonte: USGS`).addTo(quakes);
    }
    layerStatus.textContent = `${data.features.length} terremotos nas últimas 24h · USGS`;
  } catch { layerStatus.textContent = 'A consulta de terremotos ficou indisponível.'; }
}
function drawSatellites() {
  if (!switches.satellites.checked) return;
  satellites.clearLayers(); const now = new Date(); const gmst = satellite.gstime(now);
  for (const record of orbitalRecords) {
    const state = satellite.propagate(record.satrec, now);
    if (!state.position) continue;
    const point = satellite.eciToGeodetic(state.position, gmst);
    L.marker([satellite.degreesLat(point.latitude), satellite.degreesLong(point.longitude)], { icon: L.divIcon({ className:'sat-icon',html:'◇',iconSize:[24,24] }) }).bindTooltip(record.name).bindPopup(`<strong>${safe(record.name)}</strong><br>Altitude calculada: ${Math.round(point.height)} km<br>Fonte: CelesTrak / SGP4`).addTo(satellites);
  }
}
async function updateSatellites() {
  if (!switches.satellites.checked) { map.removeLayer(satellites); return; }
  satellites.addTo(map);
  try {
    if (!orbitalRecords.length) {
      const response = await fetch('/api/celestrak/stations'); if (!response.ok) throw new Error('feed');
      const lines = (await response.text()).split(/\r?\n/).map(line=>line.trim()).filter(Boolean);
      for(let i=0;i+2<lines.length;i+=3) if(lines[i+1].startsWith('1 ') && lines[i+2].startsWith('2 ')) orbitalRecords.push({ name:lines[i],satrec:satellite.twoline2satrec(lines[i+1],lines[i+2]) });
    }
    drawSatellites(); layerStatus.textContent = `${orbitalRecords.length} satélites · posição orbital calculada`;
  } catch { layerStatus.textContent = 'A consulta de satélites ficou indisponível.'; }
}
function restoreCamera() {
  const params = new URLSearchParams(location.hash.slice(1));
  const lat = Number(params.get('lat')); const lon = Number(params.get('lon')); const alt = Number(params.get('alt'));
  if (params.has('lat') && Number.isFinite(lat) && Number.isFinite(lon) && Math.abs(lat)<=90 && Math.abs(lon)<=180) map.setView([lat,lon], alt > 10000000 ? 2 : alt > 1000000 ? 4 : 11);
}
window.addEventListener('hashchange', restoreCamera); restoreCamera();
map.on('moveend', () => { clearTimeout(flightTimer); flightTimer = setTimeout(updateFlights, 600); });
switches.flights.addEventListener('change', updateFlights);
switches.earthquakes.addEventListener('change', updateQuakes);
switches.satellites.addEventListener('change', updateSatellites);
setInterval(drawSatellites, 5000);
document.getElementById('search').addEventListener('submit', event => {
  event.preventDefault();
  const values = document.getElementById('coordinates').value.split(',').map(Number);
  if (values.length === 2 && values.every(Number.isFinite) && Math.abs(values[0]) <= 90 && Math.abs(values[1]) <= 180) map.setView(values, 12);
  else layerStatus.textContent = 'Informe latitude e longitude válidas, separadas por vírgula.';
});
document.getElementById('retry').addEventListener('click', () => location.replace('./index.html' + location.hash));
updateFlights();
