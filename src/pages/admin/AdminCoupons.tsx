import { useState } from 'react';
import { Plus, Trash2, Copy, Percent, IndianRupee } from 'lucide-react';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Badge } from '@/components/ui/badge';
import {
  Dialog,
  DialogContent,
  DialogHeader,
  DialogTitle,
  DialogTrigger
} from '@/components/ui/dialog';
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue
} from '@/components/ui/select';
import { Label } from '@/components/ui/label';
import { useCoupons, useCreateCoupon, useDeleteCoupon } from '@/hooks/useCoupons';
import { toast } from 'sonner';

const AdminCoupons = () => {
  const { data: coupons = [], isLoading } = useCoupons();
  const createCoupon = useCreateCoupon();
  const deleteCouponMutation = useDeleteCoupon();
  const [open, setOpen] = useState(false);
  const [form, setForm] = useState({
    code: '',
    type: 'percentage',
    value: ''
  });

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();

    createCoupon.mutate({
      code: form.code.toUpperCase(),
      type: form.type === 'flat' ? 'fixed' : 'percentage',
      value: Number(form.value),
      is_active: true,
      min_purchase: 0,
      max_discount: form.type === 'percentage' ? 500 : null,
      expiry_date: new Date(Date.now() + 30 * 24 * 60 * 60 * 1000).toISOString(),
      usage_limit: 100,
    }, {
      onSuccess: () => {
        setOpen(false);
        setForm({ code: '', type: 'percentage', value: '' });
      }
    });
  };

  const handleDelete = (id: string) => {
    if (confirm('Are you sure you want to delete this coupon?')) {
      deleteCouponMutation.mutate(id);
    }
  };

  return (
    <div className="space-y-6">
      <div className="flex justify-between items-center">
        <h1 className="text-3xl font-display font-bold">Coupons</h1>

        <Dialog open={open} onOpenChange={setOpen}>
          <DialogTrigger asChild>
            <Button>
              <Plus className="h-4 w-4 mr-2" />
              Add Coupon
            </Button>
          </DialogTrigger>

          <DialogContent className="max-w-md">
            <DialogHeader>
              <DialogTitle>Create Coupon</DialogTitle>
            </DialogHeader>

            <form onSubmit={handleSubmit} className="space-y-4">
              <div>
                <Label>Coupon Code</Label>
                <Input
                  value={form.code}
                  onChange={e => setForm({ ...form, code: e.target.value })}
                  placeholder="SAVE20"
                  required
                />
              </div>

              <div className="grid grid-cols-2 gap-4">
                <div>
                  <Label>Discount Type</Label>
                  <Select
                    value={form.type}
                    onValueChange={v => setForm({ ...form, type: v })}
                  >
                    <SelectTrigger>
                      <SelectValue />
                    </SelectTrigger>
                    <SelectContent>
                      <SelectItem value="percentage">
                        <span className="flex items-center gap-2">
                          <Percent className="h-4 w-4" /> Percentage
                        </span>
                      </SelectItem>
                      <SelectItem value="flat">
                        <span className="flex items-center gap-2">
                          <IndianRupee className="h-4 w-4" /> Flat
                        </span>
                      </SelectItem>
                    </SelectContent>
                  </Select>
                </div>

                <div>
                  <Label>Value</Label>
                  <Input
                    type="number"
                    value={form.value}
                    onChange={e => setForm({ ...form, value: e.target.value })}
                    required
                  />
                </div>
              </div>

              <Button type="submit" className="w-full" disabled={createCoupon.isPending}>
                {createCoupon.isPending ? 'Creating...' : 'Create Coupon'}
              </Button>
            </form>
          </DialogContent>
        </Dialog>
      </div>

      <div className="bg-card rounded-lg overflow-hidden">
        <table className="w-full">
          <thead className="bg-muted/50">
            <tr>
              <th className="p-4 text-left">Code</th>
              <th className="p-4 text-left">Discount</th>
              <th className="p-4 text-left">Status</th>
              <th className="p-4 text-left">Actions</th>
            </tr>
          </thead>
          <tbody>
            {isLoading ? (
              <tr>
                <td colSpan={4} className="p-8 text-center">
                  <div className="animate-spin rounded-full h-8 w-8 border-b-2 border-primary mx-auto"></div>
                </td>
              </tr>
            ) : coupons.length === 0 ? (
              <tr>
                <td colSpan={4} className="p-8 text-center text-muted-foreground">
                  No coupons created
                </td>
              </tr>
            ) : (
              coupons.map(coupon => (
                <tr key={coupon.id} className="border-t">
                  <td className="p-4 font-mono">{coupon.code}</td>
                  <td className="p-4">
                    {coupon.type === 'percentage'
                      ? `${coupon.value}%`
                      : `₹${coupon.value}`}
                  </td>
                  <td className="p-4">
                    <Badge variant={coupon.is_active ? 'default' : 'secondary'}>
                      {coupon.is_active ? 'Active' : 'Inactive'}
                    </Badge>
                  </td>
                  <td className="p-4">
                    <div className="flex gap-2">
                      <Button
                        size="icon"
                        variant="ghost"
                        onClick={() => {
                          navigator.clipboard.writeText(coupon.code);
                          toast.success('Copied to clipboard');
                        }}
                      >
                        <Copy className="h-4 w-4" />
                      </Button>
                      <Button
                        size="icon"
                        variant="ghost"
                        className="text-destructive"
                        onClick={() => handleDelete(coupon.id)}
                      >
                        <Trash2 className="h-4 w-4" />
                      </Button>
                    </div>
                  </td>
                </tr>
              ))
            )}
          </tbody>
        </table>
      </div>
    </div>
  );
};

export default AdminCoupons;