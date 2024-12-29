import React from 'react';
import { usePropertyStore } from '../store/propertyStore';
import { Scale } from 'lucide-react';
import { CompareTable } from '../components/compare/CompareTable';

export function Compare() {
  const { compareList, removeFromCompare } = usePropertyStore();

  return (
    <div className="min-h-screen bg-gray-50">
      <div className="max-w-7xl mx-auto px-4 py-8">
        <div className="flex items-center gap-2 mb-6">
          <Scale className="w-6 h-6 text-blue-500" />
          <h1 className="text-2xl font-bold">Compare Properties</h1>
        </div>

        {compareList.length === 0 ? (
          <div className="text-center py-12">
            <p className="text-gray-500">No properties to compare</p>
          </div>
        ) : (
          <CompareTable 
            properties={compareList} 
            onRemove={removeFromCompare} 
          />
        )}
      </div>
    </div>
  );
}