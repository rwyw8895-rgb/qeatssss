export interface Restaurant {
  id: string;
  restaurantId: string;
  name: string;
  city: string;
  imageUrl: string;
  latitude: number;
  longitude: number;
  opensAt: string;
  closesAt: string;
  attributes: string[];
  rating?: number;
  distanceKm?: number;
}

export interface MenuItem {
  id: string;
  itemId: string;
  name: string;
  price: number | string;
  imageUrl?: string;
  attributes?: string[];
  description?: string;
  isVeg?: boolean;
}

export interface CartItem {
  id: string;
  itemId: string;
  name: string;
  price: number;
  quantity: number;
  imageUrl?: string;
  attributes?: string[];
}

export interface Cart {
  cartId: string;
  restaurantId: string | null;
  items: CartItem[];
  total: number;
}

export interface Order {
  orderId: string;
  restaurantId: string;
  restaurantName: string;
  items: CartItem[];
  totalAmount: number;
  status: 'PLACED' | 'PREPARING' | 'OUT_FOR_DELIVERY' | 'DELIVERED';
  createdAt: string;
  deliveryAddress: string;
  etaMinutes: number;
  latitude: number;
  longitude: number;
}

export interface LocationPreset {
  name: string;
  area: string;
  latitude: number;
  longitude: number;
}

export interface SystemStatus {
  status: string;
  service: string;
  springBootBackendUrl: string;
  springBootConnected: boolean;
  peakHours: boolean;
  servingRadiusKm: number;
  time: string;
}
