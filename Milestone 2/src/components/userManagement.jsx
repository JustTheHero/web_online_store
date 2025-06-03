import React, { useState } from 'react';
import { Shield, ShieldCheck, Trash2 } from 'lucide-react';

const UserManagement = () => {
  // Dados de exemplo com mais usuários para testar
  const initialUsers = [
    { id: 1, name: 'João Silva', email: 'joao.silva@email.com', discord: 'joao#1234', isAdmin: true },
    { id: 2, name: 'Maria Santos', email: 'maria.santos@email.com', discord: 'maria#5678', isAdmin: false },
    { id: 3, name: 'Pedro Oliveira', email: 'pedro.oliveira@email.com', discord: 'pedro#9012', isAdmin: false },
    { id: 4, name: 'Ana Costa', email: 'ana.costa@email.com', discord: 'ana#3456', isAdmin: true },
    { id: 5, name: 'Carlos Ferreira', email: 'carlos.ferreira@email.com', discord: 'carlos#7890', isAdmin: false },
    { id: 6, name: 'Julia Rodrigues', email: 'julia.rodrigues@email.com', discord: 'julia#2468', isAdmin: false },
  ];

  const [users, setUsers] = useState(initialUsers);
  const [deleteConfirm, setDeleteConfirm] = useState(null);
  
  const toast = {
    success: (message) => {
      console.log('Success:', message);
      alert(message);
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
    <div style={{
      minHeight: '100vh',
      backgroundColor: '#0d1117',
      padding: '2rem 1rem',
    }}>
      <div style={{
        maxWidth: '1200px',
        margin: '0 auto',
        width: '100%'
      }}>
        <div style={{
          backgroundColor: '#1F4068',
          color: 'white',
          borderRadius: '8px',
          boxShadow: '0 4px 6px rgba(0, 0, 0, 0.1)',
          width: '100%'
        }}>
          <div style={{
            padding: '1.5rem',
            borderBottom: '1px solid rgba(79, 211, 230, 0.2)'
          }}>
            <h1 style={{
              fontSize: '1.5rem',
              fontWeight: 'bold',
              color: '#4FD3E6',
              margin: 0
            }}>User Management</h1>
          </div>
          
          <div style={{
            padding: '1.5rem'
          }}>
            <div style={{
              border: '1px solid rgba(79, 211, 230, 0.2)',
              borderRadius: '6px',
              overflow: 'hidden',
              width: '100%',
              position: 'relative'
            }}>
              <div style={{
                overflowX: 'auto',
                overflowY: 'hidden',
                WebkitOverflowScrolling: 'touch',
                scrollbarWidth: 'thin',
                scrollbarColor: '#4FD3E6 #1F4068',
                width: '100%'
              }}>
                <table style={{
                  width: '100%',
                  borderCollapse: 'collapse',
                  minWidth: '800px'
                }}>
                  <thead style={{
                    backgroundColor: '#162B45'
                  }}>
                    <tr>
                      <th style={{
                        color: '#4FD3E6',
                        padding: '0.75rem',
                        textAlign: 'left',
                        fontWeight: 600,
                        fontSize: '0.875rem',
                        whiteSpace: 'nowrap',
                        width: '20%'
                      }}>Name</th>
                      <th style={{
                        color: '#4FD3E6',
                        padding: '0.75rem',
                        textAlign: 'left',
                        fontWeight: 600,
                        fontSize: '0.875rem',
                        whiteSpace: 'nowrap',
                        width: '25%'
                      }}>Email</th>
                      <th style={{
                        color: '#4FD3E6',
                        padding: '0.75rem',
                        textAlign: 'left',
                        fontWeight: 600,
                        fontSize: '0.875rem',
                        whiteSpace: 'nowrap',
                        width: '20%'
                      }}>Discord</th>
                      <th style={{
                        color: '#4FD3E6',
                        padding: '0.75rem',
                        textAlign: 'left',
                        fontWeight: 600,
                        fontSize: '0.875rem',
                        whiteSpace: 'nowrap',
                        width: '10%'
                      }}>Role</th>
                      <th style={{
                        color: '#4FD3E6',
                        padding: '0.75rem',
                        textAlign: 'left',
                        fontWeight: 600,
                        fontSize: '0.875rem',
                        whiteSpace: 'nowrap',
                        width: '25%'
                      }}>Actions</th>
                    </tr>
                  </thead>
                  <tbody>
                    {users.map(user => (
                      <tr key={user.id} style={{
                        borderTop: '1px solid rgba(79, 211, 230, 0.2)'
                      }}>
                        <td style={{
                          padding: '0.75rem',
                          fontSize: '0.875rem',
                          wordWrap: 'break-word'
                        }}>{user.name}</td>
                        <td style={{
                          padding: '0.75rem',
                          fontSize: '0.875rem',
                          wordWrap: 'break-word',
                          wordBreak: 'break-all'
                        }}>{user.email}</td>
                        <td style={{
                          padding: '0.75rem',
                          fontSize: '0.875rem',
                          wordWrap: 'break-word'
                        }}>{user.discord}</td>
                        <td style={{
                          padding: '0.75rem',
                          fontSize: '0.875rem'
                        }}>
                          <span style={{
                            display: 'inline-flex',
                            alignItems: 'center',
                            padding: '0.25rem 0.625rem',
                            borderRadius: '9999px',
                            fontSize: '0.75rem',
                            fontWeight: 500,
                            whiteSpace: 'nowrap',
                            backgroundColor: user.isAdmin ? 'rgba(79, 211, 230, 0.2)' : 'rgba(107, 114, 128, 0.5)',
                            color: user.isAdmin ? '#4FD3E6' : '#D1D5DB'
                          }}>
                            {user.isAdmin ? 'Admin' : 'User'}
                          </span>
                        </td>
                        <td style={{
                          padding: '0.75rem',
                          fontSize: '0.875rem'
                        }}>
                          <div style={{
                            display: 'flex',
                            gap: '0.5rem',
                            flexWrap: 'wrap'
                          }}>
                            <button
                              style={{
                                display: 'inline-flex',
                                alignItems: 'center',
                                padding: '0.375rem 0.625rem',
                                fontSize: '0.75rem',
                                fontWeight: 500,
                                borderRadius: '4px',
                                border: user.isAdmin ? '1px solid transparent' : '1px solid rgba(79, 211, 230, 0.3)',
                                cursor: 'pointer',
                                transition: 'all 0.2s ease',
                                whiteSpace: 'nowrap',
                                backgroundColor: user.isAdmin ? 'transparent' : 'transparent',
                                color: user.isAdmin ? '#EF4444' : '#4FD3E6'
                              }}
                              onClick={() => handleToggleAdmin(user.id)}
                              onMouseEnter={(e) => e.target.style.backgroundColor = '#162B45'}
                              onMouseLeave={(e) => e.target.style.backgroundColor = 'transparent'}
                            >
                              {user.isAdmin ? <Shield size={18} /> : <ShieldCheck size={18} />}
                              <span style={{ marginLeft: '0.5rem' }}>
                                {user.isAdmin ? "Remove Admin" : "Make Admin"}
                              </span>
                            </button>
                            <button
                              style={{
                                display: 'inline-flex',
                                alignItems: 'center',
                                padding: '0.375rem 0.625rem',
                                fontSize: '0.75rem',
                                fontWeight: 500,
                                borderRadius: '4px',
                                border: '1px solid transparent',
                                cursor: 'pointer',
                                transition: 'all 0.2s ease',
                                whiteSpace: 'nowrap',
                                backgroundColor: 'transparent',
                                color: '#EF4444'
                              }}
                              onClick={() => handleConfirmDelete(user.id)}
                              onMouseEnter={(e) => e.target.style.backgroundColor = '#162B45'}
                              onMouseLeave={(e) => e.target.style.backgroundColor = 'transparent'}
                            >
                              <Trash2 size={18} />
                              <span style={{ marginLeft: '0.5rem' }}>Delete</span>
                            </button>
                          </div>
                        </td>
                      </tr>
                    ))}
                  </tbody>
                </table>
              </div>
              
              {/* Mobile scroll indicator */}
              <div style={{
                display: window.innerWidth <= 1024 ? 'block' : 'none',
                textAlign: 'center',
                fontSize: '0.75rem',
                color: '#4FD3E6',
                padding: '0.5rem',
                backgroundColor: 'rgba(79, 211, 230, 0.1)',
                borderTop: '1px solid rgba(79, 211, 230, 0.2)'
              }}>
                ← Deslize horizontalmente para ver mais →
              </div>
            </div>
          </div>
        </div>
      </div>

      {/* Modal for delete confirmation */}
      {deleteConfirm !== null && (
        <div style={{
          position: 'fixed',
          inset: 0,
          backgroundColor: 'rgba(0, 0, 0, 0.5)',
          display: 'flex',
          alignItems: 'center',
          justifyContent: 'center',
          zIndex: 1000
        }} onClick={handleCloseModal}>
          <div style={{
            backgroundColor: '#1F4068',
            color: 'white',
            border: '1px solid rgba(79, 211, 230, 0.3)',
            borderRadius: '8px',
            padding: '1.5rem',
            maxWidth: '400px',
            width: '90%',
            margin: '0 auto'
          }} onClick={(e) => e.stopPropagation()}>
            <div style={{ marginBottom: '1rem' }}>
              <h2 style={{
                color: '#4FD3E6',
                fontSize: '1.125rem',
                fontWeight: 600,
                margin: '0 0 0.5rem 0'
              }}>Confirm Deletion</h2>
              <p style={{
                color: '#D1D5DB',
                fontSize: '0.875rem',
                margin: 0
              }}>
                Are you sure you want to delete this user? This action cannot be undone.
              </p>
            </div>
            <div style={{
              display: 'flex',
              justifyContent: 'flex-end',
              gap: '0.75rem',
              marginTop: '1.5rem'
            }}>
              <button style={{
                background: 'transparent',
                color: '#D1D5DB',
                border: '1px solid rgba(209, 213, 219, 0.3)',
                padding: '0.375rem 0.75rem',
                fontSize: '0.875rem',
                fontWeight: 500,
                borderRadius: '4px',
                cursor: 'pointer',
                transition: 'all 0.2s ease'
              }} onClick={handleCloseModal}>
                Cancel
              </button>
              <button style={{
                backgroundColor: '#DC2626',
                color: 'white',
                border: 'none',
                padding: '0.375rem 0.75rem',
                fontSize: '0.875rem',
                fontWeight: 500,
                borderRadius: '4px',
                cursor: 'pointer',
                transition: 'all 0.2s ease'
              }} onClick={handleDeleteUser}>
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