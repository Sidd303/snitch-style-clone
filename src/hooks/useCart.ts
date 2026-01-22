import { useQuery, useMutation, useQueryClient } from '@tanstack/react-query';
import { getCart, addToCart, updateCartItemQuantity, removeFromCart, clearCart } from '@/lib/supabase/cart';
import { useAuth } from '@/contexts/AuthContext';
import { useLocalStorage } from '@/hooks/useLocalStorage';
import { toast } from 'sonner';
import { useEffect } from 'react';

// Local cart item for non-authenticated users
interface LocalCartItem {
  productId: string;
  product: {
    id: string;
    name: string;
    price: number;
    images: string[];
  };
  quantity: number;
  size: string;
  color: string;
}

export function useCart() {
  const { user } = useAuth();
  const queryClient = useQueryClient();
  const [localCart, setLocalCart] = useLocalStorage<LocalCartItem[]>('guest_cart', []);

  // Fetch cart from Supabase for authenticated users
  const { data: dbCart, isLoading, refetch } = useQuery({
    queryKey: ['cart', user?.id],
    queryFn: () => getCart(user!.id),
    enabled: !!user,
  });

  // Add to cart mutation
  const addToCartMutation = useMutation({
    mutationFn: async ({ productId, quantity, size, color }: { 
      productId: string; 
      quantity: number; 
      size?: string; 
      color?: string;
    }) => {
      if (!user || !dbCart?.cartId) {
        throw new Error('Not authenticated');
      }
      return addToCart(dbCart.cartId, productId, quantity, size, color);
    },
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ['cart', user?.id] });
      toast.success('Added to cart');
    },
    onError: (error: Error) => {
      toast.error(error.message);
    },
  });

  // Update quantity mutation
  const updateQuantityMutation = useMutation({
    mutationFn: async ({ itemId, quantity }: { itemId: string; quantity: number }) => {
      return updateCartItemQuantity(itemId, quantity);
    },
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ['cart', user?.id] });
    },
    onError: (error: Error) => {
      toast.error(error.message);
    },
  });

  // Remove from cart mutation
  const removeFromCartMutation = useMutation({
    mutationFn: removeFromCart,
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ['cart', user?.id] });
      toast.success('Removed from cart');
    },
    onError: (error: Error) => {
      toast.error(error.message);
    },
  });

  // Clear cart mutation
  const clearCartMutation = useMutation({
    mutationFn: async () => {
      if (!dbCart?.cartId) throw new Error('No cart found');
      return clearCart(dbCart.cartId);
    },
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ['cart', user?.id] });
    },
    onError: (error: Error) => {
      toast.error(error.message);
    },
  });

  // Handle local cart for non-authenticated users
  const addToLocalCart = (product: LocalCartItem['product'], size: string, color: string, quantity = 1) => {
    setLocalCart(prev => {
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

  const updateLocalCartQuantity = (productId: string, size: string, color: string, quantity: number) => {
    if (quantity <= 0) {
      removeFromLocalCart(productId, size, color);
      return;
    }
    setLocalCart(prev =>
      prev.map(item =>
        item.productId === productId && item.size === size && item.color === color
          ? { ...item, quantity }
          : item
      )
    );
  };

  const removeFromLocalCart = (productId: string, size: string, color: string) => {
    setLocalCart(prev =>
      prev.filter(
        item => !(item.productId === productId && item.size === size && item.color === color)
      )
    );
    toast.success('Removed from cart');
  };

  const clearLocalCart = () => {
    setLocalCart([]);
  };

  // Calculate cart items and totals
  const cartItems = user
    ? (dbCart?.items || []).map(item => ({
        id: item.id,
        productId: item.product_id,
        product: item.product!,
        quantity: item.quantity,
        size: item.size || '',
        color: item.color || '',
      }))
    : localCart;

  const cartTotal = cartItems.reduce(
    (sum, item) => sum + (item.product?.price || 0) * item.quantity,
    0
  );

  const cartCount = cartItems.reduce((sum, item) => sum + item.quantity, 0);

  return {
    cartItems,
    cartTotal,
    cartCount,
    cartId: dbCart?.cartId,
    isLoading: user ? isLoading : false,
    addToCart: user
      ? (productId: string, quantity: number, size?: string, color?: string) =>
          addToCartMutation.mutate({ productId, quantity, size, color })
      : (product: LocalCartItem['product'], size: string, color: string, quantity?: number) =>
          addToLocalCart(product, size, color, quantity),
    updateQuantity: user
      ? (itemId: string, quantity: number) =>
          updateQuantityMutation.mutate({ itemId, quantity })
      : (productId: string, size: string, color: string, quantity: number) =>
          updateLocalCartQuantity(productId, size, color, quantity),
    removeFromCart: user
      ? (itemId: string) => removeFromCartMutation.mutate(itemId)
      : (productId: string, size: string, color: string) =>
          removeFromLocalCart(productId, size, color),
    clearCart: user ? () => clearCartMutation.mutate() : clearLocalCart,
    refetch,
  };
}
