import React, { useState, useEffect } from 'react';
import { X, Search, Plus, Minus, Star, MapPin, Clock, Leaf, ShoppingBag, Check } from 'lucide-react';
import { Restaurant, MenuItem, Cart } from '../types';
import { getMenu } from '../api';

interface MenuModalProps {
  restaurant: Restaurant | null;
  isOpen: boolean;
  onClose: () => void;
  cart: Cart;
  onUpdateCartItem: (restaurantId: string, item: MenuItem, delta: number) => void;
  onOpenCart: () => void;
}

export const MenuModal: React.FC<MenuModalProps> = ({
  restaurant,
  isOpen,
  onClose,
  cart,
  onUpdateCartItem,
  onOpenCart,
}) => {
  const [items, setItems] = useState<MenuItem[]>([]);
  const [isLoading, setIsLoading] = useState(false);
  const [menuSearch, setMenuSearch] = useState('');
  const [vegOnly, setVegOnly] = useState(false);

  useEffect(() => {
    if (restaurant && isOpen) {
      setIsLoading(true);
      getMenu(restaurant.restaurantId)
        .then((resItems) => {
          setItems(resItems);
          setIsLoading(false);
        })
        .catch(() => {
          setIsLoading(false);
        });
    }
  }, [restaurant, isOpen]);

  if (!isOpen || !restaurant) return null;

  const filteredItems = items.filter((item) => {
    const matchesSearch = item.name.toLowerCase().includes(menuSearch.toLowerCase()) ||
      (item.attributes && item.attributes.some(a => a.toLowerCase().includes(menuSearch.toLowerCase())));
    const matchesVeg = vegOnly ? (item.isVeg !== false) : true;
    return matchesSearch && matchesVeg;
  });

  const getCartQuantity = (itemId: string) => {
    if (cart.restaurantId !== restaurant.restaurantId) return 0;
    const found = cart.items.find(i => i.id === itemId || i.itemId === itemId);
    return found ? found.quantity : 0;
  };

  const totalCartCount = cart.restaurantId === restaurant.restaurantId
    ? cart.items.reduce((s, i) => s + i.quantity, 0)
    : 0;

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center p-2 sm:p-4 bg-slate-900/70 backdrop-blur-sm animate-fade-in">
      <div className="bg-white rounded-3xl shadow-2xl w-full max-w-4xl h-[90vh] flex flex-col overflow-hidden border border-slate-100">
        
        {/* Restaurant Cover Header */}
        <div className="relative bg-slate-900 text-white shrink-0">
          <div className="h-44 sm:h-52 w-full relative overflow-hidden">
            <img
              src={restaurant.imageUrl}
              alt={restaurant.name}
              className="w-full h-full object-cover opacity-40 scale-105"
            />
            <div className="absolute inset-0 bg-gradient-to-t from-slate-950 via-slate-950/40 to-transparent" />
          </div>

          <button
            onClick={onClose}
            className="absolute top-4 right-4 z-10 p-2.5 rounded-full bg-slate-900/80 hover:bg-slate-900 text-white backdrop-blur-md transition-colors"
          >
            <X className="w-5 h-5" />
          </button>

          <div className="absolute bottom-4 left-6 right-6">
            <div className="flex flex-wrap items-center gap-2 mb-2">
              <span className="bg-emerald-600 text-white text-xs font-bold px-2.5 py-0.5 rounded-lg flex items-center gap-1">
                <Star className="w-3 h-3 fill-current" />
                <span>{restaurant.rating || 4.5}</span>
              </span>
              {restaurant.attributes.map(a => (
                <span key={a} className="bg-white/20 backdrop-blur-md text-white text-[11px] font-medium px-2 py-0.5 rounded-lg">
                  {a}
                </span>
              ))}
            </div>

            <h2 className="text-2xl sm:text-3xl font-black text-white">{restaurant.name}</h2>
            <p className="text-xs sm:text-sm text-slate-300 font-medium flex items-center gap-2 mt-1">
              <MapPin className="w-4 h-4 text-rose-400" />
              <span>{restaurant.city}</span>
              <span>•</span>
              <Clock className="w-4 h-4 text-amber-400" />
              <span>Open {restaurant.opensAt} - {restaurant.closesAt}</span>
            </p>
          </div>
        </div>

        {/* Menu Search & Filter Toolbar */}
        <div className="p-4 bg-slate-50 border-b border-slate-200/80 flex flex-col sm:flex-row items-center gap-3 shrink-0">
          <div className="relative flex-1 w-full">
            <Search className="absolute left-3.5 top-1/2 -translate-y-1/2 w-4 h-4 text-slate-400" />
            <input
              type="text"
              value={menuSearch}
              onChange={(e) => setMenuSearch(e.target.value)}
              placeholder="Search menu items..."
              className="w-full pl-10 pr-4 py-2 bg-white border border-slate-200 rounded-xl text-sm font-medium focus:outline-none focus:ring-2 focus:ring-rose-500/20"
            />
          </div>

          <button
            onClick={() => setVegOnly(!vegOnly)}
            className={`w-full sm:w-auto flex items-center justify-center gap-2 px-4 py-2 rounded-xl text-xs font-bold border transition-colors ${
              vegOnly
                ? 'bg-emerald-600 text-white border-emerald-600'
                : 'bg-white text-slate-700 border-slate-200 hover:bg-slate-100'
            }`}
          >
            <Leaf className={`w-3.5 h-3.5 ${vegOnly ? 'text-white' : 'text-emerald-500'}`} />
            <span>Pure Veg Only</span>
          </button>
        </div>

        {/* Menu List Area */}
        <div className="flex-1 overflow-y-auto p-4 sm:p-6 space-y-4 divide-y divide-slate-100">
          {isLoading ? (
            <div className="py-20 text-center">
              <div className="w-10 h-10 border-4 border-rose-500 border-t-transparent rounded-full animate-spin mx-auto mb-3" />
              <p className="text-sm font-bold text-slate-600">Loading QEats Menu...</p>
            </div>
          ) : filteredItems.length === 0 ? (
            <div className="py-16 text-center text-slate-400">
              <p className="font-bold text-base">No items match your search filter</p>
              <p className="text-xs mt-1">Try searching for a different dish name</p>
            </div>
          ) : (
            filteredItems.map((item) => {
              const qty = getCartQuantity(item.id);

              return (
                <div key={item.id} className="pt-4 first:pt-0 flex items-start justify-between gap-4">
                  <div className="flex-1">
                    <div className="flex items-center gap-2 mb-1">
                      {item.isVeg !== false ? (
                        <span className="w-4 h-4 border-2 border-emerald-600 flex items-center justify-center p-0.5 rounded-sm">
                          <span className="w-2 h-2 rounded-full bg-emerald-600" />
                        </span>
                      ) : (
                        <span className="w-4 h-4 border-2 border-rose-600 flex items-center justify-center p-0.5 rounded-sm">
                          <span className="w-2 h-2 rounded-full bg-rose-600" />
                        </span>
                      )}
                      {item.attributes?.map(a => (
                        <span key={a} className="text-[10px] uppercase tracking-wider font-extrabold bg-slate-100 text-slate-600 px-2 py-0.5 rounded">
                          {a}
                        </span>
                      ))}
                    </div>

                    <h4 className="font-bold text-base text-slate-900">{item.name}</h4>
                    <p className="font-extrabold text-sm text-slate-800 mt-1">₹{item.price}</p>
                    {item.description && (
                      <p className="text-xs text-slate-500 mt-1 line-clamp-2 leading-relaxed">{item.description}</p>
                    )}
                  </div>

                  {/* Image & Quantity Add Button */}
                  <div className="relative shrink-0 flex flex-col items-center">
                    <div className="w-24 h-24 sm:w-28 sm:h-28 rounded-2xl overflow-hidden bg-slate-100 border border-slate-200/80">
                      <img
                        src={item.imageUrl || restaurant.imageUrl}
                        alt={item.name}
                        className="w-full h-full object-cover"
                        onError={(e) => {
                          (e.target as HTMLImageElement).src = 'https://images.unsplash.com/photo-1546069901-ba9599a7e63c?w=500&auto=format&fit=crop&q=80';
                        }}
                      />
                    </div>

                    <div className="-mt-4 z-10">
                      {qty === 0 ? (
                        <button
                          onClick={() => onUpdateCartItem(restaurant.restaurantId, item, 1)}
                          className="px-6 py-2 rounded-xl bg-white text-rose-600 font-extrabold text-xs shadow-md border border-rose-200 hover:bg-rose-50 transition-colors uppercase tracking-wider"
                        >
                          ADD
                        </button>
                      ) : (
                        <div className="flex items-center gap-2 px-3 py-1.5 bg-rose-600 text-white rounded-xl shadow-md font-bold text-xs">
                          <button
                            onClick={() => onUpdateCartItem(restaurant.restaurantId, item, -1)}
                            className="p-1 hover:bg-rose-700 rounded transition-colors"
                          >
                            <Minus className="w-3.5 h-3.5" />
                          </button>
                          <span className="w-4 text-center font-extrabold text-sm">{qty}</span>
                          <button
                            onClick={() => onUpdateCartItem(restaurant.restaurantId, item, 1)}
                            className="p-1 hover:bg-rose-700 rounded transition-colors"
                          >
                            <Plus className="w-3.5 h-3.5" />
                          </button>
                        </div>
                      )}
                    </div>
                  </div>
                </div>
              );
            })
          )}
        </div>

        {/* Modal Sticky Bottom Bar */}
        {totalCartCount > 0 && (
          <div className="p-4 bg-slate-900 text-white border-t border-slate-800 flex items-center justify-between shrink-0">
            <div>
              <p className="text-xs font-semibold text-slate-400">{totalCartCount} Items added</p>
              <p className="text-lg font-black text-rose-400">₹{cart.total}</p>
            </div>
            <button
              onClick={() => {
                onClose();
                onOpenCart();
              }}
              className="flex items-center gap-2 px-6 py-3 rounded-2xl bg-rose-600 hover:bg-rose-500 text-white font-extrabold text-sm shadow-lg shadow-rose-600/30 transition-all"
            >
              <ShoppingBag className="w-4 h-4" />
              <span>View Cart & Checkout</span>
            </button>
          </div>
        )}

      </div>
    </div>
  );
};
