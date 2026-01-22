import { useQuery, useMutation, useQueryClient } from '@tanstack/react-query';
import { 
  getCoupons, 
  getCoupon, 
  validateCoupon, 
  createCoupon, 
  updateCoupon, 
  deleteCoupon,
  incrementCouponUsage,
  DbCoupon 
} from '@/lib/supabase/coupons';
import { toast } from 'sonner';

export function useCoupons() {
  return useQuery({
    queryKey: ['coupons'],
    queryFn: getCoupons,
  });
}

export function useCoupon(id: string) {
  return useQuery({
    queryKey: ['coupon', id],
    queryFn: () => getCoupon(id),
    enabled: !!id,
  });
}

export function useValidateCoupon() {
  return useMutation({
    mutationFn: ({ code, subtotal }: { code: string; subtotal: number }) =>
      validateCoupon(code, subtotal),
    onSuccess: (result) => {
      if (result.valid) {
        toast.success(result.message);
      } else {
        toast.error(result.message);
      }
    },
    onError: (error: Error) => {
      toast.error(error.message);
    },
  });
}

export function useCreateCoupon() {
  const queryClient = useQueryClient();

  return useMutation({
    mutationFn: createCoupon,
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ['coupons'] });
      toast.success('Coupon created successfully');
    },
    onError: (error: Error) => {
      toast.error(error.message);
    },
  });
}

export function useUpdateCoupon() {
  const queryClient = useQueryClient();

  return useMutation({
    mutationFn: ({ id, updates }: { id: string; updates: Partial<DbCoupon> }) =>
      updateCoupon(id, updates),
    onSuccess: (_, { id }) => {
      queryClient.invalidateQueries({ queryKey: ['coupons'] });
      queryClient.invalidateQueries({ queryKey: ['coupon', id] });
      toast.success('Coupon updated successfully');
    },
    onError: (error: Error) => {
      toast.error(error.message);
    },
  });
}

export function useDeleteCoupon() {
  const queryClient = useQueryClient();

  return useMutation({
    mutationFn: deleteCoupon,
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ['coupons'] });
      toast.success('Coupon deleted successfully');
    },
    onError: (error: Error) => {
      toast.error(error.message);
    },
  });
}

export function useIncrementCouponUsage() {
  const queryClient = useQueryClient();

  return useMutation({
    mutationFn: incrementCouponUsage,
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ['coupons'] });
    },
  });
}
