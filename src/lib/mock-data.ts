/**
 * Mock data for development and demo purposes
 * This will be replaced with Supabase queries in production
 */

import type { FoodList, Place, PlaceWithNote, User } from '@/types';

// ============================================================================
// Mock Users
// ============================================================================

export const mockUsers: User[] = [
  {
    id: 'user-1',
    email: 'sethlui@example.com',
    name: 'Seth Lui',
    avatarUrl: 'https://api.dicebear.com/7.x/avataaars/svg?seed=seth',
    createdAt: new Date('2024-01-01'),
  },
  {
    id: 'user-2',
    email: 'ladyironchef@example.com',
    name: 'Lady Iron Chef',
    avatarUrl: 'https://api.dicebear.com/7.x/avataaars/svg?seed=ladyironchef',
    createdAt: new Date('2024-01-15'),
  },
  {
    id: 'user-3',
    email: 'local@example.com',
    name: 'Local Foodie',
    avatarUrl: 'https://api.dicebear.com/7.x/avataaars/svg?seed=local',
    createdAt: new Date('2024-02-01'),
  },
];

// ============================================================================
// Mock Places
// ============================================================================

export const mockPlaces: Place[] = [
  {
    id: 'place-1',
    googlePlaceId: 'ChIJ-1',
    name: 'Tian Tian Hainanese Chicken Rice',
    address: 'Maxwell Food Centre, #01-10, Singapore 069184',
    location: { lat: 1.2805, lng: 103.8447 },
    cuisineType: ['Singaporean', 'Chicken Rice'],
    tags: ['air-conditioned'],
    culturalContext:
      'This legendary stall has been serving what many consider the best chicken rice in Singapore since 1987. The dish features silky poached chicken served over fragrant rice cooked in chicken fat and pandan leaves.',
    imageUrl: 'https://images.unsplash.com/photo-1569562211093-4ed0d0758f12?w=400',
    rating: 4.5,
    priceLevel: 1,
    createdAt: new Date('2024-01-01'),
  },
  {
    id: 'place-2',
    googlePlaceId: 'ChIJ-2',
    name: 'Hill Street Tai Hwa Pork Noodle',
    address: '466 Crawford Lane, #01-12, Singapore 190466',
    location: { lat: 1.3067, lng: 103.8617 },
    cuisineType: ['Singaporean', 'Noodles'],
    tags: ['reservation-recommended'],
    culturalContext:
      'A Michelin-starred hawker stall famous for bak chor mee (minced pork noodles). The springy noodles are tossed in a vinegar-based sauce with minced pork, liver, and crispy pork lard.',
    imageUrl: 'https://images.unsplash.com/photo-1555126634-323283e090fa?w=400',
    rating: 4.7,
    priceLevel: 1,
    createdAt: new Date('2024-01-02'),
  },
  {
    id: 'place-3',
    googlePlaceId: 'ChIJ-3',
    name: 'Lau Pa Sat',
    address: '18 Raffles Quay, Singapore 048582',
    location: { lat: 1.2806, lng: 103.8505 },
    cuisineType: ['Hawker', 'Multi-cuisine'],
    tags: ['late-night', 'outdoor', 'tourist-friendly'],
    culturalContext:
      'Built in 1894, this Victorian-era cast iron structure is one of Singapore\'s most famous hawker centres. The nightly satay street transforms Boon Tat Street into an open-air BBQ paradise.',
    imageUrl: 'https://images.unsplash.com/photo-1517248135467-4c7edcad34c4?w=400',
    rating: 4.0,
    priceLevel: 2,
    createdAt: new Date('2024-01-03'),
  },
  {
    id: 'place-4',
    googlePlaceId: 'ChIJ-4',
    name: 'Common Man Coffee Roasters',
    address: '22 Martin Road, Singapore 239058',
    location: { lat: 1.2895, lng: 103.8374 },
    cuisineType: ['Cafe', 'Brunch'],
    tags: ['wifi', 'quiet', 'air-conditioned'],
    culturalContext:
      'A specialty coffee roaster and all-day brunch spot. Perfect for remote work with excellent wifi, ample seating, and some of the best flat whites in Singapore.',
    imageUrl: 'https://images.unsplash.com/photo-1554118811-1e0d58224f24?w=400',
    rating: 4.4,
    priceLevel: 3,
    createdAt: new Date('2024-01-04'),
  },
  {
    id: 'place-5',
    googlePlaceId: 'ChIJ-5',
    name: 'Old Airport Road Food Centre',
    address: '51 Old Airport Road, Singapore 390051',
    location: { lat: 1.3118, lng: 103.8831 },
    cuisineType: ['Hawker', 'Multi-cuisine'],
    tags: ['kid-friendly', 'vegetarian'],
    culturalContext:
      'One of Singapore\'s largest and most beloved hawker centres, with over 150 stalls. Locals consider this one of the most "authentic" hawker experiences away from tourist areas.',
    imageUrl: 'https://images.unsplash.com/photo-1504674900247-0877df9cc836?w=400',
    rating: 4.3,
    priceLevel: 1,
    createdAt: new Date('2024-01-05'),
  },
  {
    id: 'place-6',
    googlePlaceId: 'ChIJ-6',
    name: 'Burnt Ends',
    address: '20 Teck Lim Road, Singapore 088393',
    location: { lat: 1.2792, lng: 103.8428 },
    cuisineType: ['BBQ', 'Modern Australian'],
    tags: ['reservation-recommended'],
    culturalContext:
      'A one-Michelin-starred modern Australian BBQ restaurant built around a custom 4-ton wood-fired oven and grills. The menu changes daily based on what\'s freshest.',
    imageUrl: 'https://images.unsplash.com/photo-1544025162-d76694265947?w=400',
    rating: 4.8,
    priceLevel: 4,
    createdAt: new Date('2024-01-06'),
  },
  {
    id: 'place-7',
    googlePlaceId: 'ChIJ-7',
    name: 'Atlas Bar',
    address: 'Parkview Square, 600 North Bridge Road, Singapore 188778',
    location: { lat: 1.2979, lng: 103.8603 },
    cuisineType: ['Bar', 'European'],
    tags: ['air-conditioned'],
    culturalContext:
      'Step into the 1920s at this Art Deco gin bar with the world\'s largest gin collection (over 1,300 labels). The stunning lobby alone is worth the visit.',
    imageUrl: 'https://images.unsplash.com/photo-1470337458703-46ad1756a187?w=400',
    rating: 4.6,
    priceLevel: 4,
    createdAt: new Date('2024-01-07'),
  },
  {
    id: 'place-8',
    googlePlaceId: 'ChIJ-8',
    name: '328 Katong Laksa',
    address: '51 East Coast Road, Singapore 428770',
    location: { lat: 1.3047, lng: 103.9053 },
    cuisineType: ['Singaporean', 'Laksa'],
    tags: ['halal'],
    culturalContext:
      'Famous for their rich, creamy laksa with thick bee hoon (rice vermicelli) cut short so you can eat it with just a spoon. Anthony Bourdain featured this stall.',
    imageUrl: 'https://images.unsplash.com/photo-1582878826629-29b7ad1cdc43?w=400',
    rating: 4.3,
    priceLevel: 1,
    createdAt: new Date('2024-01-08'),
  },
];

