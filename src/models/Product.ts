export interface Product {
  _id: string; 
  title: string;
  images: string[];
  price: number;
  rating: number;
  description?: string;
  salePrice?: number;
  category: string | { name: string };
  brand?: string;
  stock: number;
  discountPercentage?: number;
  seller?: string | { _id: string };
  createdAt?: string;
}

export interface SingleProductProps {
  product: Product;
}
