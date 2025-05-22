export interface Seller {
  id: number;
  name: string;
  email: string;
  role: string;
  plan_id: number;
}

export interface Product {
  id: number;
  name: string;
  description: string;
  size: string;
  status: string;
  created_at: string;
  seller: Seller;
  type_of_product: string;
  category: number;
  category_id: number;
  imageUrl?: string;
}
