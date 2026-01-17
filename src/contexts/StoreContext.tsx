import React, { createContext, useContext, useEffect, useState } from 'react';
import { Product, CartItem, WishlistItem, Order, Coupon, AdminUser } from '@/types';
import { initialProducts, initialCoupons } from '@/data/products';
import { useLocalStorage } from '@/hooks/useLocalStorage';
import { toast } from 'sonner';

interface StoreContextType {
  // Products
  products: Product[];
  addProduct: (product: Product) => void;
  updateProduct: (product: Product) => void;
  deleteProduct: (id: string) => void;
  getProduct: (id: string) => Product | undefined;

  // Cart
  cart: CartItem[];
  addToCart: (product: Product, size: string, color: string, quantity?: number) => void;
  removeFromCart: (productId: string, size: string, color: string) => void;
  updateCartQuantity: (productId: string, size: string, color: string, quantity: number) => void;
  clearCart: () => void;
  cartTotal: number;
  cartCount: number;

  // Wishlist
  wishlist: WishlistItem[];
  addToWishlist: (product: Product) => void;
  removeFromWishlist: (productId: string) => void;
  isInWishlist: (productId: string) => boolean;

  // Orders
  orders: Order[];
  addOrder: (order: Order) => void;
  updateOrderStatus: (orderId: string, status: Order['status']) => void;
  getOrder: (id: string) => Order | undefined;

  // Coupons
  coupons: Coupon[];
  applyCoupon: (code: string, subtotal: number) => { valid: boolean; discount: number; message: string };

  // Admin
  adminUser: AdminUser | null;
  adminLogin: (username: string, password: string) => boolean;
  adminLogout: () => void;
}

const StoreContext = createContext<StoreContextType | undefined>(undefined);

export const StoreProvider: React.FC<{ children: React.ReactNode }> = ({ children }) => {
  const [products, setProducts] = useLocalStorage<Product[]>('store_products', initialProducts);
  const [cart, setCart] = useLocalStorage<CartItem[]>('store_cart', []);
  const [wishlist, setWishlist] = useLocalStorage<WishlistItem[]>('store_wishlist', []);
  const [orders, setOrders] = useLocalStorage<Order[]>('store_orders', []);
  const [coupons, setCoupons] = useLocalStorage<Coupon[]>('store_coupons', initialCoupons);
  const [adminUser, setAdminUser] = useState<AdminUser | null>(() => {
    const stored = localStorage.getItem('admin_session');
    return stored ? JSON.parse(stored) : null;
  });

  // Products
  const addProduct = (product: Product) => {
    setProducts(prev => [...prev, product]);
    toast.success('Product added successfully');
  };

  const updateProduct = (product: Product) => {
    setProducts(prev => prev.map(p => p.id === product.id ? product : p));
    toast.success('Product updated successfully');
  };

  const deleteProduct = (id: string) => {
    setProducts(prev => prev.filter(p => p.id !== id));
    toast.success('Product deleted successfully');
  };

  const getProduct = (id: string) => products.find(p => p.id === id);

  // Cart
  const addToCart = (product: Product, size: string, color: string, quantity = 1) => {
    setCart(prev => {
      const existingIndex = prev.findIndex(
        item => item.productId === product.id && item.size === size && item.color === color
      );

      if (existingIndex >= 0) {
        const updated = [...prev];
        updated[existingIndex].quantity += quantity;
        return updated;
      }

      return [...prev, { productId: product.id, product, size, color, quantity }];
    });
    toast.success('Added to cart');
  };

  const removeFromCart = (productId: string, size: string, color: string) => {
    setCart(prev => prev.filter(
      item => !(item.productId === productId && item.size === size && item.color === color)
    ));
    toast.success('Removed from cart');
  };

  const updateCartQuantity = (productId: string, size: string, color: string, quantity: number) => {
    if (quantity <= 0) {
      removeFromCart(productId, size, color);
      return;
    }
    setCart(prev => prev.map(item =>
      item.productId === productId && item.size === size && item.color === color
        ? { ...item, quantity }
        : item
    ));
  };

  const clearCart = () => setCart([]);

  const cartTotal = cart.reduce((sum, item) => sum + item.product.price * item.quantity, 0);
  const cartCount = cart.reduce((sum, item) => sum + item.quantity, 0);

  // Wishlist
  const addToWishlist = (product: Product) => {
    if (isInWishlist(product.id)) {
      removeFromWishlist(product.id);
      return;
    }
    setWishlist(prev => [...prev, { productId: product.id, product, addedAt: new Date().toISOString() }]);
    toast.success('Added to wishlist');
  };

  const removeFromWishlist = (productId: string) => {
    setWishlist(prev => prev.filter(item => item.productId !== productId));
    toast.success('Removed from wishlist');
  };

  const isInWishlist = (productId: string) => wishlist.some(item => item.productId === productId);

  // Orders
  const addOrder = (order: Order) => {
    setOrders(prev => [order, ...prev]);
    clearCart();
    toast.success('Order placed successfully!');
  };

  const updateOrderStatus = (orderId: string, status: Order['status']) => {
    setOrders(prev => prev.map(o => 
      o.id === orderId 
        ? { ...o, status, updatedAt: new Date().toISOString() } 
        : o
    ));
  };

  const getOrder = (id: string) => orders.find(o => o.id === id);

  // Coupons
  const applyCoupon = (code: string, subtotal: number) => {
    const coupon = coupons.find(c => c.code.toUpperCase() === code.toUpperCase() && c.isActive);
    
    if (!coupon) {
      return { valid: false, discount: 0, message: 'Invalid coupon code' };
    }

    if (new Date(coupon.expiryDate) < new Date()) {
      return { valid: false, discount: 0, message: 'Coupon has expired' };
    }

    if (coupon.usedCount >= coupon.usageLimit) {
      return { valid: false, discount: 0, message: 'Coupon usage limit reached' };
    }

    if (subtotal < coupon.minPurchase) {
      return { valid: false, discount: 0, message: `Minimum purchase of ₹${coupon.minPurchase} required` };
    }

    let discount = coupon.type === 'percentage' 
      ? (subtotal * coupon.value) / 100 
      : coupon.value;

    if (coupon.maxDiscount && discount > coupon.maxDiscount) {
      discount = coupon.maxDiscount;
    }

    return { valid: true, discount, message: 'Coupon applied successfully!' };
  };

  // Admin
  const adminLogin = (username: string, password: string) => {
    if (username === 'admin' && password === 'admin@123') {
      const user: AdminUser = { username, isAuthenticated: true };
      setAdminUser(user);
      localStorage.setItem('admin_session', JSON.stringify(user));
      toast.success('Welcome, Admin!');
      return true;
    }
    toast.error('Invalid credentials');
    return false;
  };

  const adminLogout = () => {
    setAdminUser(null);
    localStorage.removeItem('admin_session');
    toast.success('Logged out successfully');
  };

  return (
    <StoreContext.Provider value={{
      products, addProduct, updateProduct, deleteProduct, getProduct,
      cart, addToCart, removeFromCart, updateCartQuantity, clearCart, cartTotal, cartCount,
      wishlist, addToWishlist, removeFromWishlist, isInWishlist,
      orders, addOrder, updateOrderStatus, getOrder,
      coupons, applyCoupon,
      adminUser, adminLogin, adminLogout
    }}>
      {children}
    </StoreContext.Provider>
  );
};

export const useStore = () => {
  const context = useContext(StoreContext);
  if (!context) throw new Error('useStore must be used within StoreProvider');
  return context;
};
