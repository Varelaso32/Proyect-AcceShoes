export interface Category {
  id: number;
  name: string;
  description: string;
  parent_id?: number | null; // puede ser null o no estar definido
}