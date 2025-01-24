import { create } from 'zustand';
import { supabase } from '../lib/supabase';
import { AuthState, ProfileUpdate } from '../types/auth';
import toast from 'react-hot-toast';

export const useAuthStore = create<AuthState & {
  login: (email: string, password: string, role?: 'user' | 'developer' | 'admin') => Promise<void>;
  register: (email: string, password: string, phone: string, role?: 'user' | 'developer' | 'admin') => Promise<void>;
  logout: () => Promise<void>;
  updateProfile: (update: ProfileUpdate) => Promise<void>;
  initializeSession: () => Promise<void>;
}>((set) => ({
  user: null,
  isLoading: false,
  error: null,

  initializeSession: async () => {
    try {
      const { data: { session }, error } = await supabase.auth.getSession();
      if (error) throw error;

      if (session?.user) {
        set({
          user: {
            id: session.user.id,
            email: session.user.email!,
            phone: session.user.phone ?? '',
            name: session.user.user_metadata?.name,
            role: session.user.user_metadata?.role,
          },
        });
      }

      // Set up auth state change listener
      supabase.auth.onAuthStateChange((_event, session) => {
        if (session?.user) {
          set({
            user: {
              id: session.user.id,
              email: session.user.email!,
              phone: session.user.phone ?? '',
              name: session.user.user_metadata?.name,
              role: session.user.user_metadata?.role,
            },
          });
        } else {
          set({ user: null });
        }
      });
    } catch (error) {
      console.error('Error initializing session:', error);
      set({ error: (error as Error).message });
    }
  },

  login: async (email, password, role = 'user') => {
    try {
      set({ isLoading: true, error: null });

      const { data, error } = await supabase.auth.signInWithPassword({
        email,
        password,
      });
      if (error) throw error;

      if (data.user) {
        const { user_metadata } = data.user;

        if (user_metadata?.role !== role) {
          throw new Error(`Invalid role. Expected ${role}, but found ${user_metadata?.role || 'none'}.`);
        }

        set({
          user: {
            id: data.user.id,
            email: data.user.email!,
            phone: data.user.phone ?? '',
            name: user_metadata?.name,
            role: user_metadata?.role,
          },
        });
      }
    } catch (error) {
      toast.error((error as Error).message)
      set({ error: (error as Error).message });
    } finally {
      set({ isLoading: false });
    }
  },

  register: async (email, password, phone, role = 'user') => {
    try {
      set({ isLoading: true, error: null });

      const { data, error } = await supabase.auth.signUp({
        email,
        password,
        options: {
          data: {
            phone,
            role,
          },
        },
      });
      if (error) throw error;

      if (data.user) {
        set({
          user: {
            id: data.user.id,
            email: data.user.email!,
            phone: phone,
            name: data.user.user_metadata?.name || '',
            role,
          },
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
        set((state) => ({
          user: state.user
            ? {
                ...state.user,
                name: update.name,
                phone: update.phone || state.user.phone,
              }
            : null,
        }));
      }
    } catch (error) {
      set({ error: (error as Error).message });
    } finally {
      set({ isLoading: false });
    }
  },
}));