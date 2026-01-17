import { useNavigate } from 'react-router-dom';
import { motion } from 'framer-motion';
import { Heart, ShoppingBag, Trash2 } from 'lucide-react';
import Header from '@/components/layout/Header';
import Footer from '@/components/layout/Footer';
import { Button } from '@/components/ui/button';
import { useStore } from '@/contexts/StoreContext';

const Wishlist = () => {
  const navigate = useNavigate();
  const { wishlist, removeFromWishlist, addToCart } = useStore();

  const handleMoveToCart = (item: typeof wishlist[0]) => {
    addToCart(item.product, item.product.sizes[0], item.product.colors[0].name, 1);
    removeFromWishlist(item.productId);
  };

  return (
    <div className="min-h-screen flex flex-col bg-background">
      <Header />
      
      <main className="flex-1 container-wide py-8">
        <h1 className="text-3xl font-display font-bold mb-8">
          My Wishlist ({wishlist.length})
        </h1>

        {wishlist.length === 0 ? (
          <div className="flex flex-col items-center justify-center py-16">
            <Heart className="h-16 w-16 text-muted-foreground mb-4" />
            <h2 className="text-xl font-medium mb-2">Your wishlist is empty</h2>
            <p className="text-muted-foreground mb-6">Save items you love for later</p>
            <Button onClick={() => navigate('/clothing')}>Browse Products</Button>
          </div>
        ) : (
          <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-6">
            {wishlist.map((item, index) => (
              <motion.div
                key={item.productId}
                initial={{ opacity: 0, y: 20 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{ delay: index * 0.1 }}
                className="group bg-card rounded-lg overflow-hidden"
              >
                <div 
                  className="relative aspect-[4/5] cursor-pointer"
                  onClick={() => navigate(`/product/${item.productId}`)}
                >
                  <img
                    src={item.product.images[0]}
                    alt={item.product.name}
                    className="w-full h-full object-cover transition-transform duration-500 group-hover:scale-105"
                  />
                  <Button
                    variant="ghost"
                    size="icon"
                    className="absolute top-3 right-3 bg-background/80 hover:bg-background text-sale"
                    onClick={e => { e.stopPropagation(); removeFromWishlist(item.productId); }}
                  >
                    <Trash2 className="h-4 w-4" />
                  </Button>
                </div>
                <div className="p-4">
                  <h3 className="font-medium truncate">{item.product.name}</h3>
                  <div className="flex items-center gap-2 mt-1">
                    <span className="font-semibold">₹{item.product.price.toLocaleString()}</span>
                    {item.product.originalPrice && (
                      <span className="text-sm text-muted-foreground line-through">
                        ₹{item.product.originalPrice.toLocaleString()}
                      </span>
                    )}
                  </div>
                  <Button 
                    className="w-full mt-4" 
                    size="sm"
                    onClick={() => handleMoveToCart(item)}
                  >
                    <ShoppingBag className="h-4 w-4 mr-2" />
                    Move to Cart
                  </Button>
                </div>
              </motion.div>
            ))}
          </div>
        )}
      </main>

      <Footer />
    </div>
  );
};

export default Wishlist;
