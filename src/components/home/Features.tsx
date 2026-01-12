import { Truck, RotateCcw, Shield, Headphones } from 'lucide-react';
import { motion } from 'framer-motion';

const features = [
  {
    icon: Truck,
    title: 'Free Shipping',
    description: 'On orders over ₹1999',
  },
  {
    icon: RotateCcw,
    title: 'Easy Returns',
    description: '15-day hassle-free returns',
  },
  {
    icon: Shield,
    title: 'Secure Payments',
    description: '100% secure checkout',
  },
  {
    icon: Headphones,
    title: '24/7 Support',
    description: 'Dedicated customer care',
  },
];

const Features = () => {
  return (
    <section className="border-t border-b border-border py-8 md:py-12">
      <div className="container-wide">
        <div className="grid grid-cols-2 md:grid-cols-4 gap-6 md:gap-8">
          {features.map((feature, index) => (
            <motion.div
              key={feature.title}
              initial={{ opacity: 0, y: 20 }}
              whileInView={{ opacity: 1, y: 0 }}
              viewport={{ once: true }}
              transition={{ delay: index * 0.1 }}
              className="text-center"
            >
              <feature.icon className="h-6 w-6 mx-auto mb-3 text-muted-foreground" />
              <h4 className="font-medium text-sm mb-1">{feature.title}</h4>
              <p className="text-xs text-muted-foreground">{feature.description}</p>
            </motion.div>
          ))}
        </div>
      </div>
    </section>
  );
};

export default Features;
