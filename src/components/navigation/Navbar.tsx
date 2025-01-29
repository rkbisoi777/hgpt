import { useState, useEffect } from 'react';
import { Link } from 'react-router-dom';
import { Heart, Scale, User } from 'lucide-react';
import { usePropertyStore } from '../../store/propertyStore';
import { useAuthStore } from '../../store/authStore';
import { NavbarIcon } from './NavbarIcon';
// import { LoginModal } from '../auth/LoginModal';
// import { RegisterModal } from '../auth/RegisterModal';
import { ProfileSidebar } from '../profile/ProfileSidebar';
import { useToken } from '../TokenContext';
import { toast } from 'react-hot-toast';

const formatTokens = (tokens: number): string => {
  if (tokens >= 1000) {
    const formatted = (tokens / 1000).toFixed(1);
    return formatted.endsWith('.0') ? `${Math.floor(tokens / 1000)}K` : `${formatted}K`;
  }
  return tokens.toString();  // Return the number as is if it's less than 1000
};


export function Navbar() {
  const { wishlist, compareList } = usePropertyStore();
  const { user } = useAuthStore();
  // const [showLoginModal, setShowLoginModal] = useState(false);
  // const [showRegisterModal, setShowRegisterModal] = useState(false);
  const [showProfileSidebar, setShowProfileSidebar] = useState(false);
  // const { tokens, setTokens } = useToken();
  const { tokens } = useToken();
  // const [hasUpdatedTokens, setHasUpdatedTokens] = useState(false);

  useEffect(() => {
    if (tokens <= 2000 && !user) {
      toast('Sign up now to get 10,000 more tokens!');
    }
  }, [tokens, user]);

  // useEffect(() => {
  //   if (user && !hasUpdatedTokens) { 
  //     const newTokenCount = tokens + 5000;
  //     setTokens(newTokenCount);
  //     setHasUpdatedTokens(true);  
  //     // document.cookie = `HouseGPTTokens=${newTokenCount}; path=/; max-age=${60 * 60 * 24 * 365}`; 
  //     document.cookie = `HouseGPTUserRegistered=true; path=/; expires=Fri, 31 Dec 9999 23:59:59 GMT`;
  //   }
  // }, [user, tokens, setTokens, hasUpdatedTokens]);

  return (
    <nav>
      <div className="flex items-center gap-3">
          <p className="font-semibold text-blue-500 text-sm mt-[1px]">
            <i className="fas fa-coins mr-1.5"></i>
            {formatTokens(tokens)}
        </p>
        
        
        {user ? (
          <>
             {user?.role == 'user' && (<Link to="/wishlist">
              <NavbarIcon 
                icon={Heart} 
                count={wishlist.length} 
              />
            </Link>)}
            {user?.role == 'user' && (<Link to="/compare">
              <NavbarIcon 
                icon={Scale} 
                
                count={compareList.length} 
              />
            </Link>)}
            <button onClick={() => setShowProfileSidebar(true)}>
              <NavbarIcon icon={User}  />
            </button>
          </>
        ) : (
          <Link to="/login">
          {/* <button className="bg-gradient-to-r from-cyan-500 to-blue-500 text-white text-sm px-3 py-1.5 rounded-lg" onClick={() => setShowLoginModal(true)}> */}
          <button className="bg-gradient-to-r from-cyan-500 to-blue-500 text-white text-sm px-3 py-1.5 rounded-lg" >
            Login
          </button>
          </Link>
        )}
      </div>

      {/* <LoginModal
        isOpen={showLoginModal}
        onClose={() => setShowLoginModal(false)}
        onRegister={() => {
          setShowLoginModal(false);
          setShowRegisterModal(true);
        }}
      /> */}

      {/* <RegisterModal
        isOpen={showRegisterModal}
        onClose={() => setShowRegisterModal(false)}
        onLogin={() => {
          setShowRegisterModal(false);
          setShowLoginModal(true);
        }}
      /> */}

      <ProfileSidebar
        isOpen={showProfileSidebar}
        onClose={() => setShowProfileSidebar(false)}
      />
    </nav>
  );
}