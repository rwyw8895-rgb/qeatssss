import express, { Request, Response } from 'express';
import cors from 'cors';
import path from 'path';
import fs from 'fs';
import { MongoClient, Collection } from 'mongodb';

const app = express();
const PORT = Number(process.env.PORT) || 3000;
const SPRING_BOOT_URL = process.env.SPRING_BOOT_URL || 'http://localhost:8081';
const MONGODB_URI = process.env.MONGODB_URI || 'mongodb://127.0.0.1:27017';
const MONGODB_DB = process.env.MONGODB_DB || 'restaurant-database';
const MONGODB_ORDERS_COLLECTION = 'orders';

app.use(cors());
app.use(express.json());

// In-memory Database for Cart
let cartState: {
  cartId: string;
  restaurantId: string | null;
  items: Array<{
    id: string;
    itemId: string;
    name: string;
    price: number;
    quantity: number;
    imageUrl?: string;
    attributes?: string[];
  }>;
  total: number;
} = {
  cartId: 'cart_default_123',
  restaurantId: null,
  items: [],
  total: 0,
};

let ordersCollection: Collection<any> | null = null;

const initialOrders = [
  {
    orderId: 'ORD-98421',
    restaurantId: '11',
    restaurantName: 'A2B Adyar Ananda Bhavan',
    items: [
      { id: '1', itemId: '1', name: 'Chicken Biryani / Veg Special', price: 225, quantity: 2, imageUrl: 'https://images.unsplash.com/photo-1563379091339-03b21ab4a4f8?w=500&auto=format&fit=crop&q=80' }
    ],
    totalAmount: 480,
    status: 'DELIVERED',
    createdAt: new Date(Date.now() - 86400000).toISOString(),
    deliveryAddress: 'Sector 1, HSR Layout, Bengaluru',
    etaMinutes: 0,
    latitude: 12.91,
    longitude: 77.63,
  }
];

// Rich Sample Data for Fallback & Mock Execution matching QEats Schema
const mockRestaurants = [
  {
    id: "10",
    restaurantId: "10",
    name: "A2B - Adyar Ananda Bhavan",
    city: "HSR Layout",
    imageUrl: "https://images.unsplash.com/photo-1610192244261-3f33de3f55e4?w=800&auto=format&fit=crop&q=80",
    latitude: 12.9116,
    longitude: 77.6389,
    opensAt: "07:00",
    closesAt: "23:00",
    rating: 4.5,
    attributes: ["South Indian", "Tamil", "Pure Veg", "Sweets"]
  },
  {
    id: "11",
    restaurantId: "11",
    name: "Empire Restaurant",
    city: "BTM Layout",
    imageUrl: "https://images.unsplash.com/photo-1563379091339-03b21ab4a4f8?w=800&auto=format&fit=crop&q=80",
    latitude: 12.9166,
    longitude: 77.6101,
    opensAt: "11:00",
    closesAt: "01:00",
    rating: 4.3,
    attributes: ["Biryani", "Mughlai", "Kebabs", "North Indian"]
  },
  {
    id: "12",
    restaurantId: "12",
    name: "Meghana Foods",
    city: "Koramangala",
    imageUrl: "https://images.unsplash.com/photo-1633945274405-b6c8069047b0?w=800&auto=format&fit=crop&q=80",
    latitude: 12.9352,
    longitude: 77.6245,
    opensAt: "11:30",
    closesAt: "22:30",
    rating: 4.8,
    attributes: ["Andhra", "Biryani", "Spicy", "Non-Veg"]
  },
  {
    id: "13",
    restaurantId: "13",
    name: "Corner House Ice Cream",
    city: "Indiranagar",
    imageUrl: "https://images.unsplash.com/photo-1563805042-7684c019e1cb?w=800&auto=format&fit=crop&q=80",
    latitude: 12.9784,
    longitude: 77.6408,
    opensAt: "11:00",
    closesAt: "23:30",
    rating: 4.9,
    attributes: ["Desserts", "Ice Cream", "Sundaes", "Fast Food"]
  },
  {
    id: "14",
    restaurantId: "14",
    name: "Truffles",
    city: "Koramangala 5th Block",
    imageUrl: "https://images.unsplash.com/photo-1568901346375-23c9450c58cd?w=800&auto=format&fit=crop&q=80",
    latitude: 12.9345,
    longitude: 77.6225,
    opensAt: "10:00",
    closesAt: "23:00",
    rating: 4.7,
    attributes: ["Burgers", "American", "Pasta", "Shakes"]
  },
  {
    id: "15",
    restaurantId: "15",
    name: "Toit Brewpub & Kitchen",
    city: "Indiranagar",
    imageUrl: "https://images.unsplash.com/photo-1555396273-367ea4eb4db5?w=800&auto=format&fit=crop&q=80",
    latitude: 12.9791,
    longitude: 77.6405,
    opensAt: "12:00",
    closesAt: "23:30",
    rating: 4.6,
    attributes: ["Continental", "Pizza", "Finger Food", "Italian"]
  },
  {
    id: "16",
    restaurantId: "16",
    name: "MTR - Mavalli Tiffin Room",
    city: "Shanthinagar",
    imageUrl: "https://images.unsplash.com/photo-1589301760014-d929f3979dbc?w=800&auto=format&fit=crop&q=80",
    latitude: 12.9565,
    longitude: 77.5925,
    opensAt: "06:30",
    closesAt: "21:30",
    rating: 4.8,
    attributes: ["South Indian", "Karnataka", "Heritage", "Pure Veg"]
  }
];

