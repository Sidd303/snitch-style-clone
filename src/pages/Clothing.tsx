import { useState } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { Filter, X, ChevronDown, Grid3X3, LayoutGrid } from 'lucide-react';
import Header from '@/components/layout/Header';
import Footer from '@/components/layout/Footer';
import ProductCard from '@/components/products/ProductCard';
import productShirt1 from '@/assets/product-shirt-1.jpg';
import productTrousers1 from '@/assets/product-trousers-1.jpg';
import productSweater1 from '@/assets/product-sweater-1.jpg';
import productJacket1 from '@/assets/product-jacket-1.jpg';
import productJeans1 from '@/assets/product-jeans-1.jpg';
import productShirt2 from '@/assets/product-shirt-2.jpg';
import productChinos1 from '@/assets/product-chinos-1.jpg';

const allProducts = [
  { id: '1', name: 'Classic Navy Oxford Shirt', price: 1499, image: productShirt1, isNew: true, category: 'shirts' },
  { id: '2', name: 'Olive Cargo Trousers', price: 1799, originalPrice: 2499, image: productTrousers1, isSale: true, discount: 28, category: 'bottoms' },
  { id: '3', name: 'Burgundy Crew Neck Sweater', price: 1999, image: productSweater1, category: 'sweaters' },
  { id: '4', name: 'Black Bomber Jacket', price: 3499, image: productJacket1, isNew: true, category: 'jackets' },
  { id: '5', name: 'Dark Wash Slim Fit Jeans', price: 1899, originalPrice: 2299, image: productJeans1, isSale: true, discount: 17, category: 'bottoms' },
  { id: '6', name: 'White Linen Casual Shirt', price: 1699, image: productShirt2, category: 'shirts' },
  { id: '7', name: 'Tan Classic Chinos', price: 1599, image: productChinos1, category: 'bottoms' },
  { id: '8', name: 'Premium Oxford Blue Shirt', price: 1299, originalPrice: 1699, image: productShirt1, isSale: true, discount: 24, category: 'shirts' },
  { id: '9', name: 'Grey Melange Sweater', price: 1899, image: productSweater1, isNew: true, category: 'sweaters' },
  { id: '10', name: 'Navy Slim Trousers', price: 1999, image: productTrousers1, category: 'bottoms' },
  { id: '11', name: 'Olive Field Jacket', price: 3999, image: productJacket1, category: 'jackets' },
  { id: '12', name: 'Striped Casual Shirt', price: 1399, image: productShirt2, category: 'shirts' },
];

const categories = ['All', 'Shirts', 'Bottoms', 'Jackets', 'Sweaters'];
const sizes = ['XS', 'S', 'M', 'L', 'XL', 'XXL'];
const colors = ['Black', 'White', 'Navy', 'Grey', 'Olive', 'Burgundy'];
const priceRanges = [
  { label: 'Under ₹1000', min: 0, max: 1000 },
  { label: '₹1000 - ₹2000', min: 1000, max: 2000 },
  { label: '₹2000 - ₹3000', min: 2000, max: 3000 },
  { label: 'Over ₹3000', min: 3000, max: Infinity },
];

const sortOptions = [
  { label: 'Newest', value: 'newest' },
  { label: 'Price: Low to High', value: 'price-asc' },
  { label: 'Price: High to Low', value: 'price-desc' },
  { label: 'Best Sellers', value: 'best-sellers' },
];

