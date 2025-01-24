import React from 'react';
import { Heart, Scale } from 'lucide-react';
import { Property } from '../../types';
import { usePropertyStore } from '../../store/propertyStore';
import { toast } from 'react-hot-toast';

interface PropertyActionsProps {
  property: Property;
}

export function PropertyActions({ property }: PropertyActionsProps) {
  const { 
    addToWishlist, 
    removeFromWishlist, 
    addToCompare, 
    removeFromCompare,
    isInWishlist,
    isInCompareList
  } = usePropertyStore();

  const handleWishlistClick = () => {
    if (isInWishlist(property.id)) {
      removeFromWishlist(property.id);
      toast.success('Removed from wishlist');
    } else {
      addToWishlist(property);
      toast.success('Added to wishlist');
    }
  };

  const handleCompareClick = () => {
    if (isInCompareList(property.id)) {
      removeFromCompare(property.id);
      toast.success('Removed from compare list');
    } else {
      const added = addToCompare(property);
      if (added) {
        toast.success('Added to compare list');
      } else {
        toast.error('Compare list is full (max 5 properties)');
      }
    }
  };

  return (
    <div className="flex gap-2">
      <button
        onClick={handleWishlistClick}
        className={`p-2 rounded-full transition-colors ${
          isInWishlist(property.id)
            ? 'bg-red-100 text-red-500'
            : 'bg-gray-100 text-gray-500 hover:bg-gray-200'
        }`}
        title={isInWishlist(property.id) ? 'Remove from wishlist' : 'Add to wishlist'}
      >
        <Heart 
          className="w-5 h-5 sm:w-6 sm:h-6" 
          fill={isInWishlist(property.id) ? 'currentColor' : 'none'} 
        />
      </button>
      <button
        onClick={handleCompareClick}
        className={`p-2 rounded-full transition-colors ${
          isInCompareList(property.id)
            ? 'bg-blue-100 text-blue-500'
            : 'bg-gray-100 text-gray-500 hover:bg-gray-200'
        }`}
        title={isInCompareList(property.id) ? 'Remove from compare' : 'Add to compare'}
      >
        <Scale className="w-5 h-5 sm:w-6 sm:h-6" />
      </button>
    </div>
  );
}