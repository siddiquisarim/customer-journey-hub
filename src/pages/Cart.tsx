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
        <main className="container px-4 py-12 sm:py-16">
          <div className="mx-auto max-w-md text-center animate-fade-in">
            <div className="mx-auto mb-4 flex h-16 w-16 items-center justify-center rounded-full bg-success/10 sm:mb-6 sm:h-20 sm:w-20">
              <CheckCircle2 className="h-8 w-8 text-success sm:h-10 sm:w-10" />
            </div>
            <h1 className="font-display text-2xl font-bold text-foreground sm:text-3xl">
              Order Placed!
            </h1>
            <p className="mt-2 text-sm text-muted-foreground sm:mt-3 sm:text-base">
              Your order has been submitted and is now pending processing.
              You'll receive a confirmation email shortly.
            </p>
            <Button
              size="lg"
              className="mt-6 w-full sm:mt-8 sm:w-auto"
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
        <main className="container px-4 py-12 sm:py-16">
          <div className="mx-auto max-w-md text-center animate-fade-in">
            <div className="mx-auto mb-4 flex h-16 w-16 items-center justify-center rounded-full bg-muted sm:mb-6 sm:h-20 sm:w-20">
              <ShoppingCart className="h-8 w-8 text-muted-foreground sm:h-10 sm:w-10" />
            </div>
            <h1 className="font-display text-2xl font-bold text-foreground sm:text-3xl">
              Your cart is empty
            </h1>
            <p className="mt-2 text-sm text-muted-foreground sm:mt-3 sm:text-base">
              Add some products to get started with your order
            </p>
            <Button asChild size="lg" className="mt-6 w-full sm:mt-8 sm:w-auto">
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
      
      <main className="container px-4 py-4 sm:py-8">
        <Button
          variant="ghost"
          asChild
          size="sm"
          className="mb-4 gap-1.5 sm:mb-6 sm:gap-2 animate-fade-in"
        >
          <Link to="/">
            <ArrowLeft className="h-4 w-4" />
            Continue Shopping
          </Link>
        </Button>

        <div className="grid gap-4 sm:gap-8 lg:grid-cols-3">
          {/* Cart Items */}
          <div className="lg:col-span-2">
            <div className="mb-3 flex items-center justify-between sm:mb-4 animate-fade-in">
              <h1 className="font-display text-xl font-bold text-foreground sm:text-2xl">
                Shopping Cart
              </h1>
              <Badge variant="secondary" className="text-xs">{getItemCount()} items</Badge>
            </div>
            
            <div className="space-y-3 sm:space-y-4">
              {items.map((item, index) => (
                <div key={item.product.id} style={{ animationDelay: `${0.1 + index * 0.05}s` }}>
                  <CartItemCard item={item} />
                </div>
              ))}
            </div>
          </div>

          {/* Order Summary */}
          <div className="animate-fade-in" style={{ animationDelay: '0.2s' }}>
            <Card className="sticky top-20 border-border/50 sm:top-24">
              <CardHeader className="p-4 sm:p-6">
                <CardTitle className="font-display text-lg sm:text-xl">Order Summary</CardTitle>
              </CardHeader>
              <CardContent className="space-y-3 p-4 pt-0 sm:space-y-4 sm:p-6 sm:pt-0">
                <div className="flex items-center justify-between text-sm">
                  <span className="text-muted-foreground">Subtotal</span>
                  <span className="font-medium">${subtotal.toFixed(2)}</span>
                </div>
                
                {discount > 0 && (
                  <div className="flex items-center justify-between text-sm">
                    <span className="text-success text-xs sm:text-sm">{discountLabel}</span>
                    <span className="font-medium text-success">Applied</span>
                  </div>
                )}

                <div className="flex items-center justify-between text-xs sm:text-sm">
                  <span className="text-muted-foreground">Shipping</span>
                  <span className="font-medium">Calculated at checkout</span>
                </div>
                
                <Separator />
                
                <div className="flex items-center justify-between">
                  <span className="font-semibold">Total</span>
                  <span className="font-display text-xl font-bold text-foreground sm:text-2xl">
                    ${subtotal.toFixed(2)}
                  </span>
                </div>

                {customer && (
                  <div className="rounded-lg bg-muted/50 p-2.5 sm:p-3">
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
                
                <p className="text-center text-[10px] text-muted-foreground sm:text-xs">
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
