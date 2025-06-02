
import React, { createContext, useContext, useState, useEffect } from 'react';

export interface Product {
  id: string;
  name: string;
  price: number;
  image: string;
  description: string;
  category: string;
  featured?: boolean;
  sizes?: string[];
  colors?: string[];
}

export interface Order {
  id: string;
  customerName: string;
  customerPhone: string;
  customerEmail?: string;
  customerAddress: string;
  items: Array<{
    id: string;
    name: string;
    price: number;
    quantity: number;
    size?: string;
    color?: string;
  }>;
  total: number;
  paymentMethod: string;
  momoNumber?: string;
  network?: string;
  paymentReference?: string;
  isPaid?: boolean;
  status: 'pending' | 'fulfilled';
  createdAt: string;
}

interface AdminState {
  products: Product[];
  orders: Order[];
  isAuthenticated: boolean;
  currency: string;
}

interface AdminContextType {
  state: AdminState;
  login: (password: string) => boolean;
  logout: () => void;
  addProduct: (product: Omit<Product, 'id'>) => void;
  updateProduct: (id: string, product: Partial<Product>) => void;
  deleteProduct: (id: string) => void;
  markOrderFulfilled: (id: string) => void;
  addOrder: (order: Omit<Order, 'id' | 'createdAt' | 'status'>) => void;
  updateCurrency: (currency: string) => void;
  handleImageUpload: (file: File) => Promise<string>;
}

const AdminContext = createContext<AdminContextType | null>(null);

const initialProducts: Product[] = [
  {
    id: '1',
    name: 'Modern Gray Armchair',
    price: 299.99,
    image: 'https://images.unsplash.com/photo-1506439773649-6e0eb8cfb237?auto=format&fit=crop&w=800&q=80',
    description: 'Comfortable modern armchair with soft gray upholstery. Perfect for any living room.',
    category: 'Furniture',
    featured: true,
    sizes: ['Small', 'Medium', 'Large'],
    colors: ['Gray', 'Beige', 'Navy']
  },
  {
    id: '2',
    name: 'Wooden Coffee Table',
    price: 189.99,
    image: 'https://images.unsplash.com/photo-1555041469-a586c61ea9bc?auto=format&fit=crop&w=800&q=80',
    description: 'Elegant wooden coffee table with clean lines and natural finish.',
    category: 'Furniture',
    featured: true,
    sizes: ['60cm', '80cm', '100cm'],
    colors: ['Natural Wood', 'Dark Walnut', 'White Oak']
  },
  {
    id: '3',
    name: 'Ceramic Table Lamp',
    price: 79.99,
    image: 'https://images.unsplash.com/photo-1507003211169-0a1dd7228f2d?auto=format&fit=crop&w=800&q=80',
    description: 'Beautiful ceramic table lamp with warm lighting.',
    category: 'Lighting',
    sizes: ['Small', 'Medium'],
    colors: ['White', 'Blue', 'Green']
  },
  {
    id: '4',
    name: 'Decorative Wall Art',
    price: 149.99,
    image: 'https://images.unsplash.com/photo-1541961017774-22349e4a1262?auto=format&fit=crop&w=800&q=80',
    description: 'Modern abstract wall art to enhance your space.',
    category: 'Decor',
    featured: true,
    sizes: ['30x40cm', '50x70cm', '70x100cm'],
    colors: ['Multi-color', 'Black & White', 'Blue Tones']
  },
  {
    id: '5',
    name: 'Velvet Throw Pillow',
    price: 34.99,
    image: 'https://images.unsplash.com/photo-1586023492125-27b2c045efd7?auto=format&fit=crop&w=800&q=80',
    description: 'Luxurious velvet throw pillow in rich colors.',
    category: 'Accessories',
    sizes: ['40x40cm', '50x50cm', '60x60cm'],
    colors: ['Burgundy', 'Navy', 'Emerald', 'Gold']
  },
  {
    id: '6',
    name: 'Scandinavian Dining Chair',
    price: 129.99,
    image: 'https://images.unsplash.com/photo-1549497538-303791108f95?auto=format&fit=crop&w=800&q=80',
    description: 'Minimalist dining chair with wooden legs and comfortable seat.',
    category: 'Furniture',
    sizes: ['Standard'],
    colors: ['White', 'Gray', 'Black', 'Natural']
  }
];

