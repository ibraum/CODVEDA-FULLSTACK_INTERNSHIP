import React from 'react';

interface DeleteConfirmationModalProps {
  isOpen: boolean;
  onClose: () => void;
  onConfirm: () => void;
  userName?: string;
}

const DeleteConfirmationModal: React.FC<DeleteConfirmationModalProps> = ({ 
  isOpen, 
  onClose, 
  onConfirm, 
  userName 
}) => {
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
          }}>Confirm Delete</h3>
          <div style={{
            borderBottom: '1px dashed grey',
            margin: '20px 0'
          }} />
          <p style={{ 
            padding: '0 20px', 
            textAlign: 'justify',
            margin: 0
          }}>
            Are you sure you want to delete this user{userName ? ` (${userName})` : ''}? 
            This action cannot be undone.
          </p>
          <div style={{
            display: 'flex',
            gap: '20px',
            width: '100%',
            justifyContent: 'space-between',
            marginTop: '20px',
            padding: '0px 20px'
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
              Cancel
            </button>
            <button 
              onClick={onConfirm}
              style={{
                background: '#ca1616',
                color: '#fff',
                padding: '10px 20px',
                borderRadius: '8px',
                border: 'none',
                cursor: 'pointer'
              }}
            >
              Delete
            </button>
          </div>
        </div>
      </div>
    </div>
  );
};

export default DeleteConfirmationModal;