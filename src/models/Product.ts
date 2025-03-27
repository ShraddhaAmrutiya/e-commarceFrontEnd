export interface Product {
  _id?: string; // Optional, since MongoDB provides it
   title: string;
  image?: string;
  price: number;
  rating: number;
  description?: string;
  salePrice?: number;
  category: string | { name: string };
    brand?: string;
  stock?: number;
  discountPercentage?: number;
}
