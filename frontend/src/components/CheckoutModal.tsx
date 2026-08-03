import React, { useState } from 'react';
import { X, MapPin, CreditCard, Wallet, Banknote, ShieldCheck, CheckCircle2 } from 'lucide-react';
import { Cart, Order } from '../types';
import { placeOrder } from '../api';

interface CheckoutModalProps {
  isOpen: boolean;
  onClose: () => void;
  cart: Cart;
  deliveryAddress: string;
  latitude: number;
  longitude: number;
  onOrderSuccess: (order: Order) => void;
}

export const CheckoutModal: React.FC<CheckoutModalProps> = ({
  isOpen,
  onClose,
  cart,
  deliveryAddress,
  latitude,
  longitude,
  onOrderSuccess,
}) => {
  const [address, setAddress] = useState(deliveryAddress || 'Sector 1, HSR Layout, Bengaluru');
  const [paymentMethod, setPaymentMethod] = useState<'UPI' | 'CARD' | 'COD'>('UPI');
  const [isPlacing, setIsPlacing] = useState(false);

  if (!isOpen) return null;

  const totalAmount = Math.round(cart.total + (cart.total > 500 ? 0 : 35) + cart.total * 0.05);

  const handleConfirmOrder = async (e: React.FormEvent) => {
    e.preventDefault();
    setIsPlacing(true);

    try {
      const order = await placeOrder({
        restaurantId: cart.restaurantId || '10',
        restaurantName: 'QEats Partner Restaurant',
        items: cart.items,
        totalAmount,
        deliveryAddress: address,
        latitude,
        longitude,
      });

      setIsPlacing(false);
      onOrderSuccess(order);
    } catch (err: any) {
      setIsPlacing(false);
      alert(err.message || 'Failed to place order. Please try again.');
    }
  };

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-slate-900/70 backdrop-blur-sm animate-fade-in">
      <div className="bg-white rounded-3xl shadow-2xl w-full max-w-lg border border-slate-100 overflow-hidden">
        
        {/* Header */}
        <div className="flex items-center justify-between p-5 border-b border-slate-100 bg-slate-50/50">
          <div>
            <h3 className="font-extrabold text-xl text-slate-900">Checkout</h3>
            <p className="text-xs text-slate-500 font-medium">QEats Express Delivery</p>
          </div>
          <button
            onClick={onClose}
            className="p-2 rounded-xl text-slate-400 hover:text-slate-600 hover:bg-slate-100 transition-colors"
          >
            <X className="w-5 h-5" />
          </button>
        </div>

        {/* Form Body */}
        <form onSubmit={handleConfirmOrder} className="p-6 space-y-6 max-h-[80vh] overflow-y-auto">
          
          {/* Address Section */}
          <div className="space-y-2">
            <label className="block text-xs font-bold uppercase tracking-wider text-slate-500 flex items-center gap-1.5">
              <MapPin className="w-4 h-4 text-rose-500" />
              <span>Delivery Address</span>
            </label>
            <textarea
              value={address}
              onChange={(e) => setAddress(e.target.value)}
              rows={2}
              required
              className="w-full p-3 border border-slate-200 rounded-xl text-sm font-medium focus:outline-none focus:ring-2 focus:ring-rose-500/20"
              placeholder="House/Flat No, Street Name, Area, Pincode"
            />
          </div>

          {/* Payment Method Selector */}
          <div className="space-y-3">
            <label className="block text-xs font-bold uppercase tracking-wider text-slate-500">
              Select Payment Method
            </label>

            <div className="grid grid-cols-3 gap-2.5">
              <button
                type="button"
                onClick={() => setPaymentMethod('UPI')}
                className={`p-3 rounded-2xl border text-center flex flex-col items-center gap-2 transition-all ${
                  paymentMethod === 'UPI'
                    ? 'bg-rose-50 border-rose-500 text-rose-900 shadow-sm'
                    : 'bg-slate-50 border-slate-200 hover:bg-slate-100 text-slate-700'
                }`}
              >
                <Wallet className="w-5 h-5 text-rose-600" />
                <span className="text-xs font-bold">BHIM / UPI</span>
              </button>

              <button
                type="button"
                onClick={() => setPaymentMethod('CARD')}
                className={`p-3 rounded-2xl border text-center flex flex-col items-center gap-2 transition-all ${
                  paymentMethod === 'CARD'
                    ? 'bg-rose-50 border-rose-500 text-rose-900 shadow-sm'
                    : 'bg-slate-50 border-slate-200 hover:bg-slate-100 text-slate-700'
                }`}
              >
                <CreditCard className="w-5 h-5 text-indigo-600" />
                <span className="text-xs font-bold">Card</span>
              </button>

              <button
                type="button"
                onClick={() => setPaymentMethod('COD')}
                className={`p-3 rounded-2xl border text-center flex flex-col items-center gap-2 transition-all ${
                  paymentMethod === 'COD'
                    ? 'bg-rose-50 border-rose-500 text-rose-900 shadow-sm'
                    : 'bg-slate-50 border-slate-200 hover:bg-slate-100 text-slate-700'
                }`}
              >
                <Banknote className="w-5 h-5 text-emerald-600" />
                <span className="text-xs font-bold">Cash</span>
              </button>
            </div>
          </div>

          {/* Order Summary Summary Box */}
          <div className="p-4 bg-slate-50 rounded-2xl border border-slate-200/80 space-y-2 text-xs font-medium text-slate-600">
            <div className="flex justify-between font-bold text-slate-800 text-sm pb-2 border-b border-slate-200">
              <span>Total Items</span>
              <span>{cart.items.reduce((s, i) => s + i.quantity, 0)} Items</span>
            </div>
            <div className="flex justify-between pt-1">
              <span>Subtotal</span>
              <span>₹{cart.total}</span>
            </div>
            <div className="flex justify-between text-base font-black text-slate-900 pt-2 border-t border-slate-200">
              <span>Grand Total</span>
              <span className="text-rose-600">₹{totalAmount}</span>
            </div>
          </div>

          {/* Action Submit */}
          <button
            type="submit"
            disabled={isPlacing}
            className="w-full py-4 px-6 bg-rose-600 hover:bg-rose-700 text-white font-extrabold text-sm rounded-2xl shadow-lg shadow-rose-600/30 flex items-center justify-center gap-2 transition-all active:scale-[0.98]"
          >
            {isPlacing ? (
              <div className="w-5 h-5 border-2 border-white border-t-transparent rounded-full animate-spin" />
            ) : (
              <>
                <CheckCircle2 className="w-5 h-5" />
                <span>Place Order • ₹{totalAmount}</span>
              </>
            )}
          </button>

        </form>

      </div>
    </div>
  );
};
