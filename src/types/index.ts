export type LicenseStatus = 'Approved' | 'Pending' | 'Rejected' | 'None';

export type PriceTier = 'standard' | 'silver' | 'gold' | 'platinum';

export interface Customer {
  id: string;
  email: string;
  company_name: string;
  license_status: LicenseStatus;
  price_tier: PriceTier;
}

export interface Product {
  id: string;
  name: string;
  description: string;
  image_url: string;
  price_base: number;
  is_restricted: boolean;
  stock_WHA: number;
  stock_WHB: number;
  category: string;
  sku: string;
}

export interface CartItem {
  product: Product;
  quantity: number;
  calculated_price: number;
}

export interface Order {
  id: string;
  customer_id: string;
  items: CartItem[];
  total: number;
  status: 'Pending' | 'Processing' | 'Shipped' | 'Delivered';
  created_at: string;
}

export const TIER_DISCOUNTS: Record<PriceTier, number> = {
  standard: 0,
  silver: 0.05,
  gold: 0.10,
  platinum: 0.15,
};
