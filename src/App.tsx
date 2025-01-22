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

function App() {
  return (
    <TokenProvider>
    <Layout>
      <Routes>
        <Route path="/" element={<Home />} />
        <Route path="/chat" element={<Chat />} />
        <Route path="/property/:id" element={<PropertyDetail />} />
        <Route path="/properties" element={<Properties />} />
        <Route path="/wishlist" element={<Wishlist />} />
        <Route path="/compare" element={<Compare />} />
        <Route path="/profile" element={<Profile />} />
        <Route path="/add-property" element={<AddProperty />} />
        <Route path="/developer/register" element={<DeveloperRegistration />} />
        <Route path="/developer/dashboard" element={<DeveloperDashboard />} />
        <Route path="/developer/:id" element={<DeveloperProfile />} />
      </Routes>
      <Toaster 
        position="top-center" 
        toastOptions={{
          style: {
            border: '2px solid #338af1', // Blue border
            padding: '3px',
            borderRadius: '8px',
          }
        }} 
      />
    </Layout>
    </TokenProvider>
  );
}

export default App;