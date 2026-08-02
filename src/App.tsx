import React, { useState, useEffect } from 'react';
import { Header } from './components/Header';
import { LocationModal } from './components/LocationModal';
import { CuisineFilter } from './components/CuisineFilter';
import { RestaurantCard } from './components/RestaurantCard';
import { MenuModal } from './components/MenuModal';
import { CartDrawer } from './components/CartDrawer';
import { CheckoutModal } from './components/CheckoutModal';
import { OrderTrackerModal } from './components/OrderTrackerModal';
import { BackendStatusModal } from './components/BackendStatusModal';

import { Restaurant, MenuItem, Cart, Order, SystemStatus } from './types';
import {
  getRestaurants,
  getCart,
  updateCartItem,
  clearCart,
  getSystemStatus,
} from './api';
import { MapPin, Search, Compass, ShieldCheck, Sparkles, Utensils, Clock, Flame } from 'lucide-react';

export function App() {
  // Location State (Default: HSR Layout, Bengaluru)
  const [latitude, setLatitude] = useState(12.9116);
  const [longitude, setLongitude] = useState(77.6389);
  const [currentLocationName, setCurrentLocationName] = useState('HSR Layout, Bengaluru');

  // Search & Filter State
  const [searchFor, setSearchFor] = useState('');
  const [selectedCategory, setSelectedCategory] = useState('All');
  const [selectedFilter, setSelectedFilter] = useState<'all' | 'veg' | 'topRated'>('all');

  // Data State
  const [restaurants, setRestaurants] = useState<Restaurant[]>([]);
  const [isLoading, setIsLoading] = useState(true);
  const [errorMsg, setErrorMsg] = useState<string | null>(null);

  // Active Menu / Restaurant Modal State
  const [activeRestaurant, setActiveRestaurant] = useState<Restaurant | null>(null);

  // Cart State
  const [cart, setCart] = useState<Cart>({
    cartId: 'cart_123',
    restaurantId: null,
    items: [],
    total: 0,
  });

  // Orders & Tracker State
  const [activeOrder, setActiveOrder] = useState<Order | null>(null);

  // Modal Visibility Toggles
  const [isLocationModalOpen, setIsLocationModalOpen] = useState(false);
  const [isCartDrawerOpen, setIsCartDrawerOpen] = useState(false);
  const [isCheckoutModalOpen, setIsCheckoutModalOpen] = useState(false);
  const [isOrdersModalOpen, setIsOrdersModalOpen] = useState(false);
  const [isStatusModalOpen, setIsStatusModalOpen] = useState(false);

  // System Status State
  const [systemStatus, setSystemStatus] = useState<SystemStatus | null>(null);

  // Initial Load & Status Fetch
  useEffect(() => {
    getSystemStatus()
      .then(setSystemStatus)
      .catch(() => console.warn('Could not connect to status endpoint'));

    fetchCart();
  }, []);

  // Fetch Restaurants when location or search query changes
  useEffect(() => {
    fetchRestaurantsData();
  }, [latitude, longitude, searchFor]);

  const fetchRestaurantsData = async () => {
    setIsLoading(true);
    setErrorMsg(null);
    try {
      const data = await getRestaurants(latitude, longitude, searchFor);
      setRestaurants(data);
      setIsLoading(false);
    } catch (err: any) {
      setErrorMsg(err.message || 'Error loading restaurants');
      setIsLoading(false);
    }
  };

  const fetchCart = async () => {
    try {
      const currentCart = await getCart();
      setCart(currentCart);
    } catch (err) {
      console.warn('Could not load cart');
    }
  };

  const handleUpdateCartItem = async (restaurantId: string, item: MenuItem, delta: number) => {
    try {
      const updatedCart = await updateCartItem(restaurantId, item, delta);
      setCart(updatedCart);
    } catch (err: any) {
      alert(err.message || 'Failed to update cart');
    }
  };

  const handleClearCart = async () => {
    try {
      const resetCart = await clearCart();
      setCart(resetCart);
    } catch (err) {
      console.warn('Could not clear cart');
    }
  };

  const handleLocationSelect = (lat: number, lng: number, name: string) => {
    setLatitude(lat);
    setLongitude(lng);
    setCurrentLocationName(name);
  };

  const handleOrderSuccess = (order: Order) => {
    setIsCheckoutModalOpen(false);
    setActiveOrder(order);
    setIsOrdersModalOpen(true);
    fetchCart();
  };

  // Filter Restaurants by Category and Veg / Rating filters
  const displayedRestaurants = restaurants.filter((res) => {
    // Cuisine filter
    const matchesCategory =
      selectedCategory === 'All' ||
      res.attributes.some((attr) => attr.toLowerCase() === selectedCategory.toLowerCase()) ||
      (selectedCategory === 'Pure Veg' && res.attributes.some((a) => a.toLowerCase().includes('veg')));

    // Quick toggles
    let matchesQuickFilter = true;
    if (selectedFilter === 'veg') {
      matchesQuickFilter = res.attributes.some((a) => a.toLowerCase().includes('veg'));
    } else if (selectedFilter === 'topRated') {
      matchesQuickFilter = (res.rating || 4.5) >= 4.5;
    }

    return matchesCategory && matchesQuickFilter;
  });

  return (
    <div className="min-h-screen bg-[#f8f9fc] flex flex-col font-sans text-slate-800">
      
      {/* Navigation Header */}
      <Header
        currentLocationName={currentLocationName}
        latitude={latitude}
        longitude={longitude}
        searchFor={searchFor}
        onSearchChange={setSearchFor}
        cart={cart}
        onOpenLocationModal={() => setIsLocationModalOpen(true)}
        onOpenCartDrawer={() => setIsCartDrawerOpen(true)}
        onOpenOrdersModal={() => setIsOrdersModalOpen(true)}
        onOpenStatusModal={() => setIsStatusModalOpen(true)}
        systemStatus={systemStatus}
      />

      {/* Main Content Body */}
      <main className="flex-1 max-w-7xl w-full mx-auto px-4 sm:px-6 lg:px-8 py-6 space-y-8">

        {/* Hero Banner Section */}
        <div className="relative rounded-3xl bg-gradient-to-r from-slate-900 via-slate-800 to-rose-950 text-white p-6 sm:p-10 overflow-hidden shadow-xl">
          <div className="absolute -right-12 -bottom-12 w-64 h-64 bg-rose-600/20 rounded-full blur-3xl pointer-events-none" />
          <div className="absolute right-1/3 -top-12 w-48 h-48 bg-amber-500/10 rounded-full blur-2xl pointer-events-none" />

          <div className="relative z-10 max-w-2xl space-y-3">
            <div className="inline-flex items-center gap-2 px-3 py-1 rounded-full bg-white/10 backdrop-blur-md border border-white/15 text-xs font-bold text-rose-300">
              <Sparkles className="w-3.5 h-3.5 text-amber-400" />
              <span>QEats Spring Boot REST API Connected</span>
            </div>

            <h1 className="text-3xl sm:text-4xl lg:text-5xl font-black tracking-tight leading-tight text-white">
              Delicious Food, <br />
              <span className="text-transparent bg-clip-text bg-gradient-to-r from-rose-400 to-amber-300">
                Delivered in Minutes
              </span>
            </h1>

            <p className="text-sm sm:text-base text-slate-300 font-medium max-w-lg leading-relaxed">
              Serving top-rated restaurants near <span className="font-bold text-white underline underline-offset-4 decoration-rose-500">{currentLocationName}</span>. Filter by location coordinates, peak hours, or cuisine preferences.
            </p>

            {/* Quick Location Badge */}
            <div className="pt-2 flex flex-wrap items-center gap-3">
              <button
                onClick={() => setIsLocationModalOpen(true)}
                className="inline-flex items-center gap-1.5 px-3.5 py-1.5 rounded-xl bg-white/10 hover:bg-white/20 text-xs font-semibold text-white backdrop-blur-sm border border-white/20 transition-colors"
              >
                <MapPin className="w-3.5 h-3.5 text-rose-400" />
                <span>{latitude.toFixed(3)}, {longitude.toFixed(3)}</span>
              </button>

              <button
                onClick={() => setIsStatusModalOpen(true)}
                className="inline-flex items-center gap-1.5 px-3.5 py-1.5 rounded-xl bg-white/10 hover:bg-white/20 text-xs font-semibold text-slate-200 backdrop-blur-sm border border-white/20 transition-colors"
              >
                <Clock className="w-3.5 h-3.5 text-amber-400" />
                <span>{systemStatus?.peakHours ? 'Peak Hour (3km Radius)' : 'Normal Hour (5km Radius)'}</span>
              </button>
            </div>
          </div>
        </div>

        {/* Cuisine Categories & Filters */}
        <section className="space-y-4">
          <CuisineFilter
            selectedCategory={selectedCategory}
            onSelectCategory={setSelectedCategory}
            selectedFilter={selectedFilter}
            onFilterChange={setSelectedFilter}
          />
        </section>

        {/* Restaurants Grid Section */}
        <section className="space-y-4">
          <div className="flex items-center justify-between">
            <div>
              <h2 className="text-xl sm:text-2xl font-black text-slate-900 tracking-tight flex items-center gap-2">
                <Utensils className="w-6 h-6 text-rose-600" />
                <span>Restaurants Near You</span>
              </h2>
              <p className="text-xs text-slate-500 font-medium mt-0.5">
                Showing {displayedRestaurants.length} restaurants serving {currentLocationName}
              </p>
            </div>

            {searchFor && (
              <button
                onClick={() => setSearchFor('')}
                className="text-xs font-bold text-rose-600 hover:text-rose-700 underline"
              >
                Clear Search ("{searchFor}")
              </button>
            )}
          </div>

          {/* Loading Spinner */}
          {isLoading ? (
            <div className="py-24 text-center space-y-3">
              <div className="w-12 h-12 border-4 border-rose-600 border-t-transparent rounded-full animate-spin mx-auto" />
              <p className="text-sm font-bold text-slate-700">Querying QEats REST API (`/qeats/v1/restaurants`)...</p>
            </div>
          ) : errorMsg ? (
            <div className="p-8 bg-rose-50 border border-rose-200 rounded-3xl text-center space-y-3">
              <p className="font-extrabold text-rose-900 text-lg">Failed to load restaurants</p>
              <p className="text-xs text-rose-700">{errorMsg}</p>
              <button
                onClick={fetchRestaurantsData}
                className="px-5 py-2.5 bg-rose-600 text-white font-bold rounded-xl text-xs hover:bg-rose-700"
              >
                Retry Request
              </button>
            </div>
          ) : displayedRestaurants.length === 0 ? (
            <div className="py-20 text-center bg-white rounded-3xl border border-slate-200/80 p-8 space-y-3">
              <div className="w-16 h-16 rounded-full bg-slate-100 text-slate-400 flex items-center justify-center mx-auto">
                <Search className="w-8 h-8" />
              </div>
              <h3 className="font-extrabold text-lg text-slate-900">No restaurants found</h3>
              <p className="text-xs text-slate-500 max-w-sm mx-auto">
                No restaurants matched "{searchFor || selectedCategory}". Try selecting another category or location coordinates.
              </p>
              <button
                onClick={() => {
                  setSearchFor('');
                  setSelectedCategory('All');
                  setSelectedFilter('all');
                }}
                className="px-5 py-2.5 bg-slate-900 text-white font-bold text-xs rounded-xl hover:bg-slate-800 transition-colors"
              >
                Reset All Filters
              </button>
            </div>
          ) : (
            <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-6">
              {displayedRestaurants.map((res) => (
                <RestaurantCard
                  key={res.restaurantId}
                  restaurant={res}
                  onOpenMenu={(restaurant) => setActiveRestaurant(restaurant)}
                />
              ))}
            </div>
          )}
        </section>

      </main>

      {/* Footer */}
      <footer className="mt-16 bg-white border-t border-slate-200/80 py-8">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 flex flex-col sm:flex-row items-center justify-between gap-4 text-xs font-medium text-slate-500">
          <div className="flex items-center gap-2">
            <span className="font-extrabold text-slate-900">QEats Food Delivery</span>
            <span>•</span>
            <span>Spring Boot REST API</span>
          </div>
          <div className="flex items-center gap-4">
            <button
              onClick={() => setIsStatusModalOpen(true)}
              className="hover:text-rose-600 transition-colors font-bold text-slate-700"
            >
              API Gateway Status
            </button>
            <span>•</span>
            <span>Latitude {latitude.toFixed(3)}, Longitude {longitude.toFixed(3)}</span>
          </div>
        </div>
      </footer>

      {/* Modals & Slide-over Drawers */}
      <LocationModal
        isOpen={isLocationModalOpen}
        onClose={() => setIsLocationModalOpen(false)}
        currentLat={latitude}
        currentLng={longitude}
        onSelectLocation={handleLocationSelect}
      />

      <MenuModal
        restaurant={activeRestaurant}
        isOpen={!!activeRestaurant}
        onClose={() => setActiveRestaurant(null)}
        cart={cart}
        onUpdateCartItem={handleUpdateCartItem}
        onOpenCart={() => setIsCartDrawerOpen(true)}
      />

      <CartDrawer
        isOpen={isCartDrawerOpen}
        onClose={() => setIsCartDrawerOpen(false)}
        cart={cart}
        onUpdateCartItem={handleUpdateCartItem}
        onClearCart={handleClearCart}
        onProceedToCheckout={() => setIsCheckoutModalOpen(true)}
        deliveryAddress={currentLocationName}
      />

      <CheckoutModal
        isOpen={isCheckoutModalOpen}
        onClose={() => setIsCheckoutModalOpen(false)}
        cart={cart}
        deliveryAddress={currentLocationName}
        latitude={latitude}
        longitude={longitude}
        onOrderSuccess={handleOrderSuccess}
      />

      <OrderTrackerModal
        isOpen={isOrdersModalOpen}
        onClose={() => setIsOrdersModalOpen(false)}
        activeOrder={activeOrder}
      />

      <BackendStatusModal
        isOpen={isStatusModalOpen}
        onClose={() => setIsStatusModalOpen(false)}
      />

    </div>
  );
}

export default App;
