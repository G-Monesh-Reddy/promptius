import React, { useState } from 'react';
import { Search, MapPin, Calendar, DollarSign } from 'lucide-react';
import { useNavigate } from 'react-router-dom';

export default function SearchBar({ onSearch, className = '' }) {
  const [destination, setDestination] = useState('');
  const [duration, setDuration] = useState('');
  const [priceRange, setPriceRange] = useState('');
  const navigate = useNavigate();

  const handleSearch = (e) => {
    e.preventDefault();
    const searchParams = { destination, duration, priceRange };
    
    if (onSearch) {
      onSearch(searchParams);
    } else {
      // Navigate to search results with query parameters
      const params = new URLSearchParams();
      if (destination) params.set('destination', destination);
      if (duration) params.set('duration', duration);
      if (priceRange) params.set('price', priceRange);
      
      navigate(`/search?${params.toString()}`);
    }
  };

  return (
    <form 
      onSubmit={handleSearch}
      className={`bg-white rounded-2xl shadow-2xl p-6 ${className}`}
    >
      <div className="grid grid-cols-1 md:grid-cols-4 gap-4">
        {/* Destination */}
        <div className="relative">
          <label className="block text-sm font-medium text-gray-700 mb-2">
            Destination
          </label>
          <div className="relative">
            <MapPin className="absolute left-3 top-1/2 transform -translate-y-1/2 h-5 w-5 text-gray-400" />
            <input
              type="text"
              value={destination}
              onChange={(e) => setDestination(e.target.value)}
              placeholder="Where to?"
              className="w-full pl-10 pr-4 py-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent"
            />
          </div>
        </div>

        {/* Duration */}
        <div className="relative">
          <label className="block text-sm font-medium text-gray-700 mb-2">
            Duration
          </label>
          <div className="relative">
            <Calendar className="absolute left-3 top-1/2 transform -translate-y-1/2 h-5 w-5 text-gray-400" />
            <select
              value={duration}
              onChange={(e) => setDuration(e.target.value)}
              className="w-full pl-10 pr-4 py-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent appearance-none"
            >
              <option value="">Any duration</option>
              <option value="3-5">3-5 days</option>
              <option value="5-7">5-7 days</option>
              <option value="7+">7+ days</option>
            </select>
          </div>
        </div>

        {/* Price Range */}
        <div className="relative">
          <label className="block text-sm font-medium text-gray-700 mb-2">
            Price Range
          </label>
          <div className="relative">
            <DollarSign className="absolute left-3 top-1/2 transform -translate-y-1/2 h-5 w-5 text-gray-400" />
            <select
              value={priceRange}
              onChange={(e) => setPriceRange(e.target.value)}
              className="w-full pl-10 pr-4 py-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent appearance-none"
            >
              <option value="">Any price</option>
              <option value="0-500">$0 - $500</option>
              <option value="500-1000">$500 - $1000</option>
              <option value="1000-1500">$1000 - $1500</option>
              <option value="1500+">$1500+</option>
            </select>
          </div>
        </div>

        {/* Search Button */}
        <div className="flex items-end">
          <button
            type="submit"
            className="w-full bg-gradient-to-r from-blue-600 to-purple-600 text-white py-3 px-6 rounded-lg font-semibold hover:from-blue-700 hover:to-purple-700 transition-all duration-200 flex items-center justify-center space-x-2"
          >
            <Search className="h-5 w-5" />
            <span>Search</span>
          </button>
        </div>
      </div>
    </form>
  );
}