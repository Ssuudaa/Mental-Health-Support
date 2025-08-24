import { useState } from "react";
import { useAuth } from "../context/AuthContext";
import { useNavigate, Navigate, Link } from "react-router-dom";
import axiosInstance from "../axiosConfig";

const Login = () => {
  const [formData, setFormData] = useState({ email: "", password: "" });
  const { user, login } = useAuth();
  const navigate = useNavigate();

  if (user) return <Navigate to="/dashboard" replace />;

  const handleSubmit = async (e) => {
    e.preventDefault();
    try {
      const res = await axiosInstance.post("/api/auth/login", formData);
      login(res.data);
      navigate("/dashboard");
    } catch {
      alert("Login failed. Please try again.");
    }
  };

  return (
    <div
      className="min-h-screen w-full flex items-center justify-center px-4"
      style={{
        background:
          "radial-gradient(1200px 600px at 10% 10%, rgba(99,102,241,0.15), transparent), radial-gradient(1200px 600px at 90% 30%, rgba(16,185,129,0.16), transparent), linear-gradient(180deg, #F8FAFC 0%, #EEF2FF 100%)",
      }}
    >
      <div className="w-full max-w-md rounded-2xl border border-white/40 bg-white/20 backdrop-blur-2xl shadow-[0_10px_30px_rgba(2,6,23,0.15)]">
        <form onSubmit={handleSubmit} className="p-8">
          <h1 className="text-2xl font-semibold text-slate-900 text-center">Login</h1>
          <p className="text-sm text-slate-600 text-center mt-2">
            Welcome back. Please sign in to continue.
          </p>

          <div className="mt-6 space-y-4">
            <input
              type="email"
              placeholder="Email"
              value={formData.email}
              onChange={(e) => setFormData({ ...formData, email: e.target.value })}
              className="w-full rounded-xl border border-white/50 bg-white/60 backdrop-blur-md px-3 py-2 text-slate-800 placeholder-slate-400 focus:outline-none focus:ring-2 focus:ring-indigo-300"
              required
            />
            <input
              type="password"
              placeholder="Password"
              value={formData.password}
              onChange={(e) => setFormData({ ...formData, password: e.target.value })}
              className="w-full rounded-xl border border-white/50 bg-white/60 backdrop-blur-md px-3 py-2 text-slate-800 placeholder-slate-400 focus:outline-none focus:ring-2 focus:ring-indigo-300"
              required
            />
            <button
              type="submit"
              className="w-full rounded-xl text-white px-4 py-2 bg-gradient-to-r from-indigo-600 to-emerald-500 hover:opacity-90 transition-opacity shadow-lg shadow-indigo-200"
            >
              Login
            </button>
          </div>

          <div className="text-center text-sm text-slate-600 mt-4">
            Don’t have an account?{" "}
            <Link to="/register" className="text-indigo-600 hover:underline">
              Register
            </Link>
          </div>
        </form>
      </div>
    </div>
  );
};

export default Login;
