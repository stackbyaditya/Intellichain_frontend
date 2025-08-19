import React, { Suspense, lazy, useEffect } from 'react';
import { Routes, Route, useNavigate } from 'react-router-dom';
import HeroSectionDemo from '@/pages/HeroSectionDemo';
import AlertDisplay from '@/components/ui/AlertDisplay';
import { Header, Footer } from '@/components/ui';
import { useAuth } from '@/context/AuthContext';
import './index.css';

// Lazy load dashboard components
const OwnerDashboard = lazy(() => import('@/pages/owner'));
const CustomerDashboard = lazy(() => import('@/pages/customer'));
const DriverDashboard = lazy(() => import('@/pages/driver'));
const OperatorHub = lazy(() => import('@/pages/operator'));
const AdminDashboard = lazy(() => import('@/pages/admin'));
const ManagerDashboard = lazy(() => import('@/pages/manager'));

function App() {
  const { userRole } = useAuth();
  const navigate = useNavigate();

  useEffect(() => {
    if (userRole) {
      switch (userRole) {
        case 'admin':
          navigate('/admin');
          break;
        case 'owner':
          navigate('/owner');
          break;
        case 'customer':
          navigate('/customer');
          break;
        case 'driver':
          navigate('/driver');
          break;
        case 'operator':
          navigate('/operator');
          break;
        case 'manager':
          navigate('/manager');
          break;
        default:
          navigate('/');
      }
    } else {
      navigate('/');
    }
  }, [userRole, navigate]);

  return (
    <>
      <AlertDisplay />
      <div className="min-h-screen flex flex-col">
        <Header />

        <main className="flex-grow">
          <Suspense fallback={<div>Loading dashboard...</div>}>
            <Routes>
              <Route path="/" element={<HeroSectionDemo />} />
              <Route path="/admin" element={<AdminDashboard />} />
              <Route path="/owner" element={<OwnerDashboard />} />
              <Route path="/customer" element={<CustomerDashboard />} />
              <Route path="/driver" element={<DriverDashboard />} />
              <Route path="/operator" element={<OperatorHub />} />
              <Route path="/manager" element={<ManagerDashboard />} />
            </Routes>
          </Suspense>
        </main>

        <Footer />
      </div>
    </>
  );
}

export default App;