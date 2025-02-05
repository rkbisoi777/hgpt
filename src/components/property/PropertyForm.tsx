import React, { useState } from 'react';
import { supabase } from '../../lib/supabaseClient';
import { toast } from 'react-hot-toast';
import { useAuthStore } from '../../store/authStore';

export function PropertyForm() {
  const [isLoading, setIsLoading] = useState(false);
  const { user } = useAuthStore(); // Get the current user from auth store
  const [formData, setFormData] = useState({
    title: '',
    location: '',
    price: '',
    area: '',
    bedrooms: '',
    bathrooms: '',
    property_type: '',
    status: '',
    amenities: [] as string[],
    possession_date: '',
    furnishing_status: '',
    property_url: '',
    latitude: '',
    longitude: '',
    images: [],
    description: '',
    contact_details: {
      name: '',
      phone: '',
      email: ''
    },
    nearby_landmarks: '',
    availability: '',
    tags: [],
    sqft: ''
  });

  const propertyTypes = [
    'Apartment',
    'Villa',
    'Independent House',
    'Plot',
    'Penthouse',
    'Studio'
  ];

  const statusOptions = [
    'Under Construction',
    'Ready to Move',
    'Resale',
    'New Launch'
  ];

  const furnishingOptions = [
    'Unfurnished',
    'Semi-Furnished',
    'Fully Furnished'
  ];

  const amenityOptions = [
    'Swimming Pool',
    'Gym',
    'Club House',
    'Park',
    'Security',
    'Power Backup',
    'Parking',
    'Garden'
  ];

  const handleInputChange = (e: React.ChangeEvent<HTMLInputElement | HTMLSelectElement | HTMLTextAreaElement>) => {
    const { name, value } = e.target;
    setFormData(prev => ({
      ...prev,
      [name]: value
    }));
  };

  const handleAmenitiesChange = (amenity: string) => {
    setFormData(prev => ({
      ...prev,
      amenities: prev.amenities.includes(amenity)
        ? prev.amenities.filter(a => a !== amenity)
        : [...prev.amenities, amenity]
    }));
  };

  // const handleTagInput = (e: React.KeyboardEvent<HTMLInputElement>) => {
  //   if (e.key === 'Enter' && e.currentTarget.value) {
  //     e.preventDefault();
  //     const newTag = e.currentTarget.value.trim();
  //     if (!formData.tags.includes(newTag)) {
  //       setFormData(prev => ({
  //         ...prev,
  //         tags: [...prev.tags, newTag]
  //       }));
  //     }
  //     e.currentTarget.value = '';
  //   }
  // };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    
    if (!user?.id) {
      toast.error('You must be logged in to add a property');
      return;
    }

    setIsLoading(true);

    try {
      const { error } = await supabase
        .from('properties')
        .insert([{
          ...formData,
          developer_name: user.id, // Set the developer_name to the user's ID
          price: parseFloat(formData.price),
          area: parseFloat(formData.area),
          bedrooms: parseInt(formData.bedrooms),
          bathrooms: parseInt(formData.bathrooms),
          sqft: parseInt(formData.sqft),
          latitude: parseFloat(formData.latitude),
          longitude: parseFloat(formData.longitude),
          availability: parseInt(formData.availability),
          amenities: JSON.stringify(formData.amenities),
          tags: JSON.stringify(formData.tags),
          contact_details: JSON.stringify(formData.contact_details),
          imageUrl: formData.images[0] || 'https://images.unsplash.com/photo-1560448204-e02f11c3d0e2' // Default image
        }]);

      if (error) throw error;
      toast.success('Property added successfully!');
      
      // Reset form
      setFormData({
        title: '',
        location: '',
        price: '',
        area: '',
        bedrooms: '',
        bathrooms: '',
        property_type: '',
        status: '',
        amenities: [],
        possession_date: '',
        furnishing_status: '',
        property_url: '',
        latitude: '',
        longitude: '',
        images: [],
        description: '',
        contact_details: {
          name: '',
          phone: '',
          email: ''
        },
        nearby_landmarks: '',
        availability: '',
        tags: [],
        sqft: ''
      });
    } catch (error) {
      console.error('Error adding property:', error);
      toast.error('Failed to add property');
    } finally {
      setIsLoading(false);
    }
  };

  return (
    <div className="max-w-4xl mx-auto p-6">
      <h2 className="text-2xl font-bold mb-6">Add New Property</h2>
      
      <form onSubmit={handleSubmit} className="space-y-6">
        {/* Basic Information */}
        <div className="bg-white p-6 rounded-lg shadow-md">
          <h3 className="text-lg font-semibold mb-4">Basic Information</h3>
          <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
            <div>
              <label className="block text-sm font-medium mb-1">Title/Name *</label>
              <input
                type="text"
                name="title"
                value={formData.title}
                onChange={handleInputChange}
                className="w-full px-3 py-2 border rounded-md"
                required
              />
            </div>

            <div>
              <label className="block text-sm font-medium mb-1">Property Type *</label>
              <select
                name="property_type"
                value={formData.property_type}
                onChange={handleInputChange}
                className="w-full px-3 py-2 border rounded-md"
                required
              >
                <option value="">Select Type</option>
                {propertyTypes.map(type => (
                  <option key={type} value={type}>{type}</option>
                ))}
              </select>
            </div>

            <div>
              <label className="block text-sm font-medium mb-1">Status *</label>
              <select
                name="status"
                value={formData.status}
                onChange={handleInputChange}
                className="w-full px-3 py-2 border rounded-md"
                required
              >
                <option value="">Select Status</option>
                {statusOptions.map(status => (
                  <option key={status} value={status}>{status}</option>
                ))}
              </select>
            </div>
          </div>
        </div>

        {/* Location Details */}
        <div className="bg-white p-6 rounded-lg shadow-md">
          <h3 className="text-lg font-semibold mb-4">Location Details</h3>
          <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
            <div>
              <label className="block text-sm font-medium mb-1">Location *</label>
              <input
                type="text"
                name="location"
                value={formData.location}
                onChange={handleInputChange}
                className="w-full px-3 py-2 border rounded-md"
                required
              />
            </div>

            <div>
              <label className="block text-sm font-medium mb-1">Nearby Landmarks</label>
              <input
                type="text"
                name="nearby_landmarks"
                value={formData.nearby_landmarks}
                onChange={handleInputChange}
                className="w-full px-3 py-2 border rounded-md"
              />
            </div>

            <div>
              <label className="block text-sm font-medium mb-1">Latitude</label>
              <input
                type="number"
                name="latitude"
                value={formData.latitude}
                onChange={handleInputChange}
                className="w-full px-3 py-2 border rounded-md"
                step="any"
              />
            </div>

            <div>
              <label className="block text-sm font-medium mb-1">Longitude</label>
              <input
                type="number"
                name="longitude"
                value={formData.longitude}
                onChange={handleInputChange}
                className="w-full px-3 py-2 border rounded-md"
                step="any"
              />
            </div>
          </div>
        </div>

        {/* Property Details */}
        <div className="bg-white p-6 rounded-lg shadow-md">
          <h3 className="text-lg font-semibold mb-4">Property Details</h3>
          <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
            <div>
              <label className="block text-sm font-medium mb-1">Price (₹) *</label>
              <input
                type="number"
                name="price"
                value={formData.price}
                onChange={handleInputChange}
                className="w-full px-3 py-2 border rounded-md"
                required
              />
            </div>

            <div>
              <label className="block text-sm font-medium mb-1">Area (sq.ft) *</label>
              <input
                type="number"
                name="sqft"
                value={formData.sqft}
                onChange={handleInputChange}
                className="w-full px-3 py-2 border rounded-md"
                required
              />
            </div>

            <div>
              <label className="block text-sm font-medium mb-1">Bedrooms *</label>
              <input
                type="number"
                name="bedrooms"
                value={formData.bedrooms}
                onChange={handleInputChange}
                className="w-full px-3 py-2 border rounded-md"
                required
              />
            </div>

            <div>
              <label className="block text-sm font-medium mb-1">Bathrooms *</label>
              <input
                type="number"
                name="bathrooms"
                value={formData.bathrooms}
                onChange={handleInputChange}
                className="w-full px-3 py-2 border rounded-md"
                required
              />
            </div>

            <div>
              <label className="block text-sm font-medium mb-1">Possession Date</label>
              <input
                type="date"
                name="possession_date"
                value={formData.possession_date}
                onChange={handleInputChange}
                className="w-full px-3 py-2 border rounded-md"
              />
            </div>

            <div>
              <label className="block text-sm font-medium mb-1">Furnishing Status</label>
              <select
                name="furnishing_status"
                value={formData.furnishing_status}
                onChange={handleInputChange}
                className="w-full px-3 py-2 border rounded-md"
              >
                <option value="">Select Status</option>
                {furnishingOptions.map(status => (
                  <option key={status} value={status}>{status}</option>
                ))}
              </select>
            </div>
          </div>
        </div>

        {/* Amenities */}
        <div className="bg-white p-6 rounded-lg shadow-md">
          <h3 className="text-lg font-semibold mb-4">Amenities</h3>
          <div className="grid grid-cols-2 md:grid-cols-4 gap-4">
            {amenityOptions.map(amenity => (
              <label key={amenity} className="flex items-center space-x-2">
                <input
                  type="checkbox"
                  checked={formData.amenities.includes(amenity)}
                  onChange={() => handleAmenitiesChange(amenity)}
                  className="rounded border-gray-300"
                />
                <span className="text-sm">{amenity}</span>
              </label>
            ))}
          </div>
        </div>

        {/* Contact Details */}
        <div className="bg-white p-6 rounded-lg shadow-md">
          <h3 className="text-lg font-semibold mb-4">Contact Details</h3>
          <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
            <div>
              <label className="block text-sm font-medium mb-1">Contact Name</label>
              <input
                type="text"
                name="contact_name"
                value={formData.contact_details.name}
                onChange={(e) => setFormData(prev => ({
                  ...prev,
                  contact_details: { ...prev.contact_details, name: e.target.value }
                }))}
                className="w-full px-3 py-2 border rounded-md"
              />
            </div>

            <div>
              <label className="block text-sm font-medium mb-1">Contact Phone</label>
              <input
                type="tel"
                name="contact_phone"
                value={formData.contact_details.phone}
                onChange={(e) => setFormData(prev => ({
                  ...prev,
                  contact_details: { ...prev.contact_details, phone: e.target.value }
                }))}
                className="w-full px-3 py-2 border rounded-md"
              />
            </div>

            <div>
              <label className="block text-sm font-medium mb-1">Contact Email</label>
              <input
                type="email"
                name="contact_email"
                value={formData.contact_details.email}
                onChange={(e) => setFormData(prev => ({
                  ...prev,
                  contact_details: { ...prev.contact_details, email: e.target.value }
                }))}
                className="w-full px-3 py-2 border rounded-md"
              />
            </div>
          </div>
        </div>

        {/* Description */}
        <div className="bg-white p-6 rounded-lg shadow-md">
          <h3 className="text-lg font-semibold mb-4">Description</h3>
          <textarea
            name="description"
            value={formData.description}
            onChange={handleInputChange}
            rows={4}
            className="w-full px-3 py-2 border rounded-md"
            placeholder="Enter property description..."
          />
        </div>

        {/* Submit Button */}
        <div className="flex justify-end">
          <button
            type="submit"
            disabled={isLoading}
            className="px-6 py-2 bg-blue-500 text-white rounded-md hover:bg-blue-600 disabled:opacity-50"
          >
            {isLoading ? 'Adding Property...' : 'Add Property'}
          </button>
        </div>
      </form>
    </div>
  );
}