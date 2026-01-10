import { useState } from 'react';
import { login } from '../api/auth';
import { useNavigate } from 'react-router-dom';

const Login = () => {
  const [correo, setCorreo] = useState('');
  const [contrasena, setContrasena] = useState('');
  const navigate = useNavigate();

  const handleLogin = async () => {
    const res = await login({ correo, contrasena });
    localStorage.setItem('token', res.access_token);
    navigate('/usuarios');
  };

  return (
    <div>
      <h2>Login</h2>
      <input placeholder="Correo" onChange={e => setCorreo(e.target.value)} />
      <input type="password" placeholder="Contraseña" onChange={e => setContrasena(e.target.value)} />
      <button onClick={handleLogin}>Ingresar</button>
    </div>
  );
};

export default Login;
