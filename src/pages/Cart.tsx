import { useState } from 'react';
import { Link, useNavigate } from 'react-router-dom';
import { useCart } from '@/context/CartContext';
import { useAuth } from '@/context/AuthContext';
import { Header } from '@/components/Header';
import { CartItemCard } from '@/components/CartItem';
import { Button } from '@/components/ui/button';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Badge } from '@/components/ui/badge';
import { Separator } from '@/components/ui/separator';
import { ShoppingCart, ArrowLeft, Loader2, CheckCircle2, Package } from 'lucide-react';
import { toast } from 'sonner';
import { TIER_DISCOUNTS } from '@/types';

export default function Cart() {
  const { items, getTotal, clearCart, getItemCount } = useCart();
  const { customer } = useAuth();
  const navigate = useNavigate();
  const [isProcessing, setIsProcessing] = useState(false);
  const [orderPlaced, setOrderPlaced] = useState(false);

  const subtotal = getTotal();
  const discount = customer ? TIER_DISCOUNTS[customer.price_tier] : 0;
  const discountLabel = customer ? `${customer.price_tier.charAt(0).toUpperCase() + customer.price_tier.slice(1)} Discount (${(discount * 100).toFixed(0)}%)` : '';

  const handleCheckout = async () => {
    setIsProcessing(true);
    
    // Simulate order creation
    await new Promise(resolve => setTimeout(resolve, 1500));
    
    // Create order (mock)
    const orderId = `ORD-${Date.now()}`;
    
    clearCart();
    setOrderPlaced(true);
    toast.success(`Order ${orderId} placed successfully!`);
    
    setIsProcessing(false);
  };

  if (orderPlaced) {
    return (
      <div className="min-h-screen bg-background">
        <Header />
        <main className="container py-16">
          <div className="mx-auto max-w-md text-center animate-fade-in">
            <div className="mx-auto mb-6 flex h-20 w-20 items-center justify-center rounded-full bg-success/10">
              <CheckCircle2 className="h-10 w-10 text-success" />
            </div>
            <h1 className="font-display text-3xl font-bold text-foreground">
              Order Placed!
            </h1>
            <p className="mt-3 text-muted-foreground">
              Your order has been submitted and is now pending processing.
              You'll receive a confirmation email shortly.
            </p>
            <Button
              size="lg"
              className="mt-8"
              onClick={() => {
                setOrderPlaced(false);
                navigate('/');
              }}
            >
              Continue Shopping
            </Button>
          </div>
        </main>
      </div>
    );
  }

  if (items.length === 0) {
    return (
      <div className="min-h-screen bg-background">
        <Header />
        <main className="container py-16">
          <div className="mx-auto max-w-md text-center animate-fade-in">
            <div className="mx-auto mb-6 flex h-20 w-20 items-center justify-center rounded-full bg-muted">
              <ShoppingCart className="h-10 w-10 text-muted-foreground" />
            </div>
            <h1 className="font-display text-3xl font-bold text-foreground">
              Your cart is empty
            </h1>
            <p className="mt-3 text-muted-foreground">
              Add some products to get started with your order
            </p>
            <Button asChild size="lg" className="mt-8">
              <Link to="/">Browse Products</Link>
            </Button>
          </div>
        </main>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-background">
      <Header />
      
      <main className="container py-8">
        <Button
          variant="ghost"
          asChild
          className="mb-6 gap-2 animate-fade-in"
        >
          <Link to="/">
            <ArrowLeft className="h-4 w-4" />
            Continue Shopping
          </Link>
        </Button>

        <div className="grid gap-8 lg:grid-cols-3">
          {/* Cart Items */}
          <div className="lg:col-span-2">
            <div className="mb-4 flex items-center justify-between animate-fade-in">
              <h1 className="font-display text-2xl font-bold text-foreground">
                Shopping Cart
              </h1>
              <Badge variant="secondary">{getItemCount()} items</Badge>
            </div>
            
            <div className="space-y-4">
              {items.map((item, index) => (
                <div key={item.product.id} style={{ animationDelay: `${0.1 + index * 0.05}s` }}>
                  <CartItemCard item={item} />
                </div>
              ))}
            </div>
          </div>

          {/* Order Summary */}
          <div className="animate-fade-in" style={{ animationDelay: '0.2s' }}>
            <Card className="sticky top-24 border-border/50">
              <CardHeader>
                <CardTitle className="font-display">Order Summary</CardTitle>
              </CardHeader>
              <CardContent className="space-y-4">
                <div className="flex items-center justify-between text-sm">
                  <span className="text-muted-foreground">Subtotal</span>
                  <span className="font-medium">${subtotal.toFixed(2)}</span>
                </div>
                
                {discount > 0 && (
                  <div className="flex items-center justify-between text-sm">
                    <span className="text-success">{discountLabel}</span>
                    <span className="font-medium text-success">Applied</span>
                  </div>
                )}

                <div className="flex items-center justify-between text-sm">
                  <span className="text-muted-foreground">Shipping</span>
                  <span className="font-medium">Calculated at checkout</span>
                </div>
                
                <Separator />
                
                <div className="flex items-center justify-between">
                  <span className="font-semibold">Total</span>
                  <span className="font-display text-2xl font-bold text-foreground">
                    ${subtotal.toFixed(2)}
                  </span>
                </div>

                {customer && (
                  <div className="rounded-lg bg-muted/50 p-3">
                    <p className="text-xs text-muted-foreground">
                      <Package className="mr-1 inline h-3 w-3" />
                      Ordering as <span className="font-medium">{customer.company_name}</span>
                    </p>
                  </div>
                )}

                <Button
                  size="lg"
                  className="w-full"
                  onClick={handleCheckout}
                  disabled={isProcessing}
                >
                  {isProcessing ? (
                    <>
                      <Loader2 className="h-4 w-4 animate-spin" />
                      Processing...
                    </>
                  ) : (
                    'Place Order'
                  )}
                </Button>
                
                <p className="text-center text-xs text-muted-foreground">
                  By placing this order, you agree to our terms of service
                </p>
              </CardContent>
            </Card>
          </div>
        </div>
      </main>
    </div>
  );
}
