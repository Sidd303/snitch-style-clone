import { motion } from 'framer-motion';
import ProductCard from '@/components/products/ProductCard';
import productShirt1 from '@/assets/product-shirt-1.jpg';
import productTrousers1 from '@/assets/product-trousers-1.jpg';
import productSweater1 from '@/assets/product-sweater-1.jpg';
import productJacket1 from '@/assets/product-jacket-1.jpg';
import productJeans1 from '@/assets/product-jeans-1.jpg';
import productShirt2 from '@/assets/product-shirt-2.jpg';
import productChinos1 from '@/assets/product-chinos-1.jpg';

const products = [
  {
    id: '1',
    name: 'Classic Navy Oxford Shirt',
    price: 1499,
    image: productShirt1,
    isNew: true,
  },
  {
    id: '2',
    name: 'Olive Cargo Trousers',
    price: 1799,
    originalPrice: 2499,
    image: productTrousers1,
    isSale: true,
    discount: 28,
  },
  {
    id: '3',
    name: 'Burgundy Crew Neck Sweater',
    price: 1999,
    image: productSweater1,
  },
  {
    id: '4',
    name: 'Black Bomber Jacket',
    price: 3499,
    image: productJacket1,
    isNew: true,
  },
  {
    id: '5',
    name: 'Dark Wash Slim Fit Jeans',
    price: 1899,
    originalPrice: 2299,
    image: productJeans1,
    isSale: true,
    discount: 17,
  },
  {
    id: '6',
    name: 'White Linen Casual Shirt',
    price: 1699,
    image: productShirt2,
  },
  {
    id: '7',
    name: 'Tan Classic Chinos',
    price: 1599,
    image: productChinos1,
  },
  {
    id: '8',
    name: 'Premium Oxford Blue Shirt',
    price: 1299,
    originalPrice: 1699,
    image: productShirt1,
    isSale: true,
    discount: 24,
  },
];

const FeaturedProducts = () => {
  return (
    <section className="py-12 md:py-20">
      <div className="container-wide">
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          whileInView={{ opacity: 1, y: 0 }}
          viewport={{ once: true }}
          className="text-center mb-10"
        >
          <span className="text-xs tracking-[0.3em] text-muted-foreground uppercase mb-2 block">
            Curated for you
          </span>
          <h2 className="section-title">New Arrivals</h2>
        </motion.div>

        <div className="grid grid-cols-2 md:grid-cols-3 lg:grid-cols-4 gap-4 md:gap-6 lg:gap-8">
          {products.map((product) => (
            <ProductCard key={product.id} {...product} />
          ))}
        </div>

        <motion.div
          initial={{ opacity: 0 }}
          whileInView={{ opacity: 1 }}
          viewport={{ once: true }}
          className="text-center mt-12"
        >
          <button className="btn-outline">
            View All Products
          </button>
        </motion.div>
      </div>
    </section>
  );
};

export default FeaturedProducts;