const mockMenus: Record<string, Array<any>> = {
  "10": [
    {
      id: "101",
      itemId: "101",
      name: "Masala Dosa",
      price: 95,
      imageUrl: "https://images.unsplash.com/photo-1668236543090-82eba5ee5976?w=500&auto=format&fit=crop&q=80",
      attributes: ["South Indian", "Pure Veg", "Crispy"],
      description: "Crispy rice crepe filled with spiced potato masala, served with coconut chutney and sambar.",
      isVeg: true
    },
    {
      id: "102",
      itemId: "102",
      name: "Idli Vada Combo",
      price: 80,
      imageUrl: "https://images.unsplash.com/photo-1589301760014-d929f3979dbc?w=500&auto=format&fit=crop&q=80",
      attributes: ["South Indian", "Breakfast"],
      description: "Steamed rice cakes and crispy medu vada served with freshly ground chutneys.",
      isVeg: true
    },
    {
      id: "103",
      itemId: "103",
      name: "Rava Onion Dosa",
      price: 110,
      imageUrl: "https://images.unsplash.com/photo-1668236543090-82eba5ee5976?w=500&auto=format&fit=crop&q=80",
      attributes: ["South Indian", "Crispy"],
      description: "Semolina crepe loaded with finely chopped onions, green chillies, and cumin.",
      isVeg: true
    },
    {
      id: "104",
      itemId: "104",
      name: "Special Mysore Pak",
      price: 160,
      imageUrl: "https://images.unsplash.com/photo-1599785209707-a456fc1337cc?w=500&auto=format&fit=crop&q=80",
      attributes: ["Desserts", "Sweets"],
      description: "Melt-in-mouth traditional ghee Mysore Pak (250g box).",
      isVeg: true
    }
  ],
  "11": [
    {
      id: "111",
      itemId: "111",
      name: "Special Chicken Biryani",
      price: 260,
      imageUrl: "https://images.unsplash.com/photo-1563379091339-03b21ab4a4f8?w=500&auto=format&fit=crop&q=80",
      attributes: ["Biryani", "Non-Veg", "Mughlai"],
      description: "Fragrant basmati rice cooked with tender chicken pieces, aromatic spices, served with raita and salan.",
      isVeg: false
    },
    {
      id: "112",
      itemId: "112",
      name: "Empire Grill Chicken (Half)",
      price: 290,
      imageUrl: "https://images.unsplash.com/photo-1598515214211-89d3c73ae83b?w=500&auto=format&fit=crop&q=80",
      attributes: ["Kebabs", "Non-Veg"],
      description: "Charcoal grilled juicy chicken marinated in special Middle Eastern spices.",
      isVeg: false
    },
    {
      id: "113",
      itemId: "113",
      name: "Butter Chicken",
      price: 310,
      imageUrl: "https://images.unsplash.com/photo-1588166524941-3bf61a9c41db?w=500&auto=format&fit=crop&q=80",
      attributes: ["North Indian", "Curry"],
      description: "Rich and creamy tomato gravy with tender chicken tikka chunks.",
      isVeg: false
    },
    {
      id: "114",
      itemId: "114",
      name: "Butter Naan",
      price: 45,
      imageUrl: "https://images.unsplash.com/photo-1601050690597-df0568f70950?w=500&auto=format&fit=crop&q=80",
      attributes: ["Breads", "Pure Veg"],
      description: "Soft clay oven baked flatbread brushed with fresh butter.",
      isVeg: true
    }
  ],
  "12": [
    {
      id: "121",
      itemId: "121",
      name: "Meghana Special Chicken Biryani",
      price: 310,
      imageUrl: "https://images.unsplash.com/photo-1633945274405-b6c8069047b0?w=500&auto=format&fit=crop&q=80",
      attributes: ["Andhra", "Biryani", "Spicy"],
      description: "Signature boneless spicy chicken fry layered over fragrant ghee rice.",
      isVeg: false
    },
    {
      id: "122",
      itemId: "122",
      name: "Paneer Biryani",
      price: 270,
      imageUrl: "https://images.unsplash.com/photo-1642821373181-696a54913e93?w=500&auto=format&fit=crop&q=80",
      attributes: ["Andhra", "Veg Biryani"],
      description: "Cubes of marinated paneer tossed in Andhra spice blend and layered with biryani rice.",
      isVeg: true
    },
    {
      id: "123",
      itemId: "123",
      name: "Andhra Chilli Chicken",
      price: 295,
      imageUrl: "https://images.unsplash.com/photo-1567620832903-9fc6debc209f?w=500&auto=format&fit=crop&q=80",
      attributes: ["Starter", "Spicy"],
      description: "Tender chicken pieces sautéed with fiery green chillies and curry leaves.",
      isVeg: false
    }
  ],
  "13": [
    {
      id: "131",
      itemId: "131",
      name: "Death By Chocolate (DBC)",
      price: 280,
      imageUrl: "https://images.unsplash.com/photo-1563805042-7684c019e1cb?w=500&auto=format&fit=crop&q=80",
      attributes: ["Desserts", "Chocolate", "Bestseller"],
      description: "Legendary sundae layered with chocolate cake, vanilla ice cream, hot fudge sauce, cherries, and roasted peanuts.",
      isVeg: true
    },
    {
      id: "132",
      itemId: "132",
      name: "Hot Fudge Nut Sundae",
      price: 210,
      imageUrl: "https://images.unsplash.com/photo-1570197788417-0e82375c9371?w=500&auto=format&fit=crop&q=80",
      attributes: ["Desserts", "Nuts"],
      description: "Triple scoops of vanilla topped with warm thick chocolate fudge and toasted cashews.",
      isVeg: true
    }
  ],
  "14": [
    {
      id: "141",
      itemId: "141",
      name: "Lamb Cheese Burger",
      price: 260,
      imageUrl: "https://images.unsplash.com/photo-1568901346375-23c9450c58cd?w=500&auto=format&fit=crop&q=80",
      attributes: ["Burgers", "Non-Veg"],
      description: "Juicy lamb patty with melted cheddar, caramelized onions, pickles, and signature Truffles sauce.",
      isVeg: false
    },
    {
      id: "142",
      itemId: "142",
      name: "Crispy Cottage Cheese Burger",
      price: 210,
      imageUrl: "https://images.unsplash.com/photo-1550547660-d9450f859349?w=500&auto=format&fit=crop&q=80",
      attributes: ["Burgers", "Pure Veg"],
      description: "Spiced panko-crusted paneer slab with spicy mayo and lettuce.",
      isVeg: true
    }
  ],
  "15": [
    {
      id: "151",
      itemId: "151",
      name: "Woodfired Margherita Pizza",
      price: 390,
      imageUrl: "https://images.unsplash.com/photo-1513104890138-7c749659a591?w=500&auto=format&fit=crop&q=80",
      attributes: ["Pizza", "Italian"],
      description: "San Marzano tomato sauce, fresh buffalo mozzarella, and basil leaves.",
      isVeg: true
    }
  ],
  "16": [
    {
      id: "161",
      itemId: "161",
      name: "MTR Rava Dosa",
      price: 110,
      imageUrl: "https://images.unsplash.com/photo-1668236543090-82eba5ee5976?w=500&auto=format&fit=crop&q=80",
      attributes: ["South Indian", "Heritage"],
      description: "Heritage golden crisp semolina dosa cooked in pure ghee.",
      isVeg: true
    }
  ]
};

