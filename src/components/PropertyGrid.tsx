import React, { useState } from 'react';
import { Property } from '../types';
import { PropertyCard } from './PropertyCard';
import { Link } from 'react-router-dom';
import { ChevronRight } from 'lucide-react';

interface PropertyGridProps {
  properties: Property[];
  maxInitialDisplay?: number;
}

export function PropertyGrid({ properties, maxInitialDisplay = 4 }: PropertyGridProps) {
  const hasMore = properties.length > maxInitialDisplay;
  const displayedProperties = properties.slice(0, maxInitialDisplay);

  return (
    <div className="space-y-4">
      <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4">
        {displayedProperties.map(property => (
          <PropertyCard key={property.id} property={property} compact />
        ))}
      </div>
      {hasMore && (
        <div className="text-center">
          <Link
            to="/properties"
            state={{ properties }}
            className="inline-flex items-center gap-1 text-blue-500 hover:text-blue-600"
          >
            View all {properties.length} properties
            <ChevronRight className="w-4 h-4" />
          </Link>
        </div>
      )}
    </div>
  );
}