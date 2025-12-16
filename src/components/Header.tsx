import { Link } from 'react-router-dom';
import { Button } from '@/components/ui/button';
import { Badge } from '@/components/ui/badge';
import { useAuth } from '@/context/AuthContext';
import { useCart } from '@/context/CartContext';
import { ShoppingCart, LogOut, User, Building2 } from 'lucide-react';
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuLabel,
  DropdownMenuSeparator,
  DropdownMenuTrigger,
} from '@/components/ui/dropdown-menu';

export function Header() {
  const { customer, logout } = useAuth();
  const { getItemCount } = useCart();
  const itemCount = getItemCount();

  const getTierColor = (tier: string) => {
    switch (tier) {
      case 'platinum': return 'bg-gradient-to-r from-slate-400 to-slate-600';
      case 'gold': return 'bg-gradient-to-r from-amber-400 to-amber-600';
      case 'silver': return 'bg-gradient-to-r from-gray-300 to-gray-500';
      default: return 'bg-secondary';
    }
  };

  return (
    <header className="sticky top-0 z-50 border-b border-border/50 bg-card/80 backdrop-blur-lg">
      <div className="container flex h-14 items-center justify-between px-4 sm:h-16">
        <Link to="/" className="flex items-center gap-2">
          <div className="flex h-8 w-8 items-center justify-center rounded-lg bg-primary sm:h-9 sm:w-9">
            <Building2 className="h-4 w-4 text-primary-foreground sm:h-5 sm:w-5" />
          </div>
          <span className="font-display text-lg font-bold text-foreground sm:text-xl">
            ProSupply
          </span>
        </Link>

        <div className="flex items-center gap-2 sm:gap-4">
          <Link to="/cart">
            <Button variant="outline" size="sm" className="relative gap-1.5 px-2.5 sm:gap-2 sm:px-4">
              <ShoppingCart className="h-4 w-4" />
              <span className="hidden sm:inline">Cart</span>
              {itemCount > 0 && (
                <Badge className="absolute -right-1.5 -top-1.5 h-5 w-5 rounded-full p-0 text-xs sm:-right-2 sm:-top-2">
                  {itemCount}
                </Badge>
              )}
            </Button>
          </Link>

          {customer && (
            <DropdownMenu>
              <DropdownMenuTrigger asChild>
                <Button variant="ghost" size="sm" className="gap-1.5 px-2 sm:gap-2 sm:px-4">
                  <div className="flex h-7 w-7 items-center justify-center rounded-full bg-primary/10 sm:h-8 sm:w-8">
                    <User className="h-3.5 w-3.5 text-primary sm:h-4 sm:w-4" />
                  </div>
                  <span className="hidden md:inline max-w-[120px] truncate">{customer.company_name}</span>
                </Button>
              </DropdownMenuTrigger>
              <DropdownMenuContent align="end" className="w-64">
                <DropdownMenuLabel>
                  <div className="flex flex-col gap-1">
                    <span className="font-semibold">{customer.company_name}</span>
                    <span className="text-xs font-normal text-muted-foreground">
                      {customer.email}
                    </span>
                  </div>
                </DropdownMenuLabel>
                <DropdownMenuSeparator />
                <DropdownMenuItem className="flex items-center justify-between">
                  <span>Price Tier</span>
                  <Badge className={`${getTierColor(customer.price_tier)} text-white`}>
                    {customer.price_tier.charAt(0).toUpperCase() + customer.price_tier.slice(1)}
                  </Badge>
                </DropdownMenuItem>
                <DropdownMenuItem className="flex items-center justify-between">
                  <span>License Status</span>
                  <Badge variant={customer.license_status === 'Approved' ? 'success' : 'muted'}>
                    {customer.license_status}
                  </Badge>
                </DropdownMenuItem>
                <DropdownMenuSeparator />
                <DropdownMenuItem onClick={logout} className="text-destructive">
                  <LogOut className="mr-2 h-4 w-4" />
                  Sign Out
                </DropdownMenuItem>
              </DropdownMenuContent>
            </DropdownMenu>
          )}
        </div>
      </div>
    </header>
  );
}