// ============================================================================
// Mock Lists
// ============================================================================

export const mockLists: FoodList[] = [
  {
    id: 'list-1',
    userId: 'user-1',
    title: 'Tourist Must-Try: Singapore Hawker Essentials',
    description:
      'The absolute essential hawker dishes every visitor must try. These are the stalls that define Singapore food culture.',
    isPublic: true,
    shareCode: 'sgfood01',
    category: 'tourist-must-try',
    coverImageUrl: 'https://images.unsplash.com/photo-1569562211093-4ed0d0758f12?w=800',
    createdAt: new Date('2024-01-10'),
    updatedAt: new Date('2024-01-15'),
    user: mockUsers[0],
    placeCount: 5,
  },
  {
    id: 'list-2',
    userId: 'user-2',
    title: 'Best Cafes for Remote Work',
    description:
      'Cafes with great wifi, good coffee, and comfortable seating for a productive work session.',
    isPublic: true,
    shareCode: 'cafework',
    category: 'cafe',
    coverImageUrl: 'https://images.unsplash.com/photo-1554118811-1e0d58224f24?w=800',
    createdAt: new Date('2024-01-12'),
    updatedAt: new Date('2024-01-20'),
    user: mockUsers[1],
    placeCount: 3,
  },
  {
    id: 'list-3',
    userId: 'user-3',
    title: 'Local Favorites: Where Singaporeans Actually Eat',
    description:
      'Skip the tourist traps. These are the places locals line up for on weekends.',
    isPublic: true,
    shareCode: 'localfav',
    category: 'local-favorites',
    coverImageUrl: 'https://images.unsplash.com/photo-1504674900247-0877df9cc836?w=800',
    createdAt: new Date('2024-01-14'),
    updatedAt: new Date('2024-01-25'),
    user: mockUsers[2],
    placeCount: 4,
  },
  {
    id: 'list-4',
    userId: 'user-1',
    title: 'Special Occasion Splurge',
    description:
      'When you want to treat yourself to Singapore\'s finest. Reservations essential.',
    isPublic: true,
    shareCode: 'splurge1',
    category: 'splurge',
    coverImageUrl: 'https://images.unsplash.com/photo-1544025162-d76694265947?w=800',
    createdAt: new Date('2024-01-16'),
    updatedAt: new Date('2024-01-28'),
    user: mockUsers[0],
    placeCount: 2,
  },
];

