import React, { useState, useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import { TabSelector } from '../components/TabSelector';
import { SearchForm } from '../components/SearchForm';
import { PropertiesTab } from '../components/PropertiesTab';
import { getRandomProperty } from '../utils/propertyUtils';
import { PremadeQuestions } from '../components/PremadeQuestions';
import { LocationSelector } from '../components/LocationSelector';
import { Logo } from '../components/home/Logo';
import { propertyService } from '../lib/propertyService';
import { PropertyGrid } from '../components/PropertyGrid';
import { HomeChatButton } from '../components/chat/HomeChatButton';
import { Award } from 'lucide-react';
import { Property } from '../types';


export function Home() {
  const [activeTab, setActiveTab] = useState<'search' | 'report'>('search');
  const navigate = useNavigate();
  const [properties, setProperties] = useState<Property[]>([]);
  
   useEffect(() => {
  const fetchProperties = async () => {
    try {
      const props: Property[]= await propertyService.searchProperties("Mumbai");
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
    <div className="min-h-50 flex flex-col items-center justify-center bg-white px-4 w-full">
      <div className="text-center mb-4 mt-[50px]">
        <Logo size={10} layout="col" />
        <div className="flex items-center justify-center gap-2 mt-4">
          <LocationSelector />
        </div>
      </div>

      <div className="w-full max-w-6xl">
        <TabSelector activeTab={activeTab} onTabChange={setActiveTab} />
        <div className="flex items-center justify-center">
          <p className="text-sm text-gray-600 mb-2">
            {activeTab === 'search'
              ? 'Find your dream home with AI assistance'
              : 'Best properties nearby'}
          </p>
        </div>
        {activeTab === 'search' ? (
          <>
            <SearchForm onSubmit={handleSearch} />
            <PremadeQuestions onQuestionClick={handleSearch} />
            <div className="my-4 text-gray-500">
              <div className="flex items-center gap-1 mb-2 text-gray-600">
                <Award className="w-4 h-4" />
                <span className="text-sm font-semibold">Top Properties in Mumbai</span>
              </div>
         
              {properties && <PropertyGrid properties={properties} maxInitialDisplay={8}/>}
            </div>
          </>
        ) : (
          <>
            {properties &&  <PropertiesTab onSubmit={handleReport} preloadedProperties={properties} />}

          </>
        )}
        
        
        
      </div>
      <HomeChatButton onSubmit={handleSearch} />
    </div>
  );
}

