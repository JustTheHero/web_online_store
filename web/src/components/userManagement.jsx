import React, { useState } from 'react';
import { Shield, ShieldCheck, Trash2 } from 'lucide-react';
import { initialUsers } from '../data/users'; // Adjust the import path as necessary
import './userManagement.css';

const UserManagement = () => {
  const [users, setUsers] = useState(initialUsers);
  const [deleteConfirm, setDeleteConfirm] = useState(null);
  
  // Simple toast function (you can replace with your preferred toast library)
  const toast = {
    success: (message) => {
      console.log('Success:', message);
      // You can implement actual toast notifications here
      alert(message); // Simple fallback
    }
  };
  
  const handleToggleAdmin = (id) => {
    setUsers(users.map(user => 
      user.id === id ? { ...user, isAdmin: !user.isAdmin } : user
    ));
    
    const user = users.find(u => u.id === id);
    if (user) {
      toast.success(`${user.name} is ${!user.isAdmin ? 'now' : 'no longer'} an admin`);
    }
  };
  
  const handleConfirmDelete = (id) => {
    setDeleteConfirm(id);
  };
  
  const handleDeleteUser = () => {
    if (deleteConfirm) {
      const userToDelete = users.find(u => u.id === deleteConfirm);
      setUsers(users.filter(user => user.id !== deleteConfirm));
      setDeleteConfirm(null);
      toast.success(`${userToDelete?.name} has been deleted`);
    }
  };

  const handleCloseModal = () => {
    setDeleteConfirm(null);
  };

  return (
    <div className="user-management-container">
      <div className="container">
        <div className="card">
          <div className="card-header">
            <h1 className="card-title">User Management</h1>
          </div>
          <div className="card-content">
            <div className="table-container">
              <div className="table-wrapper">
                <table className="table">
                  <thead className="table-header">
                    <tr>
                      <th>Name</th>
                      <th>Email</th>
                      <th>Discord</th>
                      <th>Role</th>
                      <th>Actions</th>
                    </tr>
                  </thead>
                  <tbody>
                    {users.map(user => (
                      <tr key={user.id} className="table-row">
                        <td className="table-cell" data-label="Name">{user.name}</td>
                        <td className="table-cell" data-label="Email">{user.email}</td>
                        <td className="table-cell" data-label="Discord">{user.discord}</td>
                        <td className="table-cell" data-label="Role">
                          <span className={`role-badge ${user.isAdmin ? 'admin' : 'user'}`}>
                            {user.isAdmin ? 'Admin' : 'User'}
                          </span>
                        </td>
                        <td className="table-cell" data-label="Actions">
                          <div className="actions-container">
                            <button
                              className={`btn btn-sm ${user.isAdmin ? 'btn-ghost admin' : 'btn-outline'}`}
                              onClick={() => handleToggleAdmin(user.id)}
                            >
                              {user.isAdmin ? <Shield className="icon" /> : <ShieldCheck className="icon" />}
                              <span className="btn-text">
                                {user.isAdmin ? "Remove Admin" : "Make Admin"}
                              </span>
                            </button>
                            <button
                              className="btn btn-sm btn-ghost delete"
                              onClick={() => handleConfirmDelete(user.id)}
                            >
                              <Trash2 className="icon" />
                              <span className="btn-text">Delete</span>
                            </button>
                          </div>
                        </td>
                      </tr>
                    ))}
                  </tbody>
                </table>
              </div>
            </div>
          </div>
        </div>
      </div>

      {/* Modal for delete confirmation */}
      {deleteConfirm !== null && (
        <div className="modal-overlay" onClick={handleCloseModal}>
          <div className="modal-content" onClick={(e) => e.stopPropagation()}>
            <div className="modal-header">
              <h2 className="modal-title">Confirm Deletion</h2>
              <p className="modal-description">
                Are you sure you want to delete this user? This action cannot be undone.
              </p>
            </div>
            <div className="modal-footer">
              <button className="btn btn-cancel" onClick={handleCloseModal}>
                Cancel
              </button>
              <button className="btn btn-destructive" onClick={handleDeleteUser}>
                Delete
              </button>
            </div>
          </div>
        </div>
      )}
    </div>
  );
};

export default UserManagement;