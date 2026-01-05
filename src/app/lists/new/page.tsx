'use client';

import * as React from 'react';
import { useRouter } from 'next/navigation';
import Link from 'next/link';
import { ArrowLeft, Plus, Search, X, MapPin, GripVertical } from 'lucide-react';
import { Header } from '@/components/layout';
import { PlaceCard } from '@/components/lists';
import {
  Button,
  Card,
  CardContent,
  CardHeader,
  CardTitle,
  Input,
  Textarea,
  Select,
  Badge,
} from '@/components/ui';
import { usePlaceSearch } from '@/hooks';
import { LIST_CATEGORIES } from '@/types';
import { generateShareCode } from '@/lib/utils';
import type { ListCategory, Place, PlaceWithNote } from '@/types';

export default function CreateListPage() {
  const router = useRouter();
  const [isSubmitting, setIsSubmitting] = React.useState(false);
  const [searchQuery, setSearchQuery] = React.useState('');
  const [showSearch, setShowSearch] = React.useState(false);

  // Form state
  const [title, setTitle] = React.useState('');
  const [description, setDescription] = React.useState('');
  const [category, setCategory] = React.useState<ListCategory>('local-favorites');
  const [selectedPlaces, setSelectedPlaces] = React.useState<PlaceWithNote[]>([]);

  // Search results
  const { places: searchResults, loading: searchLoading } = usePlaceSearch(searchQuery);

  // Category options for select
  const categoryOptions = Object.entries(LIST_CATEGORIES).map(([key, value]) => ({
    value: key,
    label: `${value.emoji} ${value.label}`,
  }));

  // Add place to list
  const handleAddPlace = (place: Place) => {
    if (selectedPlaces.some((p) => p.id === place.id)) return;

    setSelectedPlaces((prev) => [
      ...prev,
      {
        ...place,
        note: null,
        position: prev.length,
      },
    ]);
    setSearchQuery('');
    setShowSearch(false);
  };

  // Remove place from list
  const handleRemovePlace = (placeId: string) => {
    setSelectedPlaces((prev) =>
      prev
        .filter((p) => p.id !== placeId)
        .map((p, i) => ({ ...p, position: i }))
    );
  };

  // Update place note
  const handleUpdateNote = (placeId: string, note: string) => {
    setSelectedPlaces((prev) =>
      prev.map((p) => (p.id === placeId ? { ...p, note: note || null } : p))
    );
  };

  // Submit form
  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();

    if (!title.trim()) {
      alert('Please enter a title for your list');
      return;
    }

    if (selectedPlaces.length === 0) {
      alert('Please add at least one place to your list');
      return;
    }

    setIsSubmitting(true);

    try {
      const response = await fetch('/api/lists', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
          title: title.trim(),
          description: description.trim() || null,
          category,
          places: selectedPlaces.map((p) => ({
            placeId: p.id,
            note: p.note,
            position: p.position,
          })),
        }),
      });

      const result = await response.json();

      if (result.error) {
        alert(result.error.message);
      } else {
        router.push(`/lists/${result.data.id}`);
      }
    } catch (error) {
      alert('Failed to create list. Please try again.');
    } finally {
      setIsSubmitting(false);
    }
  };

  return (
    <div className="min-h-screen bg-gray-50">
      <Header />

      <main className="mx-auto max-w-3xl px-4 py-8">
        {/* Back button */}
        <Button variant="ghost" size="sm" asChild className="mb-6">
          <Link href="/lists">
            <ArrowLeft className="h-4 w-4" />
            Back to Lists
          </Link>
        </Button>

        <form onSubmit={handleSubmit}>
          {/* List details */}
          <Card className="mb-6">
            <CardHeader>
              <CardTitle>Create a New Food List</CardTitle>
            </CardHeader>
            <CardContent className="space-y-4">
              {/* Title */}
              <div>
                <label
                  htmlFor="title"
                  className="mb-1 block text-sm font-medium text-gray-700"
                >
                  List Title *
                </label>
                <Input
                  id="title"
                  value={title}
                  onChange={(e) => setTitle(e.target.value)}
                  placeholder="e.g., Best Hawker Food in Chinatown"
                  required
                />
              </div>

              {/* Description */}
              <div>
                <label
                  htmlFor="description"
                  className="mb-1 block text-sm font-medium text-gray-700"
                >
                  Description
                </label>
                <Textarea
                  id="description"
                  value={description}
                  onChange={(e) => setDescription(e.target.value)}
                  placeholder="Share what makes this list special..."
                  rows={3}
                />
              </div>

              {/* Category */}
              <div>
                <label
                  htmlFor="category"
                  className="mb-1 block text-sm font-medium text-gray-700"
                >
                  Category *
                </label>
                <Select
                  id="category"
                  value={category}
                  onChange={(e) => setCategory(e.target.value as ListCategory)}
                  options={categoryOptions}
                />
              </div>
            </CardContent>
          </Card>

          {/* Places */}
          <Card className="mb-6">
            <CardHeader className="flex flex-row items-center justify-between">
              <CardTitle>Places ({selectedPlaces.length})</CardTitle>
              <Button
                type="button"
                variant="outline"
                size="sm"
                onClick={() => setShowSearch(true)}
              >
                <Plus className="h-4 w-4" />
                Add Place
              </Button>
            </CardHeader>
            <CardContent>
              {selectedPlaces.length === 0 ? (
                <div className="rounded-lg border-2 border-dashed border-gray-200 py-12 text-center">
                  <MapPin className="mx-auto h-12 w-12 text-gray-300" />
                  <p className="mt-2 text-gray-500">No places added yet</p>
                  <Button
                    type="button"
                    variant="link"
                    onClick={() => setShowSearch(true)}
                  >
                    Add your first place
                  </Button>
                </div>
              ) : (
                <div className="space-y-3">
                  {selectedPlaces.map((place, index) => (
                    <div key={place.id} className="relative">
                      <div className="flex items-start gap-2">
                        {/* Drag handle (visual only for now) */}
                        <div className="mt-4 cursor-grab text-gray-400">
                          <GripVertical className="h-5 w-5" />
                        </div>

                        {/* Place card */}
                        <div className="flex-1">
                          <PlaceCard
                            place={place}
                            index={index}
                            showNote={false}
                          />

                          {/* Note input */}
                          <div className="mt-2 pl-11">
                            <Input
                              placeholder="Add a personal note (e.g., 'Try the chili crab!')"
                              value={place.note ?? ''}
                              onChange={(e) =>
                                handleUpdateNote(place.id, e.target.value)
                              }
                            />
                          </div>
                        </div>

                        {/* Remove button */}
                        <Button
                          type="button"
                          variant="ghost"
                          size="icon"
                          onClick={() => handleRemovePlace(place.id)}
                          className="mt-2"
                        >
                          <X className="h-4 w-4" />
                        </Button>
                      </div>
                    </div>
                  ))}
                </div>
              )}
            </CardContent>
          </Card>

          {/* Submit */}
          <div className="flex justify-end gap-3">
            <Button type="button" variant="outline" asChild>
              <Link href="/lists">Cancel</Link>
            </Button>
            <Button type="submit" isLoading={isSubmitting}>
              Create List
            </Button>
          </div>
        </form>
      </main>

      {/* Search modal */}
      {showSearch && (
        <div className="fixed inset-0 z-50 flex items-start justify-center bg-black/50 p-4 pt-20">
          <Card className="w-full max-w-lg">
            <CardHeader className="flex flex-row items-center justify-between">
              <CardTitle>Add a Place</CardTitle>
              <Button
                variant="ghost"
                size="icon"
                onClick={() => {
                  setShowSearch(false);
                  setSearchQuery('');
                }}
              >
                <X className="h-5 w-5" />
              </Button>
            </CardHeader>
            <CardContent>
              <Input
                type="search"
                placeholder="Search for a restaurant or hawker stall..."
                value={searchQuery}
                onChange={(e) => setSearchQuery(e.target.value)}
                icon={<Search className="h-4 w-4" />}
                autoFocus
              />

              {/* Search results */}
              <div className="mt-4 max-h-80 space-y-2 overflow-y-auto">
                {searchLoading && (
                  <p className="py-4 text-center text-gray-500">Searching...</p>
                )}

                {!searchLoading && searchQuery && searchResults.length === 0 && (
                  <p className="py-4 text-center text-gray-500">
                    No places found for "{searchQuery}"
                  </p>
                )}

                {searchResults.map((place) => {
                  const isAdded = selectedPlaces.some((p) => p.id === place.id);
                  return (
                    <div
                      key={place.id}
                      className={`flex cursor-pointer items-center gap-3 rounded-lg border p-3 transition-colors ${
                        isAdded
                          ? 'border-orange-200 bg-orange-50'
                          : 'border-gray-200 hover:bg-gray-50'
                      }`}
                      onClick={() => !isAdded && handleAddPlace(place)}
                    >
                      {place.imageUrl && (
                        <img
                          src={place.imageUrl}
                          alt={place.name}
                          className="h-12 w-12 rounded-lg object-cover"
                        />
                      )}
                      <div className="flex-1 min-w-0">
                        <p className="font-medium text-gray-900 truncate">
                          {place.name}
                        </p>
                        <p className="text-sm text-gray-500 truncate">
                          {place.address}
                        </p>
                      </div>
                      {isAdded ? (
                        <Badge variant="default">Added</Badge>
                      ) : (
                        <Plus className="h-5 w-5 text-gray-400" />
                      )}
                    </div>
                  );
                })}
              </div>
            </CardContent>
          </Card>
        </div>
      )}
    </div>
  );
}
