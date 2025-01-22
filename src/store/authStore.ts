// import { create } from 'zustand';
// import { supabase } from '../lib/supabase';
// import { AuthState, ProfileUpdate } from '../types/auth';

// export const useAuthStore = create<AuthState & {
//   login: (email: string, password: string) => Promise<void>;
//   register: (email: string, password: string, phone: string) => Promise<void>;
//   logout: () => Promise<void>;
//   updateProfile: (update: ProfileUpdate) => Promise<void>;
// }>((set) => ({
//   user: null,
//   isLoading: false,
//   error: null,

//   login: async (email, password) => {
//     try {
//       set({ isLoading: true, error: null });
//       const { data, error } = await supabase.auth.signInWithPassword({
//         email,
//         password,
//       });
//       if (error) throw error;
//       if (data.user) {
//         set({ 
//           user: {
//             id: data.user.id,
//             email: data.user.email!,
//             phone: data.user.phone ?? '',
//             name: data.user.user_metadata?.name,
//           }
//         });
//       }
//     } catch (error) {
//       set({ error: (error as Error).message });
//     } finally {
//       set({ isLoading: false });
//     }
//   },

//   register: async (email, password, phone) => {
//     try {
//       set({ isLoading: true, error: null });
//       const { data, error } = await supabase.auth.signUp({
//         email,
//         password,
//         phone,
//       });
//       if (error) throw error;
//       if (data.user) {
//         set({ 
//           user: {
//             id: data.user.id,
//             email: data.user.email!,
//             phone: data.user.phone ?? '',
//             name: data.user.user_metadata?.name,
//           }
//         });
//       }
//     } catch (error) {
//       set({ error: (error as Error).message });
//     } finally {
//       set({ isLoading: false });
//     }
//   },

//   logout: async () => {
//     try {
//       set({ isLoading: true, error: null });
//       const { error } = await supabase.auth.signOut();
//       if (error) throw error;
//       set({ user: null });
//     } catch (error) {
//       set({ error: (error as Error).message });
//     } finally {
//       set({ isLoading: false });
//     }
//   },

//   updateProfile: async (update) => {
//     try {
//       set({ isLoading: true, error: null });
//       const { data, error } = await supabase.auth.updateUser({
//         data: { name: update.name },
//         phone: update.phone,
//       });
//       if (error) throw error;
//       if (data.user) {
//         set(state => ({
//           user: state.user ? {
//             ...state.user,
//             name: update.name,
//             phone: update.phone || state.user.phone,
//           } : null
//         }));
//       }
//     } catch (error) {
//       set({ error: (error as Error).message });
//       throw error;
//     } finally {
//       set({ isLoading: false });
//     }
//   },
// }));

// import { create } from 'zustand';
// import { supabase } from '../lib/supabase';
// import { AuthState, ProfileUpdate } from '../types/auth';

// export const useAuthStore = create<AuthState & {
//   login: (email: string, password: string, role?: 'user' | 'developer' | 'admin') => Promise<void>;
//   register: (email: string, password: string, phone: string) => Promise<void>;
//   logout: () => Promise<void>;
//   updateProfile: (update: ProfileUpdate) => Promise<void>;
// }>((set) => ({
//   user: null,
//   isLoading: false,
//   error: null,

//   login: async (email, password, role = 'user') => {
//     try {
//       set({ isLoading: true, error: null });
//       const { data, error } = await supabase.auth.signInWithPassword({
//         email,
//         password,
//       });
//       if (error) throw error;
//       if (data.user) {
//         // Verify user role matches
//         const { data: userData, error: userError } = await supabase
//           .from('users')
//           .select('role')
//           .eq('id', data.user.id)
//           .single();

//         if (userError) throw userError;

//         if (userData?.role !== role) {
//           throw new Error(`Invalid role. You are not registered as a ${role}.`);
//         }

//         set({ 
//           user: {
//             id: data.user.id,
//             email: data.user.email!,
//             phone: data.user.phone ?? '',
//             name: data.user.user_metadata?.name,
//             role: userData.role
//           }
//         });
//       }
//     } catch (error) {
//       set({ error: (error as Error).message });
//     } finally {
//       set({ isLoading: false });
//     }
//   },

//   register: async (email, password, phone) => {
//     try {
//       set({ isLoading: true, error: null });
//       const { data, error } = await supabase.auth.signUp({
//         email,
//         password,
//         phone,
//         options: {
//           data: {
//             role: 'user' // Default role for new registrations
//           }
//         }
//       });
//       if (error) throw error;
//       if (data.user) {
//         set({ 
//           user: {
//             id: data.user.id,
//             email: data.user.email!,
//             phone: data.user.phone ?? '',
//             name: data.user.user_metadata?.name,
//             role: 'user'
//           }
//         });
//       }
//     } catch (error) {
//       set({ error: (error as Error).message });
//     } finally {
//       set({ isLoading: false });
//     }
//   },

//   logout: async () => {
//     try {
//       set({ isLoading: true, error: null });
//       const { error } = await supabase.auth.signOut();
//       if (error) throw error;
//       set({ user: null });
//     } catch (error) {
//       set({ error: (error as Error).message });
//     } finally {
//       set({ isLoading: false });
//     }
//   },

