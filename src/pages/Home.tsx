import React, { useState, useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import { TabSelector } from '../components/TabSelector';
import { SearchForm } from '../components/SearchForm';
import { ReportForm } from '../components/ReportForm';
import { getRandomProperty } from '../utils/propertyUtils';
import { PremadeQuestions } from '../components/PremadeQuestions';
import { LocationSelector } from '../components/LocationSelector';
import { Logo } from '../components/home/Logo';
import { propertyService } from '../lib/propertyService';
import { PropertyGrid } from '../components/PropertyGrid';
import { Award } from 'lucide-react';

export function Home() {
  const [activeTab, setActiveTab] = useState<'search' | 'report'>('search');
  const navigate = useNavigate();
  const [properties, setProperties] = useState([]);
  
   useEffect(() => {
  const fetchProperties = async () => {
    try {
      const props = await propertyService.searchProperties("Mumbai");
      setProperties(props);
      console.log(props)
    } catch (error) {
      console.error("Error fetching properties:", error);
    }
  };

  fetchProperties();
}, []);

  const handleSearch = (query: string) => {
    navigate('/chat', { state: { initialQuery: query } });
  };

  const handleReport = (url: string) => {
    const randomProperty = getRandomProperty();
    navigate(`/property/${randomProperty.id}`);
  };

  return (
    <div className="min-h-50 flex flex-col items-center justify-center bg-white px-4">
      <div className="text-center mb-4 mt-[50px]">
        <Logo size={10} layout="col" />
        <div className="flex items-center justify-center gap-2 mt-4">
          <LocationSelector />
        </div>
      </div>

      <div className="w-full max-w-xl">
        {/* <TabSelector activeTab={activeTab} onTabChange={setActiveTab} /> */}
        <div className="flex items-center justify-center">
          <p className="text-sm text-gray-600 mb-2">
            {activeTab === 'search'
              ? 'Find your dream home with AI assistance'
              : 'Generate detailed property reports'}
          </p>
        </div>
        {activeTab === 'search' ? (
          <>
            <SearchForm onSubmit={handleSearch} />
            <PremadeQuestions onQuestionClick={handleSearch} />
          </>
        ) : (
          <>
            <ReportForm onSubmit={handleReport} />
            <PremadeQuestions onQuestionClick={handleSearch} />
          </>
        )}
        <div className="my-4 text-gray-500">
          <div className="flex items-center gap-1 mb-2 text-gray-600">
        <Award className="w-4 h-4" />
        <span className="text-sm font-semibold">Top Properties in Mumbai</span>
      </div>
          
         
          <PropertyGrid properties={properties} />
        </div>
        
      </div>
    </div>
  );
}

