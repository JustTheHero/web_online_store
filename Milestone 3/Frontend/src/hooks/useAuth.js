import { useState, useEffect } from 'react';
import { useNavigate } from 'react-router-dom';

export const useAuth = () => {
  const [user, setUser] = useState(null);
  const [loading, setLoading] = useState(true);
  const [isAuthenticated, setIsAuthenticated] = useState(false);
  const navigate = useNavigate();

  useEffect(() => {
    checkAuthStatus();
  }, []);

  const checkAuthStatus = async () => {
    try {
      setLoading(true);
      const savedUser = localStorage.getItem('user');
      const authToken = localStorage.getItem('authToken');

      if (savedUser) {
        try {
          const parsedUser = JSON.parse(savedUser);
          if (parsedUser && parsedUser.id && parsedUser.email) {
            setUser(parsedUser);
            setIsAuthenticated(true);
          } else {
            logout();
          }
        } catch (parseError) {
          console.error(parseError);
          logout();
        }
      } else if (authToken) {
        const userData = await fetchUserProfile(authToken);
        if (userData) {
          setUser(userData);
          setIsAuthenticated(true);
          localStorage.setItem('user', JSON.stringify(userData));
        } else {
          logout();
        }
      } else {
        setIsAuthenticated(false);
      }
    } catch (error) {
      console.error(error);
      logout();
    } finally {
      setLoading(false);
    }
  };

  const fetchUserProfile = async (token) => {
    try {
      const response = await fetch('http://localhost:5000/api/users/profile', {
        headers: {
          'Authorization': `Bearer ${token}`,
          'Content-Type': 'application/json'
        }
      });

      if (response.ok) {
        const userData = await response.json();
        return userData;
      } 
      return null;
    } catch (error) {
      console.error(error);
      return null;
    }
  };

  const login = async (email, senha) => {
    try {
      setLoading(true);
      
      const response = await fetch('http://localhost:5000/api/users/login', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json'
        },
        body: JSON.stringify({ email: email.trim(), senha: senha.trim() })
      });

      const data = await response.json();

      if (response.ok) {
        // Salvar token se fornecido
        if (data.token) {
          localStorage.setItem('authToken', data.token);
        }
        
        // Processar dados do usuário
        const userData = data.user || {
          id: data.id,
          nome: data.nome || '',
          email: email.trim(),
          discord: data.discord || '',
          isAdmin: data.isAdmin || false
        };

        // Validar dados antes de salvar
        if (userData.id && userData.email) {
          localStorage.setItem('user', JSON.stringify(userData));
          setUser(userData);
          setIsAuthenticated(true);
          
          console.log('Login realizado com sucesso:', userData.email);
          
          return { success: true, user: userData };
        } else {
          return { success: false, message: 'Dados do usuário inválidos' };
        }
      } else {
        return { success: false, message: data.message || 'Erro ao fazer login' };
      }
    } catch (error) {
      console.error(error);
      return { success: false, message: 'Erro de conexão. Tente novamente.' };
    } finally {
      setLoading(false);
    }
  };

  const register = async (nome, email, senha, discord = '') => {
    try {
      setLoading(true);
      
      const response = await fetch('http://localhost:5000/api/users/register', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json'
        },
        body: JSON.stringify({ 
          nome: nome.trim(), 
          email: email.trim(), 
          senha: senha.trim(),
          discord: discord.trim()
        })
      });

      const data = await response.json();

      if (response.ok) {
        // Após registrar, fazer login automaticamente
        const loginResult = await login(email, senha);
        return loginResult;
      } else {
        return { success: false, message: data.message || 'Erro ao criar conta' };
      }
    } catch (error) {
      console.error(error);
      return { success: false, message: 'Erro de conexão. Tente novamente.' };
    } finally {
      setLoading(false);
    }
  };

  const logout = () => {
    localStorage.removeItem('user');
    localStorage.removeItem('authToken');
    setUser(null);
    setIsAuthenticated(false);
    console.log('Logout realizado');
  };

  const updateUser = async (updatedUserData) => {
    try {
      if (!user || !user.id) {
        throw new Error('Usuário não encontrado');
      }

      // Atualizar no servidor
      const response = await fetch(`http://localhost:5000/api/users/${user.id}`, {
        method: 'PUT',
        headers: {
          'Content-Type': 'application/json'
        },
        body: JSON.stringify(updatedUserData)
      });

      if (response.ok) {
        const serverUpdatedUser = await response.json();
        
        // Mesclar dados do servidor com dados locais
        const newUserData = { 
          ...user, 
          ...serverUpdatedUser,
          // Manter ID original se não foi retornado
          id: serverUpdatedUser.id || user.id
        };
        
        setUser(newUserData);
        localStorage.setItem('user', JSON.stringify(newUserData));
        
        return { success: true, user: newUserData };
      } else {
        const errorData = await response.json();
        return { success: false, message: errorData.message || 'Error updating user' };
      }
    } catch (error) {
      console.error(error);
      return { success: false, message: 'Error connection. Try again.' };
    }
  };

  const requireAuth = (redirectTo = '/loginSection') => {
    if (!loading && !isAuthenticated) {
      navigate(redirectTo, {
        state: { from: window.location.pathname }
      });
      return false;
    }
    return isAuthenticated;
  };

  const requireAdmin = (redirectTo = '/') => {
    if (!loading && (!isAuthenticated || !user?.isAdmin)) {
      navigate(redirectTo, {
        state: { from: window.location.pathname, message: 'Acesso negado: privilégios de administrador necessários' }
      });
      return false;
    }
    return isAuthenticated && user?.isAdmin;
  };

  const getUserOrders = async () => {
    if (!user || !user.id) {
      return { success: false, message: 'User not authenticated' };
    }

    try {
      const response = await fetch(`http://localhost:5000/api/sales?customerId=${user.id}`);
      
      if (response.ok) {
        const sales = await response.json();
        return { success: true, orders: sales };
      } else {
        const errorData = await response.json();
        return { success: false, message: errorData.message || 'Error fetching orders' };
      }
    } catch (error) {
      console.error(error);
      return { success: false, message: 'Error connection. Try again.' };
    }
  };

  const getUserStats = async () => {
    if (!user || !user.id) {
      return { success: false, message: 'User not authenticated' };
    }

    try {
      const response = await fetch(`http://localhost:5000/api/sales/user/${user.id}`);
      
      if (response.ok) {
        const data = await response.json();
        return { success: true, stats: data.stats, orders: data.sales };
      } else {
        const errorData = await response.json();
        return { success: false, message: errorData.message || 'Error fetching statistics' };
      }
    } catch (error) {
      console.error(error);
      return { success: false, message: 'Error connection. Try again.' };
    }
  };

  const isUserAuthenticated = () => {
    return !loading && isAuthenticated && user;
  };

  return {
    user,
    loading,
    isAuthenticated,
    login,
    register,
    logout,
    updateUser,
    requireAuth,
    requireAdmin,
    checkAuthStatus,
    getUserOrders,
    getUserStats,
    isUserAuthenticated
  };
};