const Clothing = () => {
  const [isFilterOpen, setIsFilterOpen] = useState(false);
  const [selectedCategory, setSelectedCategory] = useState('All');
  const [selectedSizes, setSelectedSizes] = useState<string[]>([]);
  const [selectedColors, setSelectedColors] = useState<string[]>([]);
  const [sortBy, setSortBy] = useState('newest');
  const [gridCols, setGridCols] = useState<3 | 4>(4);

  const toggleSize = (size: string) => {
    setSelectedSizes((prev) =>
      prev.includes(size) ? prev.filter((s) => s !== size) : [...prev, size]
    );
  };

  const toggleColor = (color: string) => {
    setSelectedColors((prev) =>
      prev.includes(color) ? prev.filter((c) => c !== color) : [...prev, color]
    );
  };

  const clearFilters = () => {
    setSelectedCategory('All');
    setSelectedSizes([]);
    setSelectedColors([]);
  };

  const filteredProducts = allProducts.filter((product) => {
    if (selectedCategory !== 'All' && product.category !== selectedCategory.toLowerCase()) {
      return false;
    }
    return true;
  });

  const sortedProducts = [...filteredProducts].sort((a, b) => {
    switch (sortBy) {
      case 'price-asc':
        return a.price - b.price;
      case 'price-desc':
        return b.price - a.price;
      default:
        return 0;
    }
  });

  const hasActiveFilters = selectedCategory !== 'All' || selectedSizes.length > 0 || selectedColors.length > 0;

  return (
    <div className="min-h-screen flex flex-col">
      <Header />
      <main className="flex-1">
        {/* Page Header */}
        <div className="bg-secondary py-8 md:py-12">
          <div className="container-wide">
            <h1 className="font-display text-3xl md:text-4xl lg:text-5xl font-light text-center">
              Clothing
            </h1>
            <p className="text-muted-foreground text-center mt-2">
              {sortedProducts.length} products
            </p>
          </div>
        </div>

        <div className="container-wide py-8">
          {/* Toolbar */}
          <div className="flex items-center justify-between mb-6 gap-4">
            <button
              onClick={() => setIsFilterOpen(true)}
              className="lg:hidden flex items-center gap-2 px-4 py-2 border border-border"
            >
              <Filter className="h-4 w-4" />
              Filters
              {hasActiveFilters && (
                <span className="bg-foreground text-background text-xs w-5 h-5 rounded-full flex items-center justify-center">
                  !
                </span>
              )}
            </button>

            <div className="hidden lg:flex items-center gap-2">
              {categories.map((cat) => (
                <button
                  key={cat}
                  onClick={() => setSelectedCategory(cat)}
                  className={`px-4 py-2 text-sm transition-colors ${
                    selectedCategory === cat
                      ? 'bg-foreground text-primary-foreground'
                      : 'bg-secondary hover:bg-muted'
                  }`}
                >
                  {cat}
                </button>
              ))}
            </div>

            <div className="flex items-center gap-4">
              <div className="hidden md:flex items-center gap-2">
                <button
                  onClick={() => setGridCols(3)}
                  className={`p-2 ${gridCols === 3 ? 'text-foreground' : 'text-muted-foreground'}`}
                >
                  <Grid3X3 className="h-5 w-5" />
                </button>
                <button
                  onClick={() => setGridCols(4)}
                  className={`p-2 ${gridCols === 4 ? 'text-foreground' : 'text-muted-foreground'}`}
                >
                  <LayoutGrid className="h-5 w-5" />
                </button>
              </div>

              <div className="relative">
                <select
                  value={sortBy}
                  onChange={(e) => setSortBy(e.target.value)}
                  className="appearance-none bg-transparent border border-border px-4 py-2 pr-10 text-sm focus:outline-none focus:ring-1 focus:ring-foreground"
                >
                  {sortOptions.map((option) => (
                    <option key={option.value} value={option.value}>
                      {option.label}
                    </option>
                  ))}
                </select>
                <ChevronDown className="absolute right-3 top-1/2 -translate-y-1/2 h-4 w-4 pointer-events-none" />
              </div>
            </div>
          </div>

          {/* Active Filters */}
          {hasActiveFilters && (
            <div className="flex items-center gap-2 mb-6 flex-wrap">
              <span className="text-sm text-muted-foreground">Active filters:</span>
              {selectedCategory !== 'All' && (
                <button
                  onClick={() => setSelectedCategory('All')}
                  className="flex items-center gap-1 bg-secondary px-3 py-1 text-sm"
                >
                  {selectedCategory}
                  <X className="h-3 w-3" />
                </button>
              )}
              {selectedSizes.map((size) => (
                <button
                  key={size}
                  onClick={() => toggleSize(size)}
                  className="flex items-center gap-1 bg-secondary px-3 py-1 text-sm"
                >
                  {size}
                  <X className="h-3 w-3" />
                </button>
              ))}
              {selectedColors.map((color) => (
                <button
                  key={color}
                  onClick={() => toggleColor(color)}
                  className="flex items-center gap-1 bg-secondary px-3 py-1 text-sm"
                >
                  {color}
                  <X className="h-3 w-3" />
                </button>
              ))}
              <button
                onClick={clearFilters}
                className="text-sm underline text-muted-foreground hover:text-foreground"
              >
                Clear all
              </button>
            </div>
          )}

          <div className="flex gap-8">
            {/* Desktop Filters Sidebar */}
            <aside className="hidden lg:block w-64 flex-shrink-0">
              <div className="sticky top-24 space-y-8">
                {/* Size Filter */}
                <div>
                  <h4 className="font-medium mb-4">Size</h4>
                  <div className="flex flex-wrap gap-2">
                    {sizes.map((size) => (
                      <button
                        key={size}
                        onClick={() => toggleSize(size)}
                        className={`w-10 h-10 border text-sm transition-colors ${
                          selectedSizes.includes(size)
                            ? 'bg-foreground text-primary-foreground border-foreground'
                            : 'border-border hover:border-foreground'
                        }`}
                      >
                        {size}
                      </button>
                    ))}
                  </div>
                </div>

                {/* Color Filter */}
                <div>
                  <h4 className="font-medium mb-4">Color</h4>
                  <div className="space-y-2">
                    {colors.map((color) => (
                      <button
                        key={color}
                        onClick={() => toggleColor(color)}
                        className={`flex items-center gap-3 w-full text-left py-1 text-sm ${
                          selectedColors.includes(color) ? 'font-medium' : 'text-muted-foreground'
                        }`}
                      >
                        <span
                          className={`w-4 h-4 rounded-full border ${
                            selectedColors.includes(color) ? 'ring-2 ring-foreground ring-offset-2' : ''
                          }`}
                          style={{
                            backgroundColor:
                              color === 'Black' ? '#000' :
                              color === 'White' ? '#fff' :
                              color === 'Navy' ? '#1e3a5f' :
                              color === 'Grey' ? '#808080' :
                              color === 'Olive' ? '#708238' :
                              '#722F37',
                          }}
                        />
                        {color}
                      </button>
                    ))}
                  </div>
                </div>

                {/* Price Filter */}
                <div>
                  <h4 className="font-medium mb-4">Price</h4>
                  <div className="space-y-2">
                    {priceRanges.map((range) => (
                      <label
                        key={range.label}
                        className="flex items-center gap-3 text-sm text-muted-foreground hover:text-foreground cursor-pointer"
                      >
                        <input type="checkbox" className="rounded border-border" />
                        {range.label}
                      </label>
                    ))}
                  </div>
                </div>
              </div>
            </aside>

            {/* Product Grid */}
            <div className="flex-1">
              <div
                className={`grid gap-4 md:gap-6 ${
                  gridCols === 3
                    ? 'grid-cols-2 lg:grid-cols-3'
                    : 'grid-cols-2 md:grid-cols-3 lg:grid-cols-4'
                }`}
              >
                {sortedProducts.map((product) => (
                  <ProductCard key={product.id} {...product} />
                ))}
              </div>

              {sortedProducts.length === 0 && (
                <div className="text-center py-20">
                  <p className="text-muted-foreground">No products found.</p>
                  <button
                    onClick={clearFilters}
                    className="mt-4 underline hover:text-foreground"
                  >
                    Clear filters
                  </button>
                </div>
              )}
            </div>
          </div>
        </div>
      </main>
      <Footer />

      {/* Mobile Filter Drawer */}
      <AnimatePresence>
        {isFilterOpen && (
          <>
            <motion.div
              initial={{ opacity: 0 }}
              animate={{ opacity: 1 }}
              exit={{ opacity: 0 }}
              className="fixed inset-0 bg-foreground/20 z-50 lg:hidden"
              onClick={() => setIsFilterOpen(false)}
            />
            <motion.div
              initial={{ x: '-100%' }}
              animate={{ x: 0 }}
              exit={{ x: '-100%' }}
              transition={{ type: 'tween' }}
              className="fixed top-0 left-0 bottom-0 w-80 max-w-[85vw] bg-background z-50 overflow-y-auto lg:hidden"
            >
              <div className="p-6">
                <div className="flex items-center justify-between mb-8">
                  <h3 className="font-display text-xl font-medium">Filters</h3>
                  <button onClick={() => setIsFilterOpen(false)}>
                    <X className="h-6 w-6" />
                  </button>
                </div>

                {/* Category */}
                <div className="mb-8">
                  <h4 className="font-medium mb-4">Category</h4>
                  <div className="space-y-2">
                    {categories.map((cat) => (
                      <button
                        key={cat}
                        onClick={() => setSelectedCategory(cat)}
                        className={`block w-full text-left py-2 text-sm ${
                          selectedCategory === cat ? 'font-medium' : 'text-muted-foreground'
                        }`}
                      >
                        {cat}
                      </button>
                    ))}
                  </div>
                </div>

                {/* Size */}
                <div className="mb-8">
                  <h4 className="font-medium mb-4">Size</h4>
                  <div className="flex flex-wrap gap-2">
                    {sizes.map((size) => (
                      <button
                        key={size}
                        onClick={() => toggleSize(size)}
                        className={`w-10 h-10 border text-sm ${
                          selectedSizes.includes(size)
                            ? 'bg-foreground text-primary-foreground border-foreground'
                            : 'border-border'
                        }`}
                      >
                        {size}
                      </button>
                    ))}
                  </div>
                </div>

                {/* Actions */}
                <div className="flex gap-3 mt-8">
                  <button
                    onClick={clearFilters}
                    className="flex-1 py-3 border border-border text-sm"
                  >
                    Clear
                  </button>
                  <button
                    onClick={() => setIsFilterOpen(false)}
                    className="flex-1 py-3 bg-foreground text-primary-foreground text-sm"
                  >
                    Apply
                  </button>
                </div>
              </div>
            </motion.div>
          </>
        )}
      </AnimatePresence>
    </div>
  );
};

export default Clothing;
