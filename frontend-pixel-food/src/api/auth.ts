import api from './axios';

export interface LoginDto {
  correo: string;
  contrasena: string;
}

export const login = async (data: LoginDto) => {
  const res = await api.post('/auth/login', data);
  return res.data;
};
