'use client';

import * as React from 'react';
import Link from 'next/link';
import { Menu, Search, X, MapPin } from 'lucide-react';
import { Button, Input } from '@/components/ui';
import { useUIStore } from '@/stores';
import { cn } from '@/lib/utils';

export function Header() {
  const { isSearchOpen, setSearchOpen, toggleSidebar } = useUIStore();
  const [searchQuery, setSearchQuery] = React.useState('');

  return (
    <header className="sticky top-0 z-40 border-b border-gray-200 bg-white">
      <div className="flex h-14 items-center gap-4 px-4">
        {/* Menu toggle (mobile) */}
        <Button
          variant="ghost"
          size="icon"
          onClick={toggleSidebar}
          className="lg:hidden"
        >
          <Menu className="h-5 w-5" />
        </Button>

        {/* Logo */}
        <Link href="/" className="flex items-center gap-2">
          <div className="flex h-8 w-8 items-center justify-center rounded-lg bg-orange-500">
            <MapPin className="h-5 w-5 text-white" />
          </div>
          <span className="hidden font-bold text-gray-900 sm:inline">
            Food Buddy
          </span>
        </Link>

        {/* Search (desktop) */}
        <div className="hidden flex-1 max-w-md mx-auto lg:block">
          <Input
            type="search"
            placeholder="Search for food... (e.g., 'quiet cafe with wifi')"
            value={searchQuery}
            onChange={(e) => setSearchQuery(e.target.value)}
            icon={<Search className="h-4 w-4" />}
          />
        </div>

        {/* Spacer */}
        <div className="flex-1 lg:hidden" />

        {/* Search toggle (mobile) */}
        <Button
          variant="ghost"
          size="icon"
          onClick={() => setSearchOpen(!isSearchOpen)}
          className="lg:hidden"
        >
          {isSearchOpen ? (
            <X className="h-5 w-5" />
          ) : (
            <Search className="h-5 w-5" />
          )}
        </Button>

        {/* Actions */}
        <div className="flex items-center gap-2">
          <Button variant="ghost" size="sm" asChild>
            <Link href="/lists">Explore</Link>
          </Button>
          <Button size="sm" asChild>
            <Link href="/lists/new">Create List</Link>
          </Button>
        </div>
      </div>

      {/* Mobile search bar */}
      <div
        className={cn(
          'overflow-hidden border-t border-gray-200 transition-all lg:hidden',
          isSearchOpen ? 'h-14' : 'h-0'
        )}
      >
        <div className="p-2">
          <Input
            type="search"
            placeholder="Search for food..."
            value={searchQuery}
            onChange={(e) => setSearchQuery(e.target.value)}
            icon={<Search className="h-4 w-4" />}
          />
        </div>
      </div>
    </header>
  );
}
