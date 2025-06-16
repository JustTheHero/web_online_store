import React, { useState, useEffect } from 'react';
import { Shield, ShieldCheck, Trash2, ArrowLeft } from 'lucide-react';
import { useAuth } from '../hooks/useAuth';

const UserManagement = ({ onBack }) => {
  const [users, setUsers] = useState([]);
  const [deleteConfirm, setDeleteConfirm] = useState(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);
  const { user: currentUser, requireAdmin } = useAuth();
  
  useEffect(() => {
    if (!requireAdmin()) {
      return;
    }
  }, [requireAdmin]);

  const toast = {
    success: (message) => {
      console.log('Success:', message);
      alert(message);
    },
    error: (message) => {
      console.error('Error:', message);
      alert('Erro: ' + message);
    }
  };

  const fetchUsers = async () => {
    try {
      setLoading(true);
      setError(null);
      
      const response = await fetch('http://localhost:5000/api/users/all', {
        method: 'GET',
        headers: {
          'Content-Type': 'application/json'
        }
      });

      if (response.ok) {
        const userData = await response.json();
        // Transformar dados para o formato esperado pelo componente
        const formattedUsers = userData.map(user => ({
          id: user._id,
          name: user.nome,
          email: user.email,
          discord: user.discord || '',
          isAdmin: user.isAdmin || false
        }));
        setUsers(formattedUsers);
      } else {
        const errorData = await response.json();
        setError(errorData.message || 'Erro ao carregar usuários');
        toast.error('Erro ao carregar usuários');
      }
    } catch (error) {
      console.error('Erro ao buscar usuários:', error);
      setError('Erro de conexão ao buscar usuários');
      toast.error('Erro de conexão ao buscar usuários');
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchUsers();
  }, []);
  
  const handleToggleAdmin = async (id) => {
    try {
      const userToUpdate = users.find(u => u.id === id);
      if (!userToUpdate) return;

      if (userToUpdate.id === currentUser?.id && userToUpdate.isAdmin) {
        toast.error('you can\'t remove your own admin privileges');
        return;
      }

      const response = await fetch(`http://localhost:5000/api/users/${id}`, {
        method: 'PUT',
        headers: {
          'Content-Type': 'application/json'
        },
        body: JSON.stringify({
          isAdmin: !userToUpdate.isAdmin
        })
      });

      if (response.ok) {
        // Atualizar o estado local
        setUsers(users.map(user => 
          user.id === id ? { ...user, isAdmin: !user.isAdmin } : user
        ));
        
        toast.success(`${userToUpdate.name} ${!userToUpdate.isAdmin ? 'now is' : 'is not'} an admin`);
      } else {
        const errorData = await response.json();
        toast.error(errorData.message || 'connection error');
      }
    } catch (error) {
      toast.error('connection error');
    }
  };
  
  const handleConfirmDelete = (id) => {
    const userToDelete = users.find(u => u.id === id);
    
    if (userToDelete?.id === currentUser?.id) {
      toast.error('you can\'t delete your own account');
      return;
    }
    
    setDeleteConfirm(id);
  };
  
  const handleDeleteUser = async () => {
    if (!deleteConfirm) return;

    try {
      const response = await fetch(`http://localhost:5000/api/users/${deleteConfirm}`, {
        method: 'DELETE',
        headers: {
          'Content-Type': 'application/json'
        }
      });

      if (response.ok) {
        const userToDelete = users.find(u => u.id === deleteConfirm);
        setUsers(users.filter(user => user.id !== deleteConfirm));
        setDeleteConfirm(null);
        toast.success(`${userToDelete?.name || 'user'} deleted successfully`);
      } else {
        const errorData = await response.json();
        toast.error(errorData.message || 'connection error');
      }
    } catch (error) {
      toast.error('connection error');
    }
  };

  const handleCloseModal = () => {
    setDeleteConfirm(null);
  };

  const handleBack = () => {
    if (onBack && typeof onBack === 'function') {
      onBack();
    } else {
      window.history.back();
    }
  };

  if (loading) {
    return (
      <div style={{
        minHeight: '100vh',
        backgroundColor: '#0d1117',
        padding: '2rem 1rem',
        display: 'flex',
        alignItems: 'center',
        justifyContent: 'center'
      }}>
        <div style={{ color: '#4FD3E6', fontSize: '1.2rem' }}>
          loading users...
        </div>
      </div>
    );
  }

  if (error) {
    return (
      <div style={{
        minHeight: '100vh',
        backgroundColor: '#0d1117',
        padding: '2rem 1rem',
        display: 'flex',
        flexDirection: 'column',
        alignItems: 'center',
        justifyContent: 'center'
      }}>
        <div style={{ color: '#EF4444', fontSize: '1.2rem', marginBottom: '1rem' }}>
          {error}
        </div>
        <button 
          className="btn"
          onClick={fetchUsers}
          style={{
            backgroundColor: '#4FD3E6',
            color: '#0d1117',
            border: 'none',
            padding: '0.75rem 1.5rem',
            borderRadius: '6px',
            cursor: 'pointer',
            fontSize: '1rem',
            fontWeight: '500'
          }}
        >
          try again
        </button>
      </div>
    );
  }

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
          backgroundColor: '#21262d',
          color: 'white',
          borderRadius: '8px',
          boxShadow: '0 4px 6px rgba(0, 0, 0, 0.1)',
          width: '100%'
        }}>
          <div style={{
            padding: '1.5rem',
            borderBottom: '1px solid rgba(79, 211, 230, 0.2)',
            display: 'flex',
            alignItems: 'center',
            justifyContent: 'space-between'
          }}>
            <div style={{ display: 'flex', alignItems: 'center', gap: '1rem' }}>
              <button
                className="btn"
                onClick={handleBack}
              >
                <ArrowLeft size={18} />
                <span style={{ marginLeft: '0.5rem' }}>back</span>
              </button>
              <h1 style={{
                fontSize: '1.5rem',
                fontWeight: 'bold',
                color: '#4FD3E6',
                margin: 0
              }}>User Management</h1>
            </div>
            <div style={{ 
              fontSize: '0.875rem',
              color: '#D1D5DB'
            }}>
              Total: {users.length} users
            </div>
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
                scrollbarColor: '#4FD3E6 #21262d',
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
                      }}>Nome</th>
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
                      }}>Função</th>
                      <th style={{
                        color: '#4FD3E6',
                        padding: '0.75rem',
                        textAlign: 'left',
                        fontWeight: 600,
                        fontSize: '0.875rem',
                        whiteSpace: 'nowrap',
                        width: '25%'
                      }}>Ações</th>
                    </tr>
                  </thead>
                  <tbody>
                    {users.map(user => (
                      <tr key={user.id} style={{
                        borderTop: '1px solid rgba(79, 211, 230, 0.2)',
                        backgroundColor: user.id === currentUser?.id ? 'rgba(79, 211, 230, 0.05)' : 'transparent'
                      }}>
                        <td style={{
                          padding: '0.75rem',
                          fontSize: '0.875rem',
                          wordWrap: 'break-word'
                        }}>
                          {user.name}
                          {user.id === currentUser?.id && (
                            <span style={{
                              marginLeft: '0.5rem',
                              fontSize: '0.75rem',
                              color: '#4FD3E6',
                              fontWeight: 500
                            }}>(Você)</span>
                          )}
                        </td>
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
                        }}>{user.discord || '-'}</td>
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
                            {user.isAdmin ? 'Admin' : 'Usuário'}
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
                              className="btn"
                              style={{
                                display: 'inline-flex',
                                alignItems: 'center',
                                padding: '0.375rem 0.625rem',
                                fontSize: '0.75rem',
                                fontWeight: 500,
                                borderRadius: '4px',
                                border: user.isAdmin ? '1px solid transparent' : '1px solid rgba(79, 211, 230, 0.3)',
                                cursor: user.id === currentUser?.id && user.isAdmin ? 'not-allowed' : 'pointer',
                                transition: 'all 0.2s ease',
                                whiteSpace: 'nowrap',
                                backgroundColor: 'transparent',
                                color: user.isAdmin ? '#EF4444' : '#4FD3E6',
                                opacity: user.id === currentUser?.id && user.isAdmin ? 0.5 : 1
                              }}
                              onClick={() => handleToggleAdmin(user.id)}
                              onMouseEnter={(e) => {
                                if (!(user.id === currentUser?.id && user.isAdmin)) {
                                  e.target.style.backgroundColor = '#162B45';
                                }
                              }}
                              onMouseLeave={(e) => e.target.style.backgroundColor = 'transparent'}
                              disabled={user.id === currentUser?.id && user.isAdmin}
                            >
                              {user.isAdmin ? <Shield size={18} /> : <ShieldCheck size={18} />}
                              <span style={{ marginLeft: '0.5rem' }}>
                                {user.isAdmin ? "Remover Admin" : "Tornar Admin"}
                              </span>
                            </button>
                            <button
                              className="btn"
                              style={{
                                display: 'inline-flex',
                                alignItems: 'center',
                                padding: '0.375rem 0.625rem',
                                fontSize: '0.75rem',
                                fontWeight: 500,
                                borderRadius: '4px',
                                border: '1px solid transparent',
                                cursor: user.id === currentUser?.id ? 'not-allowed' : 'pointer',
                                transition: 'all 0.2s ease',
                                whiteSpace: 'nowrap',
                                backgroundColor: 'transparent',
                                color: '#EF4444',
                                opacity: user.id === currentUser?.id ? 0.5 : 1
                              }}
                              onClick={() => handleConfirmDelete(user.id)}
                              onMouseEnter={(e) => {
                                if (user.id !== currentUser?.id) {
                                  e.target.style.backgroundColor = '#162B45';
                                }
                              }}
                              onMouseLeave={(e) => e.target.style.backgroundColor = 'transparent'}
                              disabled={user.id === currentUser?.id}
                            >
                              <Trash2 size={18} />
                              <span style={{ marginLeft: '0.5rem' }}>Deletar</span>
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
              }}>Confirmar Exclusão</h2>
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
              <button 
                className="btn"
                style={{
                  background: 'transparent',
                  color: '#D1D5DB',
                  border: '1px solid rgba(209, 213, 219, 0.3)',
                  padding: '0.375rem 0.75rem',
                  fontSize: '0.875rem',
                  fontWeight: 500,
                  borderRadius: '4px',
                  cursor: 'pointer',
                  transition: 'all 0.2s ease'
                }} 
                onClick={handleCloseModal}
              >
                Cancelar
              </button>
              <button 
                className="btn"
                style={{
                  backgroundColor: '#DC2626',
                  color: 'white',
                  border: 'none',
                  padding: '0.375rem 0.75rem',
                  fontSize: '0.875rem',
                  fontWeight: 500,
                  borderRadius: '4px',
                  cursor: 'pointer',
                  transition: 'all 0.2s ease'
                }} 
                onClick={handleDeleteUser}
              >
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