// Haversine distance formula in KM
function getHaversineDistance(lat1: number, lon1: number, lat2: number, lon2: number): number {
  const R = 6371; // Earth radius in km
  const dLat = ((lat2 - lat1) * Math.PI) / 180;
  const dLon = ((lon2 - lon1) * Math.PI) / 180;
  const a =
    Math.sin(dLat / 2) * Math.sin(dLat / 2) +
    Math.cos((lat1 * Math.PI) / 180) *
      Math.cos((lat2 * Math.PI) / 180) *
      Math.sin(dLon / 2) *
      Math.sin(dLon / 2);
  const c = 2 * Math.atan2(Math.sqrt(a), Math.sqrt(1 - a));
  return Math.round(R * c * 10) / 10;
}

// Check Peak Hours (8-10 AM, 1-2 PM, 7-9 PM)
function isPeakHour(time = new Date()): { peak: boolean; radius: number } {
  const h = time.getHours();
  const m = time.getMinutes();
  const isPeak =
    (h >= 8 && h <= 9) ||
    (h === 10 && m === 0) ||
    h === 13 ||
    (h === 14 && m === 0) ||
    (h >= 19 && h <= 20) ||
    (h === 21 && m === 0);

  return {
    peak: isPeak,
    radius: isPeak ? 3.0 : 5.0,
  };
}

