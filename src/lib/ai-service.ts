/**
 * AI Service Client
 * Connects the Next.js frontend to the Python AI service
 */

const AI_SERVICE_URL =
  process.env.NEXT_PUBLIC_AI_SERVICE_URL || 'http://localhost:8000';

/**
 * Check if the AI service is available
 */
export async function checkAIServiceHealth(): Promise<boolean> {
  try {
    const response = await fetch(`${AI_SERVICE_URL}/health`, {
      method: 'GET',
      signal: AbortSignal.timeout(5000), // 5 second timeout
    });
    return response.ok;
  } catch {
    return false;
  }
}

/**
 * Semantic search for places using natural language
 *
 * @example
 * const results = await semanticSearch("quiet cafe with wifi near Orchard");
 */
export async function semanticSearch(
  query: string,
  options?: {
    lat?: number;
    lng?: number;
    radiusKm?: number;
    limit?: number;
  }
): Promise<{
  query: string;
  results: Array<{
    place_id: string;
    name: string;
    address: string;
    score: number;
    tags: string[];
    cuisine_type: string[];
  }>;
  total: number;
}> {
  const params = new URLSearchParams({ q: query });

  if (options?.lat) params.set('lat', options.lat.toString());
  if (options?.lng) params.set('lng', options.lng.toString());
  if (options?.radiusKm) params.set('radius_km', options.radiusKm.toString());
  if (options?.limit) params.set('limit', options.limit.toString());

  const response = await fetch(`${AI_SERVICE_URL}/api/search?${params}`);

  if (!response.ok) {
    throw new Error(`Search failed: ${response.statusText}`);
  }

  return response.json();
}

/**
 * Generate cultural context for a dish
 *
 * @example
 * const context = await generateCulturalContext("Hainanese Chicken Rice", "Tian Tian");
 */
export async function generateCulturalContext(
  dishName: string,
  placeName: string,
  cuisineType?: string
): Promise<{
  dish_name: string;
  place_name: string;
  context: string;
  tips: string[];
}> {
  const response = await fetch(`${AI_SERVICE_URL}/api/context/generate`, {
    method: 'POST',
    headers: { 'Content-Type': 'application/json' },
    body: JSON.stringify({
      dish_name: dishName,
      place_name: placeName,
      cuisine_type: cuisineType,
    }),
  });

  if (!response.ok) {
    throw new Error(`Context generation failed: ${response.statusText}`);
  }

  return response.json();
}

/**
 * Get list of common Singaporean dishes
 */
export async function getCommonDishes(): Promise<{
  dishes: Array<{
    name: string;
    category: string;
    description: string;
  }>;
  total: number;
}> {
  const response = await fetch(`${AI_SERVICE_URL}/api/context/dishes`);

  if (!response.ok) {
    throw new Error(`Failed to fetch dishes: ${response.statusText}`);
  }

  return response.json();
}

/**
 * Optimize walking route through multiple places
 *
 * @example
 * const route = await optimizeRoute([
 *   { id: "1", name: "Place A", lat: 1.28, lng: 103.85 },
 *   { id: "2", name: "Place B", lat: 1.29, lng: 103.86 },
 * ]);
 */
export async function optimizeRoute(
  places: Array<{
    id: string;
    name: string;
    lat: number;
    lng: number;
  }>,
  options?: {
    startLat?: number;
    startLng?: number;
    returnToStart?: boolean;
  }
): Promise<{
  optimized_order: string[];
  steps: Array<{
    place_id: string;
    place_name: string;
    distance_from_previous: number;
    walking_time: number;
  }>;
  total_distance: number;
  total_walking_time: number;
}> {
  const response = await fetch(`${AI_SERVICE_URL}/api/routes/optimize`, {
    method: 'POST',
    headers: { 'Content-Type': 'application/json' },
    body: JSON.stringify({
      places,
      start_location: options?.startLat
        ? { lat: options.startLat, lng: options.startLng }
        : null,
      return_to_start: options?.returnToStart ?? false,
    }),
  });

  if (!response.ok) {
    throw new Error(`Route optimization failed: ${response.statusText}`);
  }

  return response.json();
}

/**
 * Batch embed texts for indexing (admin use)
 */
export async function generateEmbedding(text: string): Promise<{
  embedding?: number[];
  message?: string;
}> {
  const response = await fetch(`${AI_SERVICE_URL}/api/search/embed`, {
    method: 'POST',
    headers: { 'Content-Type': 'application/json' },
    body: JSON.stringify({ text }),
  });

  if (!response.ok) {
    throw new Error(`Embedding generation failed: ${response.statusText}`);
  }

  return response.json();
}
