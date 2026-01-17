import { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { motion, AnimatePresence } from 'framer-motion';
import { Check, ChevronRight, CreditCard, Truck, MapPin, Tag } from 'lucide-react';
import Header from '@/components/layout/Header';
import Footer from '@/components/layout/Footer';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { RadioGroup, RadioGroupItem } from '@/components/ui/radio-group';
import { Separator } from '@/components/ui/separator';
import { useStore } from '@/contexts/StoreContext';
import { Order, Address } from '@/types';

const steps = ['Cart', 'Shipping', 'Payment', 'Review'];

const Checkout = () => {
  const navigate = useNavigate();
  const { cart, cartTotal, applyCoupon, addOrder, clearCart } = useStore();
  const [currentStep, setCurrentStep] = useState(0);
  const [couponCode, setCouponCode] = useState('');
  const [discount, setDiscount] = useState(0);
  const [shippingMethod, setShippingMethod] = useState('standard');
  const [paymentMethod, setPaymentMethod] = useState('card');
  
  const [formData, setFormData] = useState({
    fullName: '',
    email: '',
    phone: '',
    street: '',
    apartment: '',
    city: '',
    state: '',
    postalCode: '',
    country: 'India'
  });

  const shippingCost = shippingMethod === 'express' ? 199 : cartTotal >= 2000 ? 0 : 99;
  const tax = Math.round(cartTotal * 0.18);
  const total = cartTotal + shippingCost + tax - discount;

  const handleApplyCoupon = () => {
    const result = applyCoupon(couponCode, cartTotal);
    if (result.valid) {
      setDiscount(result.discount);
    }
  };

  const handlePlaceOrder = () => {
    const address: Address = {
      id: Date.now().toString(),
      fullName: formData.fullName,
      phone: formData.phone,
      street: formData.street,
      apartment: formData.apartment,
      city: formData.city,
      state: formData.state,
      postalCode: formData.postalCode,
      country: formData.country
    };

    const order: Order = {
      id: `ORD-${Date.now()}`,
      customerName: formData.fullName,
      customerEmail: formData.email,
      customerPhone: formData.phone,
      items: cart.map(item => ({
        productId: item.productId,
        productName: item.product.name,
        productImage: item.product.images[0],
        quantity: item.quantity,
        size: item.size,
        color: item.color,
        price: item.product.price
      })),
      shippingAddress: address,
      shippingMethod,
      shippingCost,
      paymentMethod,
      subtotal: cartTotal,
      tax,
      discount,
      total,
      status: 'pending',
      paymentStatus: 'paid',
      couponCode: discount > 0 ? couponCode : undefined,
      createdAt: new Date().toISOString(),
      updatedAt: new Date().toISOString()
    };

    addOrder(order);
    navigate(`/order-success/${order.id}`);
  };

  if (cart.length === 0) {
    return (
      <div className="min-h-screen flex flex-col">
        <Header />
        <div className="flex-1 flex items-center justify-center">
          <div className="text-center">
            <h1 className="text-2xl font-display font-bold mb-4">Your Cart is Empty</h1>
            <Button onClick={() => navigate('/clothing')}>Browse Products</Button>
          </div>
        </div>
        <Footer />
      </div>
    );
  }

  return (
    <div className="min-h-screen flex flex-col bg-background">
      <Header />
      
      <main className="flex-1 container-wide py-8">
        {/* Steps */}
        <div className="flex items-center justify-center mb-8">
          {steps.map((step, idx) => (
            <div key={step} className="flex items-center">
              <div className={`flex items-center justify-center w-8 h-8 rounded-full text-sm font-medium ${
                idx <= currentStep ? 'bg-primary text-primary-foreground' : 'bg-muted text-muted-foreground'
              }`}>
                {idx < currentStep ? <Check className="h-4 w-4" /> : idx + 1}
              </div>
              <span className={`ml-2 text-sm font-medium hidden sm:block ${
                idx <= currentStep ? 'text-foreground' : 'text-muted-foreground'
              }`}>
                {step}
              </span>
              {idx < steps.length - 1 && (
                <ChevronRight className="h-4 w-4 mx-4 text-muted-foreground" />
              )}
            </div>
          ))}
        </div>

        <div className="grid lg:grid-cols-3 gap-8">
          {/* Main Content */}
          <div className="lg:col-span-2 space-y-6">
            <AnimatePresence mode="wait">
              {currentStep === 0 && (
                <motion.div
                  key="cart"
                  initial={{ opacity: 0, x: -20 }}
                  animate={{ opacity: 1, x: 0 }}
                  exit={{ opacity: 0, x: 20 }}
                  className="bg-card rounded-lg p-6 space-y-4"
                >
                  <h2 className="text-xl font-display font-bold">Review Your Cart</h2>
                  {cart.map((item, index) => (
                    <div key={index} className="flex gap-4 py-4 border-b last:border-0">
                      <img
                        src={item.product.images[0]}
                        alt={item.product.name}
                        className="w-20 h-24 object-cover rounded"
                      />
                      <div className="flex-1">
                        <h3 className="font-medium">{item.product.name}</h3>
                        <p className="text-sm text-muted-foreground">
                          Size: {item.size} | Color: {item.color} | Qty: {item.quantity}
                        </p>
                        <p className="font-semibold mt-2">₹{(item.product.price * item.quantity).toLocaleString()}</p>
                      </div>
                    </div>
                  ))}
                  <Button className="w-full" onClick={() => setCurrentStep(1)}>
                    Continue to Shipping
                  </Button>
                </motion.div>
              )}

              {currentStep === 1 && (
                <motion.div
                  key="shipping"
                  initial={{ opacity: 0, x: -20 }}
                  animate={{ opacity: 1, x: 0 }}
                  exit={{ opacity: 0, x: 20 }}
                  className="bg-card rounded-lg p-6 space-y-6"
                >
                  <h2 className="text-xl font-display font-bold flex items-center gap-2">
                    <MapPin className="h-5 w-5" />
                    Shipping Information
                  </h2>
                  <div className="grid sm:grid-cols-2 gap-4">
                    <div className="space-y-2">
                      <Label>Full Name</Label>
                      <Input
                        value={formData.fullName}
                        onChange={e => setFormData({ ...formData, fullName: e.target.value })}
                        placeholder="John Doe"
                      />
                    </div>
                    <div className="space-y-2">
                      <Label>Email</Label>
                      <Input
                        type="email"
                        value={formData.email}
                        onChange={e => setFormData({ ...formData, email: e.target.value })}
                        placeholder="john@example.com"
                      />
                    </div>
                    <div className="space-y-2">
                      <Label>Phone</Label>
                      <Input
                        value={formData.phone}
                        onChange={e => setFormData({ ...formData, phone: e.target.value })}
                        placeholder="+91 98765 43210"
                      />
                    </div>
                    <div className="space-y-2">
                      <Label>Street Address</Label>
                      <Input
                        value={formData.street}
                        onChange={e => setFormData({ ...formData, street: e.target.value })}
                        placeholder="123 Main Street"
                      />
                    </div>
                    <div className="space-y-2">
                      <Label>Apartment/Suite (Optional)</Label>
                      <Input
                        value={formData.apartment}
                        onChange={e => setFormData({ ...formData, apartment: e.target.value })}
                        placeholder="Apt 4B"
                      />
                    </div>
                    <div className="space-y-2">
                      <Label>City</Label>
                      <Input
                        value={formData.city}
                        onChange={e => setFormData({ ...formData, city: e.target.value })}
                        placeholder="Mumbai"
                      />
                    </div>
                    <div className="space-y-2">
                      <Label>State</Label>
                      <Input
                        value={formData.state}
                        onChange={e => setFormData({ ...formData, state: e.target.value })}
                        placeholder="Maharashtra"
                      />
                    </div>
                    <div className="space-y-2">
                      <Label>Postal Code</Label>
                      <Input
                        value={formData.postalCode}
                        onChange={e => setFormData({ ...formData, postalCode: e.target.value })}
                        placeholder="400001"
                      />
                    </div>
                  </div>

                  <Separator />

                  <div className="space-y-4">
                    <h3 className="font-medium flex items-center gap-2">
                      <Truck className="h-5 w-5" />
                      Shipping Method
                    </h3>
                    <RadioGroup value={shippingMethod} onValueChange={setShippingMethod}>
                      <div className="flex items-center justify-between p-4 border rounded-lg">
                        <div className="flex items-center gap-3">
                          <RadioGroupItem value="standard" id="standard" />
                          <Label htmlFor="standard" className="cursor-pointer">
                            <span className="font-medium">Standard Delivery</span>
                            <p className="text-sm text-muted-foreground">5-7 business days</p>
                          </Label>
                        </div>
                        <span className="font-medium">{cartTotal >= 2000 ? 'FREE' : '₹99'}</span>
                      </div>
                      <div className="flex items-center justify-between p-4 border rounded-lg">
                        <div className="flex items-center gap-3">
                          <RadioGroupItem value="express" id="express" />
                          <Label htmlFor="express" className="cursor-pointer">
                            <span className="font-medium">Express Delivery</span>
                            <p className="text-sm text-muted-foreground">2-3 business days</p>
                          </Label>
                        </div>
                        <span className="font-medium">₹199</span>
                      </div>
                    </RadioGroup>
                  </div>

                  <div className="flex gap-4">
                    <Button variant="outline" onClick={() => setCurrentStep(0)}>Back</Button>
                    <Button className="flex-1" onClick={() => setCurrentStep(2)}>
                      Continue to Payment
                    </Button>
                  </div>
                </motion.div>
              )}

              {currentStep === 2 && (
                <motion.div
                  key="payment"
                  initial={{ opacity: 0, x: -20 }}
                  animate={{ opacity: 1, x: 0 }}
                  exit={{ opacity: 0, x: 20 }}
                  className="bg-card rounded-lg p-6 space-y-6"
                >
                  <h2 className="text-xl font-display font-bold flex items-center gap-2">
                    <CreditCard className="h-5 w-5" />
                    Payment Method
                  </h2>

                  <RadioGroup value={paymentMethod} onValueChange={setPaymentMethod}>
                    <div className="p-4 border rounded-lg space-y-4">
                      <div className="flex items-center gap-3">
                        <RadioGroupItem value="card" id="card" />
                        <Label htmlFor="card" className="cursor-pointer font-medium">
                          Credit / Debit Card
                        </Label>
                      </div>
                      {paymentMethod === 'card' && (
                        <div className="ml-6 space-y-4">
                          <div className="space-y-2">
                            <Label>Card Number</Label>
                            <Input placeholder="1234 5678 9012 3456" />
                          </div>
                          <div className="grid grid-cols-2 gap-4">
                            <div className="space-y-2">
                              <Label>Expiry Date</Label>
                              <Input placeholder="MM/YY" />
                            </div>
                            <div className="space-y-2">
                              <Label>CVV</Label>
                              <Input placeholder="123" />
                            </div>
                          </div>
                          <div className="space-y-2">
                            <Label>Cardholder Name</Label>
                            <Input placeholder="John Doe" />
                          </div>
                        </div>
                      )}
                    </div>

                    <div className="flex items-center gap-3 p-4 border rounded-lg">
                      <RadioGroupItem value="upi" id="upi" />
                      <Label htmlFor="upi" className="cursor-pointer font-medium">
                        UPI Payment
                      </Label>
                    </div>

                    <div className="flex items-center gap-3 p-4 border rounded-lg">
                      <RadioGroupItem value="cod" id="cod" />
                      <Label htmlFor="cod" className="cursor-pointer font-medium">
                        Cash on Delivery
                      </Label>
                    </div>
                  </RadioGroup>

                  <div className="flex gap-4">
                    <Button variant="outline" onClick={() => setCurrentStep(1)}>Back</Button>
                    <Button className="flex-1" onClick={() => setCurrentStep(3)}>
                      Review Order
                    </Button>
                  </div>
                </motion.div>
              )}

              {currentStep === 3 && (
                <motion.div
                  key="review"
                  initial={{ opacity: 0, x: -20 }}
                  animate={{ opacity: 1, x: 0 }}
                  exit={{ opacity: 0, x: 20 }}
                  className="bg-card rounded-lg p-6 space-y-6"
                >
                  <h2 className="text-xl font-display font-bold">Review Your Order</h2>

                  <div className="space-y-4">
                    <div className="p-4 bg-secondary/50 rounded-lg">
                      <h3 className="font-medium mb-2">Shipping Address</h3>
                      <p className="text-sm text-muted-foreground">
                        {formData.fullName}<br />
                        {formData.street}{formData.apartment && `, ${formData.apartment}`}<br />
                        {formData.city}, {formData.state} {formData.postalCode}<br />
                        {formData.country}
                      </p>
                    </div>

                    <div className="p-4 bg-secondary/50 rounded-lg">
                      <h3 className="font-medium mb-2">Payment Method</h3>
                      <p className="text-sm text-muted-foreground capitalize">
                        {paymentMethod === 'card' ? 'Credit/Debit Card' : paymentMethod === 'upi' ? 'UPI Payment' : 'Cash on Delivery'}
                      </p>
                    </div>

                    <div className="p-4 bg-secondary/50 rounded-lg">
                      <h3 className="font-medium mb-2">Order Items</h3>
                      {cart.map((item, idx) => (
                        <div key={idx} className="flex justify-between text-sm py-2">
                          <span>{item.product.name} x {item.quantity}</span>
                          <span>₹{(item.product.price * item.quantity).toLocaleString()}</span>
                        </div>
                      ))}
                    </div>
                  </div>

                  <div className="flex gap-4">
                    <Button variant="outline" onClick={() => setCurrentStep(2)}>Back</Button>
                    <Button className="flex-1" onClick={handlePlaceOrder}>
                      Place Order - ₹{total.toLocaleString()}
                    </Button>
                  </div>
                </motion.div>
              )}
            </AnimatePresence>
          </div>

          {/* Order Summary */}
          <div className="lg:col-span-1">
            <div className="bg-card rounded-lg p-6 sticky top-24 space-y-4">
              <h2 className="text-lg font-display font-bold">Order Summary</h2>

              {/* Coupon */}
              <div className="flex gap-2">
                <Input
                  placeholder="Coupon code"
                  value={couponCode}
                  onChange={e => setCouponCode(e.target.value)}
                />
                <Button variant="outline" onClick={handleApplyCoupon}>
                  <Tag className="h-4 w-4" />
                </Button>
              </div>

              <Separator />

              <div className="space-y-2 text-sm">
                <div className="flex justify-between">
                  <span className="text-muted-foreground">Subtotal</span>
                  <span>₹{cartTotal.toLocaleString()}</span>
                </div>
                <div className="flex justify-between">
                  <span className="text-muted-foreground">Shipping</span>
                  <span>{shippingCost === 0 ? 'FREE' : `₹${shippingCost}`}</span>
                </div>
                <div className="flex justify-between">
                  <span className="text-muted-foreground">Tax (18% GST)</span>
                  <span>₹{tax.toLocaleString()}</span>
                </div>
                {discount > 0 && (
                  <div className="flex justify-between text-success">
                    <span>Discount</span>
                    <span>-₹{discount.toLocaleString()}</span>
                  </div>
                )}
              </div>

              <Separator />

              <div className="flex justify-between font-semibold text-lg">
                <span>Total</span>
                <span>₹{total.toLocaleString()}</span>
              </div>
            </div>
          </div>
        </div>
      </main>

      <Footer />
    </div>
  );
};

export default Checkout;
