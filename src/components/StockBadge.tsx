import { Badge } from '@/components/ui/badge';
import { Package, Truck, Clock, Bell } from 'lucide-react';

interface StockBadgeProps {
  stockWHA: number;
  stockWHB: number;
}

export function StockBadge({ stockWHA, stockWHB }: StockBadgeProps) {
  if (stockWHA > 0) {
    return (
      <Badge variant="success" className="gap-1">
        <Truck className="h-3 w-3" />
        Ships Today
      </Badge>
    );
  }

  if (stockWHB > 0) {
    return (
      <Badge variant="warning" className="gap-1">
        <Clock className="h-3 w-3" />
        Ships Tomorrow
      </Badge>
    );
  }

  return (
    <Badge variant="muted" className="gap-1">
      <Bell className="h-3 w-3" />
      Backorder
    </Badge>
  );
}
