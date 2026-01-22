import { useQuery, useMutation, useQueryClient } from '@tanstack/react-query';
import { getWishlist, addToWishlist, removeFromWishlist, isInWishlist } from '@/lib/supabase/wishlist';
import { useAuth } from '@/contexts/AuthContext';
import { useLocalStorage } from '@/hooks/useLocalStorage';
import { toast } from 'sonner';

interface LocalWishlistItem {
  productId: string;
  product: {
    id: string;
    name: string;
    price: number;
    original_price?: number;
    images: string[];
    is_sale?: boolean;
    is_new?: boolean;
  };
  addedAt: string;
}

export function useWishlist() {
  const { user } = useAuth();
  const queryClient = useQueryClient();
  const [localWishlist, setLocalWishlist] = useLocalStorage<LocalWishlistItem[]>('guest_wishlist', []);

  // Fetch wishlist from Supabase for authenticated users
  const { data: dbWishlist, isLoading } = useQuery({
    queryKey: ['wishlist', user?.id],
    queryFn: () => getWishlist(user!.id),
    enabled: !!user,
  });

  // Add to wishlist mutation
  const addMutation = useMutation({
    mutationFn: (productId: string) => addToWishlist(user!.id, productId),
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ['wishlist', user?.id] });
      toast.success('Added to wishlist');
    },
    onError: (error: Error) => {
      if (error.message.includes('duplicate')) {
        toast.info('Already in wishlist');
      } else {
        toast.error(error.message);
      }
    },
  });

  // Remove from wishlist mutation
  const removeMutation = useMutation({
    mutationFn: (productId: string) => removeFromWishlist(user!.id, productId),
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ['wishlist', user?.id] });
      toast.success('Removed from wishlist');
    },
    onError: (error: Error) => {
      toast.error(error.message);
    },
  });

  // Local wishlist handlers
  const addToLocalWishlist = (product: LocalWishlistItem['product']) => {
    const exists = localWishlist.some(item => item.productId === product.id);
    if (exists) {
      removeFromLocalWishlist(product.id);
      return;
    }
    setLocalWishlist(prev => [
      ...prev,
      { productId: product.id, product, addedAt: new Date().toISOString() }
    ]);
    toast.success('Added to wishlist');
  };

  const removeFromLocalWishlist = (productId: string) => {
    setLocalWishlist(prev => prev.filter(item => item.productId !== productId));
    toast.success('Removed from wishlist');
  };

  // Check if product is in wishlist
  const isProductInWishlist = (productId: string) => {
    if (user) {
      return dbWishlist?.some(item => item.product_id === productId) ?? false;
    }
    return localWishlist.some(item => item.productId === productId);
  };

  // Get wishlist items
  const wishlistItems = user
    ? (dbWishlist || []).map(item => ({
        productId: item.product_id,
        product: item.product!,
        addedAt: item.created_at,
      }))
    : localWishlist;

  return {
    wishlistItems,
    wishlistCount: wishlistItems.length,
    isLoading: user ? isLoading : false,
    addToWishlist: user
      ? (productId: string) => addMutation.mutate(productId)
      : (product: LocalWishlistItem['product']) => addToLocalWishlist(product),
    removeFromWishlist: user
      ? (productId: string) => removeMutation.mutate(productId)
      : removeFromLocalWishlist,
    isInWishlist: isProductInWishlist,
    toggleWishlist: user
      ? (productId: string) => {
          if (isProductInWishlist(productId)) {
            removeMutation.mutate(productId);
          } else {
            addMutation.mutate(productId);
          }
        }
      : (product: LocalWishlistItem['product']) => addToLocalWishlist(product),
  };
}
