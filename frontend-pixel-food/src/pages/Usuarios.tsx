import { useEffect, useState } from 'react';
import api from '../api/axios';
import Navbar from '../components/Navbar';

const Usuarios = () => {
  const [usuarios, setUsuarios] = useState<any[]>([]);

  useEffect(() => {
    api.get('/usuario').then(res => setUsuarios(res.data));
  }, []);

  return (
    <div>
      <Navbar />
      <h2>Usuarios</h2>
      {usuarios.map(u => (
        <div key={u.id}>{u.nombre}</div>
      ))}
    </div>
  );
};

export default Usuarios;
