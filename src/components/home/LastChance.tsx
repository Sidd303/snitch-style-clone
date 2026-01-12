import { motion } from 'framer-motion';
import { ArrowRight } from 'lucide-react';
import { Link } from 'react-router-dom';

const LastChance = () => {
  return (
    <section className="bg-foreground text-primary-foreground py-16 md:py-24">
      <div className="container-wide">
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          whileInView={{ opacity: 1, y: 0 }}
          viewport={{ once: true }}
          className="text-center max-w-2xl mx-auto"
        >
          <span className="text-xs tracking-[0.3em] text-primary-foreground/60 uppercase mb-4 block">
            Limited Stock
          </span>
          <h2 className="font-display text-4xl md:text-5xl lg:text-6xl font-light mb-4">
            Last Chance!
          </h2>
          <p className="text-lg md:text-xl text-primary-foreground/70 mb-8">
            Last few pieces left. Don't miss out on these exclusive deals.
          </p>
          <Link 
            to="/sale" 
            className="inline-flex items-center gap-2 bg-primary-foreground text-foreground 
                     px-8 py-3.5 font-medium tracking-wide hover:bg-primary-foreground/90 
                     transition-colors group"
          >
            Shop Sale
            <ArrowRight className="h-4 w-4 transition-transform group-hover:translate-x-1" />
          </Link>
        </motion.div>
      </div>
    </section>
  );
};

export default LastChance;
