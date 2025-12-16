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
    <div className="flex gap-3 rounded-lg border border-border/50 bg-card p-3 sm:gap-4 sm:p-4 animate-fade-in">
      <div className="h-16 w-16 flex-shrink-0 overflow-hidden rounded-md bg-muted sm:h-20 sm:w-20">
        <img
          src={product.image_url}
          alt={product.name}
          className="h-full w-full object-cover"
        />
      </div>

      <div className="flex flex-1 flex-col justify-between min-w-0">
        <div>
          <div className="flex items-start justify-between gap-2">
            <div className="min-w-0">
              <h3 className="font-semibold text-foreground text-sm sm:text-base truncate">{product.name}</h3>
              <p className="text-[10px] text-muted-foreground sm:text-xs">{product.sku}</p>
            </div>
            <div className="hidden sm:block">
              <StockBadge stockWHA={product.stock_WHA} stockWHB={product.stock_WHB} />
            </div>
          </div>
        </div>

        <div className="mt-2 flex items-center justify-between gap-2">
          <div className="flex items-center gap-1.5 sm:gap-2">
            <Button
              variant="outline"
              size="icon"
              className="h-6 w-6 sm:h-7 sm:w-7"
              onClick={() => updateQuantity(product.id, quantity - 1)}
            >
              <Minus className="h-3 w-3" />
            </Button>
            <span className="w-6 text-center text-xs font-medium sm:w-8 sm:text-sm">{quantity}</span>
            <Button
              variant="outline"
              size="icon"
              className="h-6 w-6 sm:h-7 sm:w-7"
              onClick={() => updateQuantity(product.id, quantity + 1)}
            >
              <Plus className="h-3 w-3" />
            </Button>
            <Button
              variant="ghost"
              size="icon"
              className="h-6 w-6 text-destructive hover:bg-destructive/10 hover:text-destructive sm:h-7 sm:w-7"
              onClick={() => removeFromCart(product.id)}
            >
              <Trash2 className="h-3 w-3" />
            </Button>
          </div>
          
          <div className="text-right">
            <p className="text-[10px] text-muted-foreground sm:text-xs">
              ${calculated_price.toFixed(2)} each
            </p>
            <p className="font-display text-base font-bold text-foreground sm:text-lg">
              ${(calculated_price * quantity).toFixed(2)}
            </p>
          </div>
        </div>
      </div>
    </div>
  );
}
