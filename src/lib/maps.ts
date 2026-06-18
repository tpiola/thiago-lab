/* ==========================================================================
   Google Maps + Google My Business Integration Library
   ========================================================================== */

export interface PlaceResult {
  placeId: string;
  name: string;
  address: string;
  latitude: number;
  longitude: number;
  phone?: string;
  website?: string;
  rating?: number;
  userRatingsTotal?: number;
  photos?: string[];
  openingHours?: string[];
  priceLevel?: number;
  types?: string[];
}

export interface MyBusinessStats {
  totalLocations: number;
  totalReviews: number;
  averageRating: number;
  locations: MyBusinessLocation[];
}

export interface MyBusinessLocation {
  id: string;
  name: string;
  address: string;
  phone: string;
  category: string;
  rating: number;
  reviewCount: number;
  isVerified: boolean;
}

/* ── Mock Data ──────────────────────────────────────────────────────────── */

const MOCK_LOCATIONS: MyBusinessLocation[] = [
  { id: "loc-1", name: "Thiago Lab HQ", address: "Av. Paulista, 1000, São Paulo - SP", phone: "(11) 99999-0001", category: "Tecnologia", rating: 4.9, reviewCount: 87, isVerified: true },
  { id: "loc-2", name: "Thiago Lab Rio", address: "Av. Rio Branco, 200, Rio de Janeiro - RJ", phone: "(21) 99999-0002", category: "Consultoria", rating: 4.7, reviewCount: 62, isVerified: true },
  { id: "loc-3", name: "Thiago Lab BH", address: "Av. Afonso Pena, 500, Belo Horizonte - MG", phone: "(31) 99999-0003", category: "Inovação", rating: 4.8, reviewCount: 45, isVerified: true },
  { id: "loc-4", name: "Thiago Lab Sul", address: "Av. Ipiranga, 300, Porto Alegre - RS", phone: "(51) 99999-0004", category: "Desenvolvimento", rating: 4.6, reviewCount: 40, isVerified: false },
];

const MOCK_REVIEWS = [
  { id: "rev-1", author: "Carlos Silva", rating: 5, text: "Excelente serviço! Equipe muito profissional e atenciosa.", date: "15/06/2026" },
  { id: "rev-2", author: "Ana Costa", rating: 5, text: "Transformaram nossa presença digital. Resultados incríveis!", date: "12/06/2026" },
  { id: "rev-3", author: "Pedro Santos", rating: 4, text: "Bom atendimento e entregas no prazo. Recomendo.", date: "10/06/2026" },
  { id: "rev-4", author: "Julia Lima", rating: 5, text: "Profissionais talentosos e criativos. Superaram expectativas.", date: "08/06/2026" },
  { id: "rev-5", author: "Roberto Alves", rating: 4, text: "Parceria de longo prazo. Equipe dedicada e competente.", date: "05/06/2026" },
  { id: "rev-6", author: "Marina Dias", rating: 5, text: "Melhor agência que já contratamos. Resultados rápidos!", date: "01/06/2026" },
];

/* ═══════════════════════════════════════════════════════════════════════════
   Google Maps API Functions
   ═══════════════════════════════════════════════════════════════════════════ */

/**
 * Geocode an address string to coordinates.
 * Falls back to mock data when API key is not configured.
 */
export async function geocodeAddress(address: string): Promise<{ lat: number; lng: number } | null> {
  const apiKey = process.env.NEXT_PUBLIC_GOOGLE_MAPS_API_KEY;
  if (!apiKey || apiKey === "YOUR_API_KEY_HERE") {
    // Mock response for development
    const mockCoords: Record<string, { lat: number; lng: number }> = {
      "são paulo": { lat: -23.5505, lng: -46.6333 },
      "rio de janeiro": { lat: -22.9068, lng: -43.1729 },
      "belo horizonte": { lat: -19.9167, lng: -43.9345 },
      "porto alegre": { lat: -30.0346, lng: -51.2177 },
    };
    const key = Object.keys(mockCoords).find((k) => address.toLowerCase().includes(k));
    return key ? mockCoords[key] : { lat: -23.5505, lng: -46.6333 };
  }

  try {
    const res = await fetch(
      `https://maps.googleapis.com/maps/api/geocode/json?address=${encodeURIComponent(address)}&key=${apiKey}`
    );
    const data = await res.json();
    if (data.status === "OK" && data.results.length > 0) {
      return data.results[0].geometry.location;
    }
    return null;
  } catch {
    return null;
  }
}

/**
 * Search nearby places by latitude/longitude.
 */
