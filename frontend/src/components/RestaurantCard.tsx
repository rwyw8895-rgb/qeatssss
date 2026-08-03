import React from 'react';
import { Star, MapPin, Clock, Utensils, ArrowRight } from 'lucide-react';
import { Restaurant } from '../types';

interface RestaurantCardProps {
  restaurant: Restaurant;
  onOpenMenu: (restaurant: Restaurant) => void;
}

export const RestaurantCard: React.FC<RestaurantCardProps> = ({ restaurant, onOpenMenu }) => {
  const rating = restaurant.rating || 4.5;
  const distanceKm = restaurant.distanceKm !== undefined ? restaurant.distanceKm : 2.5;

  return (
    <div
      onClick={() => onOpenMenu(restaurant)}
      id={`restaurant-card-${restaurant.restaurantId}`}
      className="group bg-white rounded-2xl overflow-hidden border border-slate-200/80 hover:border-rose-300 shadow-sm hover:shadow-xl hover:shadow-rose-500/5 transition-all duration-300 cursor-pointer flex flex-col h-full"
    >
      {/* Image Container with Badges */}
      <div className="relative h-48 w-full overflow-hidden bg-slate-100">
        <img
          src={restaurant.imageUrl}
          alt={restaurant.name}
          className="w-full h-full object-cover group-hover:scale-105 transition-transform duration-500"
          onError={(e) => {
            // Fallback food banner
            (e.target as HTMLImageElement).src = 'https://images.unsplash.com/photo-1504674900247-0877df9cc836?w=800&auto=format&fit=crop&q=80';
          }}
        />
        <div className="absolute inset-0 bg-gradient-to-t from-slate-950/70 via-transparent to-transparent opacity-80" />

        {/* Rating Badge */}
        <div className="absolute top-3 left-3 bg-emerald-600 text-white px-2.5 py-1 rounded-xl text-xs font-bold flex items-center gap-1 shadow-md">
          <Star className="w-3.5 h-3.5 fill-current text-white" />
          <span>{rating.toFixed(1)}</span>
        </div>

        {/* Operating Hours Pill */}
        <div className="absolute top-3 right-3 bg-slate-900/80 backdrop-blur-md text-white px-2.5 py-1 rounded-xl text-[11px] font-semibold flex items-center gap-1 border border-white/20">
          <Clock className="w-3 h-3 text-rose-400" />
          <span>{restaurant.opensAt} - {restaurant.closesAt}</span>
        </div>

        {/* Neighborhood Overlay */}
        <div className="absolute bottom-3 left-3 right-3 text-white">
          <p className="text-xs font-medium text-slate-200 flex items-center gap-1">
            <MapPin className="w-3 h-3 text-rose-400 shrink-0" />
            <span>{restaurant.city}</span>
            <span className="text-slate-400">•</span>
            <span className="font-bold text-emerald-400">{distanceKm} km away</span>
          </p>
        </div>
      </div>

      {/* Content Body */}
      <div className="p-5 flex-1 flex flex-col justify-between">
        <div>
          <h3 className="font-extrabold text-lg text-slate-900 group-hover:text-rose-600 transition-colors line-clamp-1">
            {restaurant.name}
          </h3>

          {/* Attributes / Cuisines */}
          <div className="flex flex-wrap gap-1.5 mt-2.5">
            {restaurant.attributes.map((attr) => (
              <span
                key={attr}
                className="px-2.5 py-1 rounded-lg bg-slate-100 text-slate-600 text-[11px] font-semibold group-hover:bg-rose-50 group-hover:text-rose-700 transition-colors"
              >
                {attr}
              </span>
            ))}
          </div>
        </div>

        {/* Footer Action */}
        <div className="mt-5 pt-3 border-t border-slate-100 flex items-center justify-between">
          <span className="text-xs font-bold text-slate-500 flex items-center gap-1">
            <Utensils className="w-3.5 h-3.5 text-rose-500" />
            <span>View Full Menu</span>
          </span>

          <div className="w-8 h-8 rounded-full bg-rose-50 text-rose-600 group-hover:bg-rose-600 group-hover:text-white flex items-center justify-center transition-all">
            <ArrowRight className="w-4 h-4" />
          </div>
        </div>
      </div>
    </div>
  );
};
