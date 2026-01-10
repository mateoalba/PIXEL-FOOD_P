import { useEffect, useState } from 'react';
import { createRol, updateRol } from '../api/rol';
import type { Rol } from '../api/rol';

interface Props {
  rol: Rol;
  onClose: () => void;
}

const RoleForm = ({ rol, onClose }: Props) => {
  const [nombre, setNombre] = useState('');
  const [descripcion, setDescripcion] = useState('');

  useEffect(() => {
    if (rol?.id_rol) {
      setNombre(rol.nombre);
      setDescripcion(rol.descripcion);
    }
  }, [rol]);

  const handleSubmit = async () => {
    if (rol?.id_rol) {
      await updateRol(rol.id_rol, { nombre, descripcion });
    } else {
      await createRol({ nombre, descripcion });
    }
    onClose();
  };

  return (
    <div>
      <h3>{rol?.id_rol ? 'Editar Rol' : 'Nuevo Rol'}</h3>

      <input
        placeholder="Nombre"
        value={nombre}
        onChange={e => setNombre(e.target.value)}
      />

      <input
        placeholder="Descripción"
        value={descripcion}
        onChange={e => setDescripcion(e.target.value)}
      />

      <button onClick={handleSubmit}>Guardar</button>
      <button onClick={onClose}>Cancelar</button>
    </div>
  );
};

export default RoleForm;
