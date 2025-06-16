import React, { useState, useEffect } from 'react';
import './loginSection.css';
import { useNavigate, useLocation } from 'react-router-dom';

function LoginSection() {
  const navigate = useNavigate();
  const location = useLocation();
  
  const [formData, setFormData] = useState({
    email: '',
    senha: ''
  });
  
  const [errors, setErrors] = useState({});
  const [loading, setLoading] = useState(false);
  const [message, setMessage] = useState('');
  
  useEffect(() => {
    if (location.state?.message) {
      setMessage(location.state.message);
    }
    
    const existingUser = localStorage.getItem('user');
    if (existingUser) {
      const redirectTo = location.state?.from || '/userAccount';
      navigate(redirectTo, { replace: true });
    }
  }, [location.state, navigate]);
  
  const handleInputChange = (e) => {
    const { name, value } = e.target;
    setFormData({
      ...formData,
      [name]: value
    });
    
    if (errors[name]) {
      setErrors({
        ...errors,
        [name]: null
      });
    }
  };
  
  const validateForm = () => {
    const newErrors = {};
    
    if (!formData.email.trim()) {
      newErrors.email = 'Email é obrigatório';
    } else if (!/\S+@\S+\.\S+/.test(formData.email.trim())) {
      newErrors.email = 'Email inválido';
    }
    
    if (!formData.senha.trim()) {
      newErrors.senha = 'Senha é obrigatória';
    } else if (formData.senha.trim().length < 6) {
      newErrors.senha = 'Senha deve ter pelo menos 6 caracteres';
    }
    
    setErrors(newErrors);
    return Object.keys(newErrors).length === 0;
  };
  
  const handleLogin = async (e) => {
    e.preventDefault();
    
    if (!validateForm()) {
      return;
    }
    
    setLoading(true);
    setMessage('');
    
    try {
      console.log('Enviando dados de login:', {
        email: formData.email.trim(),
        senha: formData.senha.trim()
      }); // Debug
      
      const response = await fetch('http://localhost:5000/api/users/login', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json'
        },
        body: JSON.stringify({
          email: formData.email.trim(),
          senha: formData.senha.trim()
        })
      });
      
      console.log('Status da resposta:', response.status); // Debug
      
      const data = await response.json();
      
      if (response.ok) {
        if (data.token) {
          localStorage.setItem('authToken', data.token);
        }
        
        const userData = {
          id: data.user.id,
          nome: data.user.nome || '',
          email: data.user.email,
          discord: data.user.discord || '',
          isAdmin: data.user.isAdmin || false
        };
        
        localStorage.setItem('user', JSON.stringify(userData));
        
        const redirectTo = location.state?.from || '/userAccount';
        
        setMessage('Login realizado com sucesso!');
        
        setTimeout(() => {
          navigate(redirectTo, { replace: true });
        }, 1500);
        
      } else {
        let errorMessage = data.message || 'Erro ao fazer login';
        
        if (response.status === 401) {
          errorMessage = 'Email ou senha incorretos';
        } else if (response.status === 400) {
          errorMessage = data.message || 'Dados inválidos';
        } else if (response.status >= 500) {
          errorMessage = 'Erro no servidor. Tente novamente em alguns minutos.';
        }
        
        setMessage(errorMessage);
      }
      
    } catch (error) {
      const errorMessage = error.message.includes('fetch') 
        ? 'Erro de conexão. Verifique se o servidor está rodando.' 
        : 'Erro inesperado. Tente novamente.';
      setMessage(errorMessage);
    } finally {
      setLoading(false);
    }
  };
  
  return (
    <section className='container'>
      <div className='container_login'>
        <div className='form_login'>
          <h2>Login</h2>
          
          {location.state?.from && (
            <div className="info_message">
              You need to login to continue
            </div>
          )}
          
          {message && (
            <div className={`message ${message.includes('sucesso') ? 'success' : 'error'}`}>
              {message}
            </div>
          )}
          
          <form onSubmit={handleLogin}>
            <div className='input_group'>
              <input 
                type="email"
                name="email"
                placeholder='Email'
                value={formData.email}
                onChange={handleInputChange}
                className={errors.email ? 'error' : ''}
                disabled={loading}
                autoComplete="email"
              />
              {errors.email && <p className="error_message">{errors.email}</p>}
            </div>
            
            <div className='input_group'>
              <input 
                type="password"
                name="senha"
                placeholder='Senha'
                value={formData.senha}
                onChange={handleInputChange}
                className={errors.senha ? 'error' : ''}
                disabled={loading}
                autoComplete="current-password"
              />
              {errors.senha && <p className="error_message">{errors.senha}</p>}
            </div>
            
            <button className="btn" type="submit" disabled={loading}>
              {loading ? 'Entrando...' : 'Login'}
            </button>
            
            <p className="register-line">
              Don't have an account? 
              <button 
                type="button"
                className='regbtn'
                onClick={() => navigate('/register')}
                disabled={loading}
              >
                Register
              </button>
            </p>
          </form>
        </div>
      </div>
    </section>
  );
}

export default LoginSection;