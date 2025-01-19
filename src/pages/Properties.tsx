import React, { useEffect, useState } from 'react';
import { useLocation, useNavigate } from 'react-router-dom';
import { Property } from '../types';
import { PropertyCard } from '../components/PropertyCard';
import { ArrowLeft, SlidersHorizontal } from 'lucide-react';
import { PropertyFilter } from '../components/PropertyFilter'; // Import the new filter component
import { applyPropertyFilter } from '../utils/filterProperties'; // Import the utility function

interface PropertiesProps {
  fromHome?: boolean;
  preloadedProperties?: Property[];
}

export function Properties({ fromHome = false, preloadedProperties }: PropertiesProps) {
  const location = useLocation();
  const navigate = useNavigate();
  const [properties, setProperties] = useState<Property[] | null>(null);
  const [filteredProperties, setFilteredProperties] = useState<Property[] | null>(null);
  const [filterOpen, setFilterOpen] = useState(false);
  const [filters, setFilters] = useState({
    priceRange: [0, 100000], // min and max price
    furnished: false,
    bedrooms: 0, // 0 means no filter
  });

  useEffect(() => {
    if (fromHome && preloadedProperties) {
      setProperties(preloadedProperties);
      setFilteredProperties(preloadedProperties);
    } else if (location.state?.properties) {
      const props = location.state.properties as Property[];
      setProperties(props);
      setFilteredProperties(props);
    } else {
      navigate('/');
    }
  }, [fromHome, preloadedProperties, location.state?.properties, navigate]);

  const applyFilters = () => {
    if (properties) {
      const filtered = applyPropertyFilter(properties, filters);
      setFilteredProperties(filtered);
      setFilterOpen(false);
    }
  };

  const closeFilter = () => {
    setFilterOpen(false);
  };

  if (!properties) {
    return null; // Prevent rendering while redirecting or properties are undefined
  }

  return (
    <div className="max-w-7xl mx-auto px-4 py-8">
      {!fromHome && (
        <button
          onClick={() => navigate(-1)}
          className="flex items-center gap-2 text-blue-500 mb-6"
          aria-label="Go back to previous page"
        >
          <ArrowLeft className="w-4 h-4" />
          Back
        </button>
      )}
      <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-6">
        {filteredProperties &&
          filteredProperties.length > 0 &&
          filteredProperties.map((property) => (
            <PropertyCard key={property.id} property={property} />
          ))}
        {filteredProperties && filteredProperties.length === 0 && (
          <p>No properties found with the selected filters.</p>
        )}
      </div>

      {/* Floating Filter Button */}
      <button
        onClick={() => setFilterOpen(true)}
        className="fixed bottom-4 left-4 bg-white text-blue-600 rounded-full p-3 shadow-lg hover:bg-gray-50 shadow-md"
        aria-label="Open filter options"
      >
        <SlidersHorizontal className='w-6 h-6' />
      </button>

      {/* Property Filter Popup */}
      {filterOpen && (
        <PropertyFilter
          filters={filters}
          setFilters={setFilters}
          applyFilters={applyFilters}
          closeFilter={closeFilter}
        />
      )}
    </div>
  );
}
