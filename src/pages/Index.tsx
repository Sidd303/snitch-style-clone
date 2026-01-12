import Header from '@/components/layout/Header';
import Footer from '@/components/layout/Footer';
import HeroSection from '@/components/home/HeroSection';
import CategoryGrid from '@/components/home/CategoryGrid';
import LastChance from '@/components/home/LastChance';
import FeaturedProducts from '@/components/home/FeaturedProducts';
import PromoBanner from '@/components/home/PromoBanner';
import Features from '@/components/home/Features';

const Index = () => {
  return (
    <div className="min-h-screen flex flex-col">
      <Header />
      <main className="flex-1">
        <HeroSection />
        <CategoryGrid />
        <PromoBanner />
        <FeaturedProducts />
        <LastChance />
        <Features />
      </main>
      <Footer />
    </div>
  );
};

export default Index;
