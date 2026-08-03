import React, { useState, useEffect } from 'react';
import { X, CheckCircle2, Clock, Bike, MapPin, PhoneCall, Sparkles, RefreshCw } from 'lucide-react';
import { Order } from '../types';
import { getOrders } from '../api';

interface OrderTrackerModalProps {
  isOpen: boolean;
  onClose: () => void;
  activeOrder: Order | null;
}

export const OrderTrackerModal: React.FC<OrderTrackerModalProps> = ({
  isOpen,
  onClose,
  activeOrder,
}) => {
  const [orders, setOrders] = useState<Order[]>([]);
  const [selectedOrder, setSelectedOrder] = useState<Order | null>(activeOrder);
  const [isLoading, setIsLoading] = useState(false);

  useEffect(() => {
    if (activeOrder) {
      setSelectedOrder(activeOrder);
    }
  }, [activeOrder]);

  useEffect(() => {
    if (isOpen) {
      fetchOrders();
    }
  }, [isOpen]);

  const fetchOrders = () => {
    setIsLoading(true);
    getOrders()
      .then((resOrders) => {
        setOrders(resOrders);
        if (!selectedOrder && resOrders.length > 0) {
          setSelectedOrder(resOrders[0]);
        }
        setIsLoading(false);
      })
      .catch(() => setIsLoading(false));
  };

  if (!isOpen) return null;

  const currentOrder = selectedOrder || activeOrder || (orders.length > 0 ? orders[0] : null);

  const STEPS = [
    { title: 'Order Confirmed', desc: 'QEats backend received your order', status: 'PLACED' },
    { title: 'Kitchen Preparing', desc: 'Chef is cooking your fresh meal', status: 'PREPARING' },
    { title: 'Out for Delivery', desc: 'Delivery partner picked up food', status: 'OUT_FOR_DELIVERY' },
    { title: 'Delivered', desc: 'Enjoy your delicious meal!', status: 'DELIVERED' },
  ];

  const getStepIndex = (status: string) => {
    switch (status) {
      case 'PLACED': return 1;
      case 'PREPARING': return 2;
      case 'OUT_FOR_DELIVERY': return 3;
      case 'DELIVERED': return 4;
      default: return 1;
    }
  };

  const currentStepIndex = currentOrder ? getStepIndex(currentOrder.status) : 1;

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center p-2 sm:p-4 bg-slate-900/70 backdrop-blur-sm animate-fade-in">
      <div className="bg-white rounded-3xl shadow-2xl w-full max-w-3xl h-[85vh] flex flex-col overflow-hidden border border-slate-100">
        
        {/* Modal Header */}
        <div className="p-5 border-b border-slate-100 flex items-center justify-between bg-slate-50/50">
          <div className="flex items-center gap-3">
            <div className="w-10 h-10 rounded-2xl bg-amber-100 text-amber-600 flex items-center justify-center font-bold">
              <Sparkles className="w-5 h-5" />
            </div>
            <div>
              <h3 className="font-extrabold text-xl text-slate-900">Order Tracking & History</h3>
              <p className="text-xs text-slate-500 font-medium">QEats Realtime Order Engine</p>
            </div>
          </div>

          <div className="flex items-center gap-2">
            <button
              onClick={fetchOrders}
              className="p-2 text-slate-400 hover:text-slate-600 hover:bg-slate-100 rounded-xl transition-colors"
              title="Refresh Orders"
            >
              <RefreshCw className={`w-4 h-4 ${isLoading ? 'animate-spin' : ''}`} />
            </button>
            <button
              onClick={onClose}
              className="p-2 text-slate-400 hover:text-slate-600 hover:bg-slate-100 rounded-xl transition-colors"
            >
              <X className="w-5 h-5" />
            </button>
          </div>
        </div>

        {/* Modal Layout */}
        <div className="flex-1 flex flex-col md:flex-row overflow-hidden">

          {/* Orders History Sidebar */}
          <div className="w-full md:w-72 bg-slate-50 border-r border-slate-100 overflow-y-auto p-4 space-y-3 shrink-0">
            <h4 className="text-xs font-bold uppercase tracking-wider text-slate-400 mb-2">Order History ({orders.length})</h4>
            
            {orders.map((ord) => {
              const isSelected = currentOrder?.orderId === ord.orderId;
              return (
                <button
                  key={ord.orderId}
                  onClick={() => setSelectedOrder(ord)}
                  className={`w-full text-left p-3.5 rounded-2xl border transition-all ${
                    isSelected
                      ? 'bg-white border-rose-500 shadow-md ring-2 ring-rose-500/10'
                      : 'bg-white/60 border-slate-200/80 hover:bg-white'
                  }`}
                >
                  <div className="flex items-center justify-between">
                    <span className="font-extrabold text-xs text-rose-600">{ord.orderId}</span>
                    <span className="text-[10px] font-bold px-2 py-0.5 rounded-full bg-slate-100 text-slate-700">
                      {ord.status}
                    </span>
                  </div>
                  <p className="font-bold text-sm text-slate-900 truncate mt-1">{ord.restaurantName}</p>
                  <div className="flex items-center justify-between mt-2 text-[11px] text-slate-500">
                    <span>{ord.items.length} items</span>
                    <span className="font-extrabold text-slate-900">₹{ord.totalAmount}</span>
                  </div>
                </button>
              );
            })}
          </div>

          {/* Order Details Panel */}
          <div className="flex-1 p-6 overflow-y-auto space-y-6">
            {currentOrder ? (
              <>
                {/* Active Status Banner */}
                <div className="p-5 rounded-2xl bg-gradient-to-r from-rose-600 to-rose-500 text-white shadow-lg shadow-rose-500/20">
                  <div className="flex items-center justify-between">
                    <div>
                      <p className="text-xs font-bold uppercase tracking-wider text-rose-200">
                        Status: {currentOrder.status}
                      </p>
                      <h3 className="text-2xl font-black mt-0.5">{currentOrder.restaurantName}</h3>
                      <p className="text-xs text-rose-100 font-medium mt-1 flex items-center gap-1">
                        <MapPin className="w-3.5 h-3.5" />
                        <span>{currentOrder.deliveryAddress}</span>
                      </p>
                    </div>

                    <div className="text-right bg-white/10 backdrop-blur-md p-3 rounded-2xl border border-white/20">
                      <p className="text-[10px] uppercase font-extrabold text-rose-200">Estimated Delivery</p>
                      <p className="text-2xl font-black">{currentOrder.etaMinutes || 25} mins</p>
                    </div>
                  </div>
                </div>

                {/* Progress Steps Timeline */}
                <div className="p-5 bg-slate-50 rounded-2xl border border-slate-200/80">
                  <h4 className="text-xs font-bold uppercase tracking-wider text-slate-400 mb-4">Delivery Progress</h4>
                  <div className="space-y-4">
                    {STEPS.map((step, idx) => {
                      const stepNum = idx + 1;
                      const isComplete = currentStepIndex >= stepNum;
                      const isCurrent = currentStepIndex === stepNum;

                      return (
                        <div key={step.title} className="flex items-start gap-3">
                          <div
                            className={`w-7 h-7 rounded-full flex items-center justify-center font-bold text-xs shrink-0 mt-0.5 ${
                              isComplete
                                ? 'bg-emerald-600 text-white shadow-sm'
                                : 'bg-slate-200 text-slate-500'
                            }`}
                          >
                            {isComplete ? <CheckCircle2 className="w-4 h-4" /> : stepNum}
                          </div>
                          <div>
                            <p className={`font-bold text-sm ${isCurrent ? 'text-rose-600' : 'text-slate-900'}`}>
                              {step.title}
                            </p>
                            <p className="text-xs text-slate-500 font-medium">{step.desc}</p>
                          </div>
                        </div>
                      );
                    })}
                  </div>
                </div>

                {/* Delivery Driver Info */}
                <div className="p-4 bg-slate-900 text-white rounded-2xl flex items-center justify-between">
                  <div className="flex items-center gap-3">
                    <div className="w-10 h-10 rounded-full bg-rose-600 flex items-center justify-center text-white">
                      <Bike className="w-5 h-5" />
                    </div>
                    <div>
                      <p className="font-bold text-sm">Ramesh Kumar (QEats Valet)</p>
                      <p className="text-xs text-slate-400 font-medium">Hero Splendor • KA 01 EQ 4821</p>
                    </div>
                  </div>
                  <button className="p-2.5 bg-white/10 hover:bg-white/20 text-white rounded-xl text-xs font-bold flex items-center gap-1.5 transition-colors">
                    <PhoneCall className="w-3.5 h-3.5 text-emerald-400" />
                    <span>Call Valet</span>
                  </button>
                </div>

                {/* Items Ordered List */}
                <div>
                  <h4 className="text-xs font-bold uppercase tracking-wider text-slate-400 mb-3">Items Ordered</h4>
                  <div className="space-y-2 border-t border-slate-100 pt-3">
                    {currentOrder.items.map((item) => (
                      <div key={item.id} className="flex items-center justify-between text-xs font-semibold text-slate-800">
                        <span>{item.quantity}× {item.name}</span>
                        <span>₹{item.price * item.quantity}</span>
                      </div>
                    ))}
                    <div className="flex items-center justify-between text-sm font-extrabold text-slate-900 pt-3 border-t border-slate-200">
                      <span>Total Paid</span>
                      <span className="text-rose-600">₹{currentOrder.totalAmount}</span>
                    </div>
                  </div>
                </div>
              </>
            ) : (
              <div className="py-20 text-center text-slate-400">
                <p className="font-bold text-base">No orders found</p>
              </div>
            )}
          </div>

        </div>

      </div>
    </div>
  );
};
