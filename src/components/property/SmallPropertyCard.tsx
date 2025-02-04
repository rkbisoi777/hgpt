import { Bed, Bath, Square, MapPin, Heart, Scale } from 'lucide-react';
import { Property } from '../../types';
import { Link } from 'react-router-dom';
import { usePropertyStore } from '../../store/propertyStore';
import toast from 'react-hot-toast';
import ProgressBar from '../ProgressBar';
import { convertToCroreAndLakh, extractIndianCity } from '../../lib/utils';
import { useEffect, useState } from 'react';
// import Skeleton from 'react-loading-skeleton';
import 'react-loading-skeleton/dist/skeleton.css';

interface SmallPropertyCardProps {
  propertyId: string;
}

const SkeletonCard = () => (
  <div className="animate-pulse w-44 h-60 bg-gray-200 rounded-lg shadow-md border border-gray-200"></div>
);

export function SmallPropertyCard({ propertyId }: SmallPropertyCardProps) {
  const { 
    addToWishlist, 
    removeFromWishlist, 
    addToCompare, 
    removeFromCompare,
    isInWishlist,
    isInCompareList,
    getPropertyById
  } = usePropertyStore();

  const [property, setProperty] = useState<Property | null>(null);
  const [loading, setLoading] = useState<boolean>(true);
  const [error, setError] = useState<string | null>(null);
  const [inWishlist, setInWishlist] = useState<boolean>(false);
  const [inCompareList, setInCompareList] = useState<boolean>(false);

  useEffect(() => {
    const fetchProperty = async () => {
      try {
        const prop = await getPropertyById(propertyId);
        setProperty(prop);
      } catch (err) {
        setError('Failed to load property');
        console.error(err);
      } finally {
        setLoading(false);
      }
    };
    fetchProperty();
  }, [propertyId]);

  useEffect(() => {
    const checkStatus = async () => {
      setInWishlist(await isInWishlist(propertyId));
      setInCompareList(await isInCompareList(propertyId));
    };
    checkStatus();
  }, [propertyId]);

  const handleWishlistClick = async () => {
    setInWishlist((prev) => !prev);
    if (inWishlist) {
      await removeFromWishlist(propertyId);
      toast.success('Removed from wishlist');
    } else if (property) {
      const added = await addToWishlist(property);
      if (added) {
        toast.success('Added to wishlist');
      } else {
        toast.error('Wishlist list is full (max 15 properties)');
      }
    }

    window.dispatchEvent(new Event('wishlistUpdated')); 
  };

  const handleCompareClick = async () => {
    setInCompareList((prev) => !prev);
    if (inCompareList) {
      await removeFromCompare(propertyId);
      toast.success('Removed from compare list');
    } else if (property) {
      const added = await addToCompare(property);
      if (added) {
        toast.success('Added to compare list');
      } else {
        toast.error('Compare list is full (max 5 properties)');
        setInCompareList(false); // Revert state if it fails
      }
    }

    window.dispatchEvent(new Event('compareUpdated'));
  };

  if (loading) return <SkeletonCard />;

  if (error || !property) {
    return <div className="text-red-500 text-sm">{error}</div>;
  }

  return (
    <Link to={`/property/${property.id}`} className="block relative">
      <div className="bg-white rounded-lg shadow-md overflow-hidden border border-gray-200 relative w-44 h-60">
        <div className="relative w-full h-full">
          <img
            src={property.imageUrl}
            alt={property.title}
            className="w-full h-full object-cover"
            loading="lazy"
          />

          <div className="absolute inset-0 bg-gradient-to-t from-black/40 to-transparent flex flex-col justify-between p-3 text-white">
            <div className="absolute flex flex-col top-2 right-2 space-y-1">
              <button
                onClick={(event) => {
                  event.preventDefault();
                  event.stopPropagation();
                  handleWishlistClick();
                }}
                className={`p-1 rounded-full transition-colors ${
                  inWishlist ? 'bg-red-100 bg-opacity-50 text-red-500' : 'bg-black bg-opacity-20 text-white hover:bg-gray-200'
                }`}
                title={inWishlist ? 'Remove from wishlist' : 'Add to wishlist'}
                aria-label="Like property"
              >
                <Heart className={`w-4 h-4 ${inWishlist ? 'text-[#ff0000]': 'text-white'}`} fill={inWishlist ? '#FF0000' : 'none'} />
              </button>
              <button
                onClick={(event) => {
                  event.preventDefault();
                  event.stopPropagation();
                  handleCompareClick();
                }}
                className={`p-1 rounded-full transition-colors ${
                  inCompareList ? 'bg-blue-100 bg-opacity-50 text-blue-500' : 'bg-black bg-opacity-20 text-white hover:bg-gray-200'
                }`}
                title={inCompareList ? 'Remove from compare' : 'Add to compare'}
                aria-label="Compare property"
              >
                <Scale className={`w-4 h-4 ${inCompareList ? 'text-[#00a6f4]': 'text-white'}`} fill={inCompareList ? '#00a6f4' : 'none'} />
              </button>
            </div>

            <div className="absolute bottom-2 left-2 text-xs space-y-1">
              <div className="flex items-center">
                <div className="bg-gradient-to-r from-cyan-400 to-blue-500 rounded-full flex items-center justify-center p-1">
                  <img
                    src="https://i.postimg.cc/cHgZjqp8/output-onlinepngtools.png"
                    alt="HouseGPT"
                    className="w-2 h-2"
                  />
                </div>
                <span className="truncate font-semibold text-xs ml-1">{property.title}</span>
              </div>
              <div className="flex flex-row gap-1">
                <div className="flex items-center">
                  <span className="truncate font-bold text-[10px] text-sky-600 bg-white px-1 rounded bg-opacity-80">
                    {convertToCroreAndLakh(property.price)}
                  </span>
                </div>
                <div className="flex items-center">
                  <MapPin className="w-[10px] h-[10px] mr-0.5 mt-[1px]" />
                  <span className="truncate font-semibold text-[10px]">
                    {extractIndianCity(property.location)}
                  </span>
                </div>
              </div>
              <div className="flex flex-row">
                <div className="flex items-center mr-1 font-semibold">
                  <Bed className="w-3 h-3 mr-1" />
                  <span>{property.bedrooms}</span>
                </div>
                <div className="flex items-center mr-1 font-semibold">
                  <Bath className="w-3 h-3 mr-1" />
                  <span>{property.bathrooms}</span>
                </div>
                <div className="flex items-center mr-1 mt-0.5 font-semibold">
                  <Square className="w-3 h-3 mr-1" />
                  <span>{property.sqft}</span>
                </div>
              </div>
            </div>
            <ProgressBar percentage={67} />
          </div>
        </div>

        <div className="p-3 text-xs">
          <h3 className="font-semibold text-sm">{property.title}</h3>
          <p className="font-bold text-sm mt-1">₹{property.price.toLocaleString()}</p>
        </div>
      </div>
    </Link>
  );
}
