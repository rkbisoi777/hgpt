import { useState, useEffect } from 'react';
import { Link } from 'react-router-dom';
import { Heart, Scale, User } from 'lucide-react';
import { usePropertyStore } from '../../store/propertyStore';
import { useAuthStore } from '../../store/authStore';
import { NavbarIcon } from './NavbarIcon';
import { ProfileSidebar } from '../profile/ProfileSidebar';
import { useToken } from '../TokenContext';
import { toast } from 'react-hot-toast';
import { TokenService } from '../../lib/tokenService';
import { supabase } from '../../lib/supabase';

const formatTokens = (tokens: number): string => {
  if (tokens >= 1000) {
    const formatted = (tokens / 1000).toFixed(1);
    return formatted.endsWith('.0') ? `${Math.floor(tokens / 1000)}K` : `${formatted}K`;
  }
  return tokens.toString();  // Return the number as is if it's less than 1000
};

const TOKEN_REFRESH_EVENT = "refreshTokens";

export function Navbar() {
  // const { wishlist, compareList } = usePropertyStore();
  const { user } = useAuthStore();
  const [showProfileSidebar, setShowProfileSidebar] = useState(false);
  const [tkn, setTkn ] = useState<number>(0);
  const { tokens } = useToken();
  // const [hasUpdatedTokens, setHasUpdatedTokens] = useState(false);

  useEffect(() => {
    if (tokens <= 2000 && !user) {
      toast('Sign up now to get 5,000 more tokens!');
    }
  }, [tokens, user]);

  useEffect(() => {
    const fetchTokens = async () => {
      const { data: { session } } = await supabase.auth.getSession();
      if (session?.user.id) {
        const tkns = await TokenService.fetchUserTokens(session?.user.id);
        setTkn(tkns.available_tokens);
      }
    };

    fetchTokens();

    // Listen for the refresh event
    const handleTokenRefresh = () => fetchTokens();
    window.addEventListener(TOKEN_REFRESH_EVENT, handleTokenRefresh);

    return () => {
      window.removeEventListener(TOKEN_REFRESH_EVENT, handleTokenRefresh);
    };

  }, [user]);


  useEffect(() => {
    const fetchTokens = async () => {
      const { data: { session } } = await supabase.auth.getSession();
      if (!session?.user?.id) return;

      const lastFetch = localStorage.getItem("last_token_fetch");
      const today = new Date();
      today.setHours(0, 0, 0, 0);
      
      if (lastFetch && new Date(lastFetch) >= today) {
        // console.log("Tokens already fetched today.");
        return; // Prevent multiple calls
      }

      let tkns = await TokenService.fetchUserTokens(session.user.id);
      if (tkns?.last_updated) {
        const lastUpdatedDate = new Date(tkns.last_updated);
        
        if (lastUpdatedDate < today) {
          await TokenService.resetUserTokens(session.user.id);
          tkns = await TokenService.fetchUserTokens(session.user.id); // Re-fetch updated tokens
        }

        setTkn(tkns);
        localStorage.setItem("last_token_fetch", today.toISOString()); // Store today's date
      }
    };

    fetchTokens();
  }, []); 

  // useEffect(() => {
  //   if (user && !hasUpdatedTokens) { 
  //     const newTokenCount = tokens + 10000;
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
            {!user ? formatTokens(tokens) : formatTokens(tkn)}
        </p>
        
        
        {user ? (
          <>
             {user?.role == 'user' && (<Link to="/wishlist">
              <NavbarIcon 
                icon={Heart} 
                // count={wishlist.length} 
              />
            </Link>)}
            {user?.role == 'user' && (<Link to="/compare">
              <NavbarIcon 
                icon={Scale} 
                
                // count={compareList.length} 
              />
            </Link>)}
            <button onClick={() => setShowProfileSidebar(true)}>
              <NavbarIcon icon={User}  />
            </button>
          </>
        ) : (
          <Link to="/login">
          <button className="bg-gradient-to-r from-cyan-500 to-blue-500 text-white text-sm px-3 py-1.5 rounded-lg" >
            Login
          </button>
          </Link>
        )}
      </div>

      <ProfileSidebar
        isOpen={showProfileSidebar}
        onClose={() => setShowProfileSidebar(false)}
      />
    </nav>
  );
}