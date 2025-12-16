import { CartItem as CartItemType } from '@/types';
import { Button } from '@/components/ui/button';
import { useCart } from '@/context/CartContext';
import { StockBadge } from './StockBadge';
import { Trash2, Plus, Minus } from 'lucide-react';

interface CartItemProps {
  item: CartItemType;
}

export function CartItemCard({ item }: CartItemProps) {
  const { updateQuantity, removeFromCart } = useCart();
  const { product, quantity, calculated_price } = item;

  return (
    <div className="flex gap-4 rounded-lg border border-border/50 bg-card p-4 animate-fade-in">
      <div className="h-20 w-20 flex-shrink-0 overflow-hidden rounded-md bg-muted">
        <img
          src={product.image_url}
          alt={product.name}
          className="h-full w-full object-cover"
        />
      </div>

      <div className="flex flex-1 flex-col justify-between">
        <div>
          <div className="flex items-start justify-between">
            <div>
              <h3 className="font-semibold text-foreground">{product.name}</h3>
              <p className="text-xs text-muted-foreground">{product.sku}</p>
            </div>
            <StockBadge stockWHA={product.stock_WHA} stockWHB={product.stock_WHB} />
          </div>
        </div>

        <div className="mt-2 flex items-center justify-between">
          <div className="flex items-center gap-2">
            <Button
              variant="outline"
              size="icon"
              className="h-7 w-7"
              onClick={() => updateQuantity(product.id, quantity - 1)}
            >
              <Minus className="h-3 w-3" />
            </Button>
            <span className="w-8 text-center text-sm font-medium">{quantity}</span>
            <Button
              variant="outline"
              size="icon"
              className="h-7 w-7"
              onClick={() => updateQuantity(product.id, quantity + 1)}
            >
              <Plus className="h-3 w-3" />
            </Button>
            <Button
              variant="ghost"
              size="icon"
              className="h-7 w-7 text-destructive hover:bg-destructive/10 hover:text-destructive"
              onClick={() => removeFromCart(product.id)}
            >
              <Trash2 className="h-3 w-3" />
            </Button>
          </div>
          
          <div className="text-right">
            <p className="text-xs text-muted-foreground">
              ${calculated_price.toFixed(2)} each
            </p>
            <p className="font-display text-lg font-bold text-foreground">
              ${(calculated_price * quantity).toFixed(2)}
            </p>
          </div>
        </div>
      </div>
    </div>
  );
}
