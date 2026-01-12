import { Link } from 'react-router-dom';
import { motion } from 'framer-motion';
import categoryShirts from '@/assets/category-shirts.jpg';
import categoryBottoms from '@/assets/category-bottoms.jpg';
import categoryJackets from '@/assets/category-jackets.jpg';
import categoryAccessories from '@/assets/category-accessories.jpg';

const categories = [
  {
    id: 1,
    name: 'Shirts',
    image: categoryShirts,
    href: '/clothing/shirts',
  },
  {
    id: 2,
    name: 'Bottoms',
    image: categoryBottoms,
    href: '/clothing/bottoms',
  },
  {
    id: 3,
    name: 'Jackets',
    image: categoryJackets,
    href: '/clothing/jackets',
  },
  {
    id: 4,
    name: 'Accessories',
    image: categoryAccessories,
    href: '/accessories',
  },
];

const CategoryGrid = () => {
  return (
    <section className="py-12 md:py-20">
      <div className="container-wide">
        <motion.h2
          initial={{ opacity: 0, y: 20 }}
          whileInView={{ opacity: 1, y: 0 }}
          viewport={{ once: true }}
          className="section-title mb-10"
        >
          Shop by Category
        </motion.h2>

        <div className="grid grid-cols-2 md:grid-cols-4 gap-4 md:gap-6">
          {categories.map((category, index) => (
            <motion.div
              key={category.id}
              initial={{ opacity: 0, y: 30 }}
              whileInView={{ opacity: 1, y: 0 }}
              viewport={{ once: true }}
              transition={{ delay: index * 0.1 }}
            >
              <Link to={category.href} className="relative overflow-hidden cursor-pointer group block aspect-square">
                <img
                  src={category.image}
                  alt={category.name}
                  className="w-full h-full object-cover transition-transform duration-700 group-hover:scale-110"
                />
                <div className="absolute inset-0 bg-gradient-to-t from-foreground/60 via-foreground/20 to-transparent transition-all duration-500" />
                <div className="absolute inset-0 flex items-end p-4 md:p-6">
                  <h3 className="font-display text-lg md:text-xl font-medium text-primary-foreground tracking-wide">
                    {category.name}
                  </h3>
                </div>
              </Link>
            </motion.div>
          ))}
        </div>
      </div>
    </section>
  );
};

export default CategoryGrid;
