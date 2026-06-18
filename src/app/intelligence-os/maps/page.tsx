"use client";

import { useState, useCallback, useMemo } from "react";
import { GoogleMap, Marker, InfoWindow, useLoadScript, Autocomplete } from "@react-google-maps/api";
import {
  MapPin,
  Star,
  Phone,
  Globe,
  Clock,
  ThumbsUp,
  MessageSquare,
  Plus,
  Search,
  X,
  Building2,
  Navigation,
  ExternalLink,
  BarChart3,
  TrendingUp,
  Users,
  CheckCircle,
} from "lucide-react";
import {
  getMyBusinessStats,
  getAllReviews,
  type MyBusinessStats,
  type MyBusinessLocation,
  type PlaceResult,
} from "@/lib/maps";

/* ── Constants ──────────────────────────────────────────────────────────── */
const MAP_LIBRARIES: ("places" | "geometry" | "drawing" | "visualization")[] = ["places"];
const DEFAULT_CENTER = { lat: -23.5505, lng: -46.6333 }; // São Paulo
const DEFAULT_ZOOM = 12;

/* ── Mock Client Markers ────────────────────────────────────────────────── */
const CLIENT_MARKERS = [
  { id: "c1", name: "Empresa XYZ", lat: -23.561, lng: -46.656, status: "Ativo", value: "R$ 12.000" },
  { id: "c2", name: "TechStart", lat: -23.545, lng: -46.648, status: "Lead", value: "R$ 8.500" },
  { id: "c3", name: "GlobalWeb", lat: -23.573, lng: -46.623, status: "Ativo", value: "R$ 22.000" },
  { id: "c4", name: "NovaTech", lat: -23.521, lng: -46.673, status: "Lead", value: "R$ 5.000" },
  { id: "c5", name: "Acme Corp", lat: -23.555, lng: -46.639, status: "Ativo", value: "R$ 35.000" },
  { id: "c6", name: "MegaCorp", lat: -23.589, lng: -46.611, status: "Ativo", value: "R$ 65.000" },
  { id: "c7", name: "Thiago Lab HQ", lat: -23.5505, lng: -46.6333, status: "Sede", value: "—" },
];

/* ═══════════════════════════════════════════════════════════════════════════
   COMPONENT: Stats Card
   ═══════════════════════════════════════════════════════════════════════════ */
function StatCard({ icon: Icon, label, value, color }: { icon: any; label: string; value: string | number; color: string }) {
  return (
    <div className="intelligence-os-card p-4">
      <div className="flex items-start justify-between mb-2">
        <div
          className="w-10 h-10 rounded-lg flex items-center justify-center"
          style={{ background: `${color}15`, border: `1px solid ${color}25` }}
        >
          <Icon size={18} style={{ color }} />
        </div>
      </div>
      <div className="intelligence-os-metric-value text-xl md:text-2xl">{value}</div>
      <div className="intelligence-os-metric-label">{label}</div>
    </div>
  );
}

/* ═══════════════════════════════════════════════════════════════════════════
   COMPONENT: Review Modal
   ═══════════════════════════════════════════════════════════════════════════ */
