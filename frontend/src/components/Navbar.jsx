import { Link, useNavigate } from 'react-router-dom';
import { useAuth } from '../context/AuthContext';

const Navbar = () => {
  const { user, logout } = useAuth();
  const navigate = useNavigate();

  const handleLogout = () => {
    logout();
    navigate('/login');
  };

  return (
  <nav className="bg-blue-600 text-white p-4 flex justify-between items-center">
    <div className="flex items-center space-x-4">
      <Link to="/dashboard" className="text-2xl font-bold">Mental Health Support</Link>
      {user && (
        <>
          <Link to="/bookings">Bookings</Link>
          <Link to="/moods">Moods</Link>
        </>
      )}
    </div>

    <div className="flex items-center space-x-4">
      {user ? (
        <>
          <Link to="/profile">Profile</Link>
          <button
            onClick={handleLogout}
            className="bg-red-500 px-4 py-2 rounded hover:bg-red-700"
          >
            Logout
          </button>
        </>
      ) : (
        <>
          <Link to="/login">Login</Link>
          <Link
            to="/register"
            className="bg-green-500 px-4 py-2 rounded hover:bg-green-700"
          >
            Register
          </Link>
        </>
      )}
    </div>
  </nav>
);
};

export default Navbar;
