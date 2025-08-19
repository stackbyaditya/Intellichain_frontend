import { Routes, Route, Link } from 'react-router-dom';
import { HeroSection } from '@/components/ui/hero-section-dark';
import OwnerDashboard from './pages/owner/Dashboard'; // Relative path
import CustomerDashboard from './pages/customer/Dashboard'; // Relative path
import DriverDashboard from './pages/driver/Dashboard'; // Relative path
import OperatorHub from './pages/operator/Hub'; // Relative path
import AdminDashboard from './pages/admin/Admin'; // Relative path
import { useAuth } from './context/AuthContext'; // Relative path
import AlertDisplay from './components/AlertDisplay'; // Relative path
import { Button } from '@/components/ui/button';
import './index.css';

function App() {
  const { userRole, setUserRole } = useAuth();

  const handleRoleChange = (event: React.ChangeEvent<HTMLSelectElement>) => {
    setUserRole(event.target.value as any);
  };

  return (
    <div className="min-h-screen flex flex-col">
      <AlertDisplay />
      <nav className="p-4 bg-gray-100 shadow-md flex justify-between items-center">
        <ul className="flex space-x-4">
          <li>
            <Button asChild variant="link">
              <Link to="/">Home</Link>
            </Button>
          </li>
          <li>
            <Button asChild variant="link">
              <Link to="/owner">Owner Dashboard</Link>
            </Button>
          </li>
          <li>
            <Button asChild variant="link">
              <Link to="/customer">Customer Dashboard</Link>
            </Button>
          </li>
          <li>
            <Button asChild variant="link">
              <Link to="/driver">Driver Dashboard</Link>
            </Button>
          </li>
          <li>
            <Button asChild variant="link">
              <Link to="/operator">Operator Hub</Link>
            </Button>
          </li>
          <li>
            <Button asChild variant="link">
              <Link to="/admin">Admin Dashboard</Link>
            </Button>
          </li>
        </ul>
        <div className="flex items-center space-x-2">
          <label htmlFor="role-select" className="text-gray-700">Current Role:</label>
          <select
            id="role-select"
            value={userRole}
            onChange={handleRoleChange}
            className="p-2 border rounded-md"
          >
            <option value="owner">Owner</option>
            <option value="customer">Customer</option>
            <option value="driver">Driver</option>
            <option value="operator">Operator</option>
            <option value="admin">Admin</option>
          </select>
        </div>
      </nav>

      <main className="flex-grow container mx-auto p-4">
        <Routes>
          <Route path="/" element={<HeroSection />} />
          <Route path="/owner" element={<OwnerDashboard />} />
          <Route path="/customer" element={<CustomerDashboard />} />
          <Route path="/driver" element={<DriverDashboard />} />
          <Route path="/operator" element={<OperatorHub />} />
          <Route path="/admin" element={<AdminDashboard />} />
        </Routes>
      </main>

      <footer className="p-4 bg-gray-100 shadow-md text-center text-gray-600">
        <p>&copy; 2025 RouteOptimizer. All rights reserved.</p>
      </footer>
    </div>
  );
}

export default App;