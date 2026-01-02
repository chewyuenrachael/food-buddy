/**
 * Core type definitions for Food Buddy
 */

// ============================================================================
// User Types
// ============================================================================

export interface User {
  id: string;
  email: string;
  name: string | null;
  avatarUrl: string | null;
  createdAt: Date;
}

// ============================================================================
// Place Types
// ============================================================================

export interface Coordinates {
  lat: number;
  lng: number;
}

export interface Place {
  id: string;
  googlePlaceId: string | null;
  name: string;
  address: string;
  location: Coordinates;
  cuisineType: string[];
  tags: PlaceTag[];
  culturalContext: string | null;
  imageUrl: string | null;
  rating: number | null;
  priceLevel: PriceLevel | null;
  createdAt: Date;
}

export type PlaceTag =
  | 'quiet'
  | 'wifi'
  | 'outdoor'
  | 'kid-friendly'
  | 'vegetarian'
  | 'halal'
  | 'pet-friendly'
  | 'late-night'
  | 'air-conditioned'
  | 'reservation-recommended'
  | 'tourist-friendly';

export type PriceLevel = 1 | 2 | 3 | 4; // $ to $$$$

export interface PlaceWithNote extends Place {
  note: string | null;
  position: number;
}

// ============================================================================
// List Types
// ============================================================================

export interface FoodList {
  id: string;
  userId: string;
  title: string;
  description: string | null;
  isPublic: boolean;
  shareCode: string;
  category: ListCategory;
  coverImageUrl: string | null;
  createdAt: Date;
  updatedAt: Date;
  user?: Pick<User, 'id' | 'name' | 'avatarUrl'>;
  places?: PlaceWithNote[];
  placeCount?: number;
}

export type ListCategory =
  | 'hawker'
  | 'cafe'
  | 'local-favorites'
  | 'budget'
  | 'splurge'
  | 'late-night'
  | 'breakfast'
  | 'vegetarian'
  | 'date-night'
  | 'family-friendly'
  | 'tourist-must-try';

export const LIST_CATEGORIES: Record<ListCategory, { label: string; emoji: string }> = {
  hawker: { label: 'Hawker', emoji: '🍜' },
  cafe: { label: 'Cafe', emoji: '☕' },
  'local-favorites': { label: 'Local Favorites', emoji: '⭐' },
  budget: { label: 'Budget', emoji: '💰' },
  splurge: { label: 'Splurge', emoji: '✨' },
  'late-night': { label: 'Late Night', emoji: '🌙' },
  breakfast: { label: 'Breakfast', emoji: '🌅' },
  vegetarian: { label: 'Vegetarian', emoji: '🥬' },
  'date-night': { label: 'Date Night', emoji: '💕' },
  'family-friendly': { label: 'Family Friendly', emoji: '👨‍👩‍👧‍👦' },
  'tourist-must-try': { label: 'Tourist Must Try', emoji: '🎒' },
};

// ============================================================================
// Food Route Types
// ============================================================================

export interface FoodRoute {
  id: string;
  listId: string;
  optimizedOrder: string[]; // Place IDs in optimized order
  totalWalkingTime: number; // Minutes
  totalDistance: number; // Meters
  createdAt: Date;
}

export interface RouteStep {
  from: Place;
  to: Place;
  walkingTime: number; // Minutes
  distance: number; // Meters
}

// ============================================================================
// API Request/Response Types
// ============================================================================

export interface CreateListRequest {
  title: string;
  description?: string;
  category: ListCategory;
  isPublic?: boolean;
}

export interface UpdateListRequest {
  title?: string;
  description?: string;
  category?: ListCategory;
  isPublic?: boolean;
}

export interface AddPlaceToListRequest {
  placeId: string;
  note?: string;
}

export interface SearchPlacesRequest {
  query: string;
  lat?: number;
  lng?: number;
  radiusKm?: number;
  tags?: PlaceTag[];
  limit?: number;
}

export interface OptimizeRouteRequest {
  listId: string;
  startLocation: Coordinates;
}

// ============================================================================
// API Response Types
// ============================================================================

export interface ApiResponse<T> {
  data: T;
  error: null;
}

export interface ApiError {
  data: null;
  error: {
    message: string;
    code: string;
  };
}

export type ApiResult<T> = ApiResponse<T> | ApiError;

// ============================================================================
// Map Types
// ============================================================================

export interface MapViewState {
  longitude: number;
  latitude: number;
  zoom: number;
}

export interface MapMarker {
  id: string;
  coordinates: Coordinates;
  label?: string;
  color?: string;
}
