import React from 'react';
import { useLocation, useNavigate } from 'react-router-dom';
import { Property } from '../types';
import { PropertyCard } from '../components/PropertyCard';
import { ArrowLeft } from 'lucide-react';

export function Properties() {
  const location = useLocation();
  const navigate = useNavigate();
  const properties = location.state?.properties as Property[];

  if (!properties) {
    navigate('/');
    return null;
  }

  return (
    <div className="max-w-7xl mx-auto px-4 py-8">
      <button
        onClick={() => navigate(-1)}
        className="flex items-center gap-2 text-blue-500 mb-6"
      >
        <ArrowLeft className="w-4 h-4" />
        Back
      </button>
      <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-6">
        {properties.map(property => (
          <PropertyCard key={property.id} property={property} />
        ))}
      </div>
    </div>
  );
}