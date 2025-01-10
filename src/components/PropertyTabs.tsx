interface PropertyTabsProps {
  activeTab: string;
  onTabClick: (tab: string) => void;
}

export function PropertyTabs({ activeTab, onTabClick }: PropertyTabsProps) {
  return (
    <div className="border border-gray-200 rounded-md mb-2 px-2 py-1.5  overflow-x-auto scrollbar-hide z-45">
      <nav className="flex space-x-2">
         <button
          className={`py-1 px-2 text-sm font-medium ${
            activeTab === 'OverviewCard' ? 'border-b-2 border-blue-500 text-blue-600' : 'text-gray-500'
          }`}
          onClick={() => onTabClick('OverviewCard')}
        >
          Overview
        </button>
         <button
          className={`py-1 px-2 text-sm font-medium min-w-20 ${
            activeTab === 'FloorPlan' ? 'border-b-2 border-blue-500 text-blue-600' : 'text-gray-500'
          }`}
          onClick={() => onTabClick('FloorPlan')}
        >
          Floor Plan
        </button>
         <button
          className={`py-1 px-2 text-sm font-medium min-w-20 ${
            activeTab === 'NearbyFacilities' ? 'border-b-2 border-blue-500 text-blue-600' : 'text-gray-500'
          }`}
          onClick={() => onTabClick('NearbyFacilities')}
        >
          Nearby
        </button>
        <button
          className={`py-1 px-2 text-sm font-medium ${
            activeTab === 'PropertyGallery' ? 'border-b-2 border-blue-500 text-blue-600' : 'text-gray-500'
          }`}
          onClick={() => onTabClick('PropertyGallery')}
        >
          Gallery
        </button>
        <button
          className={`py-1 px-2 text-sm font-medium min-w-24 ${
            activeTab === 'PropertyGraph' ? 'border-b-2 border-blue-500 text-blue-600' : 'text-gray-500'
          }`}
          onClick={() => onTabClick('PropertyGraph')}
        >
          Price Trends
        </button>
        <button
          className={`py-1 px-2 text-sm font-medium ${
            activeTab === 'LocalityStats' ? 'border-b-2 border-blue-500 text-blue-600' : 'text-gray-500'
          }`}
          onClick={() => onTabClick('LocalityStats')}
        >
          Locality
        </button>
      </nav>
    </div>
  );
}
