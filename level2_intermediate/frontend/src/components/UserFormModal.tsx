import React, { useState, useEffect } from 'react';
import type { User } from '../types/User';

interface UserFormModalProps {
  isOpen: boolean;
  onClose: () => void;
  user: User | null;
  onSubmit: (userData: Partial<User>) => Promise<void>;
}

const UserFormModal: React.FC<UserFormModalProps> = ({ isOpen, onClose, user, onSubmit }) => {
  const [formData, setFormData] = useState({
    firstname: '',
    lastname: '',
    username: '',
    email: '',
    age: 0,
    field: '',
    isActive: true,
  });
  const [loading, setLoading] = useState(false);

  useEffect(() => {
    if (user) {
      setFormData({
        firstname: user.firstname || '',
        lastname: user.lastname || '',
        username: user.username || '',
        email: user.email || '',
        age: user.age || 0,
        field: user.field || '',
        isActive: user.isActive ?? true,
      });
    } else {
      setFormData({
        firstname: '',
        lastname: '',
        username: '',
        email: '',
        age: 0,
        field: '',
        isActive: true,
      });
    }
  }, [user]);

  const handleInputChange = (e: React.ChangeEvent<HTMLInputElement | HTMLSelectElement>) => {
    const { name, value, type } = e.target;
    setFormData(prev => ({
      ...prev,
      [name]: type === 'checkbox' ? (e.target as HTMLInputElement).checked : 
              type === 'number' ? Number(value) : value
    }));
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setLoading(true);
    try {
      await onSubmit(formData);
      onClose();
    } catch (error) {
      console.error('Form submission error:', error);
    } finally {
      setLoading(false);
    }
  };

  return (
    <>
      <div 
        className="modal fixed right-0 top-0 bottom-0 bg-white z-1000"
        style={{
          width: '400px',
          maxWidth: '400px',
          height: '100%',
          boxShadow: '0 0 10px 1px rgba(0, 0, 0, 0.1)',
          borderLeft: '1px dashed grey',
          transform: isOpen ? 'translateX(0)' : 'translateX(100%)',
          transition: 'transform 0.4s ease',
          opacity: isOpen ? 1 : 0,
          visibility: isOpen ? 'visible' : 'hidden',
          display: 'flex',
          justifyContent: 'flex-end',
          alignItems: 'flex-start'
        }}>
        <div className="h-full flex flex-col">
          <div className="p-5 border-b border-gray-200">
            <h3 className="font-bold text-lg">
              {user ? 'Edit User' : 'Create User'}
            </h3>
          </div>
          
          <form onSubmit={handleSubmit} className="flex-1 p-5 space-y-4">
            <div className="form-group">
              <label>Firstname</label>
              <input
                type="text"
                name="firstname"
                value={formData.firstname}
                onChange={handleInputChange}
                required
                className="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500"
              />
            </div>

            <div className="form-group">
              <label>Lastname</label>
              <input
                type="text"
                name="lastname"
                value={formData.lastname}
                onChange={handleInputChange}
                required
                className="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500"
              />
            </div>

            <div className="form-group">
              <label>Username</label>
              <input
                type="text"
                name="username"
                value={formData.username}
                onChange={handleInputChange}
                required
                className="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500"
              />
            </div>

            <div className="form-group">
              <label>Email</label>
              <input
                type="email"
                name="email"
                value={formData.email}
                onChange={handleInputChange}
                required
                className="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500"
              />
            </div>

            <div className="form-group">
              <label>Age</label>
              <input
                type="number"
                name="age"
                value={formData.age}
                onChange={handleInputChange}
                required
                min="1"
                className="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500"
              />
            </div>

            <div className="form-group">
              <label>Field</label>
              <input
                type="text"
                name="field"
                value={formData.field}
                onChange={handleInputChange}
                required
                className="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500"
              />
            </div>

            <div className="form-group">
              <label>Is Active?</label>
              <select
                name="isActive"
                value={formData.isActive.toString()}
                onChange={handleInputChange}
                className="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500"
              >
                <option value="true">Yes</option>
                <option value="false">No</option>
              </select>
            </div>
          </form>

          <div className="form-actions">
            <button
              type="button"
              onClick={onClose}
              className="px-6 py-2 bg-gray-300 text-gray-700 rounded-md hover:bg-gray-400 transition-colors"
            >
              Cancel
            </button>
            <button
              type="submit"
              onClick={handleSubmit}
              disabled={loading}
              className="px-6 py-2 bg-blue-600 text-white rounded-md hover:bg-blue-700 transition-colors disabled:opacity-50"
            >
              {loading ? 'Saving...' : (user ? 'Update' : 'Create')}
            </button>
          </div>
        </div>
      </div>
    </>
  );
};

// Add CSS styles
const style = document.createElement('style');
style.textContent = `
  .form-group {
    padding: 0 20px;
    margin-bottom: 12px;
    display: flex;
    flex-direction: column;
  }
  
  .form-actions {
    display: flex;
    justify-content: space-between;
    width: 100%;
    padding: 20px;
    position: absolute;
    bottom: 5px;
  }
  
  .form-actions button[type="submit"] {
    padding: 10px 25px;
    color: #fff;
    background-color: #008cff;
    border-radius: 8px;
    border: none;
    cursor: pointer;
  }
  
  .form-actions button[type="button"] {
    padding: 10px 25px;
    color: #3b3b3b;
    background-color: #c3c3c4;
    border-radius: 8px;
    border: none;
    cursor: pointer;
  }
  
  input, select {
    padding: 10px 15px;
    border: none;
    border-radius: 8px;
    outline: 1px dashed grey;
  }
  
  select {
    background-color: transparent;
  }
  
  input:focus, select:focus {
    outline: 1px solid grey;
  }
  
  h3 {
    padding-left: 20px;
    padding-top: 20px;
    font-weight: 700;
  }
  
  label {
    font-size: .9rem;
  }
`;
document.head.appendChild(style);

export default UserFormModal;