export const AdminProvider: React.FC<{ children: React.ReactNode }> = ({ children }) => {
  const [state, setState] = useState<AdminState>({
    products: [],
    orders: [],
    isAuthenticated: false,
    currency: 'GHS'
  });

  useEffect(() => {
    const savedProducts = localStorage.getItem('products');
    const savedOrders = localStorage.getItem('orders');
    const savedCurrency = localStorage.getItem('currency');
    
    setState({
      products: savedProducts ? JSON.parse(savedProducts) : initialProducts,
      orders: savedOrders ? JSON.parse(savedOrders) : [],
      isAuthenticated: localStorage.getItem('adminAuth') === 'true',
      currency: savedCurrency || 'GHS'
    });
  }, []);

  useEffect(() => {
    localStorage.setItem('products', JSON.stringify(state.products));
  }, [state.products]);

  useEffect(() => {
    localStorage.setItem('orders', JSON.stringify(state.orders));
  }, [state.orders]);

  useEffect(() => {
    localStorage.setItem('currency', state.currency);
  }, [state.currency]);

  const handleImageUpload = (file: File): Promise<string> => {
    return new Promise((resolve, reject) => {
      const reader = new FileReader();
      reader.onload = (e) => {
        const result = e.target?.result as string;
        resolve(result);
      };
      reader.onerror = reject;
      reader.readAsDataURL(file);
    });
  };

  const login = (password: string): boolean => {
    if (password === 'admin123') {
      setState(prev => ({ ...prev, isAuthenticated: true }));
      localStorage.setItem('adminAuth', 'true');
      return true;
    }
    return false;
  };

  const logout = () => {
    setState(prev => ({ ...prev, isAuthenticated: false }));
    localStorage.removeItem('adminAuth');
  };

  const addProduct = (product: Omit<Product, 'id'>) => {
    const newProduct = { ...product, id: Date.now().toString() };
    setState(prev => ({ ...prev, products: [...prev.products, newProduct] }));
  };

  const updateProduct = (id: string, updatedProduct: Partial<Product>) => {
    setState(prev => ({
      ...prev,
      products: prev.products.map(product =>
        product.id === id ? { ...product, ...updatedProduct } : product
      )
    }));
  };

  const deleteProduct = (id: string) => {
    setState(prev => ({
      ...prev,
      products: prev.products.filter(product => product.id !== id)
    }));
  };

  const markOrderFulfilled = (id: string) => {
    setState(prev => ({
      ...prev,
      orders: prev.orders.map(order =>
        order.id === id ? { ...order, status: 'fulfilled' } : order
      )
    }));
  };

  const addOrder = (order: Omit<Order, 'id' | 'createdAt' | 'status'>) => {
    const newOrder: Order = {
      ...order,
      id: Date.now().toString(),
      createdAt: new Date().toISOString(),
      status: 'pending'
    };
    setState(prev => ({ ...prev, orders: [...prev.orders, newOrder] }));
  };

  const updateCurrency = (currency: string) => {
    setState(prev => ({ ...prev, currency }));
  };

  return (
    <AdminContext.Provider value={{
      state,
      login,
      logout,
      addProduct,
      updateProduct,
      deleteProduct,
      markOrderFulfilled,
      addOrder,
      updateCurrency,
      handleImageUpload
    }}>
      {children}
    </AdminContext.Provider>
  );
};

export const useAdmin = () => {
  const context = useContext(AdminContext);
  if (!context) {
    throw new Error('useAdmin must be used within an AdminProvider');
  }
  return context;
};
