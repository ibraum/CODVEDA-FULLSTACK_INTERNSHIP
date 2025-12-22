import React, { useEffect } from 'react';

interface Toast {
  id: number;
  message: string;
  type: 'success' | 'error' | 'warning' | 'default';
}

interface ToastContainerProps {
  toasts: Toast[];
  onRemove: (id: number) => void;
}

const ToastContainer: React.FC<ToastContainerProps> = ({ toasts, onRemove }) => {
  useEffect(() => {
    toasts.forEach(toast => {
      const timer = setTimeout(() => {
        // Start slide out animation
        const toastElement = document.getElementById(`toast-${toast.id}`);
        if (toastElement) {
          toastElement.style.animation = 'slideOut 0.3s ease-out';
          setTimeout(() => onRemove(toast.id), 300);
        } else {
          onRemove(toast.id);
        }
      }, 3000);
      return () => clearTimeout(timer);
    });
  }, [toasts, onRemove]);

  const getToastStyles = (type: Toast['type']) => {
    let bgColor = '#1e293b';
    const textColor = '#e2e8f0';
    let borderColor = '#334155';
    
    switch (type) {
      case 'success':
        bgColor = '#16a34a';
        borderColor = '#22c55e';
        break;
      case 'error':
        bgColor = '#dc2626';
        borderColor = '#ef4444';
        break;
      case 'warning':
        bgColor = '#f59e0b';
        borderColor = '#fbbf24';
        break;
    }
    
    return {
      backgroundColor: bgColor,
      border: `1px solid ${borderColor}`,
      color: textColor,
      padding: '12px 16px',
      borderRadius: '6px',
      fontSize: '14px',
      fontFamily: 'Poppins, sans-serif',
      display: 'flex',
      alignItems: 'center',
      gap: '10px',
      boxShadow: '0 4px 6px rgba(0, 0, 0, 0.1)',
      animation: 'slideIn 0.3s ease-out',
    };
  };

  const getIcon = (type: Toast['type']) => {
    switch (type) {
      case 'success':
        return '✓';
      case 'error':
        return '✕';
      case 'warning':
        return '⚠';
      default:
        return 'ℹ';
    }
  };

  return (
    <div 
      id="toast-container"
      style={{
        position: 'fixed',
        top: '20px',
        right: '20px',
        zIndex: 9999,
        display: 'flex',
        flexDirection: 'column',
        gap: '10px',
      }}
    >
      {toasts.map((toast) => (
        <div
          key={toast.id}
          id={`toast-${toast.id}`}
          style={getToastStyles(toast.type)}
        >
          <span>{getIcon(toast.type)}</span>
          <span>{toast.message}</span>
        </div>
      ))}
      
      {/* Add animation styles */}
      <style>{`
        @keyframes slideIn {
          from {
            opacity: 0;
            transform: translateX(100%);
          }
          to {
            opacity: 1;
            transform: translateX(0);
          }
        }
        
        @keyframes slideOut {
          from {
            opacity: 1;
            transform: translateX(0);
          }
          to {
            opacity: 0;
            transform: translateX(100%);
          }
        }
      `}</style>
    </div>
  );
};

export default ToastContainer;