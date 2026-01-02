import { create } from 'zustand';
import { devtools, persist } from 'zustand/middleware';
import type { Coordinates, FoodList, Place, MapViewState } from '@/types';

// ============================================================================
// Map Store
// ============================================================================

interface MapState {
  viewState: MapViewState;
  selectedPlaceId: string | null;
  setViewState: (viewState: MapViewState) => void;
  setSelectedPlace: (placeId: string | null) => void;
  flyTo: (coordinates: Coordinates, zoom?: number) => void;
}

// Default to Singapore
const DEFAULT_VIEW_STATE: MapViewState = {
  longitude: 103.8198,
  latitude: 1.3521,
  zoom: 12,
};

export const useMapStore = create<MapState>()(
  devtools(
    (set) => ({
      viewState: DEFAULT_VIEW_STATE,
      selectedPlaceId: null,
      
      setViewState: (viewState) => set({ viewState }),
      
      setSelectedPlace: (placeId) => set({ selectedPlaceId: placeId }),
      
      flyTo: (coordinates, zoom = 15) =>
        set({
          viewState: {
            longitude: coordinates.lng,
            latitude: coordinates.lat,
            zoom,
          },
        }),
    }),
    { name: 'map-store' }
  )
);

// ============================================================================
// List Store
// ============================================================================

interface ListState {
  currentList: FoodList | null;
  lists: FoodList[];
  isLoading: boolean;
  error: string | null;
  
  setCurrentList: (list: FoodList | null) => void;
  setLists: (lists: FoodList[]) => void;
  addList: (list: FoodList) => void;
  updateList: (id: string, updates: Partial<FoodList>) => void;
  removeList: (id: string) => void;
  setLoading: (isLoading: boolean) => void;
  setError: (error: string | null) => void;
}

export const useListStore = create<ListState>()(
  devtools(
    (set) => ({
      currentList: null,
      lists: [],
      isLoading: false,
      error: null,
      
      setCurrentList: (list) => set({ currentList: list }),
      
      setLists: (lists) => set({ lists }),
      
      addList: (list) =>
        set((state) => ({ lists: [list, ...state.lists] })),
      
      updateList: (id, updates) =>
        set((state) => ({
          lists: state.lists.map((list) =>
            list.id === id ? { ...list, ...updates } : list
          ),
          currentList:
            state.currentList?.id === id
              ? { ...state.currentList, ...updates }
              : state.currentList,
        })),
      
      removeList: (id) =>
        set((state) => ({
          lists: state.lists.filter((list) => list.id !== id),
          currentList: state.currentList?.id === id ? null : state.currentList,
        })),
      
      setLoading: (isLoading) => set({ isLoading }),
      
      setError: (error) => set({ error }),
    }),
    { name: 'list-store' }
  )
);

// ============================================================================
// UI Store
// ============================================================================

interface UIState {
  isSidebarOpen: boolean;
  isSearchOpen: boolean;
  activePanel: 'list' | 'place' | 'route' | null;
  
  toggleSidebar: () => void;
  setSidebarOpen: (isOpen: boolean) => void;
  setSearchOpen: (isOpen: boolean) => void;
  setActivePanel: (panel: 'list' | 'place' | 'route' | null) => void;
}

export const useUIStore = create<UIState>()(
  devtools(
    (set) => ({
      isSidebarOpen: true,
      isSearchOpen: false,
      activePanel: null,
      
      toggleSidebar: () =>
        set((state) => ({ isSidebarOpen: !state.isSidebarOpen })),
      
      setSidebarOpen: (isOpen) => set({ isSidebarOpen: isOpen }),
      
      setSearchOpen: (isOpen) => set({ isSearchOpen: isOpen }),
      
      setActivePanel: (panel) => set({ activePanel: panel }),
    }),
    { name: 'ui-store' }
  )
);

// ============================================================================
// User Preferences Store (persisted)
// ============================================================================

interface UserPreferences {
  recentSearches: string[];
  favoriteListIds: string[];
  mapStyle: 'streets' | 'satellite' | 'dark';
  
  addRecentSearch: (query: string) => void;
  clearRecentSearches: () => void;
  toggleFavoriteList: (listId: string) => void;
  setMapStyle: (style: 'streets' | 'satellite' | 'dark') => void;
}

export const useUserPreferences = create<UserPreferences>()(
  devtools(
    persist(
      (set) => ({
        recentSearches: [],
        favoriteListIds: [],
        mapStyle: 'streets',
        
        addRecentSearch: (query) =>
          set((state) => ({
            recentSearches: [
              query,
              ...state.recentSearches.filter((q) => q !== query),
            ].slice(0, 10),
          })),
        
        clearRecentSearches: () => set({ recentSearches: [] }),
        
        toggleFavoriteList: (listId) =>
          set((state) => ({
            favoriteListIds: state.favoriteListIds.includes(listId)
              ? state.favoriteListIds.filter((id) => id !== listId)
              : [...state.favoriteListIds, listId],
          })),
        
        setMapStyle: (style) => set({ mapStyle: style }),
      }),
      { name: 'user-preferences' }
    ),
    { name: 'user-preferences-store' }
  )
);
