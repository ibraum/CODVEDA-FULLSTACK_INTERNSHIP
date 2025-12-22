export interface User {
  id: number;
  firstname: string;
  lastname: string;
  username: string;
  email: string;
  age: number;
  isActive: boolean;
  field: string;
  role?: 'admin' | 'user';
}

export interface ApiResponse {
  message: string;
  data: User[];
}

export interface LoginCredentials {
  email: string;
  password: string;
}

export interface SignupCredentials {
  firstname: string;
  lastname: string;
  username: string;
  email: string;
  password: string;
  age: number;
  field: string;
}

export interface AuthResponse {
  user: User;
  token: string;
  message: string;
}