import React from 'react';
import { Bed, Bath, Square, MapPin } from 'lucide-react';
import { Property } from '../types';
import { Link } from 'react-router-dom';

interface PropertyCardProps {
  property: Property;
  compact?: boolean;
}

export function PropertyCard({ property, compact = false }: PropertyCardProps) {
  return (
    <Link to={`/property/${property.id}`} className="block">
      <div className="bg-white rounded-lg shadow-md overflow-hidden hover:shadow-lg transition-shadow">
        <img
          src={property.imageUrl}
          alt={property.title}
          className={`w-full object-cover ${compact ? 'h-36' : 'h-48'}`}
        />
        <div className={`p-3 ${compact ? 'space-y-1' : 'p-4 space-y-2'}`}>
          <h3 className={`font-semibold line-clamp-1 ${compact ? 'text-base' : 'text-lg'}`}>
            {property.title}
          </h3>
          <p className={`font-bold text-blue-600 ${compact ? 'text-lg' : 'text-2xl'}`}>
            ${property.price.toLocaleString()}
          </p>
          <div className="flex items-center text-gray-600 text-sm">
            <MapPin className="w-3 h-3 mr-1" />
            <span className="truncate">{property.location}</span>
          </div>
          <div className="flex gap-3 text-gray-600 text-sm">
            <div className="flex items-center">
              <Bed className="w-3 h-3 mr-1" />
              <span>{property.bedrooms}</span>
            </div>
            <div className="flex items-center">
              <Bath className="w-3 h-3 mr-1" />
              <span>{property.bathrooms}</span>
            </div>
            <div className="flex items-center">
              <Square className="w-3 h-3 mr-1" />
              <span>{property.sqft}</span>
            </div>
          </div>
        </div>
      </div>
    </Link>
  );
}