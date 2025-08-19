import React from 'react';
import { useAuth } from '@/context/AuthContext';
import type { Role } from '@/context/AuthContext';
import { useAlert } from '@/context/AlertContext'; // Assuming AlertContext is still separate or re-exported from '@/context'

const RoleSwitcher: React.FC = () => {
  const { userRole, setUserRole } = useAuth();
  const { showInfo } = useAlert();

  const handleRoleChange = (event: React.ChangeEvent<HTMLSelectElement>) => {
    const value = event.target.value;
    const newRole: Role = value === '' ? null : (value as Role);
    setUserRole(newRole);
    showInfo(`Role changed to: ${newRole || 'None'}`);
  };

  return (
    <select
      value={userRole || ''}
      onChange={handleRoleChange}
      className="px-3 py-2 border rounded-md"
    >
      <option value="">Select Role</option>
      <option value="admin">Admin</option>
      <option value="owner">Owner</option>
      <option value="customer">Customer</option>
      <option value="driver">Driver</option>
      <option value="operator">Operator</option>
    </select>
  );
};

export { RoleSwitcher };
