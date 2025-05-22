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

export interface CreateUserDto {
  name: string;
  email: string;
  password: string;
  plan_id?: number | null;
  role?: string; // <-- agregar esta línea
}

export interface UpdateUserWithPasswordDto {
  name: string;
  email: string;
  password?: string;
  plan_id?: number | null;
  role?: string; // <-- agregar esta línea
}
