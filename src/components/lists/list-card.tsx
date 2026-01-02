'use client';

import * as React from 'react';
import Link from 'next/link';
import { MapPin, User, Share2 } from 'lucide-react';
import { Card, CardContent, Badge, Button } from '@/components/ui';
import { LIST_CATEGORIES } from '@/types';
import type { FoodList } from '@/types';

interface ListCardProps {
  list: FoodList;
  onShare?: () => void;
}

export function ListCard({ list, onShare }: ListCardProps) {
  const category = LIST_CATEGORIES[list.category];

  return (
    <Link href={`/lists/${list.id}`}>
      <Card className="cursor-pointer transition-all hover:shadow-md">
        {/* Cover image */}
        {list.coverImageUrl && (
          <div className="h-32 w-full overflow-hidden rounded-t-xl">
            <img
              src={list.coverImageUrl}
              alt={list.title}
              className="h-full w-full object-cover"
            />
          </div>
        )}

        <CardContent className="p-4">
          {/* Category badge */}
          <Badge variant="default" className="mb-2">
            {category.emoji} {category.label}
          </Badge>

          {/* Title */}
          <h3 className="font-semibold text-gray-900 line-clamp-1">
            {list.title}
          </h3>

          {/* Description */}
          {list.description && (
            <p className="mt-1 text-sm text-gray-500 line-clamp-2">
              {list.description}
            </p>
          )}

          {/* Meta info */}
          <div className="mt-3 flex items-center justify-between">
            <div className="flex items-center gap-3 text-sm text-gray-500">
              {/* Place count */}
              <div className="flex items-center gap-1">
                <MapPin className="h-3 w-3" />
                <span>{list.placeCount ?? 0} places</span>
              </div>

              {/* Curator */}
              {list.user && (
                <div className="flex items-center gap-1">
                  <User className="h-3 w-3" />
                  <span>{list.user.name ?? 'Anonymous'}</span>
                </div>
              )}
            </div>

            {/* Share button */}
            {onShare && (
              <Button
                variant="ghost"
                size="sm"
                onClick={(e) => {
                  e.preventDefault();
                  e.stopPropagation();
                  onShare();
                }}
              >
                <Share2 className="h-4 w-4" />
              </Button>
            )}
          </div>
        </CardContent>
      </Card>
    </Link>
  );
}
