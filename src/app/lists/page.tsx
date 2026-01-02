'use client';

import * as React from 'react';
import { Search, SlidersHorizontal } from 'lucide-react';
import { Header } from '@/components/layout';
import { ListCard } from '@/components/lists';
import { Input, Button, Badge } from '@/components/ui';
import { LIST_CATEGORIES } from '@/types';
import { mockLists } from '@/lib/mock-data';
import type { ListCategory } from '@/types';

export default function ListsPage() {
  const [searchQuery, setSearchQuery] = React.useState('');
  const [selectedCategory, setSelectedCategory] = React.useState<ListCategory | null>(null);

  // Filter lists based on search and category
  const filteredLists = React.useMemo(() => {
    let lists = mockLists;

    if (selectedCategory) {
      lists = lists.filter((list) => list.category === selectedCategory);
    }

    if (searchQuery) {
      const query = searchQuery.toLowerCase();
      lists = lists.filter(
        (list) =>
          list.title.toLowerCase().includes(query) ||
          list.description?.toLowerCase().includes(query)
      );
    }

    return lists;
  }, [searchQuery, selectedCategory]);

  const categories = Object.entries(LIST_CATEGORIES) as [
    ListCategory,
    { label: string; emoji: string }
  ][];

  return (
    <div className="min-h-screen bg-gray-50">
      <Header />

      <main className="mx-auto max-w-7xl px-4 py-8">
        {/* Page header */}
        <div className="mb-8">
          <h1 className="text-3xl font-bold text-gray-900">Explore Food Lists</h1>
          <p className="mt-2 text-gray-600">
            Curated recommendations from locals and food influencers
          </p>
        </div>

        {/* Search and filters */}
        <div className="mb-6 flex flex-col gap-4 sm:flex-row sm:items-center">
          <div className="flex-1">
            <Input
              type="search"
              placeholder="Search lists..."
              value={searchQuery}
              onChange={(e) => setSearchQuery(e.target.value)}
              icon={<Search className="h-4 w-4" />}
            />
          </div>
          <Button variant="outline">
            <SlidersHorizontal className="h-4 w-4" />
            Filters
          </Button>
        </div>

        {/* Category pills */}
        <div className="mb-8 flex flex-wrap gap-2">
          <Badge
            variant={selectedCategory === null ? 'default' : 'outline'}
            className="cursor-pointer"
            onClick={() => setSelectedCategory(null)}
          >
            All
          </Badge>
          {categories.map(([key, { label, emoji }]) => (
            <Badge
              key={key}
              variant={selectedCategory === key ? 'default' : 'outline'}
              className="cursor-pointer"
              onClick={() => setSelectedCategory(key)}
            >
              {emoji} {label}
            </Badge>
          ))}
        </div>

        {/* Results */}
        {filteredLists.length > 0 ? (
          <div className="grid gap-6 sm:grid-cols-2 lg:grid-cols-3">
            {filteredLists.map((list) => (
              <ListCard key={list.id} list={list} />
            ))}
          </div>
        ) : (
          <div className="rounded-xl border border-gray-200 bg-white py-16 text-center">
            <p className="text-gray-500">No lists found matching your criteria</p>
            <Button
              variant="link"
              onClick={() => {
                setSearchQuery('');
                setSelectedCategory(null);
              }}
            >
              Clear filters
            </Button>
          </div>
        )}
      </main>
    </div>
  );
}
