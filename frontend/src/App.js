import { BrowserRouter as Router, Routes, Route } from 'react-router-dom';
import Navbar from './components/Navbar';
import Login from './pages/Login';
import Register from './pages/Register';
import Profile from './pages/Profile';
import Dashboard from './pages/Dashboard';
import Bookings from './pages/Bookings';
import Moods from './pages/Moods';
import NotFound from './pages/Notfound';
import Welcome from './pages/Welcome';
import { Outlet } from 'react-router-dom';

function App() {
  return (
    <Router>
      <Routes>

        <Route path="*" element={<NotFound />} />

        <Route element={<LayoutWithNavbar />}>
          <Route path="/" element={<Welcome />} />
          <Route path="/login" element={<Login />} />
          <Route path="/register" element={<Register />} />
          <Route path="/profile" element={<Profile />} />
          <Route path="/dashboard" element={<Dashboard />} />
          <Route path="/bookings" element={<Bookings />} />
          <Route path="/moods" element={<Moods />} />
        </Route>

      </Routes>
    </Router>
  );
}

function LayoutWithNavbar() {
  return (
    <>
      <Navbar />
      <Outlet />
    </>
  );
}

export default App;
