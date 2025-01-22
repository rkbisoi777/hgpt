// import React, { useState, useEffect } from 'react';
// import { X } from 'lucide-react';
// import { useAuthStore } from '../../store/authStore';
// import { toast } from 'react-hot-toast';

// interface LoginModalProps {
//   isOpen: boolean;
//   onClose: () => void;
//   onRegister: () => void;
// }

// export function LoginModal({ isOpen, onClose, onRegister }: LoginModalProps) {
//   const [email, setEmail] = useState('');
//   const [password, setPassword] = useState('');
//   const { login, isLoading, error, user } = useAuthStore();

//   useEffect(() => {
//     if (user) {
//       onClose();
//       setEmail('');
//       setPassword('');
//       toast.success('Successfully logged in!');
//     }
//   }, [user, onClose]);

//   const handleSubmit = async (e: React.FormEvent) => {
//     e.preventDefault();
//     await login(email, password);
//   };

//   if (!isOpen) return null;

//   return (
//     <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center p-4 z-50">
//       <div className="bg-white rounded-lg p-6 w-full max-w-md relative">
//         <button
//           onClick={onClose}
//           className="absolute right-4 top-4 text-gray-500 hover:text-gray-700"
//         >
//           <X className="w-5 h-5" />
//         </button>
        
//         <h2 className="text-2xl font-bold mb-6">Login</h2>
        
//         <form onSubmit={handleSubmit} className="space-y-4">
//           <div>
//             <label className="block text-sm font-medium text-gray-700 mb-1">
//               Email
//             </label>
//             <input
//               type="email"
//               value={email}
//               onChange={(e) => setEmail(e.target.value)}
//               placeholder="email@example.com"
//               className="w-full px-4 py-2 border rounded-lg focus:ring-2 focus:ring-blue-500"
//               required
//             />
//           </div>

//           <div>
//             <label className="block text-sm font-medium text-gray-700 mb-1">
//               Password
//             </label>
//             <input
//               type="password"
//               value={password}
//               onChange={(e) => setPassword(e.target.value)}
//               placeholder="••••••••"
//               className="w-full px-4 py-2 border rounded-lg focus:ring-2 focus:ring-blue-500"
//               required
//             />
//           </div>

//           {error && (
//             <p className="text-red-500 text-sm">{error}</p>
//           )}

//           <button
//             type="submit"
//             className="w-full bg-blue-500 text-white py-2 rounded-lg hover:bg-blue-600 disabled:opacity-50"
//             disabled={isLoading}
//           >
//             {isLoading ? 'Loading...' : 'Login'}
//           </button>
//         </form>

//         <p className="mt-4 text-center text-sm text-gray-600">
//           Don't have an account?{' '}
//           <button
//             onClick={onRegister}
//             className="text-blue-500 hover:text-blue-600"
//           >
//             Register
//           </button>
//         </p>
//       </div>
//     </div>
//   );
// }

import React, { useState, useEffect } from 'react';
import { X } from 'lucide-react';
import { useAuthStore } from '../../store/authStore';
import { toast } from 'react-hot-toast';
import { useNavigate } from 'react-router-dom';

interface LoginModalProps {
  isOpen: boolean;
  onClose: () => void;
  onRegister: () => void;
}

export function LoginModal({ isOpen, onClose, onRegister }: LoginModalProps) {
  const navigate = useNavigate();
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [role, setRole] = useState<'user' | 'developer' | 'admin'>('user');
  const { login, isLoading, error, user } = useAuthStore();

  useEffect(() => {
    if (user) {
      onClose();
      setEmail('');
      setPassword('');
      toast.success('Successfully logged in!');
      
      // Redirect developers to their dashboard
      if (role === 'developer') {
        navigate('/developer/dashboard');
      }
    }
  }, [user, onClose, navigate, role]);

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    await login(email, password, role);
  };

  if (!isOpen) return null;

  return (
    <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center p-4 z-50">
      <div className="bg-white rounded-lg p-6 w-full max-w-md relative">
        <button
          onClick={onClose}
          className="absolute right-4 top-4 text-gray-500 hover:text-gray-700"
        >
          <X className="w-5 h-5" />
        </button>
        
        <h2 className="text-2xl font-bold mb-6">Login</h2>
        
        <form onSubmit={handleSubmit} className="space-y-4">
          <div>
            <label className="block text-sm font-medium text-gray-700 mb-1">
              Email
            </label>
            <input
              type="email"
              value={email}
              onChange={(e) => setEmail(e.target.value)}
              placeholder="email@example.com"
              className="w-full px-4 py-2 border rounded-lg focus:ring-2 focus:ring-blue-500"
              required
            />
          </div>

          <div>
            <label className="block text-sm font-medium text-gray-700 mb-1">
              Password
            </label>
            <input
              type="password"
              value={password}
              onChange={(e) => setPassword(e.target.value)}
              placeholder="••••••••"
              className="w-full px-4 py-2 border rounded-lg focus:ring-2 focus:ring-blue-500"
              required
            />
          </div>

          <div>
            <label className="block text-sm font-medium text-gray-700 mb-1">
              Login As
            </label>
            <div className="flex gap-4">
              <label className="flex items-center">
                <input
                  type="radio"
                  name="role"
                  value="user"
                  checked={role === 'user'}
                  onChange={(e) => setRole(e.target.value as 'user')}
                  className="mr-2"
                />
                <span className="text-sm">User</span>
              </label>
              <label className="flex items-center">
                <input
                  type="radio"
                  name="role"
                  value="developer"
                  checked={role === 'developer'}
                  onChange={(e) => setRole(e.target.value as 'developer')}
                  className="mr-2"
                />
                <span className="text-sm">Developer</span>
              </label>
              <label className="flex items-center">
                <input
                  type="radio"
                  name="role"
                  value="admin"
                  checked={role === 'admin'}
                  onChange={(e) => setRole(e.target.value as 'admin')}
                  className="mr-2"
                />
                <span className="text-sm">Admin</span>
              </label>
            </div>
          </div>

          {error && (
            <p className="text-red-500 text-sm">{error}</p>
          )}

          <button
            type="submit"
            className="w-full bg-blue-500 text-white py-2 rounded-lg hover:bg-blue-600 disabled:opacity-50"
            disabled={isLoading}
          >
            {isLoading ? 'Loading...' : 'Login'}
          </button>
        </form>

        <div className="mt-4 text-center text-sm text-gray-600">
          <p>
            Don't have an account?{' '}
            <button
              onClick={onRegister}
              className="text-blue-500 hover:text-blue-600"
            >
              Register
            </button>
          </p>
          {role === 'developer' && (
            <p className="mt-2">
              Want to register as a developer?{' '}
              <button
                onClick={() => {
                  onClose();
                  navigate('/developer/register');
                }}
                className="text-blue-500 hover:text-blue-600"
              >
                Register as Developer
              </button>
            </p>
          )}
        </div>
      </div>
    </div>
  );
}