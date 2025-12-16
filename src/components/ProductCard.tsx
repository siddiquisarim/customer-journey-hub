import { useState } from 'react';
import { Product } from '@/types';
import { Card, CardContent, CardFooter } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Badge } from '@/components/ui/badge';
import { StockBadge } from './StockBadge';
import { useCart } from '@/context/CartContext';
import { useAuth } from '@/context/AuthContext';
import { ShoppingCart, Plus, Minus, Lock } from 'lucide-react';
import { toast } from 'sonner';

interface ProductCardProps {
  product: Product;
}

export function ProductCard({ product }: ProductCardProps) {
  const [quantity, setQuantity] = useState(1);
  const { addToCart, calculatePrice } = useCart();
  const { customer } = useAuth();

  const price = calculatePrice(product.price_base);
  const hasDiscount = price < product.price_base;
  const isOutOfStock = product.stock_WHA === 0 && product.stock_WHB === 0;

  const handleAddToCart = () => {
    addToCart(product, quantity);
    toast.success(`Added ${quantity}x ${product.name} to cart`);
    setQuantity(1);
  };

  return (
    <Card className="group overflow-hidden border-border/50 bg-card transition-all duration-300 hover:border-primary/30 hover:shadow-lg animate-fade-in">
      <div className="relative aspect-square overflow-hidden bg-muted/50">
        <img
          src={product.image_url}
          alt={product.name}
          className="h-full w-full object-cover transition-transform duration-300 group-hover:scale-105"
        />
        <div className="absolute left-3 top-3 flex flex-col gap-2">
          {product.is_restricted && (
            <Badge variant="secondary" className="gap-1 bg-card/90 backdrop-blur-sm">
              <Lock className="h-3 w-3" />
              Licensed
            </Badge>
          )}
        </div>
        <div className="absolute right-3 top-3">
          <StockBadge stockWHA={product.stock_WHA} stockWHB={product.stock_WHB} />
        </div>
      </div>

      <CardContent className="p-4">
        <p className="text-xs font-medium uppercase tracking-wider text-muted-foreground">
          {product.category} • {product.sku}
        </p>
        <h3 className="mt-1 font-display text-lg font-semibold leading-tight text-foreground">
          {product.name}
        </h3>
        <p className="mt-2 line-clamp-2 text-sm text-muted-foreground">
          {product.description}
        </p>
        
        <div className="mt-4 flex items-baseline gap-2">
          <span className="font-display text-2xl font-bold text-foreground">
            ${price.toFixed(2)}
          </span>
          {hasDiscount && (
            <span className="text-sm text-muted-foreground line-through">
              ${product.price_base.toFixed(2)}
            </span>
          )}
          {hasDiscount && customer && (
            <Badge variant="success" className="text-xs">
              {customer.price_tier.charAt(0).toUpperCase() + customer.price_tier.slice(1)} Price
            </Badge>
          )}
        </div>
      </CardContent>

      <CardFooter className="flex items-center gap-3 border-t border-border/50 bg-muted/30 p-4">
        <div className="flex items-center rounded-lg border border-border bg-card">
          <Button
            variant="ghost"
            size="icon"
            className="h-8 w-8 rounded-r-none"
            onClick={() => setQuantity(Math.max(1, quantity - 1))}
          >
            <Minus className="h-4 w-4" />
          </Button>
          <span className="w-10 text-center text-sm font-medium">{quantity}</span>
          <Button
            variant="ghost"
            size="icon"
            className="h-8 w-8 rounded-l-none"
            onClick={() => setQuantity(quantity + 1)}
          >
            <Plus className="h-4 w-4" />
          </Button>
        </div>
        
        <Button
          className="flex-1"
          onClick={handleAddToCart}
          disabled={isOutOfStock}
        >
          <ShoppingCart className="h-4 w-4" />
          {isOutOfStock ? 'Out of Stock' : 'Add to Cart'}
        </Button>
      </CardFooter>
    </Card>
  );
}
