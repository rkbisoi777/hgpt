import { supabase } from './supabase';
import type { Property } from '../types/database';

export const propertyService = {
  async getAllProperties(): Promise<Property[]> {
    const { data, error } = await supabase
      .from('properties')
      .select('*')
      .order('created_at', { ascending: false });

    if (error) {
      throw error;
    }

    return data;
  },

  async getPropertyById(id: string): Promise<Property | null> {
    const { data, error } = await supabase
      .from('properties')
      .select('*')
      .eq('id', id)
      .single();

    if (error) {
      throw error;
    }

    return data;
  },


async searchProperties(query: string): Promise<Property[]> {
  let supabaseQuery = supabase
    .from('properties')
    .select('*')
    .order('created_at', { ascending: false });

  // Define filters
  const filters: { field: string; operator: string; value: any }[] = [];
  const textSearchFields = ['title', 'description', 'location'];
  let textSearchQuery = '';

  // Parse query for specific filters
  const bedroomsMatch = query.match(/(\d+)BHK/i);
  const locationMatch = query.match(/in ([a-zA-Z\s]+)/i);
  const priceUnderMatch = query.match(/under (\d+[\w\s]*)/i);
  const priceAboveMatch = query.match(/above (\d+[\w\s]*)/i);
  const sqftAboveMatch = query.match(/above (\d+)\s?sqft/i);
  const sqftUnderMatch = query.match(/under (\d+)\s?sqft/i);

  // Exact Match for Bedrooms
  if (bedroomsMatch) {
    filters.push({ field: 'bedrooms', operator: 'eq', value: parseInt(bedroomsMatch[1], 10) });
  }

  // Partial Match for Location
  if (locationMatch) {
    filters.push({ field: 'location', operator: 'ilike', value: `%${locationMatch[1].trim()}%` });
  }

  // Price Filters
  if (priceUnderMatch) {
    const price = parseFloat(priceUnderMatch[1].replace(/\D/g, ''));
    if (!isNaN(price)) {
      filters.push({ field: 'price', operator: 'lte', value: price });
    }
  }

  if (priceAboveMatch) {
    const price = parseFloat(priceAboveMatch[1].replace(/\D/g, ''));
    if (!isNaN(price)) {
      filters.push({ field: 'price', operator: 'gte', value: price });
    }
  }

  // Sqft Filters
  if (sqftAboveMatch) {
    filters.push({ field: 'sqft', operator: 'gte', value: parseInt(sqftAboveMatch[1], 10) });
  }

  if (sqftUnderMatch) {
    filters.push({ field: 'sqft', operator: 'lte', value: parseInt(sqftUnderMatch[1], 10) });
  }

  // General Text Search (fallback if no structured filters match)
  if (filters.length === 0) {
    textSearchQuery = textSearchFields
      .map((field) => `${field}.ilike.%${query}%`)
      .join(',');
    supabaseQuery = supabaseQuery.or(textSearchQuery);
  } else {
    // Apply each structured filter as an AND condition
    filters.forEach(({ field, operator, value }) => {
      supabaseQuery = supabaseQuery.filter(field, operator as any, value);
    });
  }

  // Execute Query
  const { data, error } = await supabaseQuery;

  if (error) {
    console.error('Error fetching properties:', error.message);
    throw new Error('Failed to fetch properties. Please try again later.');
  }

  return data || [];
}


};