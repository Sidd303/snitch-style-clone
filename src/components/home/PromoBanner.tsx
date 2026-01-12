import { motion } from 'framer-motion';
import { Link } from 'react-router-dom';

const promoBanners = [
  {
    id: 1,
    title: 'Workwear Edit',
    subtitle: 'Office-ready styles',
    cta: 'Shop Now',
    href: '/collections/workwear',
    bg: 'bg-secondary',
  },
  {
    id: 2,
    title: 'Statement Pieces',
    subtitle: 'Stand out from the crowd',
    cta: 'Explore',
    href: '/collections/statement',
    bg: 'bg-muted',
  },
];

const PromoBanner = () => {
  return (
    <section className="py-12 md:py-20">
      <div className="container-wide">
        <div className="grid md:grid-cols-2 gap-4 md:gap-6">
          {promoBanners.map((banner, index) => (
            <motion.div
              key={banner.id}
              initial={{ opacity: 0, x: index === 0 ? -30 : 30 }}
              whileInView={{ opacity: 1, x: 0 }}
              viewport={{ once: true }}
              transition={{ duration: 0.6 }}
            >
              <Link
                to={banner.href}
                className={`block ${banner.bg} p-8 md:p-12 lg:p-16 group transition-all 
                           duration-300 hover:shadow-lg`}
              >
                <span className="text-xs tracking-[0.2em] text-muted-foreground uppercase mb-2 block">
                  {banner.subtitle}
                </span>
                <h3 className="font-display text-2xl md:text-3xl lg:text-4xl font-light mb-6">
                  {banner.title}
                </h3>
                <span className="inline-flex items-center text-sm font-medium tracking-wide 
                               border-b border-foreground pb-1 group-hover:border-b-2 transition-all">
                  {banner.cta}
                </span>
              </Link>
            </motion.div>
          ))}
        </div>
      </div>
    </section>
  );
};

export default PromoBanner;
