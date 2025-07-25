import React, { useState } from 'react';
import { Link } from 'react-router-dom';
import { Star, Clock, MapPin, Heart } from 'lucide-react';

export default function TripCard({ trip }) {
  const [isFavorite, setIsFavorite] = useState(false);
  const [imageLoaded, setImageLoaded] = useState(false);

  return (
    <div className="bg-white rounded-xl shadow-lg overflow-hidden hover:shadow-xl transition-all duration-300 transform hover:-translate-y-1">
      <div className="relative h-48 overflow-hidden">
        <img
          src={trip.images[0]}
          alt={trip.destination}
          className={`w-full h-full object-cover transition-all duration-500 ${
            imageLoaded ? 'opacity-100 scale-100' : 'opacity-0 scale-105'
          }`}
          onLoad={() => setImageLoaded(true)}
        />
        {!imageLoaded && (
          <div className="absolute inset-0 bg-gray-200 animate-pulse" />
        )}
        
        <button
          onClick={() => setIsFavorite(!isFavorite)}
          className="absolute top-3 right-3 p-2 rounded-full bg-white/80 backdrop-blur-sm hover:bg-white transition-all duration-200"
        >
          <Heart
            className={`h-5 w-5 transition-colors ${
              isFavorite ? 'text-red-500 fill-current' : 'text-gray-600'
            }`}
          />
        </button>

        <div className="absolute top-3 left-3">
          <span className="bg-blue-600 text-white px-2 py-1 rounded-md text-xs font-medium">
            {trip.category}
          </span>
        </div>
      </div>

      <div className="p-6">
        <div className="flex items-start justify-between mb-2">
          <h3 className="text-xl font-bold text-gray-900 line-clamp-1">
            {trip.destination}
          </h3>
          <div className="text-right">
            <p className="text-2xl font-bold text-blue-600">${trip.price}</p>
            <p className="text-sm text-gray-500">per person</p>
          </div>
        </div>

        <div className="flex items-center mb-3 space-x-4">
          <div className="flex items-center">
            <Star className="h-4 w-4 text-yellow-400 fill-current" />
            <span className="ml-1 text-sm font-medium text-gray-900">{trip.rating}</span>
            <span className="ml-1 text-sm text-gray-500">({trip.reviews})</span>
          </div>
          <div className="flex items-center">
            <Clock className="h-4 w-4 text-gray-400" />
            <span className="ml-1 text-sm text-gray-600">{trip.duration}</span>
          </div>
        </div>

        <p className="text-gray-600 text-sm mb-4 line-clamp-2">
          {trip.description}
        </p>

        <div className="flex items-center justify-between">
          <div className="flex items-center">
            <MapPin className="h-4 w-4 text-gray-400" />
            <span className="ml-1 text-sm text-gray-600">{trip.country}</span>
          </div>
          <Link
            to={`/trip/${trip.id}`}
            className="bg-blue-600 text-white px-4 py-2 rounded-lg font-medium hover:bg-blue-700 transition-colors"
          >
            View Details
          </Link>
        </div>
      </div>
    </div>
  );
}