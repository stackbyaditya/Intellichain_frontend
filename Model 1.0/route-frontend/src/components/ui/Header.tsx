import React from 'react';
import { Link } from 'react-router-dom';
import { RoleSwitcher } from './RoleSwitcher';
import { Button } from './button'; // Assuming button is re-exported from index.ts
import { useAlert } from '@/context/AlertContext'; // Assuming AlertContext is still separate or re-exported from '@/context'

const Header: React.FC = () => {
  const { showSuccess, showError, showInfo } = useAlert();

  const testAlerts = () => {
    showSuccess('Success message test!');
    showError('Error message test!');
    showInfo('Info message test!');
  };

  return (
    <nav className="p-4 bg-gray-100">
      <div className="flex items-center justify-between">
        <Link to="/" className="text-xl font-bold">Intellichain</Link>
        <div className="flex items-center gap-4">
          <RoleSwitcher />
          <Button onClick={testAlerts} variant="outline" size="sm">
            Test Alerts
          </Button>
        </div>
      </div>
    </nav>
  );
};

export { Header };
