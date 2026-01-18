import { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { CreditCard, Smartphone, Wallet, Building2, Truck, ArrowLeft, CheckCircle2 } from 'lucide-react';
import Header from '@/components/layout/Header';
import Footer from '@/components/layout/Footer';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { RadioGroup, RadioGroupItem } from '@/components/ui/radio-group';
import { useStore } from '@/contexts/StoreContext';

const Payment = () => {
  const navigate = useNavigate();
  const { cart, cartTotal, addOrder, clearCart } = useStore();
  const [paymentMethod, setPaymentMethod] = useState('card');
  const [isProcessing, setIsProcessing] = useState(false);

  const [cardDetails, setCardDetails] = useState({
    number: '',
    name: '',
    expiry: '',
    cvv: ''
  });

  const [upiId, setUpiId] = useState('');

  const shipping = cartTotal >= 2000 ? 0 : 99;
  const tax = Math.round(cartTotal * 0.18);
  const total = cartTotal + shipping + tax;

  const handlePlaceOrder = async () => {
    setIsProcessing(true);

    // Simulate payment processing
    await new Promise(resolve => setTimeout(resolve, 2000));

    const storedAddress = localStorage.getItem('checkout_address');
    const addressData = storedAddress ? JSON.parse(storedAddress) : {};

    const orderId = `ORD${Date.now()}`;
    const order = {
      id: orderId,
      customerName: addressData.fullName || 'Guest',
      customerEmail: addressData.email || 'guest@example.com',
      customerPhone: addressData.phone || '',
      items: cart.map(item => ({
        productId: item.productId,
        productName: item.product.name,
        productImage: item.product.images[0],
        quantity: item.quantity,
        size: item.size,
        color: item.color,
        price: item.product.price
      })),
      shippingAddress: {
        id: '1',
        fullName: addressData.fullName || '',
        phone: addressData.phone || '',
        street: addressData.addressLine1 || '',
        apartment: addressData.addressLine2 || '',
        city: addressData.city || '',
        state: addressData.state || '',
        postalCode: addressData.pincode || '',
        country: 'India'
      },
      shippingMethod: 'Standard',
      shippingCost: shipping,
      paymentMethod,
      subtotal: cartTotal,
      tax,
      discount: 0,
      total,
      status: 'pending' as const,
      paymentStatus: 'paid' as const,
      createdAt: new Date().toISOString(),
      updatedAt: new Date().toISOString()
    };

    addOrder(order);
    localStorage.removeItem('checkout_address');
    
    setIsProcessing(false);
    navigate(`/order-success/${orderId}`);
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
              <div className="w-8 h-8 rounded-full bg-primary text-primary-foreground flex items-center justify-center">
                <CheckCircle2 className="h-5 w-5" />
              </div>
              <span className="font-medium">Address</span>
            </div>
            <div className="w-12 h-0.5 bg-primary" />
            <div className="flex items-center gap-2">
              <div className="w-8 h-8 rounded-full bg-primary text-primary-foreground flex items-center justify-center font-medium">2</div>
              <span className="font-medium">Payment</span>
            </div>
            <div className="w-12 h-0.5 bg-muted" />
            <div className="flex items-center gap-2">
              <div className="w-8 h-8 rounded-full bg-muted text-muted-foreground flex items-center justify-center font-medium">3</div>
              <span className="text-muted-foreground">Confirm</span>
            </div>
          </div>

          <div className="grid lg:grid-cols-3 gap-8">
            {/* Payment Methods */}
            <div className="lg:col-span-2 space-y-6">
              <div className="bg-card rounded-lg p-6">
                <h2 className="text-xl font-semibold mb-6">Payment Method</h2>

                <RadioGroup value={paymentMethod} onValueChange={setPaymentMethod} className="space-y-4">
                  {/* Credit/Debit Card */}
                  <div className={`border rounded-lg p-4 transition-colors ${paymentMethod === 'card' ? 'border-primary bg-primary/5' : ''}`}>
                    <div className="flex items-center gap-3">
                      <RadioGroupItem value="card" id="card" />
                      <Label htmlFor="card" className="flex items-center gap-2 cursor-pointer">
                        <CreditCard className="h-5 w-5" />
                        Credit / Debit Card
                      </Label>
                    </div>
                    
                    {paymentMethod === 'card' && (
                      <div className="mt-4 space-y-4 pl-6">
                        <div>
                          <Label>Card Number</Label>
                          <Input
                            placeholder="1234 5678 9012 3456"
                            value={cardDetails.number}
                            onChange={e => setCardDetails({ ...cardDetails, number: e.target.value })}
                          />
                        </div>
                        <div>
                          <Label>Cardholder Name</Label>
                          <Input
                            placeholder="John Doe"
                            value={cardDetails.name}
                            onChange={e => setCardDetails({ ...cardDetails, name: e.target.value })}
                          />
                        </div>
                        <div className="grid grid-cols-2 gap-4">
                          <div>
                            <Label>Expiry Date</Label>
                            <Input
                              placeholder="MM/YY"
                              value={cardDetails.expiry}
                              onChange={e => setCardDetails({ ...cardDetails, expiry: e.target.value })}
                            />
                          </div>
                          <div>
                            <Label>CVV</Label>
                            <Input
                              type="password"
                              placeholder="123"
                              maxLength={4}
                              value={cardDetails.cvv}
                              onChange={e => setCardDetails({ ...cardDetails, cvv: e.target.value })}
                            />
                          </div>
                        </div>
                      </div>
                    )}
                  </div>

                  {/* UPI */}
                  <div className={`border rounded-lg p-4 transition-colors ${paymentMethod === 'upi' ? 'border-primary bg-primary/5' : ''}`}>
                    <div className="flex items-center gap-3">
                      <RadioGroupItem value="upi" id="upi" />
                      <Label htmlFor="upi" className="flex items-center gap-2 cursor-pointer">
                        <Smartphone className="h-5 w-5" />
                        UPI Payment
                      </Label>
                    </div>
                    
                    {paymentMethod === 'upi' && (
                      <div className="mt-4 pl-6">
                        <Label>UPI ID</Label>
                        <Input
                          placeholder="yourname@upi"
                          value={upiId}
                          onChange={e => setUpiId(e.target.value)}
                        />
                        <p className="text-xs text-muted-foreground mt-2">
                          Enter your UPI ID (e.g., yourname@paytm, yourname@gpay)
                        </p>
                      </div>
                    )}
                  </div>

                  {/* Digital Wallets */}
                  <div className={`border rounded-lg p-4 transition-colors ${paymentMethod === 'wallet' ? 'border-primary bg-primary/5' : ''}`}>
                    <div className="flex items-center gap-3">
                      <RadioGroupItem value="wallet" id="wallet" />
                      <Label htmlFor="wallet" className="flex items-center gap-2 cursor-pointer">
                        <Wallet className="h-5 w-5" />
                        Digital Wallets
                      </Label>
                    </div>
                    
                    {paymentMethod === 'wallet' && (
                      <div className="mt-4 pl-6 flex flex-wrap gap-3">
                        <Button variant="outline" className="h-12 px-6">PayPal</Button>
                        <Button variant="outline" className="h-12 px-6">Apple Pay</Button>
                        <Button variant="outline" className="h-12 px-6">Google Pay</Button>
                        <Button variant="outline" className="h-12 px-6">Amazon Pay</Button>
                      </div>
                    )}
                  </div>

                  {/* Net Banking */}
                  <div className={`border rounded-lg p-4 transition-colors ${paymentMethod === 'netbanking' ? 'border-primary bg-primary/5' : ''}`}>
                    <div className="flex items-center gap-3">
                      <RadioGroupItem value="netbanking" id="netbanking" />
                      <Label htmlFor="netbanking" className="flex items-center gap-2 cursor-pointer">
                        <Building2 className="h-5 w-5" />
                        Net Banking
                      </Label>
                    </div>
                    
                    {paymentMethod === 'netbanking' && (
                      <div className="mt-4 pl-6 grid grid-cols-2 sm:grid-cols-4 gap-3">
                        <Button variant="outline" className="h-12">HDFC</Button>
                        <Button variant="outline" className="h-12">ICICI</Button>
                        <Button variant="outline" className="h-12">SBI</Button>
                        <Button variant="outline" className="h-12">Axis</Button>
                      </div>
                    )}
                  </div>

                  {/* Cash on Delivery */}
                  <div className={`border rounded-lg p-4 transition-colors ${paymentMethod === 'cod' ? 'border-primary bg-primary/5' : ''}`}>
                    <div className="flex items-center gap-3">
                      <RadioGroupItem value="cod" id="cod" />
                      <Label htmlFor="cod" className="flex items-center gap-2 cursor-pointer">
                        <Truck className="h-5 w-5" />
                        Cash on Delivery
                      </Label>
                    </div>
                    
                    {paymentMethod === 'cod' && (
                      <p className="mt-4 pl-6 text-sm text-muted-foreground">
                        Pay with cash when your order is delivered. An additional ₹50 COD charge may apply.
                      </p>
                    )}
                  </div>
                </RadioGroup>
              </div>

              <div className="flex gap-4">
                <Button variant="outline" onClick={() => navigate('/placeorder')}>
                  <ArrowLeft className="h-4 w-4 mr-2" />
                  Back to Address
                </Button>
                <Button 
                  className="flex-1" 
                  size="lg"
                  onClick={handlePlaceOrder}
                  disabled={isProcessing}
                >
                  {isProcessing ? 'Processing...' : `Place Order - ₹${total.toLocaleString()}`}
                </Button>
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
                  {paymentMethod === 'cod' && (
                    <div className="flex justify-between">
                      <span className="text-muted-foreground">COD Charge</span>
                      <span>₹50</span>
                    </div>
                  )}
                </div>

                <div className="border-t pt-4 flex justify-between font-semibold text-lg">
                  <span>Total</span>
                  <span>₹{(total + (paymentMethod === 'cod' ? 50 : 0)).toLocaleString()}</span>
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

export default Payment;
