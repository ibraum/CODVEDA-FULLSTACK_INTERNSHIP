import React from 'react';
import type { User } from '../types/User';

interface ViewUserModalProps {
  isOpen: boolean;
  onClose: () => void;
  user: User | null;
}

const ViewUserModal: React.FC<ViewUserModalProps> = ({ isOpen, onClose, user }) => {
  if (!user) return null;

  const badgeStyle = user.isActive
    ? 'background-color: #16a34a; color: white;'
    : 'background-color: #ef4444; color: white;';
  
  const badgeText = user.isActive ? 'Yes' : 'No';
  
  const displayText = `
    <div style="display: grid; gap: 12px;">
      <div style="display: grid; grid-template-columns: 120px 1fr; gap: 16px; align-items: center;">
        <strong>ID:</strong>
        <span>${user.id}</span>
      </div>
      <div style="display: grid; grid-template-columns: 120px 1fr; gap: 16px; align-items: center;">
        <strong>First Name:</strong>
        <span>${user.firstname || 'N/A'}</span>
      </div>
      <div style="display: grid; grid-template-columns: 120px 1fr; gap: 16px; align-items: center;">
        <strong>Last Name:</strong>
        <span>${user.lastname || 'N/A'}</span>
      </div>
      <div style="display: grid; grid-template-columns: 120px 1fr; gap: 16px; align-items: center;">
        <strong>Username:</strong>
        <span>${user.username || 'N/A'}</span>
      </div>
      <div style="display: grid; grid-template-columns: 120px 1fr; gap: 16px; align-items: center;">
        <strong>Email:</strong>
        <span>${user.email || 'N/A'}</span>
      </div>
      <div style="display: grid; grid-template-columns: 120px 1fr; gap: 16px; align-items: center;">
        <strong>Age:</strong>
        <span>${user.age || 'N/A'}</span>
      </div>
      <div style="display: grid; grid-template-columns: 120px 1fr; gap: 16px; align-items: center;">
        <strong>Field:</strong>
        <span>${user.field || 'N/A'}</span>
      </div>
      <div style="display: grid; grid-template-columns: 120px 1fr; gap: 16px; align-items: center;">
        <strong>Active:</strong>
        <span style="display: inline-block; padding: 4px 12px; border-radius: 4px; font-size: 12px; font-weight: 600; ${badgeStyle}">${badgeText}</span>
      </div>
    </div>
  `.trim();

  return (
    <div className="modal fixed inset-0"
      style={{
        zIndex: 1000,
        opacity: isOpen ? 1 : 0,
        visibility: isOpen ? 'visible' : 'hidden',
        transition: 'opacity 0.4s ease, visibility 0.4s ease',
        justifyContent: 'flex-end',
        alignItems: 'flex-start',
        top: 0,
        right: 0,
        bottom: 0,
        display: 'flex'
      }}>
      <div 
        className="modal-content"
        style={{
          width: '420px',
          maxWidth: '90%',
          background: 'white',
          height: '100%',
          borderRadius: 0,
          transform: isOpen ? 'translateX(0)' : 'translateX(100%)',
          transition: 'transform 0.4s ease',
          borderLeft: '1px dashed grey',
          position: 'relative',
          overflow: 'auto'
        }}>
        <div>
          <h3 style={{ 
            padding: '20px 0 0 20px',
            fontWeight: 700,
            margin: 0
          }}>View User</h3>
          <div style={{
            borderBottom: '1px dashed grey',
            margin: '20px 0'
          }} />
          <pre 
            dangerouslySetInnerHTML={{ __html: displayText }}
            style={{
              whiteSpace: 'pre-wrap',
              wordBreak: 'break-word',
              padding: '20px',
              margin: 0,
              fontFamily: 'Poppins, sans-serif'
            }}
          />
          <div style={{
            display: 'flex',
            gap: '10px',
            justifyContent: 'flex-end',
            marginTop: '20px',
            padding: '20px'
          }}>
            <button 
              onClick={onClose}
              style={{
                background: '#c4c3c3',
                color: '#1d1d1d',
                padding: '10px 20px',
                borderRadius: '8px',
                border: 'none',
                cursor: 'pointer'
              }}
            >
              Close
            </button>
          </div>
        </div>
      </div>
    </div>
  );
};

export default ViewUserModal;