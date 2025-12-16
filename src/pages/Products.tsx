import { useState, useMemo } from 'react';
import { useAuth } from '@/context/AuthContext';
import { mockProducts } from '@/data/mockData';
import { ProductCard } from '@/components/ProductCard';
import { Header } from '@/components/Header';
import { Input } from '@/components/ui/input';
import { Badge } from '@/components/ui/badge';
import { Button } from '@/components/ui/button';
import { Search, Filter, Package } from 'lucide-react';
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from '@/components/ui/select';

export default function Products() {
  const { customer } = useAuth();
  const [search, setSearch] = useState('');
  const [categoryFilter, setCategoryFilter] = useState<string>('all');
  const [stockFilter, setStockFilter] = useState<string>('all');

  // Filter products based on license status and search
  const filteredProducts = useMemo(() => {
    return mockProducts.filter(product => {
      // License check: Only show restricted products if customer has approved license
      if (product.is_restricted && customer?.license_status !== 'Approved') {
        return false;
      }

      // Search filter
      if (search) {
        const searchLower = search.toLowerCase();
        if (
          !product.name.toLowerCase().includes(searchLower) &&
          !product.sku.toLowerCase().includes(searchLower) &&
          !product.category.toLowerCase().includes(searchLower)
        ) {
          return false;
        }
      }

      // Category filter
      if (categoryFilter !== 'all' && product.category !== categoryFilter) {
        return false;
      }

      // Stock filter
      if (stockFilter === 'in-stock' && product.stock_WHA === 0 && product.stock_WHB === 0) {
        return false;
      }
      if (stockFilter === 'ships-today' && product.stock_WHA === 0) {
        return false;
      }

      return true;
    });
  }, [customer, search, categoryFilter, stockFilter]);

  const categories = useMemo(() => {
    const cats = new Set(mockProducts.map(p => p.category));
    return Array.from(cats);
  }, []);

  const restrictedCount = mockProducts.filter(p => p.is_restricted).length;
  const visibleRestrictedCount = filteredProducts.filter(p => p.is_restricted).length;

  return (
    <div className="min-h-screen bg-background">
      <Header />
      
      <main className="container py-8">
        {/* Hero Section */}
        <div className="mb-8 animate-fade-in">
          <h1 className="font-display text-3xl font-bold text-foreground md:text-4xl">
            Product Catalog
          </h1>
          <p className="mt-2 text-muted-foreground">
            Browse our wholesale inventory with tier-based pricing
          </p>
          
          {customer?.license_status !== 'Approved' && (
            <div className="mt-4 flex items-center gap-2 rounded-lg border border-warning/30 bg-warning/10 px-4 py-3">
              <Package className="h-5 w-5 text-warning" />
              <p className="text-sm text-warning">
                <span className="font-semibold">{restrictedCount} restricted products</span> are hidden. 
                Get your license approved to access the full catalog.
              </p>
            </div>
          )}
        </div>

        {/* Filters */}
        <div className="mb-6 flex flex-col gap-4 rounded-lg border border-border/50 bg-card p-4 md:flex-row md:items-center animate-fade-in" style={{ animationDelay: '0.1s' }}>
          <div className="relative flex-1">
            <Search className="absolute left-3 top-1/2 h-4 w-4 -translate-y-1/2 text-muted-foreground" />
            <Input
              placeholder="Search products, SKUs..."
              value={search}
              onChange={(e) => setSearch(e.target.value)}
              className="pl-10"
            />
          </div>
          
          <div className="flex flex-wrap gap-3">
            <Select value={categoryFilter} onValueChange={setCategoryFilter}>
              <SelectTrigger className="w-[160px]">
                <Filter className="mr-2 h-4 w-4" />
                <SelectValue placeholder="Category" />
              </SelectTrigger>
              <SelectContent>
                <SelectItem value="all">All Categories</SelectItem>
                {categories.map(cat => (
                  <SelectItem key={cat} value={cat}>{cat}</SelectItem>
                ))}
              </SelectContent>
            </Select>

            <Select value={stockFilter} onValueChange={setStockFilter}>
              <SelectTrigger className="w-[160px]">
                <SelectValue placeholder="Availability" />
              </SelectTrigger>
              <SelectContent>
                <SelectItem value="all">All Stock</SelectItem>
                <SelectItem value="in-stock">In Stock</SelectItem>
                <SelectItem value="ships-today">Ships Today</SelectItem>
              </SelectContent>
            </Select>
          </div>
        </div>

        {/* Results count */}
        <div className="mb-4 flex items-center gap-2 animate-fade-in" style={{ animationDelay: '0.15s' }}>
          <Badge variant="secondary">{filteredProducts.length} products</Badge>
          {customer?.license_status === 'Approved' && visibleRestrictedCount > 0 && (
            <Badge variant="outline" className="gap-1">
              {visibleRestrictedCount} licensed
            </Badge>
          )}
        </div>

        {/* Product Grid */}
        <div className="grid gap-6 sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4">
          {filteredProducts.map((product, index) => (
            <div key={product.id} style={{ animationDelay: `${0.2 + index * 0.05}s` }}>
              <ProductCard product={product} />
            </div>
          ))}
        </div>

        {filteredProducts.length === 0 && (
          <div className="flex flex-col items-center justify-center py-16 text-center animate-fade-in">
            <Package className="h-16 w-16 text-muted-foreground/50" />
            <h3 className="mt-4 font-display text-xl font-semibold">No products found</h3>
            <p className="mt-2 text-muted-foreground">
              Try adjusting your filters or search terms
            </p>
            <Button
              variant="outline"
              className="mt-4"
              onClick={() => {
                setSearch('');
                setCategoryFilter('all');
                setStockFilter('all');
              }}
            >
              Clear Filters
            </Button>
          </div>
        )}
      </main>
    </div>
  );
}
