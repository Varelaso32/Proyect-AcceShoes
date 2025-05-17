// user.model.ts
export interface User {
  name: string;
  email: string;
  password: string;
}

export interface UserResponse {
  name: string;
  email: string;
  id: number; 
  role: string; 
  plan_id: number;
}

export interface UpdateUserDto {
  name?: string;
  email?: string;
}
