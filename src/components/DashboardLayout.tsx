import { Outlet, Navigate } from 'react-router-dom';
import { useAuth } from '@/contexts/AuthContext';
import Sidebar from '@/components/Sidebar';
import Header from '@/components/Header';

const DashboardLayout = () => {
  const { isAuthenticated } = useAuth();

  if (!isAuthenticated) return <Navigate to="/login" replace />;

  return (
    <div className="flex min-h-screen bg-background transition-colors duration-500">
      <Sidebar />
      {/* Desktop: offset for sidebar. Mobile: offset for top bar + bottom nav */}
      <div className="flex-1 md:ml-60 transition-all duration-300 min-w-0">
        <Header />
        <main className="p-4 md:p-6 pt-16 md:pt-4 pb-24 md:pb-6">
          <Outlet />
        </main>
      </div>
    </div>
  );
};

export default DashboardLayout;
