'use client';

import * as React from 'react';
import { MapPin, Star, Clock, ExternalLink } from 'lucide-react';
import { Card, CardContent, Badge, Button } from '@/components/ui';
import { cn, formatDistance } from '@/lib/utils';
import type { Place, PlaceWithNote } from '@/types';

interface PlaceCardProps {
  place: Place | PlaceWithNote;
  index?: number;
  distance?: number;
  isSelected?: boolean;
  showNote?: boolean;
  onClick?: () => void;
  onDirections?: () => void;
}

export function PlaceCard({
  place,
  index,
  distance,
  isSelected,
  showNote = true,
  onClick,
  onDirections,
}: PlaceCardProps) {
  const note = 'note' in place ? place.note : null;

  return (
    <Card
      className={cn(
        'cursor-pointer transition-all hover:shadow-md',
        isSelected && 'ring-2 ring-orange-500'
      )}
      onClick={onClick}
    >
      <CardContent className="p-4">
        <div className="flex gap-3">
          {/* Index number for routes */}
          {typeof index === 'number' && (
            <div className="flex h-8 w-8 flex-shrink-0 items-center justify-center rounded-full bg-orange-500 text-sm font-bold text-white">
              {index + 1}
            </div>
          )}

          {/* Place image */}
          {place.imageUrl && (
            <div className="h-16 w-16 flex-shrink-0 overflow-hidden rounded-lg">
              <img
                src={place.imageUrl}
                alt={place.name}
                className="h-full w-full object-cover"
              />
            </div>
          )}

          {/* Place info */}
          <div className="flex-1 min-w-0">
            <h3 className="font-semibold text-gray-900 truncate">{place.name}</h3>

            {/* Address */}
            <div className="mt-1 flex items-center gap-1 text-sm text-gray-500">
              <MapPin className="h-3 w-3 flex-shrink-0" />
              <span className="truncate">{place.address}</span>
            </div>

            {/* Rating and distance */}
            <div className="mt-2 flex items-center gap-3 text-sm">
              {place.rating && (
                <div className="flex items-center gap-1">
                  <Star className="h-3 w-3 fill-yellow-400 text-yellow-400" />
                  <span className="font-medium">{place.rating.toFixed(1)}</span>
                </div>
              )}
              {distance && (
                <div className="flex items-center gap-1 text-gray-500">
                  <Clock className="h-3 w-3" />
                  <span>{formatDistance(distance)}</span>
                </div>
              )}
              {place.priceLevel && (
                <span className="text-gray-500">
                  {'$'.repeat(place.priceLevel)}
                </span>
              )}
            </div>

            {/* Tags */}
            {place.tags.length > 0 && (
              <div className="mt-2 flex flex-wrap gap-1">
                {place.tags.slice(0, 3).map((tag) => (
                  <Badge key={tag} variant="secondary" className="text-xs">
                    {tag}
                  </Badge>
                ))}
                {place.tags.length > 3 && (
                  <Badge variant="outline" className="text-xs">
                    +{place.tags.length - 3}
                  </Badge>
                )}
              </div>
            )}

            {/* Curator note */}
            {showNote && note && (
              <p className="mt-2 text-sm text-gray-600 italic">"{note}"</p>
            )}
          </div>

          {/* Actions */}
          {onDirections && (
            <Button
              variant="ghost"
              size="icon"
              onClick={(e) => {
                e.stopPropagation();
                onDirections();
              }}
              className="flex-shrink-0"
            >
              <ExternalLink className="h-4 w-4" />
            </Button>
          )}
        </div>
      </CardContent>
    </Card>
  );
}
