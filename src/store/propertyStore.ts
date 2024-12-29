import { create } from 'zustand';
import type { Property } from '../types/database';
import { propertyService } from '../lib/propertyService';

interface PropertyStore {
  properties: Property[];
  isLoading: boolean;
  error: string | null;
  wishlist: Property[];
  compareList: Property[];
  fetchProperties: () => Promise<void>;
  searchProperties: (query: string) => Promise<Property[]>;
  getPropertyById: (id: string) => Promise<Property | null>;
  addToWishlist: (property: Property) => void;
  removeFromWishlist: (propertyId: string) => void;
  addToCompare: (property: Property) => boolean;
  removeFromCompare: (propertyId: string) => void;
  isInWishlist: (propertyId: string) => boolean;
  isInCompareList: (propertyId: string) => boolean;
}

export const usePropertyStore = create<PropertyStore>((set, get) => ({
  properties: [],
  isLoading: false,
  error: null,
  wishlist: [],
  compareList: [],

  fetchProperties: async () => {
    try {
      set({ isLoading: true, error: null });
      const properties = await propertyService.getAllProperties();
      set({ properties });
    } catch (error) {
      set({ error: (error as Error).message });
    } finally {
      set({ isLoading: false });
    }
  },

  searchProperties: async (query) => {
    try {
      set({ isLoading: true, error: null });
      const properties = await propertyService.searchProperties(query);
      return properties;
    } catch (error) {
      set({ error: (error as Error).message });
      return [];
    } finally {
      set({ isLoading: false });
    }
  },

  getPropertyById: async (id) => {
    try {
      set({ isLoading: true, error: null });
      const property = await propertyService.getPropertyById(id);
      return property;
    } catch (error) {
      set({ error: (error as Error).message });
      return null;
    } finally {
      set({ isLoading: false });
    }
  },
  
  addToWishlist: (property) => {
    set((state) => ({
      wishlist: state.wishlist.some(p => p.id === property.id) 
        ? state.wishlist 
        : [...state.wishlist, property]
    }));
  },
  
  removeFromWishlist: (propertyId) => {
    set((state) => ({
      wishlist: state.wishlist.filter(p => p.id !== propertyId)
    }));
  },
  
  addToCompare: (property) => {
    const { compareList } = get();
    if (compareList.length >= 5) return false;
    
    set((state) => ({
      compareList: state.compareList.some(p => p.id === property.id)
        ? state.compareList
        : [...state.compareList, property]
    }));
    return true;
  },
  
  removeFromCompare: (propertyId) => {
    set((state) => ({
      compareList: state.compareList.filter(p => p.id !== propertyId)
    }));
  },
  
  isInWishlist: (propertyId) => {
    return get().wishlist.some(p => p.id === propertyId);
  },
  
  isInCompareList: (propertyId) => {
    return get().compareList.some(p => p.id === propertyId);
  }
}));