// Status check route
app.get('/qeats/v1/status', async (req: Request, res: Response) => {
  let springBootActive = false;
  try {
    const controller = new AbortController();
    const id = setTimeout(() => controller.abort(), 1000);
    const response = await fetch(`${SPRING_BOOT_URL}/qeats/v1/restaurants?latitude=12.91&longitude=77.63`, {
      signal: controller.signal
    });
    clearTimeout(id);
    if (response.ok) springBootActive = true;
  } catch (err) {
    springBootActive = false;
  }

  const { peak, radius } = isPeakHour();
  res.json({
    status: 'ONLINE',
    service: 'QEats Spring Boot & Express API Gateway',
    springBootBackendUrl: SPRING_BOOT_URL,
    springBootConnected: springBootActive,
    peakHours: peak,
    servingRadiusKm: radius,
    time: new Date().toISOString()
  });
});

// RESTAURANTS API ENDPOINT
app.get('/qeats/v1/restaurants', async (req: Request, res: Response) => {
  const latitudeStr = req.query.latitude as string;
  const longitudeStr = req.query.longitude as string;
  const searchFor = (req.query.searchFor as string || '').toLowerCase().trim();

  if (!latitudeStr || !longitudeStr) {
    return res.status(400).json({ error: 'latitude and longitude query parameters are required' });
  }

  const latitude = parseFloat(latitudeStr);
  const longitude = parseFloat(longitudeStr);

  if (isNaN(latitude) || isNaN(longitude) || latitude < -90 || latitude > 90 || longitude < -180 || longitude > 180) {
    return res.status(400).json({ error: 'Invalid latitude or longitude range' });
  }

  // Attempt proxy to Java Spring Boot backend if running
  try {
    const controller = new AbortController();
    const timeoutId = setTimeout(() => controller.abort(), 1500);
    const targetUrl = new URL(`${SPRING_BOOT_URL}/qeats/v1/restaurants`);
    targetUrl.searchParams.append('latitude', String(latitude));
    targetUrl.searchParams.append('longitude', String(longitude));
    if (searchFor) targetUrl.searchParams.append('searchFor', searchFor);

    const sbResponse = await fetch(targetUrl.toString(), { signal: controller.signal });
    clearTimeout(timeoutId);

    if (sbResponse.ok) {
      const data = await sbResponse.json();
      console.log('[QEats Gateway] Successfully fetched from Spring Boot backend');
      return res.json(data);
    }
  } catch (err) {
    // Fallback to local high-fidelity dataset
  }

  const { radius } = isPeakHour();

  // Filter restaurants by distance & search term
  const filtered = mockRestaurants.filter((res) => {
    const distance = getHaversineDistance(latitude, longitude, res.latitude, res.longitude);
    const withinRadius = distance <= (radius + 15); // Allow generous radius for demo locations if needed

    if (!searchFor) return true;

    // Search matching: name, city, attributes, or dishes in menu
    const nameMatch = res.name.toLowerCase().includes(searchFor);
    const cityMatch = res.city.toLowerCase().includes(searchFor);
    const attrMatch = res.attributes.some(a => a.toLowerCase().includes(searchFor));
    const menuItems = mockMenus[res.restaurantId] || [];
    const dishMatch = menuItems.some(i => i.name.toLowerCase().includes(searchFor) || i.attributes.some((a: string) => a.toLowerCase().includes(searchFor)));

    return nameMatch || cityMatch || attrMatch || dishMatch;
  }).map(r => ({
    ...r,
    distanceKm: getHaversineDistance(latitude, longitude, r.latitude, r.longitude)
  }));

  res.json({
    restaurants: filtered
  });
});

