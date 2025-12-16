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
        <div className="absolute left-2 top-2 flex flex-col gap-1.5 sm:left-3 sm:top-3 sm:gap-2">
          {product.is_restricted && (
            <Badge variant="secondary" className="gap-1 bg-card/90 backdrop-blur-sm text-xs">
              <Lock className="h-3 w-3" />
              Licensed
            </Badge>
          )}
        </div>
        <div className="absolute right-2 top-2 sm:right-3 sm:top-3">
          <StockBadge stockWHA={product.stock_WHA} stockWHB={product.stock_WHB} />
        </div>
      </div>

      <CardContent className="p-3 sm:p-4">
        <p className="text-[10px] font-medium uppercase tracking-wider text-muted-foreground sm:text-xs">
          {product.category} • {product.sku}
        </p>
        <h3 className="mt-1 font-display text-base font-semibold leading-tight text-foreground sm:text-lg">
          {product.name}
        </h3>
        <p className="mt-1.5 line-clamp-2 text-xs text-muted-foreground sm:mt-2 sm:text-sm">
          {product.description}
        </p>
        
        <div className="mt-3 flex flex-wrap items-baseline gap-1.5 sm:mt-4 sm:gap-2">
          <span className="font-display text-xl font-bold text-foreground sm:text-2xl">
            ${price.toFixed(2)}
          </span>
          {hasDiscount && (
            <span className="text-xs text-muted-foreground line-through sm:text-sm">
              ${product.price_base.toFixed(2)}
            </span>
          )}
          {hasDiscount && customer && (
            <Badge variant="success" className="text-[10px] sm:text-xs">
              {customer.price_tier.charAt(0).toUpperCase() + customer.price_tier.slice(1)}
            </Badge>
          )}
        </div>
      </CardContent>

      <CardFooter className="flex items-center gap-2 border-t border-border/50 bg-muted/30 p-2.5 sm:gap-3 sm:p-4">
        <div className="flex items-center rounded-lg border border-border bg-card">
          <Button
            variant="ghost"
            size="icon"
            className="h-7 w-7 rounded-r-none sm:h-8 sm:w-8"
            onClick={() => setQuantity(Math.max(1, quantity - 1))}
          >
            <Minus className="h-3 w-3 sm:h-4 sm:w-4" />
          </Button>
          <span className="w-8 text-center text-xs font-medium sm:w-10 sm:text-sm">{quantity}</span>
          <Button
            variant="ghost"
            size="icon"
            className="h-7 w-7 rounded-l-none sm:h-8 sm:w-8"
            onClick={() => setQuantity(quantity + 1)}
          >
            <Plus className="h-3 w-3 sm:h-4 sm:w-4" />
          </Button>
        </div>
        
        <Button
          className="flex-1 h-8 text-xs sm:h-10 sm:text-sm"
          onClick={handleAddToCart}
          disabled={isOutOfStock}
        >
          <ShoppingCart className="h-3.5 w-3.5 sm:h-4 sm:w-4" />
          <span className="ml-1.5">{isOutOfStock ? 'Out of Stock' : 'Add'}</span>
        </Button>
      </CardFooter>
    </Card>
  );
}
