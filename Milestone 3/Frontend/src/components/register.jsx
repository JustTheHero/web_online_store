import React, { useState } from 'react';
import './register.css'; 
import { useNavigate } from 'react-router-dom';

function RegisterSection() {
  const navigate = useNavigate();
  
  // Estados do formulário
  const [formData, setFormData] = useState({
    nome: '',
    email: '',
    senha: '',
    confirmSenha: '',
    discord: ''
  });
  
  const [errors, setErrors] = useState({});
  const [loading, setLoading] = useState(false);
  const [message, setMessage] = useState('');

  // Atualiza dados do form e limpa erros do campo específico
  const handleInputChange = (e) => {
    const { name, value } = e.target;
    setFormData({
      ...formData,
      [name]: value
    });
    
    // Remove erro do campo quando usuário digita
    if (errors[name]) {
      setErrors({
        ...errors,
        [name]: null
      });
    }
  };

  // Validações do formulário
  const validateForm = () => {
    const newErrors = {};
    
    // Validação nome
    if (!formData.nome.trim()) {
      newErrors.nome = 'Name is required';
    } else if (formData.nome.trim().length < 2) {
      newErrors.nome = 'Name must have at least 2 characters';
    }
    
    // Validação email
    if (!formData.email.trim()) {
      newErrors.email = 'Email is required';
    } else if (!/\S+@\S+\.\S+/.test(formData.email)) {
      newErrors.email = 'Invalid email';
    }
    
    // Validação senha
    if (!formData.senha.trim()) {
      newErrors.senha = 'Password is required';
    } else if (formData.senha.length < 6) {
      newErrors.senha = 'Password must have at least 6 characters';
    }
    
    // Validação confirmação senha
    if (!formData.confirmSenha.trim()) {
      newErrors.confirmSenha = 'Confirm password is required';
    } else if (formData.senha !== formData.confirmSenha) {
      newErrors.confirmSenha = 'Passwords do not match';
    }
    
    setErrors(newErrors);
    return Object.keys(newErrors).length === 0;
  };

  // Submissão do formulário
  const handleRegister = async (e) => {
    e.preventDefault();
    
    if (!validateForm()) {
      return;
    }

    setLoading(true);
    setMessage('');

    try {
      // Requisição para API de registro
      const response = await fetch('http://localhost:5000/api/users/register', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json'
        },
        body: JSON.stringify({
          nome: formData.nome,
          email: formData.email,
          senha: formData.senha,
          discord: formData.discord
        })
      });

      const data = await response.json();

      if (response.ok) {
        // Salva token e redireciona para conta do usuário
        localStorage.setItem('authToken', data.token);
        setMessage('Registration successful!');
        
        setTimeout(() => {
          navigate('/userAccount', { replace: true });
        }, 1000);
        
      } else {
        setMessage(data.message || 'Error creating account');
      }

    } catch (error) {
      console.error('Error in registration:', error);
      setMessage('Connection error. Try again.');
    } finally {
      setLoading(false);
    }
  };

  return (
    <section className='container'>
      <div className='container_login'>
        <div className='form_login'>
          <h2>Register</h2>
          
          {/* Mensagem de feedback */}
          {message && (
            <div className={`message ${message.includes('sucesso') ? 'success' : 'error'}`}>
              {message}
            </div>
          )}
          
          <form onSubmit={handleRegister}>
            {/* Campo nome com validação */}
            <div className='input_group'>
              <input 
                type="text" 
                name="nome"
                placeholder='Full name' 
                value={formData.nome}
                onChange={handleInputChange}
                className={errors.nome ? 'error' : ''}
                disabled={loading}
              />
              {errors.nome && <p className="error_message">{errors.nome}</p>}
            </div>
            
            {/* Campo email com validação */}
            <div className='input_group'>
              <input 
                type="email" 
                name="email"
                placeholder='Email' 
                value={formData.email}
                onChange={handleInputChange}
                className={errors.email ? 'error' : ''}
                disabled={loading}
              />
              {errors.email && <p className="error_message">{errors.email}</p>}
            </div>
            
            {/* Campo senha com validação */}
            <div className='input_group'>
              <input 
                type="password" 
                name="senha"
                placeholder='Password (minimum 6 characters)' 
                value={formData.senha}
                onChange={handleInputChange}
                className={errors.senha ? 'error' : ''}
                disabled={loading}
              />
              {errors.senha && <p className="error_message">{errors.senha}</p>}
            </div>
            
            {/* Campo confirmação senha */}
            <div className='input_group'>
              <input 
                type="password" 
                name="confirmSenha"
                placeholder='Confirm password' 
                value={formData.confirmSenha}
                onChange={handleInputChange}
                className={errors.confirmSenha ? 'error' : ''}
                disabled={loading}
              />
              {errors.confirmSenha && <p className="error_message">{errors.confirmSenha}</p>}
            </div>
            
            {/* Campo discord (opcional) */}
            <div className='input_group'>
              <input 
                type="text" 
                name="discord"
                placeholder='Discord (optional)' 
                value={formData.discord}
                onChange={handleInputChange}
                disabled={loading}
              />
            </div>
            
            {/* Botão de submissão com estado de loading */}
            <button className="btn" type="submit" disabled={loading}>
              {loading ? 'Creating account...' : 'Register'}
            </button>
            
            {/* Link para página de login */}
            <p className="register-line">
              Already have an account? 
              <button 
                type="button"
                className='regbtn' 
                onClick={() => navigate('/loginSection')}
                disabled={loading}
              >
                Login
              </button>
            </p>
          </form>
        </div>
      </div>
    </section>
  );
}

export default RegisterSection;