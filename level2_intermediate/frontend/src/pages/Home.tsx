import React, { useState, useEffect } from 'react';
import type { User } from '../types/User';
import { apiService } from '../services/api';
import Header from '../components/Header';
import UserTable from '../components/UserTable';
import UserFormModal from '../components/UserFormModal';
import ViewUserModal from '../components/ViewUserModal';
import DeleteConfirmationModal from '../components/DeleteConfirmationModal';
import ToastContainer from '../components/ToastContainer';

interface Toast {
  id: number;
  message: string;
  type: 'success' | 'error' | 'warning' | 'default';
}

const Home: React.FC = () => {
  const [users, setUsers] = useState<User[]>([]);
  const [loading, setLoading] = useState(true);
  const [showFormModal, setShowFormModal] = useState(false);
  const [showViewModal, setShowViewModal] = useState(false);
  const [showDeleteModal, setShowDeleteModal] = useState(false);
  const [selectedUser, setSelectedUser] = useState<User | null>(null);
  const [editingUser, setEditingUser] = useState<User | null>(null);
  const [toasts, setToasts] = useState<Toast[]>([]);
  const [nextToastId, setNextToastId] = useState(1);

  const showToast = (message: string, type: Toast['type'] = 'default') => {
    const newToast: Toast = {
      id: nextToastId,
      message,
      type,
    };
    setToasts(prev => [...prev, newToast]);
    setNextToastId(prev => prev + 1);
  };

  const removeToast = (id: number) => {
    setToasts(prev => prev.filter(toast => toast.id !== id));
  };

  const fetchUsers = async () => {
    try {
      setLoading(true);
      const data = await apiService.getUsers();
      setUsers(data);
    } catch (error) {
      console.error('Failed to fetch users:', error);
      showToast('Failed to load users', 'error');
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchUsers();
  }, []);

  const handleCreateUser = () => {
    setEditingUser(null);
    setShowFormModal(true);
  };

  const handleEditUser = (user: User) => {
    setEditingUser(user);
    setShowFormModal(true);
  };

  const handleViewUser = (user: User) => {
    setSelectedUser(user);
    setShowViewModal(true);
  };

  const handleDeleteUser = (user: User) => {
    setSelectedUser(user);
    setShowDeleteModal(true);
  };

  const handleFormSubmit = async (userData: Partial<User>) => {
    try {
      if (editingUser) {
        await apiService.updateUser(editingUser.id, userData);
        showToast('User updated successfully', 'success');
      } else {
        const newUser = {
          ...userData,
          id: Math.max(...users.map(u => u.id), 0) + 1,
        } as User;
        await apiService.createUser(newUser);
        showToast('User created successfully', 'success');
      }
      await fetchUsers();
      setShowFormModal(false);
      setEditingUser(null);
    } catch (error) {
      console.error('Failed to save user:', error);
      showToast('Failed to save user', 'error');
    }
  };

  const handleConfirmDelete = async () => {
    if (!selectedUser) return;
    
    try {
      await apiService.deleteUser(selectedUser.id);
      showToast('User deleted successfully', 'success');
      await fetchUsers();
      setShowDeleteModal(false);
      setSelectedUser(null);
    } catch (error) {
      console.error('Failed to delete user:', error);
      showToast('Failed to delete user', 'error');
    }
  };

  const handleCloseModals = () => {
    setShowFormModal(false);
    setShowViewModal(false);
    setShowDeleteModal(false);
    setSelectedUser(null);
    setEditingUser(null);
  };

  const handleBackdropClick = () => {
    handleCloseModals();
  };

  return (
    <div className="min-h-screen bg-gray-50">
      <link
        href="https://fonts.googleapis.com/css2?family=Poppins:ital,wght@0,100;0,200;0,300;0,400;0,500;0,600;0,700;0,800;0,900;1,100;1,200;1,300;1,400;1,500;1,600;1,700;1,800;1,900&display=swap"
        rel="stylesheet"
      />
      <link
        rel="stylesheet"
        href="https://cdnjs.cloudflare.com/ajax/libs/font-awesome/7.0.1/css/all.min.css"
      />
      
      <div className="mx-auto w-[90%] max-w-6xl min-h-screen py-10 border-x border-dashed border-gray-400">
        <Header />
        
        <section className="mb-6 px-6">
          <div className="text-justify font-light">
            The final outcome of the <strong>Level 1</strong> Codveda Internship
            Program:
            <em className="bg-amber-500 ml-1">
              a simple CRUD API paired with a modern frontend built using our modern stack
            </em>
            <ul className="list-disc pl-8 mt-2 font-light">
              <li>HTML</li>
              <li>CSS</li>
              <li>JavaScript</li>
              <li>React</li>
              <li>TypeScript</li>
            </ul>
          </div>
        </section>
        
        <div className="border-b border-dashed border-gray-400 my-4" />
        
        <main className="rounded-lg p-6 mb-6">
          <div className="flex justify-between items-center mb-5">
            <div className="text-xl font-semibold">Users list</div>
            <button
              onClick={handleCreateUser}
              className="px-3 py-1 bg-blue-500 text-white rounded-md hover:bg-blue-600 transition-colors font-medium"
            >
              Create user
            </button>
          </div>
          
          {loading ? (
            <div className="text-center py-8 text-gray-500">
              Loading users...
            </div>
          ) : (
            <UserTable
              users={users}
              onView={handleViewUser}
              onEdit={handleEditUser}
              onDelete={handleDeleteUser}
            />
          )}
        </main>
        
        <div className="border-b border-dashed border-gray-400 my-4" />
        
        <footer className="flex items-end justify-end text-sm text-gray-600 px-6 pt-8">
          <div>Codveda internship 2025</div>
        </footer>
      </div>

      {/* Individual blur backdrop that closes all modals when clicked */}
      {(showFormModal || showViewModal || showDeleteModal) && (
        <div 
          id="blur-modals"
          className="fixed inset-0 w-full h-screen z-40"
          onClick={handleBackdropClick}
          style={{
            backgroundColor: 'rgba(255, 255, 255, 0.1)',
            backdropFilter: 'blur(15px)',
            opacity: 1,
            visibility: 'visible',
            transition: 'opacity 0.4s ease, visibility 0.4s ease'
          }}
        />
      )}

      <UserFormModal
        isOpen={showFormModal}
        onClose={handleCloseModals}
        user={editingUser}
        onSubmit={handleFormSubmit}
      />

      <ViewUserModal
        isOpen={showViewModal}
        onClose={handleCloseModals}
        user={selectedUser}
      />

      <DeleteConfirmationModal
        isOpen={showDeleteModal}
        onClose={handleCloseModals}
        onConfirm={handleConfirmDelete}
        userName={selectedUser ? `${selectedUser.firstname} ${selectedUser.lastname}` : undefined}
      />

      <ToastContainer
        toasts={toasts}
        onRemove={removeToast}
      />
    </div>
  );
};

export default Home;