// ============================================================================
// Mock List-Place Relationships
// ============================================================================

export const mockListPlaces: Record<string, PlaceWithNote[]> = {
  'list-1': [
    {
      ...mockPlaces[0],
      note: 'Get here before 11am to avoid the crazy lunch queue!',
      position: 0,
    },
    {
      ...mockPlaces[1],
      note: 'Order the dry version with extra vinegar',
      position: 1,
    },
    {
      ...mockPlaces[7],
      note: 'No chopsticks needed - they cut the noodles short',
      position: 2,
    },
    {
      ...mockPlaces[2],
      note: 'Visit at night for the satay street experience',
      position: 3,
    },
    {
      ...mockPlaces[4],
      note: 'Try stall #51 for the best char kway teow',
      position: 4,
    },
  ],
  'list-2': [
    {
      ...mockPlaces[3],
      note: 'Best flat white in Singapore, great for calls',
      position: 0,
    },
  ],
  'list-3': [
    {
      ...mockPlaces[4],
      note: 'This is where the locals go - trust me',
      position: 0,
    },
    {
      ...mockPlaces[0],
      note: 'The original, accept no substitutes',
      position: 1,
    },
    {
      ...mockPlaces[1],
      note: 'Worth the queue, I promise',
      position: 2,
    },
    {
      ...mockPlaces[7],
      note: 'Best laksa in the east side',
      position: 3,
    },
  ],
  'list-4': [
    {
      ...mockPlaces[5],
      note: 'Book 2 weeks in advance for dinner',
      position: 0,
    },
    {
      ...mockPlaces[6],
      note: 'The architecture alone is worth the visit',
      position: 1,
    },
  ],
};

// ============================================================================
// Helper functions to simulate API calls
// ============================================================================

export function getListById(id: string): FoodList | undefined {
  return mockLists.find((list) => list.id === id);
}

export function getListByShareCode(code: string): FoodList | undefined {
  return mockLists.find((list) => list.shareCode === code);
}

export function getListPlaces(listId: string): PlaceWithNote[] {
  return mockListPlaces[listId] ?? [];
}

export function getPlaceById(id: string): Place | undefined {
  return mockPlaces.find((place) => place.id === id);
}

export function searchPlaces(query: string): Place[] {
  const lowerQuery = query.toLowerCase();
  return mockPlaces.filter(
    (place) =>
      place.name.toLowerCase().includes(lowerQuery) ||
      place.address.toLowerCase().includes(lowerQuery) ||
      place.cuisineType.some((c) => c.toLowerCase().includes(lowerQuery)) ||
      place.tags.some((t) => t.toLowerCase().includes(lowerQuery))
  );
}

export function getAllLists(): FoodList[] {
  return mockLists;
}
