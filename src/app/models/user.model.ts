// user.model.ts
export interface User {
  name: string;
  email: string;
  password: string;
}

export interface UserResponse {
  name: string;
  email: string;
  id: number; // Cambiado a number según la respuesta del backend
  role: string; // Añadido según la respuesta
}

export interface UpdateUserDto {
  name?: string;
  email?: string;
}
