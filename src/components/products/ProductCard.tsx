import { useState } from 'react';
import { Link } from 'react-router-dom';
import { Heart } from 'lucide-react';
import { motion } from 'framer-motion';

interface ProductCardProps {
  id: string;
  name: string;
  price: number;
  originalPrice?: number;
  image: string;
  hoverImage?: string;
  isNew?: boolean;
  isSale?: boolean;
  discount?: number;
}

const ProductCard = ({
  id,
  name,
  price,
  originalPrice,
  image,
  hoverImage,
  isNew,
  isSale,
  discount,
}: ProductCardProps) => {
  const [isWishlisted, setIsWishlisted] = useState(false);
  const [isHovered, setIsHovered] = useState(false);

  return (
    <motion.div
      initial={{ opacity: 0, y: 20 }}
      whileInView={{ opacity: 1, y: 0 }}
      viewport={{ once: true }}
      className="group cursor-pointer relative"
      onMouseEnter={() => setIsHovered(true)}
      onMouseLeave={() => setIsHovered(false)}
    >
      <Link to={`/product/${id}`}>
        <div className="relative overflow-hidden bg-secondary aspect-[4/5]">
          {/* Main Image */}
          <img
            src={isHovered && hoverImage ? hoverImage : image}
            alt={name}
            className="w-full h-full object-cover object-top transition-opacity duration-500"
          />
          <div className="absolute inset-0 bg-foreground/0 group-hover:bg-foreground/5 transition-all duration-500" />

          {/* Badges */}
          {isNew && <span className="badge-new">New</span>}
          {isSale && discount && (
            <span className="badge-sale">-{discount}%</span>
          )}

          {/* Quick View Button */}
          <span className="absolute bottom-4 left-1/2 -translate-x-1/2 translate-y-full opacity-0
                         group-hover:translate-y-0 group-hover:opacity-100
                         bg-primary text-primary-foreground px-6 py-2.5 text-xs font-medium uppercase tracking-wider
                         transition-all duration-300">Quick View</span>
        </div>
      </Link>

      {/* Wishlist Button */}
      <button
        className="absolute top-3 right-3 p-2 bg-background/80 rounded-full 
                   hover:bg-background transition-colors z-10"
        onClick={(e) => {
          e.preventDefault();
          setIsWishlisted(!isWishlisted);
        }}
        aria-label={isWishlisted ? 'Remove from wishlist' : 'Add to wishlist'}
      >
        <Heart
          className={`h-4 w-4 transition-colors ${
            isWishlisted ? 'fill-sale text-sale' : 'text-foreground'
          }`}
        />
      </button>

      {/* Product Info */}
      <div className="mt-4 space-y-1">
        <Link to={`/product/${id}`}>
          <h3 className="text-sm font-medium line-clamp-1 hover:underline">
            {name}
          </h3>
        </Link>
        <div className="flex items-center gap-2">
          <span className={`text-sm font-medium ${isSale ? 'price-sale' : ''}`}>
            ₹{price.toLocaleString()}
          </span>
          {originalPrice && (
            <span className="price-original">
              ₹{originalPrice.toLocaleString()}
            </span>
          )}
        </div>
      </div>
    </motion.div>
  );
};

export default ProductCard;
