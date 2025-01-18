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
          className={`py-1 px-2 text-sm font-medium ${
            activeTab === 'Amenities' ? 'border-b-2 border-blue-500 text-blue-600' : 'text-gray-500'
          }`}
          onClick={() => onTabClick('Amenities')}
        >
          Amenities
        </button>
        <button
          className={`py-1 px-2 text-sm font-medium ${
            activeTab === 'FAQ' ? 'border-b-2 border-blue-500 text-blue-600' : 'text-gray-500'
          }`}
          onClick={() => onTabClick('FAQ')}
        >
          FAQs
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

// interface PropertyTabsProps {
//   activeTab: string;
//   onTabClick: (tab: string) => void;
// }

// export function PropertyTabs({ activeTab, onTabClick }: PropertyTabsProps) {
//   const handleTabClick = (tab: string, tabElement: HTMLButtonElement | null) => {
//     onTabClick(tab);

//     // Scroll the clicked tab into view
//     if (tabElement) {
//       tabElement.scrollIntoView({
//         behavior: "smooth",
//         block: "nearest",
//         inline: "center",
//       });
//     }
//   };

//   return (
//     <div className="border border-gray-200 rounded-md mb-2 px-2 py-1.5 overflow-x-auto scrollbar-hide z-45">
//       <nav className="flex space-x-2">
//         <button
//           className={`py-1 px-2 text-sm font-medium ${
//             activeTab === "OverviewCard"
//               ? "border-b-2 border-blue-500 text-blue-600"
//               : "text-gray-500"
//           }`}
//           onClick={(e) => handleTabClick("OverviewCard", e.currentTarget)}
//         >
//           Overview
//         </button>
//         <button
//           className={`py-1 px-2 text-sm font-medium min-w-20 ${
//             activeTab === "FloorPlan"
//               ? "border-b-2 border-blue-500 text-blue-600"
//               : "text-gray-500"
//           }`}
//           onClick={(e) => handleTabClick("FloorPlan", e.currentTarget)}
//         >
//           Floor Plan
//         </button>
//         <button
//           className={`py-1 px-2 text-sm font-medium min-w-20 ${
//             activeTab === "NearbyFacilities"
//               ? "border-b-2 border-blue-500 text-blue-600"
//               : "text-gray-500"
//           }`}
//           onClick={(e) => handleTabClick("NearbyFacilities", e.currentTarget)}
//         >
//           Nearby
//         </button>
//         <button
//           className={`py-1 px-2 text-sm font-medium ${
//             activeTab === "PropertyGallery"
//               ? "border-b-2 border-blue-500 text-blue-600"
//               : "text-gray-500"
//           }`}
//           onClick={(e) => handleTabClick("PropertyGallery", e.currentTarget)}
//         >
//           Gallery
//         </button>
//         <button
//           className={`py-1 px-2 text-sm font-medium ${
//             activeTab === "Amenities"
//               ? "border-b-2 border-blue-500 text-blue-600"
//               : "text-gray-500"
//           }`}
//           onClick={(e) => handleTabClick("Amenities", e.currentTarget)}
//         >
//           Amenities
//         </button>
//         <button
//           className={`py-1 px-2 text-sm font-medium min-w-24 ${
//             activeTab === "PropertyGraph"
//               ? "border-b-2 border-blue-500 text-blue-600"
//               : "text-gray-500"
//           }`}
//           onClick={(e) => handleTabClick("PropertyGraph", e.currentTarget)}
//         >
//           Price Trends
//         </button>
//         <button
//           className={`py-1 px-2 text-sm font-medium mr-2 ${
//             activeTab === "LocalityStats"
//               ? "border-b-2 border-blue-500 text-blue-600 mr-2"
//               : "text-gray-500"
//           }`}
//           onClick={(e) => handleTabClick("LocalityStats", e.currentTarget)}
//         >
//           Locality
//         </button>
//       </nav>
//     </div>
//   );
// }
