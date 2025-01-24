import React, { useState } from 'react';
import { useAuthStore } from '../../store/authStore';
import { toast } from 'react-hot-toast';
import { PhoneInput } from './PhoneInput';
import { useNavigate } from 'react-router-dom';
// import { useToken } from '../TokenContext';

interface RegisterPageProps {
}

export function RegisterPage({ }: RegisterPageProps) {
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [phone, setPhone] = useState('+91 ');
  const { register, isLoading, error } = useAuthStore();
  const navigate = useNavigate();
  // const { tokens, setTokens } = useToken();

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    await register(email, password, phone.replace(/\s+/g, ''));
    if (!error) {
      toast.success('Registration successful');
      // document.cookie = `HouseGPTTokens=${tokens + 10000}; path=/; max-age=${60 * 60 * 24 * 365}`;
      document.cookie = `HouseGPTUserRegistered=true; path=/; expires=Fri, 31 Dec 9999 23:59:59 GMT`;
      navigate('/')

    }
  };

  const onLogin = async () =>{
    navigate('/login')
  }


  return (
    <div className="flex items-center justify-center p-4 py-16">
      <div className="bg-white rounded-lg p-6 w-full max-w-md relative">
        
        
        <h2 className="text-2xl text-center text-blue-500 font-bold mb-6">Register</h2>
        
        <form onSubmit={handleSubmit} className="space-y-6 max-w-2xl mx-auto p-6 bg-white rounded-lg shadow-md border border-blue-500">
          <div>
            <label className="block text-sm font-medium text-gray-700 mb-1">
              Email *
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
              Password *
            </label>
            <input
              type="password"
              value={password}
              onChange={(e) => setPassword(e.target.value)}
              placeholder="••••••••"
              className="w-full px-4 py-2 border rounded-lg focus:ring-2 focus:ring-blue-500"
              required
              minLength={6}
            />
          </div>

          <div>
            <label className="block text-sm font-medium text-gray-700 mb-1">
              Phone Number *
            </label>
            <PhoneInput
              value={phone}
              onChange={setPhone}
              required
            />
          </div>

          {error && (
            <p className="text-red-500 text-sm">{error}</p>
          )}

          <button
            type="submit"
            className="w-full bg-blue-500 text-white py-2 rounded-lg hover:bg-blue-600 disabled:opacity-50"
            disabled={isLoading}
          >
            {isLoading ? 'Loading...' : 'Register'}
          </button>
        </form>

        <p className="mt-4 text-center text-sm text-gray-600">
          Already have an account?{' '}
          <button
             onClick={onLogin}
            className="text-blue-500 hover:text-blue-600"
          >
            Login
          </button>
        </p>
      </div>
    </div>
  );
}