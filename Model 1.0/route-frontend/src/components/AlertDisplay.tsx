import React from 'react';
import { useAlert } from '@/context/AlertContext';
import { Alert, AlertDescription, AlertTitle } from '@/components/ui/alert'; // Assuming shadcn/ui alert component
import { XCircle, CheckCircle, Info, AlertTriangle } from 'lucide-react'; // Icons

const AlertDisplay: React.FC = () => {
  const { alerts, remove } = useAlert();

  const getIcon = (type: 'success' | 'error' | 'info' | 'warning') => {
    switch (type) {
      case 'success':
        return <CheckCircle className="h-4 w-4" />;
      case 'error':
        return <XCircle className="h-4 w-4" />;
      case 'info':
        return <Info className="h-4 w-4" />;
      case 'warning':
        return <AlertTriangle className="h-4 w-4" />;
      default:
        return null;
    }
  };

  const getVariant = (type: 'success' | 'error' | 'info' | 'warning') => {
    switch (type) {
      case 'success':
        return 'default'; // Assuming default is green for success
      case 'error':
        return 'destructive';
      case 'info':
        return 'default'; // Assuming default is blue for info
      case 'warning':
        return 'default'; // Assuming default is yellow for warning
      default:
        return 'default';
    }
  };

  return (
    <div className="fixed top-4 right-4 z-50 space-y-2 w-full max-w-sm">
      {alerts.map((alert) => (
        <Alert key={alert.id} variant={getVariant(alert.type)}>
          {getIcon(alert.type)}
          <div className="ml-2">
            {alert.title && <AlertTitle>{alert.title}</AlertTitle>}
            <AlertDescription>{alert.message}</AlertDescription>
          </div>
          <button onClick={() => remove(alert.id)} className="ml-auto p-1 rounded-md hover:bg-gray-200">
            <XCircle className="h-4 w-4" />
          </button>
        </Alert>
      ))}
    </div>
  );
};

export default AlertDisplay;