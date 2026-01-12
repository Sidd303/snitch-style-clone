import { useState, useEffect } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { ChevronLeft, ChevronRight } from 'lucide-react';
import heroWorkwear from '@/assets/hero-workwear.jpg';
import heroStatement from '@/assets/hero-statement.jpg';

const slides = [
  {
    id: 1,
    image: heroWorkwear,
    title: 'Modern Workwear',
    subtitle: 'Elevate your everyday essentials',
    cta: 'Shop Collection',
    align: 'left' as const,
  },
  {
    id: 2,
    image: heroStatement,
    title: 'Statement Threads',
    subtitle: 'Bold pieces for the confident man',
    cta: 'Explore Now',
    align: 'right' as const,
  },
];

const HeroSection = () => {
  const [currentSlide, setCurrentSlide] = useState(0);

  useEffect(() => {
    const timer = setInterval(() => {
      setCurrentSlide((prev) => (prev + 1) % slides.length);
    }, 6000);
    return () => clearInterval(timer);
  }, []);

  const goToSlide = (index: number) => setCurrentSlide(index);
  const prevSlide = () => setCurrentSlide((prev) => (prev - 1 + slides.length) % slides.length);
  const nextSlide = () => setCurrentSlide((prev) => (prev + 1) % slides.length);

  return (
    <section className="relative h-[60vh] md:h-[80vh] lg:h-[90vh] overflow-hidden">
      <AnimatePresence mode="wait">
        <motion.div
          key={slides[currentSlide].id}
          initial={{ opacity: 0, scale: 1.1 }}
          animate={{ opacity: 1, scale: 1 }}
          exit={{ opacity: 0, scale: 1.05 }}
          transition={{ duration: 0.8 }}
          className="absolute inset-0"
        >
          <img
            src={slides[currentSlide].image}
            alt={slides[currentSlide].title}
            className="w-full h-full object-cover object-center"
          />
          {/* Overlay */}
          <div className="absolute inset-0 bg-gradient-to-r from-foreground/40 via-foreground/20 to-transparent" />
        </motion.div>
      </AnimatePresence>

      {/* Content */}
      <div className="absolute inset-0 flex items-center">
        <div className="container-wide">
          <AnimatePresence mode="wait">
            <motion.div
              key={slides[currentSlide].id}
              initial={{ opacity: 0, y: 30 }}
              animate={{ opacity: 1, y: 0 }}
              exit={{ opacity: 0, y: -30 }}
              transition={{ duration: 0.6, delay: 0.2 }}
              className={`max-w-lg ${
                slides[currentSlide].align === 'right' ? 'ml-auto text-right' : ''
              }`}
            >
              <h1 className="font-display text-4xl md:text-5xl lg:text-6xl font-light text-primary-foreground mb-4 tracking-tight">
                {slides[currentSlide].title}
              </h1>
              <p className="text-lg md:text-xl text-primary-foreground/80 mb-8">
                {slides[currentSlide].subtitle}
              </p>
              <button className="btn-hero">
                {slides[currentSlide].cta}
              </button>
            </motion.div>
          </AnimatePresence>
        </div>
      </div>

      {/* Navigation Arrows */}
      <button
        onClick={prevSlide}
        className="absolute left-4 top-1/2 -translate-y-1/2 p-2 bg-background/80 hover:bg-background 
                   rounded-full transition-colors hidden md:block"
        aria-label="Previous slide"
      >
        <ChevronLeft className="h-6 w-6" />
      </button>
      <button
        onClick={nextSlide}
        className="absolute right-4 top-1/2 -translate-y-1/2 p-2 bg-background/80 hover:bg-background 
                   rounded-full transition-colors hidden md:block"
        aria-label="Next slide"
      >
        <ChevronRight className="h-6 w-6" />
      </button>

      {/* Dots */}
      <div className="absolute bottom-6 left-1/2 -translate-x-1/2 flex gap-2">
        {slides.map((_, index) => (
          <button
            key={index}
            onClick={() => goToSlide(index)}
            className={`w-2 h-2 rounded-full transition-all duration-300 ${
              index === currentSlide
                ? 'w-8 bg-primary-foreground'
                : 'bg-primary-foreground/40 hover:bg-primary-foreground/60'
            }`}
            aria-label={`Go to slide ${index + 1}`}
          />
        ))}
      </div>
    </section>
  );
};

export default HeroSection;
