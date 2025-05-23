export interface Category {
  id: number;
  name: string;
  description: string;
  parent_id?: number | null; 
  children?: Category[];
}