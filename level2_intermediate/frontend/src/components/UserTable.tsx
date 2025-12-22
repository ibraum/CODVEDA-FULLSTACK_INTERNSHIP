import React from 'react';
import type { User } from '../types/User';

interface UserTableProps {
  users: User[];
  onView: (user: User) => void;
  onEdit: (user: User) => void;
  onDelete: (user: User) => void;
}

const UserTable: React.FC<UserTableProps> = ({ users, onView, onEdit, onDelete }) => {
  if (!users.length) {
    return (
      <div className="text-center py-8 text-gray-500">
        No users found
      </div>
    );
  }

  return (
    <div className="overflow-x-auto">
      <table className="w-full">
        <thead>
          <tr className="border-b border-gray-300">
            <th className="text-left py-4 text-sm font-light">ID</th>
            <th className="text-left py-4 text-sm font-light">Nom</th>
            <th className="text-left py-4 text-sm font-light">Prénom</th>
            <th className="text-left py-4 text-sm font-light">Username</th>
            <th className="text-left py-4 text-sm font-light">Active</th>
            <th className="text-left py-4 text-sm font-light">Email</th>
            <th className="text-left py-4 text-sm font-light">Age</th>
            <th className="text-left py-4 text-sm font-light">Domaine</th>
            <th className="text-right py-4 text-sm font-light">Actions</th>
          </tr>
        </thead>
        <tbody>
          {users.map((user) => (
            <tr key={user.id} className="border-b border-gray-200">
              <td className="py-4 text-sm">{user.id}</td>
              <td className="py-4 text-sm">{user.lastname || ''}</td>
              <td className="py-4 text-sm">{user.firstname || ''}</td>
              <td className="py-4 text-sm">{user.username || ''}</td>
              <td className="py-4 text-sm">
                <span
                  className={`inline-block px-3 py-1 rounded-full text-xs font-semibold ${
                    user.isActive
                      ? 'bg-green-100 text-green-800'
                      : 'bg-red-100 text-red-800'
                  }`}
                >
                  {user.isActive ? 'Yes' : 'No'}
                </span>
              </td>
              <td className="py-4 text-sm">{user.email || ''}</td>
              <td className="py-4 text-sm">{user.age || ''}</td>
              <td className="py-4 text-sm">{user.field || ''}</td>
              <td className="py-4 text-sm">
                <div className="flex justify-end gap-3">
                  <button
                    onClick={() => onView(user)}
                    className="text-blue-600 hover:text-blue-800 cursor-pointer"
                    title="View"
                  >
                    <i className="fas fa-eye"></i>
                  </button>
                  <button
                    onClick={() => onEdit(user)}
                    className="text-yellow-500 hover:text-yellow-600 cursor-pointer"
                    title="Edit"
                  >
                    <i className="fas fa-pen-clip"></i>
                  </button>
                  <button
                    onClick={() => onDelete(user)}
                    className="text-red-600 hover:text-red-800 cursor-pointer"
                    title="Delete"
                  >
                    <i className="fas fa-trash-can"></i>
                  </button>
                </div>
              </td>
            </tr>
          ))}
        </tbody>
      </table>
    </div>
  );
};

export default UserTable;