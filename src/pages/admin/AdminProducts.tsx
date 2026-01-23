import { useState } from 'react';
import { Plus, Pencil, Trash2, Search } from 'lucide-react';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Badge } from '@/components/ui/badge';
import { Dialog, DialogContent, DialogHeader, DialogTitle, DialogTrigger } from '@/components/ui/dialog';
import { Label } from '@/components/ui/label';
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '@/components/ui/select';
import { Textarea } from '@/components/ui/textarea';
import { useProducts, useCreateProduct, useUpdateProduct, useDeleteProduct } from '@/hooks/useProducts';
import { DbProduct } from '@/lib/supabase/products';

const AdminProducts = () => {
  const [search, setSearch] = useState('');
  const [isDialogOpen, setIsDialogOpen] = useState(false);
  const [editingProduct, setEditingProduct] = useState<DbProduct | null>(null);
  const [formData, setFormData] = useState({ name: '', description: '', price: '', category: 'shirts', stock: '', sku: '' });

  const { data: productsData, isLoading } = useProducts({ search: search || undefined });
  const createProduct = useCreateProduct();
  const updateProduct = useUpdateProduct();
  const deleteProduct = useDeleteProduct();

  const products = productsData?.products || [];

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    
    const productData = {
      name: formData.name,
      description: formData.description || null,
      price: parseInt(formData.price),
      images: editingProduct?.images || ['/placeholder.svg'],
      sizes: editingProduct?.sizes || ['S', 'M', 'L', 'XL'],
      colors: editingProduct?.colors || [{ name: 'Default', hex: '#000000' }],
      stock: parseInt(formData.stock),
      sku: formData.sku || null,
      is_active: true,
      is_featured: false,
      is_new: false,
      is_sale: false,
      metadata: {},
      category_id: null,
      original_price: null,
    };
    
    if (editingProduct) {
      updateProduct.mutate({ 
        id: editingProduct.id, 
        updates: productData 
      }, {
        onSuccess: () => {
          setIsDialogOpen(false);
          resetForm();
        }
      });
    } else {
      createProduct.mutate(productData, {
        onSuccess: () => {
          setIsDialogOpen(false);
          resetForm();
        }
      });
    }
  };

  const resetForm = () => {
    setFormData({ name: '', description: '', price: '', category: 'shirts', stock: '', sku: '' });
    setEditingProduct(null);
  };

  const handleEdit = (product: DbProduct) => {
    setEditingProduct(product);
    setFormData({ 
      name: product.name, 
      description: product.description || '', 
      price: product.price.toString(), 
      category: 'shirts', 
      stock: product.stock.toString(), 
      sku: product.sku || '' 
    });
    setIsDialogOpen(true);
  };

  const handleDelete = (productId: string) => {
    if (confirm('Are you sure you want to delete this product?')) {
      deleteProduct.mutate(productId);
    }
  };

  return (
    <div className="space-y-6">
      <div className="flex flex-col sm:flex-row justify-between gap-4">
        <h1 className="text-3xl font-display font-bold">Products</h1>
        <Dialog open={isDialogOpen} onOpenChange={o => { setIsDialogOpen(o); if (!o) resetForm(); }}>
          <DialogTrigger asChild><Button><Plus className="h-4 w-4 mr-2" />Add Product</Button></DialogTrigger>
          <DialogContent className="max-w-md">
            <DialogHeader><DialogTitle>{editingProduct ? 'Edit' : 'Add'} Product</DialogTitle></DialogHeader>
            <form onSubmit={handleSubmit} className="space-y-4">
              <div><Label>Name</Label><Input value={formData.name} onChange={e => setFormData({ ...formData, name: e.target.value })} required /></div>
              <div><Label>Description</Label><Textarea value={formData.description} onChange={e => setFormData({ ...formData, description: e.target.value })} /></div>
              <div className="grid grid-cols-2 gap-4">
                <div><Label>Price (₹)</Label><Input type="number" value={formData.price} onChange={e => setFormData({ ...formData, price: e.target.value })} required /></div>
                <div><Label>Stock</Label><Input type="number" value={formData.stock} onChange={e => setFormData({ ...formData, stock: e.target.value })} required /></div>
              </div>
              <div className="grid grid-cols-2 gap-4">
                <div><Label>Category</Label>
                  <Select value={formData.category} onValueChange={v => setFormData({ ...formData, category: v })}>
                    <SelectTrigger><SelectValue /></SelectTrigger>
                    <SelectContent><SelectItem value="shirts">Shirts</SelectItem><SelectItem value="jackets">Jackets</SelectItem><SelectItem value="bottoms">Bottoms</SelectItem></SelectContent>
                  </Select>
                </div>
                <div><Label>SKU</Label><Input value={formData.sku} onChange={e => setFormData({ ...formData, sku: e.target.value })} /></div>
              </div>
              <Button type="submit" className="w-full" disabled={createProduct.isPending || updateProduct.isPending}>
                {createProduct.isPending || updateProduct.isPending ? 'Saving...' : editingProduct ? 'Update' : 'Add'} Product
              </Button>
            </form>
          </DialogContent>
        </Dialog>
      </div>

      <div className="relative max-w-sm">
        <Search className="absolute left-3 top-1/2 -translate-y-1/2 h-4 w-4 text-muted-foreground" />
        <Input placeholder="Search products..." value={search} onChange={e => setSearch(e.target.value)} className="pl-10" />
      </div>

      <div className="bg-card rounded-lg overflow-hidden">
        <div className="overflow-x-auto">
          <table className="w-full">
            <thead className="bg-muted/50"><tr><th className="text-left p-4">Product</th><th className="text-left p-4">Category</th><th className="text-left p-4">Price</th><th className="text-left p-4">Stock</th><th className="text-left p-4">Actions</th></tr></thead>
            <tbody>
              {isLoading ? (
                <tr>
                  <td colSpan={5} className="p-8 text-center">
                    <div className="animate-spin rounded-full h-8 w-8 border-b-2 border-primary mx-auto"></div>
                  </td>
                </tr>
              ) : products.length === 0 ? (
                <tr>
                  <td colSpan={5} className="p-8 text-center text-muted-foreground">
                    No products found
                  </td>
                </tr>
              ) : (
                products.map(product => (
                  <tr key={product.id} className="border-t">
                    <td className="p-4"><div className="flex items-center gap-3"><img src={product.images[0] || '/placeholder.svg'} className="w-10 h-12 object-cover rounded" /><span className="font-medium">{product.name}</span></div></td>
                    <td className="p-4 capitalize">-</td>
                    <td className="p-4">₹{product.price}</td>
                    <td className="p-4"><Badge variant={product.stock > 10 ? 'default' : 'destructive'}>{product.stock}</Badge></td>
                    <td className="p-4"><div className="flex gap-2"><Button variant="ghost" size="icon" onClick={() => handleEdit(product)}><Pencil className="h-4 w-4" /></Button><Button variant="ghost" size="icon" className="text-destructive" onClick={() => handleDelete(product.id)}><Trash2 className="h-4 w-4" /></Button></div></td>
                  </tr>
                ))
              )}
            </tbody>
          </table>
        </div>
      </div>
    </div>
  );
};

export default AdminProducts;