function ReviewModal({ open, onClose }: { open: boolean; onClose: () => void }) {
  const [reviews, setReviews] = useState<any[]>([]);

  useMemo(() => {
    if (open) {
      getAllReviews().then(setReviews);
    }
  }, [open]);

  if (!open) return null;

  return (
    <div className="intelligence-os-modal-overlay" onClick={onClose}>
      <div
        className="intelligence-os-modal max-w-2xl w-[95%] md:w-[90%] max-h-[85vh] flex flex-col"
        onClick={(e) => e.stopPropagation()}
      >
        <div className="flex items-center justify-between mb-6">
          <h2 className="text-lg font-semibold text-[#E8EDF2] font-['Clash_Display',system-ui,sans-serif]">
            Reviews Recentes
          </h2>
          <button onClick={onClose} className="p-1 text-[#6B7280] hover:text-[#E8EDF2] rounded transition-colors">
            <X size={18} />
          </button>
        </div>
        <div className="flex-1 overflow-y-auto intelligence-os-scrollbar space-y-3">
          {reviews.length === 0 ? (
            <p className="text-sm text-[#6B7280] text-center py-8">Carregando reviews...</p>
          ) : (
            reviews.map((r) => (
              <div key={r.id} className="bg-[rgba(201,162,39,0.03)] border border-[rgba(201,162,39,0.08)] rounded-lg p-4">
                <div className="flex items-center justify-between mb-2">
                  <span className="text-sm font-medium text-[#E8EDF2]">{r.author}</span>
                  <div className="flex items-center gap-1">
                    {Array.from({ length: 5 }).map((_, i) => (
                      <Star
                        key={i}
                        size={12}
                        className={i < r.rating ? "text-[#C9A227] fill-[#C9A227]" : "text-[#6B7280]"}
                      />
                    ))}
                  </div>
                </div>
                <p className="text-sm text-[#9BA3B8]">{r.text}</p>
                <p className="text-[10px] text-[#6B7280] mt-2">{r.date}</p>
              </div>
            ))
          )}
        </div>
      </div>
    </div>
  );
}

/* ═══════════════════════════════════════════════════════════════════════════
   COMPONENT: Place Detail Modal
   ═══════════════════════════════════════════════════════════════════════════ */
function PlaceDetailModal({
  place,
  open,
  onClose,
}: {
  place: PlaceResult | null;
  open: boolean;
  onClose: () => void;
}) {
  if (!open || !place) return null;

  return (
    <div className="intelligence-os-modal-overlay" onClick={onClose}>
      <div
        className="intelligence-os-modal max-w-lg w-[95%] md:w-[90%]"
        onClick={(e) => e.stopPropagation()}
      >
        <div className="flex items-center justify-between mb-4">
          <div className="flex items-center gap-3 min-w-0">
            <div className="w-10 h-10 rounded-lg bg-[rgba(201,162,39,0.1)] border border-[rgba(201,162,39,0.15)] flex items-center justify-center flex-shrink-0">
              <MapPin size={18} className="text-[#C9A227]" />
            </div>
            <div className="min-w-0">
              <h2 className="text-base font-semibold text-[#E8EDF2] truncate font-['Clash_Display',system-ui,sans-serif]">
                {place.name}
              </h2>
              {place.rating && (
                <div className="flex items-center gap-1 text-xs text-[#C9A227]">
                  <Star size={11} className="fill-[#C9A227]" />
                  <span>{place.rating}</span>
                  {place.userRatingsTotal && (
                    <span className="text-[#6B7280]">({place.userRatingsTotal} reviews)</span>
                  )}
                </div>
              )}
            </div>
          </div>
          <button onClick={onClose} className="p-1 text-[#6B7280] hover:text-[#E8EDF2] rounded transition-colors flex-shrink-0">
            <X size={18} />
          </button>
        </div>

        <div className="space-y-3">
          {place.address && (
            <div className="flex items-start gap-2 text-sm text-[#9BA3B8]">
              <MapPin size={14} className="text-[#6B7280] mt-0.5 flex-shrink-0" />
              <span>{place.address}</span>
            </div>
          )}
          {place.phone && (
            <div className="flex items-center gap-2 text-sm text-[#9BA3B8]">
              <Phone size={14} className="text-[#6B7280] flex-shrink-0" />
              <span>{place.phone}</span>
            </div>
          )}
          {place.website && (
            <a
              href={place.website}
              target="_blank"
              rel="noopener noreferrer"
              className="flex items-center gap-2 text-sm text-[#C9A227] hover:underline"
            >
              <Globe size={14} className="flex-shrink-0" />
              <span className="truncate">{place.website}</span>
              <ExternalLink size={12} className="flex-shrink-0" />
            </a>
          )}
          {place.openingHours && place.openingHours.length > 0 && (
            <div className="border-t border-[rgba(201,162,39,0.06)] pt-3 mt-3">
              <div className="flex items-center gap-2 text-xs font-medium text-[#6B7280] mb-2">
                <Clock size={12} />
                Horários
              </div>
              <div className="space-y-1">
                {place.openingHours.map((h, i) => (
                  <div key={i} className="text-xs text-[#9BA3B8] flex justify-between">
                    <span>{h.split(": ")[0]}</span>
                    <span>{h.split(": ")[1] || h}</span>
                  </div>
                ))}
              </div>
            </div>
          )}
        </div>

        <div className="flex flex-col sm:flex-row gap-2 mt-6 pt-4 border-t border-[rgba(201,162,39,0.06)]">
          <button className="intelligence-os-btn-primary flex-1 text-xs py-2">
            <Navigation size={14} />
            Abrir no Maps
          </button>
          <button className="intelligence-os-btn-outline flex-1 text-xs py-2">
            <Star size={14} />
            Avaliar
          </button>
        </div>
      </div>
    </div>
  );
}

