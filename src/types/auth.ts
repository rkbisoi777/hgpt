export interface User {
  id: string;
  phone: string;
  email?: string;
  name?: string;
}

export interface AuthState {
  user: User | null;
  isLoading: boolean;
  error: string | null;
}

export interface ProfileUpdate {
  name?: string;
  phone?: string;
}