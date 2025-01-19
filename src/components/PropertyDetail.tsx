import React, { useState, useEffect, useRef } from 'react';
import { useParams, useNavigate } from 'react-router-dom';
import { ArrowLeft } from 'lucide-react';
import { PropertyStats } from './PropertyStats';
import { PropertyHeader } from './PropertyHeader';
import { PropertyActions } from './PropertyActions';
import { NearbyFacilities } from './report/NearbyFacilities';
import { PropertyGraph } from './report/PropertyGraph';
import { PropertyDescriptionCard } from './report/PropertyDescriptionCard';
import { LocalityStats } from './report/LocalityStats';
import { useAuthStore } from '../store/authStore';
import { usePropertyStore } from '../store/propertyStore';
import { LoginModal } from './auth/LoginModal';
import { RegisterModal } from './auth/RegisterModal';
import { PropertyTabs } from './PropertyTabs';
import PropertyGallery from './PropertyGallery';
import OverviewCard from './report/OverviewCardProps';
import FloorPlan from './report/FloorPlan';
import Amenities from './report/Amenities';
import FAQ from './report/FAQ';
import { PropertyChatButton } from './chat/PropertyChatButton';
import { Property } from '../types';

export function PropertyDetail() {
  const { id } = useParams();
  const navigate = useNavigate();
  const { user } = useAuthStore();
  const { getPropertyById } = usePropertyStore();
  const [showLoginModal, setShowLoginModal] = useState(false);
  const [showRegisterModal, setShowRegisterModal] = useState(false);
  const [property, setProperty] = useState<Property | null>(null);
  const [isLoading, setIsLoading] = useState(true);
  const [activeTab, setActiveTab] = useState('NearbyFacilities');

  // Section Refs
  const nearbyRef = useRef<HTMLDivElement | null>(null);
  const graphRef = useRef<HTMLDivElement | null>(null);
  const statsRef = useRef<HTMLDivElement | null>(null);
  const overviewRef = useRef<HTMLDivElement | null>(null);
  const descriptionRef = useRef<HTMLDivElement | null>(null);
  const floorPlanRef = useRef<HTMLDivElement | null>(null);
  const galleryRef = useRef<HTMLDivElement | null>(null);
  const amenitiesRef = useRef<HTMLDivElement | null>(null);
  const faqRef = useRef<HTMLDivElement | null>(null);

  useEffect(() => {
    const fetchProperty = async () => {
      if (id) {
        try {
          const data = await getPropertyById(id);
          if (data) {
            setProperty({
              ...data,
              imageUrl: data.imageUrl,
              id: data.id,
              title: data.title,
              price: data.price,
              location: data.location,
              bedrooms: data.bedrooms,
              bathrooms: data.bathrooms,
              sqft: data.sqft,
              description: data.description
            });
          }
        } catch (error) {
          console.error('Error fetching property:', error);
        } finally {
          setIsLoading(false);
        }
      }
    };

    fetchProperty();
  }, [id, getPropertyById]);

  if (isLoading) {
    return (
      <div className="min-h-screen flex items-center justify-center">
        <div className="animate-pulse text-gray-500">Loading property details...</div>
      </div>
    );
  }

  if (!property) {
    return (
      <div className="min-h-screen flex items-center justify-center">
        <div className="text-gray-500">Property not found</div>
      </div>
    );
  }

  const handleTabClick = (tab: string) => {
    setActiveTab(tab);
    const refs = {
      OverviewCard: overviewRef,
      FloorPlan: floorPlanRef,
      PropertyGallery: galleryRef,
      NearbyFacilities: nearbyRef,
      PropertyGraph: graphRef,
      LocalityStats: statsRef,
      Amenities: amenitiesRef,
      FAQ: faqRef
    };

    refs[tab as keyof typeof refs]?.current?.scrollIntoView({ behavior: 'smooth' });
  };

  return (
    <>
      <div className="max-w-6xl mx-auto p-4 space-y-6">
        <div className="flex justify-between items-center">
          <button 
            onClick={() => navigate(-1)}
            className="p-2 -ml-2 text-blue-500 hover:text-blue-600 hover:bg-blue-50 rounded-full transition-colors"
            aria-label="Back"
          >
            <ArrowLeft className="w-5 h-5" />
          </button>
          <PropertyActions property={property} />
        </div>

        {/* <div className="aspect-video w-full max-h-[400px] rounded-lg overflow-hidden border border-gray-300">
          <img
            src={property.imageUrl}
            alt={property.title}
            className="w-full h-full object-cover"
          />
        </div> */}
        <div className="aspect-video w-full max-h-[400px] rounded-lg overflow-hidden border border-gray-300">
  <img
    src={property.imageUrl}
    alt={property.title || "Property Image"}
    loading="lazy"
    className="w-full h-full object-contain"
  />
</div>


        <div className="space-y-3">
          <PropertyHeader property={property} />
          <PropertyStats property={property} />
          {/* <div className="prose max-w-none">
            <p className="text-gray-700 leading-relaxed">{property.description}</p>
          </div> */}
        </div>

        <div className="sticky top-16 z-48 bg-white rounded-md shadow-md">
          <PropertyTabs activeTab={activeTab} onTabClick={handleTabClick} />
        </div>

        <div>
          <div ref={overviewRef}>
            <OverviewCard
              projectName="Ashar Pulse"
              projectArea="2.35 Acres"
              sizes="441 - 750 sq.ft."
              projectSize="2 Buildings - 760 units"
              launchDate="Oct, 2022"
              avgPrice="21.54 K - 23.33 K/sq.ft"
              possessionStarts="Dec, 2028"
              configurations="1, 2 BHK Apartments"
              reraId="P51700047432"
            />
          </div>

          <div ref={descriptionRef}>
            <PropertyDescriptionCard title={property.title} description={property.description} />
          </div>
          
          <div ref={floorPlanRef}>
            <FloorPlan />
          </div>
          
          <div ref={nearbyRef}>
            <NearbyFacilities propertyId={property.id} />
          </div>

          <div ref={galleryRef}>
            <PropertyGallery images={[]} />
          </div>
          
          <div ref={statsRef}>
            <LocalityStats propertyId={property.id} />
          </div>

           <div ref={amenitiesRef}>
            <Amenities />
          </div>

          <div ref={faqRef}>
            <FAQ />
          </div>

           <div ref={graphRef}>
            <PropertyGraph propertyId={property.id} />
          </div>

          
        </div>
      </div>

      <PropertyChatButton property={property} />

      <LoginModal
        isOpen={showLoginModal}
        onClose={() => setShowLoginModal(false)}
        onRegister={() => {
          setShowLoginModal(false);
          setShowRegisterModal(true);
        }}
      />

      <RegisterModal
        isOpen={showRegisterModal}
        onClose={() => setShowRegisterModal(false)}
        onLogin={() => {
          setShowRegisterModal(false);
          setShowLoginModal(true);
        }}
      />
    </>
  );
}