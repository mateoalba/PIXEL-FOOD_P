import { useAuth } from '../hooks/useAuth';

const Navbar = () => {
  const { logout } = useAuth();

  return (
    <button onClick={logout}>
      Cerrar sesión
    </button>
  );
};

export default Navbar;