// MENU API ENDPOINT
app.get('/qeats/v1/menu', async (req: Request, res: Response) => {
  const restaurantId = req.query.restaurantId as string;

  if (!restaurantId) {
    return res.status(400).json({ error: 'restaurantId is required' });
  }

  // Try Spring Boot proxy
  try {
    const controller = new AbortController();
    const timeoutId = setTimeout(() => controller.abort(), 1500);
    const sbResponse = await fetch(`${SPRING_BOOT_URL}/qeats/v1/menu?restaurantId=${restaurantId}`, { signal: controller.signal });
    clearTimeout(timeoutId);

    if (sbResponse.ok) {
      const data = await sbResponse.json();
      return res.json(data);
    }
  } catch (e) {
    // Fallback
  }

  const items = mockMenus[restaurantId] || mockMenus["10"];

  res.json({
    menu: {
      restaurantId,
      items
    }
  });
});

// CART API ENDPOINTS
app.get('/qeats/v1/cart', (req: Request, res: Response) => {
  res.json({ cart: cartState });
});

app.post('/qeats/v1/cart/item', (req: Request, res: Response) => {
  const { restaurantId, item, quantityDelta = 1 } = req.body;

  if (!item || !item.id) {
    return res.status(400).json({ error: 'Item details are required' });
  }

  // If adding item from a different restaurant, reset cart
  if (cartState.restaurantId && cartState.restaurantId !== restaurantId) {
    cartState.items = [];
    cartState.restaurantId = restaurantId;
  } else if (!cartState.restaurantId) {
    cartState.restaurantId = restaurantId;
  }

  const existingIndex = cartState.items.findIndex(i => i.id === item.id);
  if (existingIndex > -1) {
    cartState.items[existingIndex].quantity += quantityDelta;
    if (cartState.items[existingIndex].quantity <= 0) {
      cartState.items.splice(existingIndex, 1);
    }
  } else if (quantityDelta > 0) {
    cartState.items.push({
      id: item.id,
      itemId: item.itemId || item.id,
      name: item.name,
      price: Number(item.price),
      quantity: quantityDelta,
      imageUrl: item.imageUrl,
      attributes: item.attributes || []
    });
  }

  if (cartState.items.length === 0) {
    cartState.restaurantId = null;
  }

  cartState.total = cartState.items.reduce((sum, i) => sum + i.price * i.quantity, 0);

  res.json({ cart: cartState });
});

