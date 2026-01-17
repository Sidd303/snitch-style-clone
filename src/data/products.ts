import { Product, Category, Coupon } from '@/types';

import productShirt1 from '@/assets/product-shirt-1.jpg';
import productShirt2 from '@/assets/product-shirt-2.jpg';
import productJacket1 from '@/assets/product-jacket-1.jpg';
import productJeans1 from '@/assets/product-jeans-1.jpg';
import productChinos1 from '@/assets/product-chinos-1.jpg';
import productTrousers1 from '@/assets/product-trousers-1.jpg';
import productSweater1 from '@/assets/product-sweater-1.jpg';

export const initialProducts: Product[] = [
  {
    id: '1',
    name: 'Classic Oxford Shirt',
    description: 'A timeless oxford shirt crafted from premium cotton. Perfect for both casual and formal occasions.',
    price: 2499,
    originalPrice: 3499,
    images: [productShirt1, productShirt2],
    category: 'shirts',
    sizes: ['S', 'M', 'L', 'XL', 'XXL'],
    colors: [
      { name: 'White', hex: '#FFFFFF' },
      { name: 'Blue', hex: '#4A90D9' },
      { name: 'Black', hex: '#000000' }
    ],
    stock: 50,
    sku: 'SHT-001',
    isNew: true,
    status: 'active',
    createdAt: new Date().toISOString()
  },
  {
    id: '2',
    name: 'Denim Trucker Jacket',
    description: 'Classic denim jacket with a modern fit. Features authentic wash and premium hardware.',
    price: 4999,
    images: [productJacket1],
    category: 'jackets',
    sizes: ['S', 'M', 'L', 'XL'],
    colors: [
      { name: 'Indigo', hex: '#3F51B5' },
      { name: 'Black', hex: '#000000' }
    ],
    stock: 30,
    sku: 'JKT-001',
    isNew: true,
    status: 'active',
    createdAt: new Date().toISOString()
  },
  {
    id: '3',
    name: 'Slim Fit Jeans',
    description: 'Modern slim fit jeans with stretch comfort. Made from premium selvedge denim.',
    price: 3499,
    originalPrice: 4499,
    images: [productJeans1],
    category: 'bottoms',
    sizes: ['28', '30', '32', '34', '36'],
    colors: [
      { name: 'Dark Blue', hex: '#1A237E' },
      { name: 'Light Blue', hex: '#64B5F6' }
    ],
    stock: 45,
    sku: 'BTM-001',
    isSale: true,
    status: 'active',
    createdAt: new Date().toISOString()
  },
  {
    id: '4',
    name: 'Cotton Chinos',
    description: 'Versatile cotton chinos with a comfortable fit. Perfect for everyday wear.',
    price: 2999,
    images: [productChinos1],
    category: 'bottoms',
    sizes: ['28', '30', '32', '34', '36'],
    colors: [
      { name: 'Khaki', hex: '#C3B091' },
      { name: 'Navy', hex: '#000080' },
      { name: 'Olive', hex: '#808000' }
    ],
    stock: 60,
    sku: 'BTM-002',
    status: 'active',
    createdAt: new Date().toISOString()
  },
  {
    id: '5',
    name: 'Formal Trousers',
    description: 'Elegant formal trousers with a tailored fit. Perfect for office and events.',
    price: 3299,
    images: [productTrousers1],
    category: 'bottoms',
    sizes: ['28', '30', '32', '34', '36'],
    colors: [
      { name: 'Charcoal', hex: '#36454F' },
      { name: 'Black', hex: '#000000' }
    ],
    stock: 35,
    sku: 'BTM-003',
    status: 'active',
    createdAt: new Date().toISOString()
  },
  {
    id: '6',
    name: 'Linen Blend Shirt',
    description: 'Breathable linen blend shirt perfect for summer. Relaxed fit with button-down collar.',
    price: 2799,
    images: [productShirt2],
    category: 'shirts',
    sizes: ['S', 'M', 'L', 'XL'],
    colors: [
      { name: 'White', hex: '#FFFFFF' },
      { name: 'Beige', hex: '#F5F5DC' }
    ],
    stock: 40,
    sku: 'SHT-002',
    status: 'active',
    createdAt: new Date().toISOString()
  },
  {
    id: '7',
    name: 'Wool Blend Sweater',
    description: 'Cozy wool blend sweater for cold days. Features ribbed cuffs and hem.',
    price: 3999,
    originalPrice: 4999,
    images: [productSweater1],
    category: 'jackets',
    sizes: ['S', 'M', 'L', 'XL'],
    colors: [
      { name: 'Grey', hex: '#808080' },
      { name: 'Navy', hex: '#000080' },
      { name: 'Burgundy', hex: '#800020' }
    ],
    stock: 25,
    sku: 'SWT-001',
    isSale: true,
    status: 'active',
    createdAt: new Date().toISOString()
  },
  {
    id: '8',
    name: 'Printed Casual Shirt',
    description: 'Stylish printed shirt for a casual look. Made from soft cotton fabric.',
    price: 1999,
    images: [productShirt1],
    category: 'shirts',
    sizes: ['S', 'M', 'L', 'XL', 'XXL'],
    colors: [
      { name: 'Multi', hex: '#FF6B6B' }
    ],
    stock: 55,
    sku: 'SHT-003',
    isNew: true,
    status: 'active',
    createdAt: new Date().toISOString()
  }
];

export const initialCategories: Category[] = [
  { id: '1', name: 'Shirts', slug: 'shirts', productCount: 3 },
  { id: '2', name: 'Jackets', slug: 'jackets', productCount: 2 },
  { id: '3', name: 'Bottoms', slug: 'bottoms', productCount: 3 },
  { id: '4', name: 'Accessories', slug: 'accessories', productCount: 0 }
];

export const initialCoupons: Coupon[] = [
  {
    id: '1',
    code: 'WELCOME10',
    type: 'percentage',
    value: 10,
    minPurchase: 1000,
    usageLimit: 100,
    usedCount: 0,
    expiryDate: '2025-12-31',
    isActive: true
  },
  {
    id: '2',
    code: 'FLAT500',
    type: 'fixed',
    value: 500,
    minPurchase: 3000,
    usageLimit: 50,
    usedCount: 0,
    expiryDate: '2025-06-30',
    isActive: true
  }
];
