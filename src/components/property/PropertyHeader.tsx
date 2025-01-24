import React from 'react';
import { MapPin } from 'lucide-react';
import { Property } from '../../types';

interface PropertyHeaderProps {
  property: Property;
}

export function PropertyHeader({ property }: PropertyHeaderProps) {
  return (
    <div className="space-y-1.5">
      <h1 className="text-xl sm:text-3xl font-bold break-words">{property.title}</h1>
      <p className="text-xl sm:text-3xl font-bold text-blue-600">
        ₹{property.price.toLocaleString()}
      </p>
      <div className="flex items-center text-gray-600 text-sm">
        <MapPin className="w-4 h-4 mr-1 flex-shrink-0" />
        <span className="break-words">{property.location}</span>
      </div>
    </div>
  );
}