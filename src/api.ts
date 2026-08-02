import { Restaurant, MenuItem, Cart, Order, SystemStatus } from './types';

const API_BASE = '/qeats/v1';

export async function getSystemStatus(): Promise<SystemStatus> {
  const res = await fetch(`${API_BASE}/status`);
  if (!res.ok) throw new Error('Failed to fetch system status');
  return res.json();
}

export async function getRestaurants(
  latitude: number,
  longitude: number,
  searchFor?: string
): Promise<Restaurant[]> {
  const params = new URLSearchParams({
    latitude: latitude.toString(),
    longitude: longitude.toString(),
  });
  if (searchFor && searchFor.trim()) {
    params.append('searchFor', searchFor.trim());
  }

  const res = await fetch(`${API_BASE}/restaurants?${params.toString()}`);
  if (!res.ok) {
    const err = await res.json().catch(() => ({ error: 'Failed to fetch restaurants' }));
    throw new Error(err.error || 'Failed to fetch restaurants');
  }
  const data = await res.json();
  return data.restaurants || [];
}

export async function getMenu(restaurantId: string): Promise<MenuItem[]> {
  const res = await fetch(`${API_BASE}/menu?restaurantId=${encodeURIComponent(restaurantId)}`);
  if (!res.ok) {
    throw new Error('Failed to fetch restaurant menu');
  }
  const data = await res.json();
  return data.menu?.items || [];
}

export async function getCart(): Promise<Cart> {
  const res = await fetch(`${API_BASE}/cart`);
  if (!res.ok) throw new Error('Failed to fetch cart');
  const data = await res.json();
  return data.cart;
}

export async function updateCartItem(
  restaurantId: string,
  item: MenuItem,
  quantityDelta: number
): Promise<Cart> {
  const res = await fetch(`${API_BASE}/cart/item`, {
    method: 'POST',
    headers: { 'Content-Type': 'application/json' },
    body: JSON.stringify({ restaurantId, item, quantityDelta }),
  });
  if (!res.ok) throw new Error('Failed to update cart');
  const data = await res.json();
  return data.cart;
}

export async function clearCart(): Promise<Cart> {
  const res = await fetch(`${API_BASE}/cart/clear`, {
    method: 'DELETE',
  });
  if (!res.ok) throw new Error('Failed to clear cart');
  const data = await res.json();
  return data.cart;
}

export async function placeOrder(orderData: {
  restaurantId: string;
  restaurantName: string;
  items: any[];
  totalAmount: number;
  deliveryAddress: string;
  latitude: number;
  longitude: number;
}): Promise<Order> {
  const res = await fetch(`${API_BASE}/order`, {
    method: 'POST',
    headers: { 'Content-Type': 'application/json' },
    body: JSON.stringify(orderData),
  });
  if (!res.ok) {
    const err = await res.json().catch(() => ({ error: 'Failed to place order' }));
    throw new Error(err.error || 'Failed to place order');
  }
  const data = await res.json();
  return data.order;
}

export async function getOrders(): Promise<Order[]> {
  const res = await fetch(`${API_BASE}/orders`);
  if (!res.ok) throw new Error('Failed to fetch orders');
  const data = await res.json();
  return data.orders || [];
}
