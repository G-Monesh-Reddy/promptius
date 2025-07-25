import React, { useState, useEffect } from 'react';
import { useSearchParams } from 'react-router-dom';
import { motion } from 'framer-motion';
import { Filter, SlidersHorizontal, Grid3X3, List } from 'lucide-react';
import TripCard from '../components/TripCard';
import SearchBar from '../components/SearchBar';
import tripsData from '../data/trips.json';

const trips = tripsData;

export default function SearchResults() {
  const [searchParams] = useSearchParams();
  const [filteredTrips, setFilteredTrips] = useState(trips);
  const [showFilters, setShowFilters] = useState(false);
  const [viewMode, setViewMode] = useState('grid');
  const [sortBy, setSortBy] = useState('popular');
  
  const [filters, setFilters] = useState({
    priceRange: [0, 2000],
    location: '',
    duration: '',
    category: '',
  });

  useEffect(() => {
    // Apply filters from URL parameters
    const destination = searchParams.get('destination') || '';
    const duration = searchParams.get('duration') || '';
    const price = searchParams.get('price') || '';

    setFilters(prev => ({
      ...prev,
      location: destination,
      duration: duration,
      priceRange: price ? getPriceRangeFromString(price) : [0, 2000]
    }));
  }, [searchParams]);

  useEffect(() => {
    let filtered = trips.filter(trip => {
      const matchesLocation = !filters.location || 
        trip.destination.toLowerCase().includes(filters.location.toLowerCase()) ||
        trip.country.toLowerCase().includes(filters.location.toLowerCase());
      
      const matchesPrice = trip.price >= filters.priceRange[0] && trip.price <= filters.priceRange[1];
      
      const matchesDuration = !filters.duration || matchesDurationFilter(trip.duration, filters.duration);
      
      const matchesCategory = !filters.category || trip.category === filters.category;

      return matchesLocation && matchesPrice && matchesDuration && matchesCategory;
    });

    // Apply sorting
    switch (sortBy) {
      case 'price-low':
        filtered.sort((a, b) => a.price - b.price);
        break;
      case 'price-high':
        filtered.sort((a, b) => b.price - a.price);
        break;
      case 'rating':
        filtered.sort((a, b) => b.rating - a.rating);
        break;
      case 'duration':
        filtered.sort((a, b) => parseInt(a.duration) - parseInt(b.duration));
        break;
      default:
        filtered.sort((a, b) => b.rating * b.reviews - a.rating * a.reviews);
    }

    setFilteredTrips(filtered);
  }, [filters, sortBy]);

  const getPriceRangeFromString = (priceStr) => {
    switch (priceStr) {
      case '0-500': return [0, 500];
      case '500-1000': return [500, 1000];
      case '1000-1500': return [1000, 1500];
      case '1500+': return [1500, 2000];
      default: return [0, 2000];
    }
  };

  const matchesDurationFilter = (tripDuration, filterDuration) => {
    const days = parseInt(tripDuration);
    switch (filterDuration) {
      case '3-5': return days >= 3 && days <= 5;
      case '5-7': return days >= 5 && days <= 7;
      case '7+': return days >= 7;
      default: return true;
    }
  };

  const updatePriceRange = (range) => {
    setFilters(prev => ({ ...prev, priceRange: range }));
  };

  const categories = ['Beach', 'Cultural', 'Adventure', 'Luxury'];

  return (
    <div className="min-h-screen bg-gray-50">
      {/* Search Header */}
      <section className="bg-white shadow-sm border-b">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
          <SearchBar 
            onSearch={(params) => {
              setFilters(prev => ({
                ...prev,
                location: params.destination,
                duration: params.duration,
                priceRange: params.priceRange ? getPriceRangeFromString(params.priceRange) : [0, 2000]
              }));
            }}
          />
        </div>
      </section>

      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
        <div className="flex flex-col lg:flex-row gap-8">
          {/* Filters Sidebar */}
          <div className="lg:w-80">
            <div className="bg-white rounded-lg shadow-sm p-6 sticky top-8">
              <div className="flex items-center justify-between mb-6">
                <h3 className="text-lg font-semibold text-gray-900 flex items-center">
                  <Filter className="h-5 w-5 mr-2" />
                  Filters
                </h3>
                <button
                  onClick={() => setShowFilters(!showFilters)}
                  className="lg:hidden p-2 rounded-md hover:bg-gray-100"
                >
                  <SlidersHorizontal className="h-5 w-5" />
                </button>
              </div>

              <div className={`space-y-6 ${showFilters ? 'block' : 'hidden lg:block'}`}>
                {/* Price Range */}
                <div>
                  <label className="block text-sm font-medium text-gray-900 mb-3">
                    Price Range: ${filters.priceRange[0]} - ${filters.priceRange[1]}
                  </label>
                  <input
                    type="range"
                    min="0"
                    max="2000"
                    step="100"
                    value={filters.priceRange[1]}
                    onChange={(e) => updatePriceRange([filters.priceRange[0], parseInt(e.target.value)])}
                    className="w-full h-2 bg-gray-200 rounded-lg appearance-none cursor-pointer slider"
                  />
                  <div className="flex justify-between text-xs text-gray-500 mt-1">
                    <span>$0</span>
                    <span>$2000+</span>
                  </div>
                </div>

                {/* Category */}
                <div>
                  <label className="block text-sm font-medium text-gray-900 mb-3">Category</label>
                  <div className="space-y-2">
                    <label className="flex items-center">
                      <input
                        type="radio"
                        name="category"
                        value=""
                        checked={filters.category === ''}
                        onChange={(e) => setFilters(prev => ({ ...prev, category: e.target.value }))}
                        className="text-blue-600 focus:ring-blue-500"
                      />
                      <span className="ml-2 text-sm text-gray-700">All Categories</span>
                    </label>
                    {categories.map(category => (
                      <label key={category} className="flex items-center">
                        <input
                          type="radio"
                          name="category"
                          value={category}
                          checked={filters.category === category}
                          onChange={(e) => setFilters(prev => ({ ...prev, category: e.target.value }))}
                          className="text-blue-600 focus:ring-blue-500"
                        />
                        <span className="ml-2 text-sm text-gray-700">{category}</span>
                      </label>
                    ))}
                  </div>
                </div>

                {/* Duration */}
                <div>
                  <label className="block text-sm font-medium text-gray-900 mb-3">Duration</label>
                  <select
                    value={filters.duration}
                    onChange={(e) => setFilters(prev => ({ ...prev, duration: e.target.value }))}
                    className="w-full p-2 border border-gray-300 rounded-md focus:ring-2 focus:ring-blue-500 focus:border-transparent"
                  >
                    <option value="">Any duration</option>
                    <option value="3-5">3-5 days</option>
                    <option value="5-7">5-7 days</option>
                    <option value="7+">7+ days</option>
                  </select>
                </div>

                {/* Clear Filters */}
                <button
                  onClick={() => setFilters({ priceRange: [0, 2000], location: '', duration: '', category: '' })}
                  className="w-full py-2 px-4 border border-gray-300 rounded-md text-gray-700 hover:bg-gray-50 transition-colors"
                >
                  Clear All Filters
                </button>
              </div>
            </div>
          </div>

          {/* Results */}
          <div className="flex-1">
            {/* Results Header */}
            <div className="flex flex-col sm:flex-row sm:items-center sm:justify-between mb-6">
              <div>
                <h1 className="text-2xl font-bold text-gray-900">
                  {filteredTrips.length} Trip{filteredTrips.length !== 1 ? 's' : ''} Found
                </h1>
                <p className="text-gray-600 mt-1">
                  {filters.location && `Destination: ${filters.location}`}
                </p>
              </div>

              <div className="flex items-center space-x-4 mt-4 sm:mt-0">
                {/* Sort */}
                <select
                  value={sortBy}
                  onChange={(e) => setSortBy(e.target.value)}
                  className="p-2 border border-gray-300 rounded-md focus:ring-2 focus:ring-blue-500 focus:border-transparent"
                >
                  <option value="popular">Most Popular</option>
                  <option value="price-low">Price: Low to High</option>
                  <option value="price-high">Price: High to Low</option>
                  <option value="rating">Highest Rated</option>
                  <option value="duration">Duration</option>
                </select>

                {/* View Mode */}
                <div className="flex border border-gray-300 rounded-md">
                  <button
                    onClick={() => setViewMode('grid')}
                    className={`p-2 ${viewMode === 'grid' ? 'bg-blue-500 text-white' : 'text-gray-500 hover:text-gray-700'}`}
                  >
                    <Grid3X3 className="h-4 w-4" />
                  </button>
                  <button
                    onClick={() => setViewMode('list')}
                    className={`p-2 ${viewMode === 'list' ? 'bg-blue-500 text-white' : 'text-gray-500 hover:text-gray-700'}`}
                  >
                    <List className="h-4 w-4" />
                  </button>
                </div>
              </div>
            </div>

            {/* Results Grid/List */}
            {filteredTrips.length === 0 ? (
              <motion.div
                initial={{ opacity: 0 }}
                animate={{ opacity: 1 }}
                className="text-center py-12"
              >
                <div className="text-6xl mb-4">🔍</div>
                <h3 className="text-xl font-semibold text-gray-900 mb-2">No trips found</h3>
                <p className="text-gray-600">Try adjusting your filters to see more results.</p>
              </motion.div>
            ) : (
              <motion.div
                initial={{ opacity: 0 }}
                animate={{ opacity: 1 }}
                className={`grid gap-6 ${
                  viewMode === 'grid' 
                    ? 'grid-cols-1 md:grid-cols-2 xl:grid-cols-3' 
                    : 'grid-cols-1'
                }`}
              >
                {filteredTrips.map((trip, index) => (
                  <motion.div
                    key={trip.id}
                    initial={{ opacity: 0, y: 20 }}
                    animate={{ opacity: 1, y: 0 }}
                    transition={{ duration: 0.3, delay: index * 0.1 }}
                  >
                    <TripCard trip={trip} />
                  </motion.div>
                ))}
              </motion.div>
            )}
          </div>
        </div>
      </div>
    </div>
  );
}