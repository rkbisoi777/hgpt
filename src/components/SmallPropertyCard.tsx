import React from 'react';
import { Bed, Bath, Square, MapPin, MessageCircle, MoreHorizontal, Heart, Scale } from 'lucide-react';
import { Property } from '../types';
import ProgressBar from './ProgressBar'
import { Link } from 'react-router-dom';

function extractIndianCity(address) {
    const indianCities = [
        'Mumbai','Thane', 'Navi Mumbai','Delhi', 'Bangalore', 'Hyderabad', 'Chennai', 'Kolkata','Ahmedabad', 'Pune', 'Surat', 'Jaipur', 'Lucknow', 'Kanpur', 'Nagpur', 'Indore', 'Vadodara', 'Ghaziabad', 'Ludhiana', 'Agra', 'Nashik', 'Faridabad', 'Patna', 'Meerut', 'Rajkot', 'Vijayawada', 'Goa', 'Bhopal', 'Madurai', 'Coimbatore', 'Chandigarh', 'Visakhapatnam'
    ];

    // Extract city from the string
    for (let i = 0; i < indianCities.length; i++) {
        if (address.includes(indianCities[i])) {
            return indianCities[i];
        }
    }

    return null; // No city found
}

interface SmallPropertyCardProps {
  property: Property;
}

export function SmallPropertyCard({ property }: SmallPropertyCardProps) {
  return (
    <Link to={`/property/${property.id}`} className="block relative">
      <div className="bg-white rounded-lg shadow-md overflow-hidden border border-gray-200 relative w-44 h-60">
        {/* Image as background */}
        <div className="relative w-full h-full">
          <img
            src={property.imageUrl}
            alt={property.title}
            className="w-full h-full object-cover"
          />
          
          {/* Overlay with details */}
          <div className="absolute inset-0 bg-black bg-opacity-20 flex flex-col justify-between p-3 text-white">
            {/* Icons for More, Like, Compare - top right corner */}
            <div className="absolute top-2 right-2 space-y-1">
              <MoreHorizontal className="w-4 h-4" />
              <Heart className="w-4 h-4" />
              <Scale className="w-4 h-4" />
              
            </div>

            {/* Property details - bottom left corner */}
            <div className="absolute bottom-2 left-2 text-xs space-y-1">
              {/* <div className="flex items-center">
                <span className="truncate font-semibold">{property.title}</span>
              </div> */}
              <div className="flex items-center">
                <div
      className={`bg-gradient-to-r from-cyan-400 to-blue-500 rounded-full flex items-center justify-center p-1 `}
      
    ><img
        src="https://i.postimg.cc/cHgZjqp8/output-onlinepngtools.png"
        alt="HouseGPT"
        className="w-2 h-2"
      /></div>
                <span className="truncate text-xs ml-1">{property.title}</span>
              </div>
              <div className="flex items-center">
                <MapPin className="w-3 h-3 mr-1" />
                <span className="truncate text-[10px]">{extractIndianCity(property.location)}</span>
              </div>
              <div className="flex flex-row">
             
              <div className="flex items-center mr-1">
                <Bed className="w-3 h-3 mr-1" />
                <span>{property.bedrooms}</span>
              </div>
              <div className="flex items-center mr-1">
                <Bath className="w-3 h-3 mr-1" />
                <span>{property.bathrooms}</span>
              </div>
              <div className="flex items-center mr-1 mt-0.5">
                <Square className="w-3 h-3 mr-1" />
                <span>{property.sqft}</span>
              </div>
                 </div>
            </div>
            <ProgressBar percentage={67} />

            {/* Bottom right corner: Chat button */}
            <div className="absolute bottom-2 right-2">
              <button
      className={`bg-gradient-to-r from-cyan-400 to-blue-500 rounded-full flex items-center justify-center p-1 animate-bounce`}
      
    >
      <img
        src="https://i.postimg.cc/cHgZjqp8/output-onlinepngtools.png"
        alt="HouseGPT"
        className="w-4 h-4"
      />
    </button>
            </div>
            
          </div>
        </div>

        {/* Title and Price */}
        <div className="p-3 text-xs">
          <h3 className="font-semibold text-sm">{property.title}</h3>
          <p className="font-bold text-sm mt-1">
            ₹{property.price.toLocaleString()}
          </p>
        </div>
      </div>
    </Link>
  );
}
