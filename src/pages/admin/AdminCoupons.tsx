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
import { useStore } from '@/contexts/StoreContext';

type Coupon = {
  id: string;
  code: string;
  type: 'percentage' | 'flat';
  value: number;
  active: boolean;
  createdAt: string;
};

const AdminCoupons = () => {
  const { coupons = [], addCoupon, deleteCoupon } = useStore();
  const [open, setOpen] = useState(false);
  const [form, setForm] = useState({
    code: '',
    type: 'percentage',
    value: ''
  });

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();

    const coupon: Coupon = {
      id: Date.now().toString(),
      code: form.code.toUpperCase(),
      type: form.type as any,
      value: Number(form.value),
      active: true,
      createdAt: new Date().toISOString()
    };

    addCoupon(coupon);
    setOpen(false);
    setForm({ code: '', type: 'percentage', value: '' });
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

              <Button type="submit" className="w-full">
                Create Coupon
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
            {coupons.length === 0 ? (
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
                    <Badge variant={coupon.active ? 'default' : 'secondary'}>
                      {coupon.active ? 'Active' : 'Inactive'}
                    </Badge>
                  </td>
                  <td className="p-4">
                    <div className="flex gap-2">
                      <Button
                        size="icon"
                        variant="ghost"
                        onClick={() => navigator.clipboard.writeText(coupon.code)}
                      >
                        <Copy className="h-4 w-4" />
                      </Button>
                      <Button
                        size="icon"
                        variant="ghost"
                        className="text-destructive"
                        onClick={() => deleteCoupon(coupon.id)}
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
