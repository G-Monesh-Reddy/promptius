import React, { useState, useEffect } from 'react';
import { useParams, useNavigate } from 'react-router-dom';
import { motion } from 'framer-motion';
import { 
  Star, 
  Clock, 
  MapPin, 
  Users, 
  Calendar,
  Check,
  Heart,
  Share2,
  ArrowLeft
} from 'lucide-react';
import ImageCarousel from '../components/ImageCarousel';
import { useBooking } from '../context/BookingContext';
import tripsData from '../data/trips.json';

const trips = tripsData;

export default function TripDetails() {
  const { id } = useParams();
  const navigate = useNavigate();
  const { setTrip } = useBooking();
  const [trip, setTripData] = useState(null);
  const [selectedTravelers, setSelectedTravelers] = useState(1);
  const [isFavorite, setIsFavorite] = useState(false);

  useEffect(() => {
    const foundTrip = trips.find(t => t.id === parseInt(id || '0'));
    if (foundTrip) {
      setTripData(foundTrip);
    } else {
      navigate('/search');
    }
  }, [id, navigate]);

  const handleBookNow = () => {
    if (trip) {
      setTrip(trip);
      navigate('/checkout');
    }
  };

  const handleShare = async () => {
    if (navigator.share) {
      try {
        await navigator.share({
          title: `${trip?.destination} - XYZ Travel`,
          text: trip?.description,
          url: window.location.href,
        });
      } catch (error) {
        console.log('Error sharing:', error);
      }
    } else {
      // Fallback: copy to clipboard
      navigator.clipboard.writeText(window.location.href);
      alert('Link copied to clipboard!');
    }
  };

  if (!trip) {
    return (
      <div className="min-h-screen flex items-center justify-center">
        <div className="animate-spin rounded-full h-32 w-32 border-b-2 border-blue-600"></div>
      </div>
    );
  }

  const totalPrice = trip.price * selectedTravelers;

  return (
    <div className="min-h-screen bg-gray-50">
      {/* Hero Section */}
      <div className="relative h-96 lg:h-[500px]">
        <ImageCarousel 
          images={trip.images} 
          className="h-full"
          autoPlay={true}
        />
        <div className="absolute inset-0 bg-black/30" />
        
        {/* Back Button */}
        <button
          onClick={() => navigate(-1)}
          className="absolute top-6 left-6 z-10 bg-white/90 backdrop-blur-sm text-gray-800 p-3 rounded-full hover:bg-white transition-all duration-200 shadow-lg"
        >
          <ArrowLeft className="h-5 w-5" />
        </button>

        {/* Action Buttons */}
        <div className="absolute top-6 right-6 z-10 flex space-x-3">
          <button
            onClick={() => setIsFavorite(!isFavorite)}
            className="bg-white/90 backdrop-blur-sm text-gray-800 p-3 rounded-full hover:bg-white transition-all duration-200 shadow-lg"
          >
            <Heart className={`h-5 w-5 ${isFavorite ? 'text-red-500 fill-current' : ''}`} />
          </button>
          <button
            onClick={handleShare}
            className="bg-white/90 backdrop-blur-sm text-gray-800 p-3 rounded-full hover:bg-white transition-all duration-200 shadow-lg"
          >
            <Share2 className="h-5 w-5" />
          </button>
        </div>

        {/* Trip Badge */}
        <div className="absolute bottom-6 left-6 z-10">
          <span className="bg-blue-600 text-white px-4 py-2 rounded-full text-sm font-medium">
            {trip.category}
          </span>
        </div>
      </div>

      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
        <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">
          {/* Main Content */}
          <div className="lg:col-span-2 space-y-8">
            {/* Trip Header */}
            <motion.div
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ duration: 0.6 }}
            >
              <div className="flex items-start justify-between mb-4">
                <div>
                  <h1 className="text-3xl lg:text-4xl font-bold text-gray-900 mb-2">
                    {trip.destination}
                  </h1>
                  <div className="flex items-center space-x-4 text-gray-600">
                    <div className="flex items-center">
                      <MapPin className="h-4 w-4 mr-1" />
                      <span>{trip.country}</span>
                    </div>
                    <div className="flex items-center">
                      <Clock className="h-4 w-4 mr-1" />
                      <span>{trip.duration}</span>
                    </div>
                    <div className="flex items-center">
                      <Star className="h-4 w-4 text-yellow-400 fill-current mr-1" />
                      <span className="font-medium">{trip.rating}</span>
                      <span className="text-sm ml-1">({trip.reviews} reviews)</span>
                    </div>
                  </div>
                </div>
              </div>

              <p className="text-lg text-gray-700 leading-relaxed">
                {trip.description}
              </p>
            </motion.div>

            {/* Highlights */}
            <motion.div
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ duration: 0.6, delay: 0.1 }}
              className="bg-white rounded-lg p-6 shadow-sm"
            >
              <h2 className="text-2xl font-bold text-gray-900 mb-4">Trip Highlights</h2>
              <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                {trip.highlights.map((highlight, index) => (
                  <div key={index} className="flex items-center">
                    <Check className="h-5 w-5 text-green-500 mr-3 flex-shrink-0" />
                    <span className="text-gray-700">{highlight}</span>
                  </div>
                ))}
              </div>
            </motion.div>

            {/* Itinerary */}
            <motion.div
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ duration: 0.6, delay: 0.2 }}
              className="bg-white rounded-lg p-6 shadow-sm"
            >
              <h2 className="text-2xl font-bold text-gray-900 mb-6">Day-by-Day Itinerary</h2>
              <div className="space-y-4">
                {trip.itinerary.map((day, index) => (
                  <div key={index} className="flex">
                    <div className="flex-shrink-0 w-8 h-8 bg-blue-100 text-blue-600 rounded-full flex items-center justify-center font-semibold text-sm mr-4">
                      {index + 1}
                    </div>
                    <div className="flex-grow">
                      <p className="text-gray-800">{day}</p>
                    </div>
                  </div>
                ))}
              </div>
            </motion.div>

            {/* What's Included */}
            <motion.div
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ duration: 0.6, delay: 0.3 }}
              className="bg-white rounded-lg p-6 shadow-sm"
            >
              <h2 className="text-2xl font-bold text-gray-900 mb-4">What's Included</h2>
              <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                {trip.included.map((item, index) => (
                  <div key={index} className="flex items-center">
                    <Check className="h-5 w-5 text-green-500 mr-3 flex-shrink-0" />
                    <span className="text-gray-700">{item}</span>
                  </div>
                ))}
              </div>
            </motion.div>
          </div>

          {/* Booking Sidebar */}
          <div className="lg:col-span-1">
            <motion.div
              initial={{ opacity: 0, x: 20 }}
              animate={{ opacity: 1, x: 0 }}
              transition={{ duration: 0.6 }}
              className="bg-white rounded-lg p-6 shadow-lg sticky top-8"
            >
              <div className="text-center mb-6">
                <div className="text-3xl font-bold text-blue-600 mb-1">
                  ${trip.price}
                </div>
                <div className="text-gray-600">per person</div>
                <div className="text-sm text-gray-500 mt-1">
                  Price range: ${trip.minPrice} - ${trip.maxPrice}
                </div>
              </div>

              {/* Travelers Selection */}
              <div className="mb-6">
                <label className="block text-sm font-medium text-gray-700 mb-2">
                  Number of Travelers
                </label>
                <div className="flex items-center border border-gray-300 rounded-md">
                  <button
                    onClick={() => setSelectedTravelers(Math.max(1, selectedTravelers - 1))}
                    className="p-2 hover:bg-gray-50 rounded-l-md"
                  >
                    -
                  </button>
                  <div className="flex-1 text-center py-2 border-x border-gray-300">
                    <Users className="h-4 w-4 inline mr-1" />
                    {selectedTravelers}
                  </div>
                  <button
                    onClick={() => setSelectedTravelers(selectedTravelers + 1)}
                    className="p-2 hover:bg-gray-50 rounded-r-md"
                  >
                    +
                  </button>
                </div>
              </div>

              {/* Price Breakdown */}
              <div className="border-t border-gray-200 pt-4 mb-6">
                <div className="flex justify-between text-sm text-gray-600 mb-2">
                  <span>${trip.price} × {selectedTravelers} traveler{selectedTravelers > 1 ? 's' : ''}</span>
                  <span>${totalPrice}</span>
                </div>
                <div className="flex justify-between text-lg font-semibold text-gray-900">
                  <span>Total</span>
                  <span>${totalPrice}</span>
                </div>
              </div>

              {/* Book Now Button */}
              <button
                onClick={handleBookNow}
                className="w-full bg-gradient-to-r from-blue-600 to-purple-600 text-white py-4 px-6 rounded-lg font-semibold hover:from-blue-700 hover:to-purple-700 transition-all duration-200 transform hover:scale-105 shadow-lg mb-4"
              >
                Book Now
              </button>

              {/* Contact Info */}
              <div className="text-center text-sm text-gray-600">
                <p className="mb-2">Need help booking?</p>
                <p className="font-medium text-blue-600">Call: +1 (555) 123-4567</p>
              </div>

              {/* Trip Details */}
              <div className="mt-6 pt-6 border-t border-gray-200 space-y-3">
                <div className="flex items-center justify-between text-sm">
                  <span className="text-gray-600">Duration:</span>
                  <span className="font-medium">{trip.duration}</span>
                </div>
                <div className="flex items-center justify-between text-sm">
                  <span className="text-gray-600">Category:</span>
                  <span className="font-medium">{trip.category}</span>
                </div>
                <div className="flex items-center justify-between text-sm">
                  <span className="text-gray-600">Rating:</span>
                  <div className="flex items-center">
                    <Star className="h-4 w-4 text-yellow-400 fill-current mr-1" />
                    <span className="font-medium">{trip.rating}</span>
                  </div>
                </div>
              </div>
            </motion.div>
          </div>
        </div>
      </div>
    </div>
  );
}