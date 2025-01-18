import React, { useEffect, useState } from 'react';
import { useLocation, useNavigate } from 'react-router-dom';
import { Property } from '../types';
import { PropertyCard } from '../components/PropertyCard';
import { ArrowLeft } from 'lucide-react';

interface PropertiesProps {
  fromHome?: boolean;
  preloadedProperties?: Property[];
}

export function Properties({ fromHome = false, preloadedProperties }: PropertiesProps) {
  const location = useLocation();
  const navigate = useNavigate();
  const [properties, setProperties] = useState<Property[] | null>(null);

  useEffect(() => {
    if (fromHome && preloadedProperties) {
      // Use preloaded properties if accessed from the home page
      setProperties(preloadedProperties);
    } else if (location.state?.properties) {
      // Otherwise, use properties from location.state
      setProperties(location.state.properties as Property[]);
    } else {
      // Redirect to home page if no properties are available
      navigate('/');
    }
  }, [fromHome, preloadedProperties, location.state?.properties, navigate]);

  if (!properties) {
    return null; // Prevent rendering while redirecting or properties are undefined
  }

  return (
    <div className="max-w-7xl mx-auto px-4 py-8">
      {!fromHome && <button
        onClick={() => navigate(-1)}
        className="flex items-center gap-2 text-blue-500 mb-6"
        aria-label="Go back to previous page"
      >
        <ArrowLeft className="w-4 h-4" />
        Back
      </button>}
      <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-6">
        {properties.map(property => (
          <PropertyCard key={property.id} property={property} />
        ))}
      </div>
    </div>
  );
}
