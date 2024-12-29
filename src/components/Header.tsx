import React from 'react';
import { Link } from 'react-router-dom';
import { Home } from 'lucide-react';
import { Navbar } from './navigation/Navbar';

export function Header() {
  return (
    <header className="bg-white shadow-sm sticky top-0 z-50">
      <div className="max-w-7xl mx-auto">
        <div className="flex items-center justify-between px-4 py-3">
          <Link to="/" className="flex items-center gap-2">
            <Home className="w-6 h-6 text-blue-500" />
            <h1 className="text-xl font-bold text-gray-900">houseGPT</h1>
          </Link>
          <Navbar />
        </div>
      </div>
    </header>
  );
}