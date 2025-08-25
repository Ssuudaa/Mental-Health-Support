import { Link, useNavigate } from "react-router-dom";
import { useAuth } from "../context/AuthContext";

/** */
const Navbar = () => {
  const { user, logout } = useAuth();
  const navigate = useNavigate();

  const handleLogout = () => {
    logout();
    navigate("/login");
  };

  return (
    <nav className="sticky top-0 z-50 backdrop-blur-xl bg-white/60 border-b border-white/50">
      <div className="mx-auto max-w-7xl px-4 md:px-6 py-3 flex items-center justify-between">
        <div className="flex items-center gap-6">
          <Link
            to="/dashboard"
            className="text-xl md:text-2xl font-semibold tracking-tight bg-clip-text text-transparent bg-gradient-to-r from-indigo-600 via-sky-600 to-emerald-500"
          >
            Mental Health Support
          </Link>
          {user && (
            <div className="hidden md:flex items-center gap-4 text-slate-700">
              <Link to="/bookings" className="hover:text-indigo-600 transition-colors">Bookings</Link>
              <Link to="/moods" className="hover:text-indigo-600 transition-colors">Moods</Link>
            </div>
          )}
        </div>
        <div className="flex items-center gap-3">
          {user ? (
            <>
              <Link to="/profile" className="px-3 py-1.5 rounded-xl text-slate-700 hover:bg-slate-100 transition-colors">Profile</Link>
              <button
                onClick={handleLogout}
                className="px-4 py-1.5 rounded-xl text-white bg-gradient-to-r from-rose-500 to-red-500 hover:opacity-90 transition-opacity shadow-lg shadow-red-100"
              >
                Logout
              </button>
            </>
          ) : (
            <>
              <Link to="/login" className="px-3 py-1.5 rounded-xl text-slate-700 hover:bg-slate-100 transition-colors">Login</Link>
              <Link to="/register" className="px-4 py-1.5 rounded-xl text-white bg-gradient-to-r from-emerald-500 to-teal-500 hover:opacity-90 transition-opacity shadow-lg shadow-emerald-100">Register</Link>
            </>
          )}
        </div>
      </div>
    </nav>
  );
};

export default Navbar;
