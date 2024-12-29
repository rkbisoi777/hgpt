import React from 'react';
import { X } from 'lucide-react';
import { Property } from '../../types';

interface CompareTableHeaderProps {
  properties: Property[];
  onRemove: (id: string) => void;
}

export function CompareTableHeader({ properties, onRemove }: CompareTableHeaderProps) {
  return (
    <thead>
      <tr>
        <th className="p-4 text-left bg-gray-50">Features</th>
        {properties.map(property => (
          <th key={property.id} className="p-4 min-w-[250px]">
            <div className="relative">
              <button
                onClick={() => onRemove(property.id)}
                className="absolute -top-2 -right-2 p-1 rounded-full bg-red-100 text-red-500 hover:bg-red-200"
              >
                <X className="w-4 h-4" />
              </button>
              <img
                src={property.imageUrl}
                alt={property.title}
                className="w-full h-40 object-cover rounded-lg mb-2"
              />
              <h3 className="font-semibold">{property.title}</h3>
            </div>
          </th>
        ))}
      </tr>
    </thead>
  );
}