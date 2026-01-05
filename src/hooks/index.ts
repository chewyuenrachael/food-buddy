'use client';

import * as React from 'react';
import type { FoodList, Place, PlaceWithNote } from '@/types';

/**
 * Hook to detect if user is on mobile device
 */
export function useIsMobile(breakpoint = 768): boolean {
  const [isMobile, setIsMobile] = React.useState(false);

  React.useEffect(() => {
    const checkMobile = () => {
      setIsMobile(window.innerWidth < breakpoint);
    };

    checkMobile();
    window.addEventListener('resize', checkMobile);
    return () => window.removeEventListener('resize', checkMobile);
  }, [breakpoint]);

  return isMobile;
}

/**
 * Hook to get user's current location
 */
export function useGeolocation() {
  const [location, setLocation] = React.useState<{
    lat: number;
    lng: number;
  } | null>(null);
  const [error, setError] = React.useState<string | null>(null);
  const [loading, setLoading] = React.useState(false);

  const requestLocation = React.useCallback(() => {
    if (!navigator.geolocation) {
      setError('Geolocation is not supported by your browser');
      return;
    }

    setLoading(true);
    setError(null);

    navigator.geolocation.getCurrentPosition(
      (position) => {
        setLocation({
          lat: position.coords.latitude,
          lng: position.coords.longitude,
        });
        setLoading(false);
      },
      (err) => {
        setError(err.message);
        setLoading(false);
      },
      {
        enableHighAccuracy: true,
        timeout: 10000,
        maximumAge: 60000,
      }
    );
  }, []);

  return { location, error, loading, requestLocation };
}

/**
 * Hook for debounced value
 */
export function useDebounce<T>(value: T, delay: number): T {
  const [debouncedValue, setDebouncedValue] = React.useState(value);

  React.useEffect(() => {
    const timer = setTimeout(() => setDebouncedValue(value), delay);
    return () => clearTimeout(timer);
  }, [value, delay]);

  return debouncedValue;
}

/**
 * Hook for local storage with SSR safety
 */
export function useLocalStorage<T>(
  key: string,
  initialValue: T
): [T, (value: T | ((prev: T) => T)) => void] {
  const [storedValue, setStoredValue] = React.useState<T>(initialValue);

  React.useEffect(() => {
    try {
      const item = window.localStorage.getItem(key);
      if (item) {
        setStoredValue(JSON.parse(item));
      }
    } catch (error) {
      console.error('Error reading from localStorage:', error);
    }
  }, [key]);

  const setValue = React.useCallback(
    (value: T | ((prev: T) => T)) => {
      try {
        const valueToStore =
          value instanceof Function ? value(storedValue) : value;
        setStoredValue(valueToStore);
        window.localStorage.setItem(key, JSON.stringify(valueToStore));
      } catch (error) {
        console.error('Error writing to localStorage:', error);
      }
    },
    [key, storedValue]
  );

  return [storedValue, setValue];
}

/**
 * Hook to fetch a list by ID
 */
export function useList(listId: string | null) {
  const [list, setList] = React.useState<FoodList | null>(null);
  const [places, setPlaces] = React.useState<PlaceWithNote[]>([]);
  const [loading, setLoading] = React.useState(false);
  const [error, setError] = React.useState<string | null>(null);

  React.useEffect(() => {
    if (!listId) return;

    const fetchList = async () => {
      setLoading(true);
      setError(null);

      try {
        const response = await fetch(`/api/lists/${listId}`);
        const result = await response.json();

        if (result.error) {
          setError(result.error.message);
        } else {
          setList(result.data);
          setPlaces(result.data.places ?? []);
        }
      } catch (err) {
        setError('Failed to fetch list');
      } finally {
        setLoading(false);
      }
    };

    fetchList();
  }, [listId]);

  return { list, places, loading, error };
}

/**
 * Hook to fetch all public lists
 */
export function useLists(category?: string) {
  const [lists, setLists] = React.useState<FoodList[]>([]);
  const [loading, setLoading] = React.useState(true);
  const [error, setError] = React.useState<string | null>(null);

  React.useEffect(() => {
    const fetchLists = async () => {
      setLoading(true);
      setError(null);

      try {
        const params = new URLSearchParams();
        if (category) params.set('category', category);

        const response = await fetch(`/api/lists?${params}`);
        const result = await response.json();

        if (result.error) {
          setError(result.error.message);
        } else {
          setLists(result.data);
        }
      } catch (err) {
        setError('Failed to fetch lists');
      } finally {
        setLoading(false);
      }
    };

    fetchLists();
  }, [category]);

  return { lists, loading, error };
}

/**
 * Hook to search places
 */
export function usePlaceSearch(query: string) {
  const debouncedQuery = useDebounce(query, 300);
  const [places, setPlaces] = React.useState<Place[]>([]);
  const [loading, setLoading] = React.useState(false);
  const [error, setError] = React.useState<string | null>(null);

  React.useEffect(() => {
    if (!debouncedQuery || debouncedQuery.length < 2) {
      setPlaces([]);
      return;
    }

    const searchPlaces = async () => {
      setLoading(true);
      setError(null);

      try {
        const response = await fetch(
          `/api/places?q=${encodeURIComponent(debouncedQuery)}`
        );
        const result = await response.json();

        if (result.error) {
          setError(result.error.message);
        } else {
          setPlaces(result.data);
        }
      } catch (err) {
        setError('Failed to search places');
      } finally {
        setLoading(false);
      }
    };

    searchPlaces();
  }, [debouncedQuery]);

  return { places, loading, error };
}
