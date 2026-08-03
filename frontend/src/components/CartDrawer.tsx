import React, { useState } from 'react';
import { X, Trash2, Plus, Minus, ShoppingBag, Tag, ArrowRight, ShieldCheck, MapPin } from 'lucide-react';
import { Cart, MenuItem } from '../types';

interface CartDrawerProps {
  isOpen: boolean;
  onClose: () => void;
  cart: Cart;
  onUpdateCartItem: (restaurantId: string, item: MenuItem, delta: number) => void;
  onClearCart: () => void;
  onProceedToCheckout: () => void;
  deliveryAddress: string;
}

export const CartDrawer: React.FC<CartDrawerProps> = ({
  isOpen,
  onClose,
  cart,
  onUpdateCartItem,
  onClearCart,
  onProceedToCheckout,
  deliveryAddress,
}) => {
  const [promoCode, setPromoCode] = useState('');
  const [discount, setDiscount] = useState(0);
  const [promoApplied, setPromoApplied] = useState(false);

  if (!isOpen) return null;

  const handleApplyPromo = (e: React.FormEvent) => {
    e.preventDefault();
    if (promoCode.toUpperCase() === 'QEATS20' || promoCode.toUpperCase() === 'WELCOME50') {
      const disc = promoCode.toUpperCase() === 'QEATS20' ? Math.round(cart.total * 0.2) : 50;
      setDiscount(disc);
      setPromoApplied(true);
    } else {
      alert('Invalid promo code. Try QEATS20 or WELCOME50');
    }
  };

  const deliveryFee = cart.total > 500 || cart.total === 0 ? 0 : 35;
  const taxesAndCharges = Math.round(cart.total * 0.05);
  const finalTotal = Math.max(0, cart.total + deliveryFee + taxesAndCharges - discount);

  return (
    <div className="fixed inset-0 z-50 overflow-hidden animate-fade-in">
      <div className="absolute inset-0 bg-slate-900/60 backdrop-blur-sm" onClick={onClose} />

      <div className="fixed inset-y-0 right-0 max-w-full flex pl-10">
        <div className="w-screen max-w-md bg-white shadow-2xl flex flex-col border-l border-slate-100">
          
          {/* Header */}
          <div className="p-5 border-b border-slate-100 flex items-center justify-between bg-slate-50/50">
            <div className="flex items-center gap-3">
              <div className="w-10 h-10 rounded-2xl bg-rose-100 text-rose-600 flex items-center justify-center font-bold">
                <ShoppingBag className="w-5 h-5" />
              </div>
              <div>
                <h3 className="font-extrabold text-lg text-slate-900">Your Cart</h3>
                <p className="text-xs text-slate-500 font-medium">QEats Express Order Summary</p>
              </div>
            </div>

            <div className="flex items-center gap-2">
              {cart.items.length > 0 && (
                <button
                  onClick={onClearCart}
                  className="p-2 text-slate-400 hover:text-rose-600 hover:bg-rose-50 rounded-xl transition-colors text-xs font-semibold flex items-center gap-1"
                  title="Clear Cart"
                >
                  <Trash2 className="w-4 h-4" />
                </button>
              )}
              <button
                onClick={onClose}
                className="p-2 text-slate-400 hover:text-slate-600 hover:bg-slate-100 rounded-xl transition-colors"
              >
                <X className="w-5 h-5" />
              </button>
            </div>
          </div>

          {/* Cart Content */}
          <div className="flex-1 overflow-y-auto p-6 space-y-6">

            {cart.items.length === 0 ? (
              <div className="py-20 text-center space-y-3">
                <div className="w-16 h-16 rounded-full bg-rose-50 text-rose-500 flex items-center justify-center mx-auto">
                  <ShoppingBag className="w-8 h-8" />
                </div>
                <h4 className="font-extrabold text-lg text-slate-800">Your cart is empty</h4>
                <p className="text-xs text-slate-500 max-w-xs mx-auto">
                  Browse nearby restaurants and add delicious dishes to your order.
                </p>
              </div>
            ) : (
              <>
                {/* Delivery Address Banner */}
                <div className="p-3.5 bg-slate-50 border border-slate-200/80 rounded-2xl flex items-center gap-3">
                  <MapPin className="w-4 h-4 text-rose-500 shrink-0" />
                  <div className="flex-1 min-w-0">
                    <p className="text-[10px] uppercase font-extrabold tracking-wider text-slate-400">Delivering To</p>
                    <p className="text-xs font-bold text-slate-800 truncate">{deliveryAddress}</p>
                  </div>
                </div>

                {/* Cart Items List */}
                <div className="space-y-4 divide-y divide-slate-100">
                  {cart.items.map((item) => (
                    <div key={item.id} className="pt-3 first:pt-0 flex items-center justify-between gap-3">
                      <div className="flex-1">
                        <p className="font-bold text-sm text-slate-900">{item.name}</p>
                        <p className="text-xs font-extrabold text-slate-600 mt-0.5">
                          ₹{item.price} × {item.quantity} = ₹{item.price * item.quantity}
                        </p>
                      </div>

                      <div className="flex items-center gap-2 px-2.5 py-1 bg-slate-100 text-slate-800 rounded-xl font-bold text-xs">
                        <button
                          onClick={() => onUpdateCartItem(cart.restaurantId!, item as any, -1)}
                          className="p-1 hover:bg-slate-200 rounded transition-colors text-slate-600"
                        >
                          <Minus className="w-3.5 h-3.5" />
                        </button>
                        <span className="w-4 text-center">{item.quantity}</span>
                        <button
                          onClick={() => onUpdateCartItem(cart.restaurantId!, item as any, 1)}
                          className="p-1 hover:bg-slate-200 rounded transition-colors text-slate-600"
                        >
                          <Plus className="w-3.5 h-3.5" />
                        </button>
                      </div>
                    </div>
                  ))}
                </div>

                {/* Promo Code Form */}
                <form onSubmit={handleApplyPromo} className="pt-4 border-t border-slate-100">
                  <label className="block text-xs font-bold text-slate-600 mb-1.5 flex items-center gap-1">
                    <Tag className="w-3.5 h-3.5 text-rose-500" />
                    <span>Apply Promo Code</span>
                  </label>
                  <div className="flex gap-2">
                    <input
                      type="text"
                      value={promoCode}
                      onChange={(e) => setPromoCode(e.target.value)}
                      placeholder="Try QEATS20 or WELCOME50"
                      className="flex-1 px-3 py-2 border border-slate-200 rounded-xl text-xs font-semibold uppercase focus:outline-none focus:ring-2 focus:ring-rose-500/20"
                    />
                    <button
                      type="submit"
                      className="px-4 py-2 bg-slate-900 text-white rounded-xl text-xs font-bold hover:bg-slate-800 transition-colors"
                    >
                      Apply
                    </button>
                  </div>
                  {promoApplied && (
                    <p className="text-[11px] font-bold text-emerald-600 mt-1.5">
                      ✓ Promo code applied! You saved ₹{discount}
                    </p>
                  )}
                </form>

                {/* Bill Breakdown */}
                <div className="pt-4 border-t border-slate-100 space-y-2 text-xs font-medium text-slate-600">
                  <div className="flex justify-between">
                    <span>Item Subtotal</span>
                    <span className="font-bold text-slate-800">₹{cart.total}</span>
                  </div>
                  <div className="flex justify-between">
                    <span>Delivery Partner Fee</span>
                    <span className="font-bold text-slate-800">
                      {deliveryFee === 0 ? <span className="text-emerald-600 uppercase font-extrabold">FREE</span> : `₹${deliveryFee}`}
                    </span>
                  </div>
                  <div className="flex justify-between">
                    <span>GST & Restaurant Charges (5%)</span>
                    <span className="font-bold text-slate-800">₹{taxesAndCharges}</span>
                  </div>
                  {discount > 0 && (
                    <div className="flex justify-between text-emerald-600 font-bold">
                      <span>Promo Discount</span>
                      <span>-₹{discount}</span>
                    </div>
                  )}

                  <div className="pt-3 border-t border-slate-200 flex justify-between text-base font-black text-slate-900">
                    <span>To Pay</span>
                    <span className="text-rose-600">₹{finalTotal}</span>
                  </div>
                </div>

                <div className="p-3 bg-emerald-50 border border-emerald-200/80 rounded-2xl flex items-center gap-2 text-xs font-semibold text-emerald-900">
                  <ShieldCheck className="w-4 h-4 text-emerald-600 shrink-0" />
                  <span>Verified 100% Safe & Contactless Delivery</span>
                </div>
              </>
            )}

          </div>

          {/* Footer Proceed Button */}
          {cart.items.length > 0 && (
            <div className="p-5 border-t border-slate-100 bg-white">
              <button
                onClick={() => {
                  onClose();
                  onProceedToCheckout();
                }}
                className="w-full py-3.5 px-6 bg-rose-600 hover:bg-rose-700 text-white font-extrabold text-sm rounded-2xl shadow-lg shadow-rose-600/30 flex items-center justify-between transition-all active:scale-[0.98]"
              >
                <span>Proceed to Checkout</span>
                <div className="flex items-center gap-1.5">
                  <span className="font-black text-base">₹{finalTotal}</span>
                  <ArrowRight className="w-4 h-4" />
                </div>
              </button>
            </div>
          )}

        </div>
      </div>
    </div>
  );
};
