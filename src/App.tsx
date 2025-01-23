import { Routes, Route } from 'react-router-dom';
import { Home } from './pages/Home';
import { Chat } from './pages/Chat';
import { PropertyDetail } from './components/PropertyDetail';
import { Wishlist } from './pages/Wishlist';
import { Compare } from './pages/Compare';
import { Properties } from './pages/Properties';
import { Profile } from './pages/Profile';
import { Toaster } from 'react-hot-toast';
import { Layout } from './components/layout/Layout';
import { TokenProvider } from './components/TokenContext';
import { AddProperty } from './pages/AddProperty';
import { DeveloperRegistration } from './pages/DeveloperRegistration';
import { DeveloperDashboard } from './pages/DeveloperDashboard';
import { DeveloperProfile } from './pages/DeveloperProfile';
import { ProtectedRoute } from './components/auth/ProtectedRoute';
import { useEffect } from 'react';
import { useAuthStore } from './store/authStore';

function App() {
  const { initializeSession } = useAuthStore();

  useEffect(() => {
    initializeSession();
  }, [initializeSession]);

  return (
    <TokenProvider>
      <Layout>
        <Routes>
          {/* Public Routes */}
          <Route path="/" element={<Home />} />
          <Route path="/chat" element={<Chat />} />
          <Route path="/property/:id" element={<PropertyDetail />} />
          <Route path="/properties" element={<Properties />} />
          <Route path="/developer/:id" element={<DeveloperProfile />} />
          <Route path="/developer/register" element={<DeveloperRegistration />}/>

          {/* Protected Routes */}
          <Route
            path="/wishlist"
            element={
              <ProtectedRoute>
                <Wishlist />
              </ProtectedRoute>
            }
          />
          <Route
            path="/compare"
            element={
              <ProtectedRoute>
                <Compare />
              </ProtectedRoute>
            }
          />
          <Route
            path="/profile"
            element={
              <ProtectedRoute>
                <Profile />
              </ProtectedRoute>
            }
          />
          <Route
            path="/developer/add-property"
            element={
              <ProtectedRoute>
                <AddProperty />
              </ProtectedRoute>
            }
          />
         
          <Route
            path="/developer/dashboard"
            element={
              <ProtectedRoute>
                <DeveloperDashboard />
              </ProtectedRoute>
            }
          />
        </Routes>
        <Toaster
          position="top-center"
          toastOptions={{
            style: {
              border: '2px solid #338af1',
              padding: '3px',
              borderRadius: '8px',
            },
          }}
        />
      </Layout>
    </TokenProvider>
  );
}

export default App;