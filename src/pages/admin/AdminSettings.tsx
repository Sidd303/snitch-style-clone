import { useState } from 'react';
import { Save, Store, Mail, Percent, Shield } from 'lucide-react';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { Switch } from '@/components/ui/switch';
import { useStore } from '@/contexts/StoreContext';

const AdminSettings = () => {
  const { settings, updateSettings } = useStore();

  const [form, setForm] = useState({
    storeName: settings?.storeName || '',
    adminEmail: settings?.adminEmail || '',
    taxRate: settings?.taxRate || '',
    maintenance: settings?.maintenance || false
  });

  const handleSave = () => {
    updateSettings(form);
  };

  return (
    <div className="space-y-6 max-w-2xl">
      <h1 className="text-3xl font-display font-bold">Settings</h1>

      <div className="bg-card rounded-lg p-6 space-y-6">
        <div className="flex items-center gap-3">
          <Store className="h-5 w-5" />
          <h2 className="text-lg font-semibold">Store Information</h2>
        </div>

        <div className="space-y-4">
          <div>
            <Label>Store Name</Label>
            <Input
              value={form.storeName}
              onChange={e => setForm({ ...form, storeName: e.target.value })}
            />
          </div>

          <div>
            <Label>Admin Email</Label>
            <Input
              type="email"
              value={form.adminEmail}
              onChange={e => setForm({ ...form, adminEmail: e.target.value })}
            />
          </div>
        </div>
      </div>

      <div className="bg-card rounded-lg p-6 space-y-6">
        <div className="flex items-center gap-3">
          <Percent className="h-5 w-5" />
          <h2 className="text-lg font-semibold">Pricing</h2>
        </div>

        <div>
          <Label>Tax Rate (%)</Label>
          <Input
            type="number"
            value={form.taxRate}
            onChange={e => setForm({ ...form, taxRate: e.target.value })}
          />
        </div>
      </div>

      <div className="bg-card rounded-lg p-6 flex items-center justify-between">
        <div className="flex items-center gap-3">
          <Shield className="h-5 w-5" />
          <div>
            <p className="font-semibold">Maintenance Mode</p>
            <p className="text-sm text-muted-foreground">
              Temporarily disable the storefront
            </p>
          </div>
        </div>

        <Switch
          checked={form.maintenance}
          onCheckedChange={v => setForm({ ...form, maintenance: v })}
        />
      </div>

      <Button onClick={handleSave} className="w-full sm:w-auto">
        <Save className="h-4 w-4 mr-2" />
        Save Settings
      </Button>
    </div>
  );
};

export default AdminSettings;
