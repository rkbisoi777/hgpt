import React from 'react';
import { Search } from 'lucide-react';
import { Properties } from '../pages/Properties';
import { Property } from '../types';

interface PropertiesTabProps {
  onSubmit: (url: string) => void;
  preloadedProperties?: Property[];
}

export function PropertiesTab({ onSubmit, preloadedProperties }: PropertiesTabProps) {
  const [query, setQuery] = React.useState('');

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    if (url.trim()) {
      onSubmit(query);
    }
  };

  return (
    <div>

    
    <form onSubmit={handleSubmit} className="w-full">
      <div className="flex gap-2">
        <input
          type="text"
          value={query}
          onChange={(e) => setQuery(e.target.value)}
          placeholder="Enter your property requirements..."
          className="flex-1 px-3 py-2 text-sm rounded-full border border-gray-300 focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-transparent shadow-sm"
        />
        <button
          type="submit"
          className="px-3 py-2 bg-gradient-to-r from-cyan-500 to-blue-500 text-white rounded-full hover:bg-blue-600 focus:outline-none focus:ring-2 focus:ring-blue-500 focus:ring-offset-2 shadow-sm"
        >
          <Search className="w-5 h-5" />
        </button>
      </div>
    </form>
    <Properties fromHome={true} preloadedProperties={preloadedProperties} />
    </div>
  );
}