import { useState, useEffect, useCallback } from 'react';
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

  const [inWishlist, setInWishlist] = useState(false);
  const [inCompareList, setInCompareList] = useState(false);

  // Fetch initial wishlist and compare status
  useEffect(() => {
    const checkStatus = async () => {
      setInWishlist(await isInWishlist(property.id));
      setInCompareList(await isInCompareList(property.id));
    };
    checkStatus();
  }, [property.id]); // Removed function dependencies to prevent re-renders

  // Handle wishlist click with optimistic UI update
  const handleWishlistClick = useCallback(async () => {
    setInWishlist((prev) => !prev); // Optimistic update

    if (inWishlist) {
      await removeFromWishlist(property.id);
      toast.success('Removed from wishlist');
    } else {
      const added = await addToWishlist(property);
      if (added) {
        toast.success('Added to wishlist');
      } else {
        toast.error('Wishlist list is full (max 15 properties)');
      }
    }

    window.dispatchEvent(new Event('wishlistUpdated')); // Event dispatch (optional)
  }, [inWishlist, property.id, addToWishlist, removeFromWishlist]);

  // Handle compare list click with optimistic UI update
  const handleCompareClick = useCallback(async () => {
    setInCompareList((prev) => !prev); // Optimistic update

    if (inCompareList) {
      await removeFromCompare(property.id);
      toast.success('Removed from compare list');
    } else {
      const added = await addToCompare(property);
      if (added) {
        toast.success('Added to compare list');
      } else {
        toast.error('Compare list is full (max 5 properties)');
        setInCompareList(false); // Revert optimistic update if add failed
      }
    }

    window.dispatchEvent(new Event('compareUpdated')); // Event dispatch (optional)
  }, [inCompareList, property.id, addToCompare, removeFromCompare]);

  return (
    <div className="flex gap-2">
      <button
        onClick={handleWishlistClick}
        className={`p-2 rounded-full transition-colors ${
          inWishlist ? 'bg-red-100 text-red-500' : 'bg-gray-100 text-gray-500 hover:bg-gray-200'
        }`}
        title={inWishlist ? 'Remove from wishlist' : 'Add to wishlist'}
      >
        <Heart className="w-5 h-5 sm:w-6 sm:h-6" fill={inWishlist ? 'currentColor' : 'none'} />
      </button>
      
      <button
        onClick={handleCompareClick}
        className={`p-2 rounded-full transition-colors ${
          inCompareList ? 'bg-blue-100 text-blue-500' : 'bg-gray-100 text-gray-500 hover:bg-gray-200'
        }`}
        title={inCompareList ? 'Remove from compare' : 'Add to compare'}
      >
        <Scale className="w-5 h-5 sm:w-6 sm:h-6" fill={inCompareList ? 'currentColor' : 'none'} />
      </button>
    </div>
  );
}
