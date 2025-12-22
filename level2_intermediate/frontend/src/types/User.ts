export interface User {
  id: number;
  firstname: string;
  lastname: string;
  username: string;
  email: string;
  age: number;
  isActive: boolean;
  field: string;
}

export interface ApiResponse {
  message: string;
  data: User[];
}