/* ═══════════════════════════════════════════════════════════════════════════
   PAGE: Google Maps + My Business
   ═══════════════════════════════════════════════════════════════════════════ */
export default function MapsPage() {
  const [stats, setStats] = useState<MyBusinessStats | null>(null);
  const [selectedPlace, setSelectedPlace] = useState<PlaceResult | null>(null);
  const [selectedClient, setSelectedClient] = useState<typeof CLIENT_MARKERS[0] | null>(null);
  const [reviewModalOpen, setReviewModalOpen] = useState(false);
  const [mapCenter, setMapCenter] = useState(DEFAULT_CENTER);
  const [searchValue, setSearchValue] = useState("");

  /* ── Load Google Maps ────────────────────────────────────────────────── */
  const apiKey = process.env.NEXT_PUBLIC_GOOGLE_MAPS_API_KEY;
  const { isLoaded, loadError } = useLoadScript({
    googleMapsApiKey: apiKey || "MOCK_KEY",
    libraries: MAP_LIBRARIES,
  });

  /* ── Load stats ──────────────────────────────────────────────────────── */
  useMemo(() => {
    getMyBusinessStats().then(setStats);
  }, []);

  /* ── Autocomplete handler ────────────────────────────────────────────── */
  const onPlaceChanged = useCallback((autocomplete: google.maps.places.Autocomplete | null) => {
    if (!autocomplete) return;
    const place = autocomplete.getPlace();
    if (place.geometry?.location) {
      const lat = place.geometry.location.lat();
      const lng = place.geometry.location.lng();
      setMapCenter({ lat, lng });
    }
  }, []);

  /* ── Map click ───────────────────────────────────────────────────────── */
  const onMapClick = useCallback(() => {
    setSelectedClient(null);
    setSelectedPlace(null);
  }, []);

  /* ── Loading State ───────────────────────────────────────────────────── */
  if (loadError) {
    return (
      <div className="p-4 lg:p-6 min-h-full intelligence-os-grid-bg flex items-center justify-center">
        <div className="text-center">
          <MapPin size={48} className="text-[#6B7280] mx-auto mb-4" />
          <h2 className="text-lg font-semibold text-[#E8EDF2] mb-2">Erro ao carregar Google Maps</h2>
          <p className="text-sm text-[#6B7280]">
            Verifique se a chave da API do Google Maps está configurada corretamente.
          </p>
        </div>
      </div>
    );
  }

  if (!isLoaded) {
    return (
      <div className="p-4 lg:p-6 min-h-full intelligence-os-grid-bg flex items-center justify-center">
        <div className="flex flex-col items-center gap-3">
          <div className="spinner-accent" />
          <p className="text-sm text-[#6B7280]">Carregando Google Maps...</p>
        </div>
      </div>
    );
  }

  return (
    <div className="p-4 lg:p-6 min-h-full intelligence-os-grid-bg">
      {/* ── Header ────────────────────────────────────────────────────── */}
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4 mb-6">
        <div>
          <h1 className="intelligence-os-section-title text-xl md:text-2xl">Google Maps & My Business</h1>
          <p className="intelligence-os-section-subtitle mt-1 text-sm">
            Visualize clientes no mapa e gerencie suas fichas do Google
          </p>
        </div>
        <div className="flex flex-wrap items-center gap-2">
          <button className="intelligence-os-btn-outline text-xs px-3 py-2" onClick={() => setReviewModalOpen(true)}>
            <MessageSquare size={14} />
            <span className="hidden sm:inline">Ver Reviews</span>
          </button>
          <button className="intelligence-os-btn-primary text-xs px-3 py-2">
            <Plus size={14} />
            <span className="hidden sm:inline">Adicionar Local</span>
          </button>
        </div>
      </div>

      {/* ── Stats Row ─────────────────────────────────────────────────── */}
      <div className="grid grid-cols-1 sm:grid-cols-3 gap-3 mb-6">
        <StatCard icon={MapPin} label="Locais Cadastrados" value={stats?.totalLocations ?? 47} color="#C9A227" />
        <StatCard icon={MessageSquare} label="Total de Reviews" value={stats?.totalReviews ?? 234} color="#60A5FA" />
        <StatCard icon={Star} label="Avaliação Média" value={stats ? `${stats.averageRating}★` : "4.8★"} color="#34D399" />
      </div>

      {/* ── Map + Sidebar ─────────────────────────────────────────────── */}
      <div className="grid grid-cols-1 lg:grid-cols-3 gap-4 mb-6">
        {/* Map Container */}
        <div className="intelligence-os-card p-2 lg:col-span-2 min-h-[400px] md:min-h-[500px]">
          <GoogleMap
            mapContainerStyle={{ width: "100%", height: "100%", minHeight: "400px", borderRadius: "0.5rem" }}
            center={mapCenter}
            zoom={DEFAULT_ZOOM}
            options={{
              styles: getDarkMapStyles(),
              disableDefaultUI: false,
              zoomControl: true,
              mapTypeControl: false,
              streetViewControl: false,
              fullscreenControl: true,
            }}
            onClick={onMapClick}
          >
            {/* Client Markers */}
            {CLIENT_MARKERS.map((client) => (
              <Marker
                key={client.id}
                position={{ lat: client.lat, lng: client.lng }}
                icon={{
                  path: google.maps.SymbolPath.CIRCLE,
                  scale: 8,
                  fillColor: client.status === "Sede" ? "#C9A227" : client.status === "Ativo" ? "#34D399" : "#FBBF24",
                  fillOpacity: 1,
                  strokeColor: "#050D1A",
                  strokeWeight: 2,
                }}
                onClick={() => setSelectedClient(client)}
              />
            ))}

            {/* Client InfoWindow */}
            {selectedClient && (
              <InfoWindow
                position={{ lat: selectedClient.lat, lng: selectedClient.lng }}
                onCloseClick={() => setSelectedClient(null)}
              >
                <div style={{ background: "#0A1628", color: "#E8EDF2", padding: "8px", borderRadius: "8px", minWidth: "160px" }}>
                  <p style={{ fontWeight: 600, margin: 0 }}>{selectedClient.name}</p>
                  <p style={{ fontSize: "12px", color: "#6B7280", margin: "4px 0 0" }}>
                    {selectedClient.status} · {selectedClient.value}
                  </p>
                </div>
              </InfoWindow>
            )}
          </GoogleMap>
        </div>

        {/* Sidebar */}
        <div className="space-y-3">
          {/* Search */}
          <div className="intelligence-os-card p-3">
            <Autocomplete
              onLoad={(auto) => {}}
              onPlaceChanged={() => {}}
            >
              <div className="relative">
                <Search size={14} className="absolute left-3 top-1/2 -translate-y-1/2 text-[#6B7280]" />
                <input
                  type="text"
                  placeholder="Buscar endereço..."
                  className="intelligence-os-input w-full pl-9 pr-3 py-2 text-sm"
                  value={searchValue}
                  onChange={(e) => setSearchValue(e.target.value)}
                />
              </div>
            </Autocomplete>
          </div>

          {/* Locations List */}
          <div className="intelligence-os-card p-3 max-h-[320px] overflow-y-auto intelligence-os-scrollbar">
            <h3 className="text-xs font-semibold text-[#6B7280] uppercase tracking-wider mb-3">
              Locais Google My Business
            </h3>
            <div className="space-y-2">
              {(stats?.locations ?? []).map((loc) => (
                <div
                  key={loc.id}
                  className="flex items-start gap-3 p-2 rounded-lg hover:bg-[rgba(201,162,39,0.04)] cursor-pointer transition-colors border border-transparent hover:border-[rgba(201,162,39,0.08)]"
                  onClick={() =>
                    setMapCenter({ lat: DEFAULT_CENTER.lat + Math.random() * 0.02 - 0.01, lng: DEFAULT_CENTER.lng + Math.random() * 0.02 - 0.01 })
                  }
                >
                  <div className="w-8 h-8 rounded-lg bg-[rgba(201,162,39,0.08)] border border-[rgba(201,162,39,0.06)] flex items-center justify-center flex-shrink-0">
                    <Building2 size={14} className="text-[#C9A227]" />
                  </div>
                  <div className="min-w-0 flex-1">
                    <div className="flex items-center gap-1.5">
                      <span className="text-sm font-medium text-[#E8EDF2] truncate">{loc.name}</span>
                      {loc.isVerified && (
                        <CheckCircle size={12} className="text-[#34D399] flex-shrink-0" />
                      )}
                    </div>
                    <div className="flex items-center gap-2 text-xs text-[#6B7280] mt-0.5">
                      <Star size={10} className="text-[#C9A227]" />
                      <span>{loc.rating}</span>
                      <span>·</span>
                      <span>{loc.reviewCount} reviews</span>
                    </div>
                  </div>
                </div>
              ))}
            </div>
          </div>

          {/* Quick Actions */}
          <div className="intelligence-os-card p-3">
            <h3 className="text-xs font-semibold text-[#6B7280] uppercase tracking-wider mb-3">
              Ações Rápidas
            </h3>
            <div className="space-y-2">
              <button
                className="w-full flex items-center gap-2 px-3 py-2 text-xs text-[#9BA3B8] hover:text-[#E8EDF2] rounded-lg hover:bg-[rgba(201,162,39,0.04)] transition-colors"
                onClick={() => setReviewModalOpen(true)}
              >
                <MessageSquare size={14} className="text-[#60A5FA]" />
                Ver Reviews
              </button>
              <button className="w-full flex items-center gap-2 px-3 py-2 text-xs text-[#9BA3B8] hover:text-[#E8EDF2] rounded-lg hover:bg-[rgba(201,162,39,0.04)] transition-colors">
                <BarChart3 size={14} className="text-[#C9A227]" />
                Gerenciar Ficha
              </button>
              <button className="w-full flex items-center gap-2 px-3 py-2 text-xs text-[#9BA3B8] hover:text-[#E8EDF2] rounded-lg hover:bg-[rgba(201,162,39,0.04)] transition-colors">
                <TrendingUp size={14} className="text-[#34D399]" />
                Relatório de Insights
              </button>
            </div>
          </div>
        </div>
      </div>

      {/* ── My Business Locations Table ────────────────────────────────── */}
      <div className="intelligence-os-card overflow-hidden">
        <div className="p-4 border-b border-[rgba(201,162,39,0.06)]">
          <h3 className="text-sm font-semibold text-[#E8EDF2]">
            Todas as Unidades
          </h3>
        </div>
        <div className="overflow-x-auto">
          <table className="intelligence-os-table">
            <thead>
              <tr>
                <th>Unidade</th>
                <th className="hidden sm:table-cell">Endereço</th>
                <th className="hidden md:table-cell">Telefone</th>
                <th>Avaliação</th>
                <th className="hidden lg:table-cell">Status</th>
                <th></th>
              </tr>
            </thead>
            <tbody>
              {(stats?.locations ?? []).map((loc) => (
                <tr key={loc.id}>
                  <td className="font-medium">
                    <div className="flex items-center gap-2">
                      <span>{loc.name}</span>
                      {loc.isVerified && <CheckCircle size={12} className="text-[#34D399]" />}
                    </div>
                  </td>
                  <td className="hidden sm:table-cell text-xs text-[#9BA3B8]">{loc.address}</td>
                  <td className="hidden md:table-cell text-xs text-[#9BA3B8]">{loc.phone}</td>
                  <td>
                    <div className="flex items-center gap-1">
                      <Star size={11} className="text-[#C9A227] fill-[#C9A227]" />
                      <span className="text-sm font-medium">{loc.rating}</span>
                      <span className="text-[10px] text-[#6B7280]">({loc.reviewCount})</span>
                    </div>
                  </td>
                  <td className="hidden lg:table-cell">
                    <span className={`inline-flex items-center gap-1 text-[11px] font-medium px-2 py-0.5 rounded-full ${
                      loc.isVerified ? "text-[#34D399] bg-[rgba(52,211,153,0.08)]" : "text-[#6B7280] bg-[rgba(107,114,128,0.08)]"
                    }`}>
                      {loc.isVerified ? "Verificado" : "Pendente"}
                    </span>
                  </td>
                  <td>
                    <button className="p-1 text-[#6B7280] hover:text-[#C9A227] rounded transition-colors">
                      <ExternalLink size={14} />
                    </button>
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      </div>

      {/* ── Modals ─────────────────────────────────────────────────────── */}
      <ReviewModal open={reviewModalOpen} onClose={() => setReviewModalOpen(false)} />
      <PlaceDetailModal place={selectedPlace} open={!!selectedPlace} onClose={() => setSelectedPlace(null)} />
    </div>
  );
}

/* ── Dark Map Styles ───────────────────────────────────────────────────── */
function getDarkMapStyles(): google.maps.MapTypeStyle[] {
  return [
    { elementType: "geometry", stylers: [{ color: "#0A1628" }] },
    { elementType: "labels.icon", stylers: [{ visibility: "off" }] },
    { elementType: "labels.text.fill", stylers: [{ color: "#9BA3B8" }] },
    { elementType: "labels.text.stroke", stylers: [{ color: "#0A1628" }] },
    { featureType: "administrative", elementType: "geometry", stylers: [{ color: "#0F1F36" }] },
    { featureType: "administrative.country", elementType: "labels.text.fill", stylers: [{ color: "#6B7280" }] },
    { featureType: "poi", elementType: "geometry", stylers: [{ color: "#0D1A2E" }] },
    { featureType: "poi", elementType: "labels.text.fill", stylers: [{ color: "#6B7280" }] },
    { featureType: "road", elementType: "geometry", stylers: [{ color: "#122240" }] },
    { featureType: "road", elementType: "labels.text.fill", stylers: [{ color: "#9BA3B8" }] },
    { featureType: "road.highway", elementType: "geometry", stylers: [{ color: "#1A2F4F" }] },
    { featureType: "road.highway", elementType: "labels.text.fill", stylers: [{ color: "#E8EDF2" }] },
    { featureType: "transit", elementType: "geometry", stylers: [{ color: "#0F1F36" }] },
    { featureType: "water", elementType: "geometry", stylers: [{ color: "#060D1A" }] },
    { featureType: "water", elementType: "labels.text.fill", stylers: [{ color: "#4B5563" }] },
  ];
}
