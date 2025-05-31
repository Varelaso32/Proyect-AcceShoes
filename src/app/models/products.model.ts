export interface Seller {
  id: number;
  name: string;
  email: string;
  role: string;
  plan_id: number;
  img?: string;
}

export interface Product {
  id: number;
  name: string;
  description: string;
  size: string;
  status: string;
  price: number;
  created_at: string;
  seller: Seller;
  type_of_product: string;
  category: number;
  category_id: number;
  imageUrl?: string;
  category_name?: string;
  stock?: number;
}
