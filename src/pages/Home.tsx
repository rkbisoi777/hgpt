import React, { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { TabSelector } from '../components/TabSelector';
import { SearchForm } from '../components/SearchForm';
import { ReportForm } from '../components/ReportForm';
import { getRandomProperty } from '../utils/propertyUtils';
import { Home as HomeIcon } from 'lucide-react';

export function Home() {
  const [activeTab, setActiveTab] = useState<'search' | 'report'>('search');
  const navigate = useNavigate();

  const handleSearch = (query: string) => {
    navigate('/chat', { state: { initialQuery: query } });
  };

  const handleReport = (url: string) => {
    const randomProperty = getRandomProperty();
    navigate(`/property/${randomProperty.id}`);
  };

  return (
    <div className="min-h-[calc(100vh-64px)] flex flex-col items-center justify-center bg-gray-50 px-4">
      <div className="text-center mb-12">
        <div className="inline-flex items-center justify-center p-4 mb-4 bg-blue-500 rounded-full text-white">
          <HomeIcon className="w-8 h-8" />
        </div>
        <h1 className="text-3xl font-bold mb-2">houseGPT</h1>
        <p className="text-gray-600">
          {activeTab === 'search'
            ? 'Find your dream home with AI assistance'
            : 'Generate detailed property reports'}
        </p>
      </div>

      <div className="w-full max-w-2xl">
        <TabSelector activeTab={activeTab} onTabChange={setActiveTab} />
        {activeTab === 'search' ? (
          <SearchForm onSubmit={handleSearch} />
        ) : (
          <ReportForm onSubmit={handleReport} />
        )}
      </div>
    </div>
  );
}