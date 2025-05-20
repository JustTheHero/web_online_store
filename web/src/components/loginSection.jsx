import React from 'react';
import './loginSection.css';

function LoginSection(){
    return (
        <section className='container'>
            <div className='container_login'>
                <div className='form_login'>
                    <h2>Login</h2>
                    <form action="">
                        <div className='input_group'>
                            <input type="text" placeholder='Username'/>
                        </div>
                        <div className='input_group'>
                            <input type="password" placeholder='Password'/>
                        </div>
                        <button className='btn'>Login</button>
                        <p>Don't have an account? <a href="/register">Register</a></p>
                    </form>
                </div>
            </div>
        </section>
    )
}

export default LoginSection;