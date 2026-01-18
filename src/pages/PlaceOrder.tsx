import { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { MapPin, ArrowRight, ArrowLeft } from 'lucide-react';
import Header from '@/components/layout/Header';
import Footer from '@/components/layout/Footer';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { useStore } from '@/contexts/StoreContext';

const PlaceOrder = () => {
  const navigate = useNavigate();
  const { cart, cartTotal } = useStore();

  const [address, setAddress] = useState({
    fullName: '',
    phone: '',
    email: '',
    addressLine1: '',
    addressLine2: '',
    city: '',
    state: '',
    pincode: '',
    landmark: ''
  });

  const shipping = cartTotal >= 2000 ? 0 : 99;
  const tax = Math.round(cartTotal * 0.18);
  const total = cartTotal + shipping + tax;

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    // Store address in localStorage for payment page
    localStorage.setItem('checkout_address', JSON.stringify(address));
    navigate('/payment');
  };

  if (cart.length === 0) {
    navigate('/cart');
    return null;
  }

  return (
    <div className="min-h-screen flex flex-col">
      <Header />
      
      <main className="flex-1 container-wide py-8">
        <div className="max-w-4xl mx-auto">
          {/* Progress Steps */}
          <div className="flex items-center justify-center gap-4 mb-8">
            <div className="flex items-center gap-2">
              <div className="w-8 h-8 rounded-full bg-primary text-primary-foreground flex items-center justify-center font-medium">1</div>
              <span className="font-medium">Address</span>
            </div>
            <div className="w-12 h-0.5 bg-muted" />
            <div className="flex items-center gap-2">
              <div className="w-8 h-8 rounded-full bg-muted text-muted-foreground flex items-center justify-center font-medium">2</div>
              <span className="text-muted-foreground">Payment</span>
            </div>
            <div className="w-12 h-0.5 bg-muted" />
            <div className="flex items-center gap-2">
              <div className="w-8 h-8 rounded-full bg-muted text-muted-foreground flex items-center justify-center font-medium">3</div>
              <span className="text-muted-foreground">Confirm</span>
            </div>
          </div>

          <div className="grid lg:grid-cols-3 gap-8">
            {/* Address Form */}
            <div className="lg:col-span-2">
              <div className="bg-card rounded-lg p-6">
                <div className="flex items-center gap-2 mb-6">
                  <MapPin className="h-5 w-5" />
                  <h2 className="text-xl font-semibold">Delivery Address</h2>
                </div>

                <form onSubmit={handleSubmit} className="space-y-4">
                  <div className="grid sm:grid-cols-2 gap-4">
                    <div>
                      <Label htmlFor="fullName">Full Name *</Label>
                      <Input
                        id="fullName"
                        value={address.fullName}
                        onChange={e => setAddress({ ...address, fullName: e.target.value })}
                        required
                      />
                    </div>
                    <div>
                      <Label htmlFor="phone">Phone Number *</Label>
                      <Input
                        id="phone"
                        type="tel"
                        value={address.phone}
                        onChange={e => setAddress({ ...address, phone: e.target.value })}
                        required
                      />
                    </div>
                  </div>

                  <div>
                    <Label htmlFor="email">Email Address *</Label>
                    <Input
                      id="email"
                      type="email"
                      value={address.email}
                      onChange={e => setAddress({ ...address, email: e.target.value })}
                      required
                    />
                  </div>

                  <div>
                    <Label htmlFor="addressLine1">Address Line 1 *</Label>
                    <Input
                      id="addressLine1"
                      value={address.addressLine1}
                      onChange={e => setAddress({ ...address, addressLine1: e.target.value })}
                      placeholder="House No., Building Name"
                      required
                    />
                  </div>

                  <div>
                    <Label htmlFor="addressLine2">Address Line 2</Label>
                    <Input
                      id="addressLine2"
                      value={address.addressLine2}
                      onChange={e => setAddress({ ...address, addressLine2: e.target.value })}
                      placeholder="Street, Area"
                    />
                  </div>

                  <div className="grid sm:grid-cols-3 gap-4">
                    <div>
                      <Label htmlFor="city">City *</Label>
                      <Input
                        id="city"
                        value={address.city}
                        onChange={e => setAddress({ ...address, city: e.target.value })}
                        required
                      />
                    </div>
                    <div>
                      <Label htmlFor="state">State *</Label>
                      <Input
                        id="state"
                        value={address.state}
                        onChange={e => setAddress({ ...address, state: e.target.value })}
                        required
                      />
                    </div>
                    <div>
                      <Label htmlFor="pincode">PIN Code *</Label>
                      <Input
                        id="pincode"
                        value={address.pincode}
                        onChange={e => setAddress({ ...address, pincode: e.target.value })}
                        required
                      />
                    </div>
                  </div>

                  <div>
                    <Label htmlFor="landmark">Landmark (Optional)</Label>
                    <Input
                      id="landmark"
                      value={address.landmark}
                      onChange={e => setAddress({ ...address, landmark: e.target.value })}
                      placeholder="Near..."
                    />
                  </div>

                  <div className="flex gap-4 pt-4">
                    <Button type="button" variant="outline" onClick={() => navigate('/cart')}>
                      <ArrowLeft className="h-4 w-4 mr-2" />
                      Back to Cart
                    </Button>
                    <Button type="submit" className="flex-1">
                      Continue to Payment
                      <ArrowRight className="h-4 w-4 ml-2" />
                    </Button>
                  </div>
                </form>
              </div>
            </div>

            {/* Order Summary */}
            <div className="lg:col-span-1">
              <div className="bg-card rounded-lg p-6 sticky top-24 space-y-4">
                <h2 className="text-lg font-semibold">Order Summary</h2>

                <div className="space-y-3 max-h-48 overflow-y-auto">
                  {cart.map(item => (
                    <div key={`${item.productId}-${item.size}`} className="flex gap-3">
                      <img
                        src={item.product.images[0]}
                        alt={item.product.name}
                        className="w-12 h-14 object-cover rounded"
                      />
                      <div className="flex-1 text-sm">
                        <p className="font-medium line-clamp-1">{item.product.name}</p>
                        <p className="text-muted-foreground">{item.size} × {item.quantity}</p>
                      </div>
                      <p className="text-sm font-medium">₹{(item.product.price * item.quantity).toLocaleString()}</p>
                    </div>
                  ))}
                </div>

                <div className="border-t pt-4 space-y-2 text-sm">
                  <div className="flex justify-between">
                    <span className="text-muted-foreground">Subtotal</span>
                    <span>₹{cartTotal.toLocaleString()}</span>
                  </div>
                  <div className="flex justify-between">
                    <span className="text-muted-foreground">Shipping</span>
                    <span>{shipping === 0 ? 'FREE' : `₹${shipping}`}</span>
                  </div>
                  <div className="flex justify-between">
                    <span className="text-muted-foreground">Tax (18% GST)</span>
                    <span>₹{tax.toLocaleString()}</span>
                  </div>
                </div>

                <div className="border-t pt-4 flex justify-between font-semibold text-lg">
                  <span>Total</span>
                  <span>₹{total.toLocaleString()}</span>
                </div>
              </div>
            </div>
          </div>
        </div>
      </main>

      <Footer />
    </div>
  );
};

export default PlaceOrder;
