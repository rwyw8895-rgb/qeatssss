import React from 'react';
import { MapPin, Search, ShoppingBag, Server, Clock, ChevronDown, Sparkles } from 'lucide-react';
import { Cart, SystemStatus } from '../types';

interface HeaderProps {
  currentLocationName: string;
  latitude: number;
  longitude: number;
  searchFor: string;
  onSearchChange: (val: string) => void;
  cart: Cart;
  onOpenLocationModal: () => void;
  onOpenCartDrawer: () => void;
  onOpenOrdersModal: () => void;
  onOpenStatusModal: () => void;
  systemStatus: SystemStatus | null;
}

export const Header: React.FC<HeaderProps> = ({
  currentLocationName,
  latitude,
  longitude,
  searchFor,
  onSearchChange,
  cart,
  onOpenLocationModal,
  onOpenCartDrawer,
  onOpenOrdersModal,
  onOpenStatusModal,
  systemStatus,
}) => {
  const totalItemCount = cart.items.reduce((sum, item) => sum + item.quantity, 0);

  return (
    <header className="sticky top-0 z-30 bg-white border-b border-slate-200/80 shadow-sm backdrop-blur-md bg-white/95">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="flex items-center justify-between h-20 gap-4">
          
          {/* Brand Logo & Location */}
          <div className="flex items-center gap-6">
            <div className="flex items-center gap-2.5 cursor-pointer select-none group" onClick={() => window.scrollTo({ top: 0, behavior: 'smooth' })}>
              <div className="w-11 h-11 rounded-2xl bg-gradient-to-tr from-rose-600 to-rose-500 flex items-center justify-center text-white shadow-lg shadow-rose-500/20 group-hover:scale-105 transition-transform">
                <span className="font-extrabold text-2xl tracking-tighter italic">Q</span>
              </div>
              <div>
                <div className="flex items-center gap-1.5">
                  <span className="font-black text-2xl tracking-tight text-slate-900">QEats</span>
                  <span className="text-[10px] font-bold uppercase tracking-wider bg-rose-100 text-rose-700 px-1.5 py-0.5 rounded-full border border-rose-200">v1 API</span>
                </div>
                <p className="text-xs text-slate-500 font-medium hidden sm:block">Spring Boot Food Delivery</p>
              </div>
            </div>

            {/* Location Selector Pill */}
            <button
              onClick={onOpenLocationModal}
              id="location-selector-btn"
              className="flex items-center gap-2 px-3.5 py-2 rounded-xl bg-slate-100/80 hover:bg-slate-200/80 text-slate-800 transition-colors border border-slate-200/60 max-w-[240px] sm:max-w-xs text-left"
            >
              <MapPin className="w-4 h-4 text-rose-500 shrink-0" />
              <div className="truncate text-xs">
                <p className="font-bold text-slate-900 truncate">{currentLocationName}</p>
                <p className="text-[11px] text-slate-500 font-medium truncate">
                  {latitude.toFixed(3)}, {longitude.toFixed(3)}
                </p>
              </div>
              <ChevronDown className="w-3.5 h-3.5 text-slate-400 shrink-0 ml-auto" />
            </button>
          </div>

          {/* Search Input Bar */}
          <div className="flex-1 max-w-md hidden md:block">
            <div className="relative">
              <Search className="absolute left-3.5 top-1/2 -translate-y-1/2 w-4 h-4 text-slate-400" />
              <input
                type="text"
                value={searchFor}
                onChange={(e) => onSearchChange(e.target.value)}
                placeholder="Search restaurants, cuisines, or dishes..."
                id="header-search-input"
                className="w-full pl-10 pr-4 py-2.5 bg-slate-50 border border-slate-200 rounded-xl text-sm font-medium focus:outline-none focus:ring-2 focus:ring-rose-500/20 focus:border-rose-500 transition-all placeholder:text-slate-400"
              />
              {searchFor && (
                <button
                  onClick={() => onSearchChange('')}
                  className="absolute right-3 top-1/2 -translate-y-1/2 text-xs text-slate-400 hover:text-slate-600 bg-slate-200 hover:bg-slate-300 rounded-full w-4 h-4 flex items-center justify-center font-bold"
                >
                  ×
                </button>
              )}
            </div>
          </div>

          {/* Actions & Status Badges */}
          <div className="flex items-center gap-2 sm:gap-3">

            {/* Peak Hour Indicator */}
            {systemStatus && (
              <button
                onClick={onOpenStatusModal}
                id="status-badge-btn"
                className={`hidden lg:flex items-center gap-1.5 px-3 py-1.5 rounded-xl border text-xs font-semibold transition-all ${
                  systemStatus.peakHours
                    ? 'bg-amber-50 text-amber-800 border-amber-200 hover:bg-amber-100'
                    : 'bg-emerald-50 text-emerald-800 border-emerald-200 hover:bg-emerald-100'
                }`}
              >
                <Clock className="w-3.5 h-3.5" />
                <span>{systemStatus.peakHours ? 'Peak (3km Radius)' : 'Normal (5km Radius)'}</span>
              </button>
            )}

            {/* Backend Direct Status Modal trigger */}
            <button
              onClick={onOpenStatusModal}
              id="backend-api-status-btn"
              className="p-2.5 rounded-xl bg-slate-100 hover:bg-slate-200 text-slate-700 transition-colors border border-slate-200 flex items-center gap-1.5 text-xs font-semibold"
              title="QEats Backend API Status"
            >
              <Server className="w-4 h-4 text-indigo-600" />
              <span className="hidden xl:inline">Spring Boot API</span>
            </button>

            {/* Orders Button */}
            <button
              onClick={onOpenOrdersModal}
              id="my-orders-btn"
              className="p-2.5 rounded-xl bg-slate-100 hover:bg-slate-200 text-slate-700 transition-colors border border-slate-200 flex items-center gap-1.5 text-xs font-semibold"
            >
              <Sparkles className="w-4 h-4 text-amber-500" />
              <span className="hidden sm:inline">My Orders</span>
            </button>

            {/* Cart Drawer Toggle */}
            <button
              onClick={onOpenCartDrawer}
              id="header-cart-btn"
              className="relative flex items-center gap-2 px-4 py-2.5 rounded-xl bg-rose-600 hover:bg-rose-700 text-white font-bold text-sm transition-all shadow-md shadow-rose-600/20 active:scale-95"
            >
              <ShoppingBag className="w-4 h-4" />
              <span className="hidden sm:inline">Cart</span>
              {totalItemCount > 0 && (
                <span className="bg-white text-rose-600 font-extrabold text-xs px-2 py-0.5 rounded-full shadow-sm">
                  {totalItemCount}
                </span>
              )}
            </button>
          </div>

        </div>

        {/* Mobile Search Bar */}
        <div className="pb-3 md:hidden">
          <div className="relative">
            <Search className="absolute left-3.5 top-1/2 -translate-y-1/2 w-4 h-4 text-slate-400" />
            <input
              type="text"
              value={searchFor}
              onChange={(e) => onSearchChange(e.target.value)}
              placeholder="Search restaurants or dishes..."
              id="mobile-header-search-input"
              className="w-full pl-10 pr-4 py-2 bg-slate-50 border border-slate-200 rounded-xl text-sm font-medium focus:outline-none focus:ring-2 focus:ring-rose-500/20"
            />
          </div>
        </div>

      </div>
    </header>
  );
};
