import React, { useState } from 'react';
import { Link } from 'react-router-dom';
import { Heart, Scale, User, LogIn } from 'lucide-react';
import { usePropertyStore } from '../../store/propertyStore';
import { useAuthStore } from '../../store/authStore';
import { NavbarIcon } from './NavbarIcon';
import { LoginModal } from '../auth/LoginModal';
import { RegisterModal } from '../auth/RegisterModal';
import { ProfileSidebar } from '../profile/ProfileSidebar';

export function Navbar() {
  const { wishlist, compareList } = usePropertyStore();
  const { user } = useAuthStore();
  const [showLoginModal, setShowLoginModal] = useState(false);
  const [showRegisterModal, setShowRegisterModal] = useState(false);
  const [showProfileSidebar, setShowProfileSidebar] = useState(false);

  return (
    <>
      <div className="flex items-center gap-3">
        {user ? (
          <>
            <Link to="/wishlist">
              <NavbarIcon 
                icon={Heart} 
                label="Wishlist" 
                count={wishlist.length} 
              />
            </Link>
            <Link to="/compare">
              <NavbarIcon 
                icon={Scale} 
                label="Compare" 
                count={compareList.length} 
              />
            </Link>
            <button onClick={() => setShowProfileSidebar(true)}>
              <NavbarIcon icon={User} label="Profile" />
            </button>
          </>
        ) : (
          <button onClick={() => setShowLoginModal(true)}>
            <NavbarIcon icon={LogIn} label="Login" />
          </button>
        )}
      </div>

      <LoginModal
        isOpen={showLoginModal}
        onClose={() => setShowLoginModal(false)}
        onRegister={() => {
          setShowLoginModal(false);
          setShowRegisterModal(true);
        }}
      />

      <RegisterModal
        isOpen={showRegisterModal}
        onClose={() => setShowRegisterModal(false)}
        onLogin={() => {
          setShowRegisterModal(false);
          setShowLoginModal(true);
        }}
      />

      <ProfileSidebar
        isOpen={showProfileSidebar}
        onClose={() => setShowProfileSidebar(false)}
      />
    </>
  );
}