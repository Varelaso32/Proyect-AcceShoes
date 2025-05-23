export interface Plan {
  id: number;
  name: string;
  description: string;
  price: number;
  maxActivePosts: number | null;
  promotionsIncluded: number;
}


export type CreatePlanDto = Omit<Plan, 'id'>;