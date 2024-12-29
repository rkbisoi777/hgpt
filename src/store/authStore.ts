import { create } from 'zustand';
import { supabase } from '../lib/supabase';
import { AuthState, ProfileUpdate } from '../types/auth';

export const useAuthStore = create<AuthState & {
  login: (email: string, password: string) => Promise<void>;
  register: (email: string, password: string, phone: string) => Promise<void>;
  logout: () => Promise<void>;
  updateProfile: (update: ProfileUpdate) => Promise<void>;
}>((set) => ({
  user: null,
  isLoading: false,
  error: null,

  login: async (email, password) => {
    try {
      set({ isLoading: true, error: null });
      const { data, error } = await supabase.auth.signInWithPassword({
        email,
        password,
      });
      if (error) throw error;
      if (data.user) {
        set({ 
          user: {
            id: data.user.id,
            email: data.user.email!,
            phone: data.user.phone ?? '',
            name: data.user.user_metadata?.name,
          }
        });
      }
    } catch (error) {
      set({ error: (error as Error).message });
    } finally {
      set({ isLoading: false });
    }
  },

  register: async (email, password, phone) => {
    try {
      set({ isLoading: true, error: null });
      const { data, error } = await supabase.auth.signUp({
        email,
        password,
        phone,
      });
      if (error) throw error;
      if (data.user) {
        set({ 
          user: {
            id: data.user.id,
            email: data.user.email!,
            phone: data.user.phone ?? '',
            name: data.user.user_metadata?.name,
          }
        });
      }
    } catch (error) {
      set({ error: (error as Error).message });
    } finally {
      set({ isLoading: false });
    }
  },

  logout: async () => {
    try {
      set({ isLoading: true, error: null });
      const { error } = await supabase.auth.signOut();
      if (error) throw error;
      set({ user: null });
    } catch (error) {
      set({ error: (error as Error).message });
    } finally {
      set({ isLoading: false });
    }
  },

  updateProfile: async (update) => {
    try {
      set({ isLoading: true, error: null });
      const { data, error } = await supabase.auth.updateUser({
        data: { name: update.name },
        phone: update.phone,
      });
      if (error) throw error;
      if (data.user) {
        set(state => ({
          user: state.user ? {
            ...state.user,
            name: update.name,
            phone: update.phone || state.user.phone,
          } : null
        }));
      }
    } catch (error) {
      set({ error: (error as Error).message });
      throw error;
    } finally {
      set({ isLoading: false });
    }
  },
}));