app.delete('/qeats/v1/cart/clear', (req: Request, res: Response) => {
  cartState = {
    cartId: 'cart_default_123',
    restaurantId: null,
    items: [],
    total: 0
  };
  res.json({ message: 'Cart cleared successfully', cart: cartState });
});

// ORDER API ENDPOINTS
app.post('/qeats/v1/order', async (req: Request, res: Response) => {
  const { restaurantId, restaurantName, items, totalAmount, deliveryAddress, latitude, longitude } = req.body;

  if (!items || items.length === 0) {
    return res.status(400).json({ error: 'Order must contain at least one item' });
  }

  if (!ordersCollection) {
    return res.status(500).json({ error: 'Order storage is not available' });
  }

  const newOrder = {
    orderId: `ORD-${Math.floor(100000 + Math.random() * 900000)}`,
    restaurantId: restaurantId || '10',
    restaurantName: restaurantName || 'QEats Restaurant',
    items,
    totalAmount: totalAmount || cartState.total + 40,
    status: 'PLACED' as const,
    createdAt: new Date().toISOString(),
    deliveryAddress: deliveryAddress || 'HSR Layout, Sector 1, Bengaluru',
    etaMinutes: Math.floor(25 + Math.random() * 15),
    latitude: latitude || 12.91,
    longitude: longitude || 77.63
  };

  const result = await ordersCollection.insertOne(newOrder);
  const savedOrder = { ...newOrder, _id: result.insertedId };

  // Clear cart after placing order
  cartState = {
    cartId: 'cart_default_123',
    restaurantId: null,
    items: [],
    total: 0
  };

  res.status(201).json({
    message: 'Order placed successfully',
    order: savedOrder
  });
});

app.get('/qeats/v1/orders', async (req: Request, res: Response) => {
  if (!ordersCollection) {
    return res.status(500).json({ error: 'Order storage is not available' });
  }

  const orders = await ordersCollection.find().sort({ createdAt: -1 }).toArray();
  res.json({ orders });
});

async function initMongo() {
  const mongoClient = new MongoClient(MONGODB_URI);
  await mongoClient.connect();
  const db = mongoClient.db(MONGODB_DB);
  ordersCollection = db.collection(MONGODB_ORDERS_COLLECTION);

  const count = await ordersCollection.countDocuments();
  if (count === 0) {
    await ordersCollection.insertMany(initialOrders);
    console.log(`📦 Inserted ${initialOrders.length} initial order(s) into MongoDB`);
  }
}

async function startServer() {
  await initMongo();

  // Serve Vite App or Static Build
  if (process.env.NODE_ENV === 'production') {
    const distPath = path.join(process.cwd(), 'dist');
    app.use(express.static(distPath));
    app.get('*', (req: Request, res: Response) => {
      res.sendFile(path.join(distPath, 'index.html'));
    });
  } else {
    const { createServer: createViteServer } = await import('vite');
    const vite = await createViteServer({
      server: { middlewareMode: true },
      appType: 'spa',
    });
    app.use(vite.middlewares);
  }

  app.listen(PORT, '0.0.0.0', () => {
    console.log(`🚀 QEats App Gateway running on http://0.0.0.0:${PORT}`);
    console.log(`📡 Spring Boot target URL configured as: ${SPRING_BOOT_URL}`);
  });
}

startServer();
