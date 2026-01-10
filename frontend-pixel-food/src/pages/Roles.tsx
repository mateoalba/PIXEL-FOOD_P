import { useEffect, useState } from 'react';
import { getRoles, deleteRol } from '../api/rol';
import type { Rol } from '../api/rol';
import RoleForm from '../components/RoleForm';

const Roles = () => {
  const [roles, setRoles] = useState<Rol[]>([]);
  const [selectedRol, setSelectedRol] = useState<Rol | null>(null);

  const loadRoles = async () => {
    const data = await getRoles();
    setRoles(data);
  };

  useEffect(() => {
    loadRoles();
  }, []);

  const handleDelete = async (id: string) => {
    if (confirm('¿Eliminar rol?')) {
      await deleteRol(id);
      loadRoles();
    }
  };

  return (
    <div>
      <h2>Roles</h2>

      <button onClick={() => setSelectedRol({} as Rol)}>
        Nuevo Rol
      </button>

      {selectedRol && (
        <RoleForm
          rol={selectedRol}
          onClose={() => {
            setSelectedRol(null);
            loadRoles();
          }}
        />
      )}

      <ul>
        {roles.map(r => (
          <li key={r.id_rol}>
            <b>{r.nombre}</b> - {r.descripcion}

            <button onClick={() => setSelectedRol(r)}>
              Editar
            </button>

            <button onClick={() => handleDelete(r.id_rol)}>
              Eliminar
            </button>
          </li>
        ))}
      </ul>
    </div>
  );
};

export default Roles;
