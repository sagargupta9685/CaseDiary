 
import React, { useState } from 'react';
import axios from 'axios';
import { useNavigate } from 'react-router-dom';
import 'bootstrap/dist/css/bootstrap.min.css';
import styles from './login.module.css';

 

function Login() {
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [error, setError] = useState('');
  const navigate = useNavigate();



  

  const handleLogin = async (e) => {
    e.preventDefault();
    try {
       
    const res = await axios.post(
  `${import.meta.env.VITE_API_URL}/api/auth/login`,
  { email, password }
);

       const { token, user } = res.data;
       console.log(res.data);
   
      localStorage.setItem('token', token);
      localStorage.setItem('user', JSON.stringify(user));
       
      navigate('/dashboard'); 
    } catch (err) {
      setError('Invalid email or password');
    }
  };

  return (
     
    <div className={styles['login-container']}>
  <div className={styles['login-card']}>
    <div className={styles['login-header']}>
      <h2>Login</h2>
      <p>Please enter your email and password</p>
    </div>

    {error && <div className={styles['alert-error']}>{error}</div>}

    <form onSubmit={handleLogin}>
      <div className={styles['form-group']}>
        <label>Email</label>
        <input
          type="email"
          className={styles['form-control']}
          required
          onChange={(e) => setEmail(e.target.value)}
        />
      </div>
      <div className={styles['form-group']}>
        <label>Password</label>
        <input
          type="password"
          className={styles['form-control']}
          required
          onChange={(e) => setPassword(e.target.value)}
        />
      </div>
      <button className={styles['login-button']} type="submit">
        Login
      </button>
    </form>
 
     
  </div>
</div>
 

  );
}

export default Login;