//   updateProfile: async (update) => {
//     try {
//       set({ isLoading: true, error: null });
//       const { data, error } = await supabase.auth.updateUser({
//         data: { name: update.name },
//         phone: update.phone,
//       });
//       if (error) throw error;
//       if (data.user) {
//         set(state => ({
//           user: state.user ? {
//             ...state.user,
//             name: update.name,
//             phone: update.phone || state.user.phone,
//           } : null
//         }));
//       }
//     } catch (error) {
//       set({ error: (error as Error).message });
//       throw error;
//     } finally {
//       set({ isLoading: false });
//     }
//   },
// }));


// import { create } from 'zustand';
// import { supabase } from '../lib/supabase';
// import { AuthState, ProfileUpdate } from '../types/auth';

// export const useAuthStore = create<AuthState & {
//   login: (email: string, password: string, role?: string) => Promise<void>;
//   register: (email: string, password: string, phone: string, role?: string) => Promise<void>;
//   logout: () => Promise<void>;
//   updateProfile: (update: ProfileUpdate) => Promise<void>;
// }>((set) => ({
//   user: null,
//   isLoading: false,
//   error: null,

//   login: async (email, password, role = 'user') => {
//     try {
//       set({ isLoading: true, error: null });

//       const { data, error } = await supabase.auth.signInWithPassword({
//         email,
//         password,
//       });

//       if (error) throw error;

//       if (data.user) {
//         const userRole = data.user.user_metadata?.role;

//         // Role validation
//         if (userRole !== role) {
//           throw new Error(`Unauthorized: Expected role '${role}', but found '${userRole}'`);
//         }

//         set({
//           user: {
//             id: data.user.id,
//             email: data.user.email!,
//             phone: data.user.phone ?? '',
//             name: data.user.user_metadata?.name,
//             role: userRole,
//           },
//         });
//       }
//     } catch (error) {
//       set({ error: (error as Error).message });
//     } finally {
//       set({ isLoading: false });
//     }
//   },

//   register: async (email, password, phone, role = 'user') => {
//     try {
//       set({ isLoading: true, error: null });

//       const { data, error } = await supabase.auth.signUp({
//         email,
//         password,
//         options: {
//           data: {
//             phone,
//             role, // Store role in user_metadata
//           },
//         },
//       });

//       if (error) throw error;

//       if (data.user) {
//         set({
//           user: {
//             id: data.user.id,
//             email: data.user.email!,
//             phone: data.user.phone ?? '',
//             name: data.user.user_metadata?.name,
//             role,
//           },
//         });
//       }
//     } catch (error) {
//       set({ error: (error as Error).message });
//     } finally {
//       set({ isLoading: false });
//     }
//   },

//   logout: async () => {
//     try {
//       set({ isLoading: true, error: null });

//       const { error } = await supabase.auth.signOut();
//       if (error) throw error;

//       set({ user: null });
//     } catch (error) {
//       set({ error: (error as Error).message });
//     } finally {
//       set({ isLoading: false });
//     }
//   },

//   updateProfile: async (update) => {
//     try {
//       set({ isLoading: true, error: null });

//       const { data, error } = await supabase.auth.updateUser({
//         data: { name: update.name },
//         phone: update.phone,
//       });

//       if (error) throw error;

//       if (data.user) {
//         set((state) => ({
//           user: state.user
//             ? {
//                 ...state.user,
//                 name: update.name,
//                 phone: update.phone || state.user.phone,
//               }
//             : null,
//         }));
//       }
//     } catch (error) {
//       set({ error: (error as Error).message });
//       throw error;
//     } finally {
//       set({ isLoading: false });
//     }
//   },
// }));


import { create } from 'zustand';
import { supabase } from '../lib/supabase';
import { AuthState, ProfileUpdate } from '../types/auth';

export const useAuthStore = create<AuthState & {
  login: (email: string, password: string, role?: 'user' | 'developer' | 'admin') => Promise<void>;
  register: (email: string, password: string, phone: string, role?: 'user' | 'developer' | 'admin') => Promise<void>;
  logout: () => Promise<void>;
  updateProfile: (update: ProfileUpdate) => Promise<void>;
}>((set) => ({
  user: null,
  isLoading: false,
  error: null,

  // Login with Role Verification
  login: async (email, password, role = 'user') => {
    try {
      set({ isLoading: true, error: null });

      // Sign in with email and password
      const { data, error } = await supabase.auth.signInWithPassword({
        email,
        password,
      });
      if (error) throw error;

      // Verify the role (from user_metadata or users table)
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
      set({ error: (error as Error).message });
    } finally {
      set({ isLoading: false });
    }
  },

  // Registration with Role
  register: async (email, password, phone, role = 'user') => {
    try {
      set({ isLoading: true, error: null });

      // Sign up and assign metadata with role
      const { data, error } = await supabase.auth.signUp({
        email,
        password,
        options: {
          data: {
            phone,
            role, // Assign the role
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

  // Logout
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

  // Update Profile
  updateProfile: async (update) => {
    try {
      set({ isLoading: true, error: null });

      // Update user metadata and phone number
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
