import api from './axios';

export interface Rol {
  id_rol: string; // UUID
  nombre: string;
  descripcion: string;
}




export const getRoles = async (): Promise<Rol[]> => {
  const res = await api.get('/rol');
  return res.data;
};


export const getRolById = async (id: string): Promise<Rol> => {
  const res = await api.get(`/rol/${id}`);
  return res.data;
};


export const createRol = async (
  data: Omit<Rol, 'id_rol'>
): Promise<Rol> => {
  const res = await api.post('/rol', data);
  return res.data;
};


export const updateRol = async (
  id: string,
  data: Omit<Rol, 'id_rol'>
): Promise<Rol> => {
  const res = await api.put(`/rol/${id}`, data);
  return res.data;
};


export const deleteRol = async (id: string): Promise<void> => {
  await api.delete(`/rol/${id}`);
};