export async function searchNearbyPlaces(
  lat: number,
  lng: number,
  radius: number = 1500,
  type?: string
): Promise<PlaceResult[]> {
  const apiKey = process.env.NEXT_PUBLIC_GOOGLE_MAPS_API_KEY;
  if (!apiKey || apiKey === "YOUR_API_KEY_HERE") {
    return getMockPlaces(lat, lng);
  }

  try {
    const params = new URLSearchParams({
      location: `${lat},${lng}`,
      radius: String(radius),
      key: apiKey,
    });
    if (type) params.set("type", type);

    const res = await fetch(
      `https://maps.googleapis.com/maps/api/place/nearbysearch/json?${params}`
    );
    const data = await res.json();
    if (data.status !== "OK") return [];

    return data.results.map((p: any): PlaceResult => ({
      placeId: p.place_id,
      name: p.name,
      address: p.vicinity || "",
      latitude: p.geometry.location.lat,
      longitude: p.geometry.location.lng,
      rating: p.rating,
      userRatingsTotal: p.user_ratings_total,
      types: p.types,
      photos: p.photos?.map((ph: any) =>
        `https://maps.googleapis.com/maps/api/place/photo?maxwidth=400&photo_reference=${ph.photo_reference}&key=${apiKey}`
      ),
    }));
  } catch {
    return [];
  }
}

/**
 * Get detailed information about a place by its Place ID.
 */
export async function getPlaceDetails(placeId: string): Promise<PlaceResult | null> {
  const apiKey = process.env.NEXT_PUBLIC_GOOGLE_MAPS_API_KEY;
  if (!apiKey || apiKey === "YOUR_API_KEY_HERE") {
    return getMockPlaceDetail(placeId);
  }

  try {
    const res = await fetch(
      `https://maps.googleapis.com/maps/api/place/details/json?place_id=${placeId}&fields=name,formatted_address,geometry,formatted_phone_number,website,rating,user_ratings_total,opening_hours,price_level,types,photos&key=${apiKey}`
    );
    const data = await res.json();
    if (data.status !== "OK") return null;

    const p = data.result;
    return {
      placeId: p.place_id,
      name: p.name,
      address: p.formatted_address || "",
      latitude: p.geometry.location.lat,
      longitude: p.geometry.location.lng,
      phone: p.formatted_phone_number,
      website: p.website,
      rating: p.rating,
      userRatingsTotal: p.user_ratings_total,
      openingHours: p.opening_hours?.weekday_text,
      priceLevel: p.price_level,
      types: p.types,
    };
  } catch {
    return null;
  }
}

/* ═══════════════════════════════════════════════════════════════════════════
   Google My Business Functions
   ═══════════════════════════════════════════════════════════════════════════ */

/**
 * Get My Business stats (mock implementation).
 * In production, this would use the Google My Business API.
 */
export async function getMyBusinessStats(): Promise<MyBusinessStats> {
  const totalReviews = MOCK_REVIEWS.length + MOCK_LOCATIONS.reduce((acc, l) => acc + l.reviewCount, 0);
  const avgRating = MOCK_LOCATIONS.reduce((acc, l) => acc + l.rating * l.reviewCount, 0) / MOCK_LOCATIONS.reduce((acc, l) => acc + l.reviewCount, 0);

  return {
    totalLocations: MOCK_LOCATIONS.length,
    totalReviews,
    averageRating: Math.round(avgRating * 10) / 10,
    locations: MOCK_LOCATIONS,
  };
}

/**
 * Get all reviews across all locations (mock).
 */
export async function getAllReviews() {
  return MOCK_REVIEWS;
}

/**
 * Update a business location listing (mock).
 * In production, this would call Google My Business API v4.
 */
export async function updateBusinessListing(
  locationId: string,
  data: Partial<MyBusinessLocation>
): Promise<MyBusinessLocation | null> {
  const idx = MOCK_LOCATIONS.findIndex((l) => l.id === locationId);
  if (idx === -1) return null;
  MOCK_LOCATIONS[idx] = { ...MOCK_LOCATIONS[idx], ...data };
  return MOCK_LOCATIONS[idx];
}

/* ═══════════════════════════════════════════════════════════════════════════
   Mock Helpers
   ═══════════════════════════════════════════════════════════════════════════ */

function getMockPlaces(lat: number, lng: number): PlaceResult[] {
  return [
    { placeId: "mock-1", name: "Thiago Lab HQ", address: "Av. Paulista, 1000", latitude: lat + 0.01, longitude: lng + 0.01, rating: 4.9, userRatingsTotal: 87, types: ["establishment"] },
    { placeId: "mock-2", name: "Café Tech", address: "Rua Augusta, 500", latitude: lat - 0.005, longitude: lng + 0.008, rating: 4.5, userRatingsTotal: 234, types: ["cafe"] },
    { placeId: "mock-3", name: "Coworking Central", address: "Rua da Consolação, 800", latitude: lat + 0.008, longitude: lng - 0.01, rating: 4.3, userRatingsTotal: 156, types: ["establishment"] },
    { placeId: "mock-4", name: "Restaurante do Tech", address: "Alameda Santos, 300", latitude: lat - 0.01, longitude: lng + 0.005, rating: 4.7, userRatingsTotal: 412, types: ["restaurant"] },
    { placeId: "mock-5", name: "Hub de Inovação", address: "Av. Faria Lima, 1500", latitude: lat + 0.015, longitude: lng - 0.008, rating: 4.6, userRatingsTotal: 89, types: ["establishment"] },
  ];
}

function getMockPlaceDetail(placeId: string): PlaceResult | null {
  const mockPlaces = getMockPlaces(-23.5505, -46.6333);
  return mockPlaces.find((p) => p.placeId === placeId) || null;
}
