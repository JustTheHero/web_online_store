import React from 'react';
import './loginSection.css';
import { useNavigate } from 'react-router-dom';

function LoginSection() {
  const navigate = useNavigate(); // ✅ hook dentro do componente

  return (
    <section className='container'>
      <div className='container_login'>
        <div className='form_login'>
          <h2>Login</h2>
          <form action="" onSubmit={(e) => {
            e.preventDefault(); // prevenir comportamento padrão do formulário
            navigate("/userAccount"); // redirecionar
          }}>
            <div className='input_group'>
              <input type="text" placeholder='Username' />
            </div>
            <div className='input_group'>
              <input type="password" placeholder='Password' />
            </div>
            <button className="btn" type="submit">
              Login
            </button>
            <p className="register-line">Don't have an account? <a className='regbtn' href="/register">Register</a></p>
          </form>
        </div>
      </div>
    </section>
  );
}

export default LoginSection;
