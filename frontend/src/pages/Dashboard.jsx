import React, { useEffect, useState } from "react";
import { Navigate } from "react-router-dom";
import { LineChart, Line, XAxis, YAxis, CartesianGrid, Tooltip, ResponsiveContainer } from "recharts";
import { useAuth } from '../context/AuthContext';
import { message } from "antd";


const Dashboard = () => {
  const { user, logout } = useAuth();
  const [bookings, setBookings] = useState([]);
  const [moodData, setMoodData] = useState([]);


  const getToken = () => user?.token;

  const fetchBookings = async () => {
    const token = getToken();
    if (!token) return;

    try {
      const res = await fetch("http://localhost:5001/api/bookings", {
        headers: { Authorization: `Bearer ${token}` },
      });
      const data = await res.json();
      setBookings(data);
    } catch (err) {
      message.error("Failed to fetch bookings");
    }
  };

  const fetchMoods = async () => {
    const token = getToken();
    if (!token) return;

    try {
      const res = await fetch("http://localhost:5001/api/moods", {
        headers: { Authorization: `Bearer ${token}` },
      });
      const data = await res.json();
      setMoodData(data.map(m => ({
        date: new Date(m.date).toLocaleDateString("en-US", { month: "2-digit", day: "2-digit" }),
        mood: m.mood
      })));
    } catch (err) {
      message.error("Failed to fetch moods");
    }
  };

  useEffect(() => {
    fetchBookings();
    fetchMoods();
  }, [user]);

  const moodMap = { Sad: 1, Neutral: 2, Happy: 3 };
  const chartData = moodData.map(m => ({ date: m.date, mood: moodMap[m.mood] }));

  const resources = [
    { title: "Coping with Stress", content: "Learn practical tips to manage stress better...", link: "#" },
    { title: "Mindfulness Basics", content: "A short guide to staying present and calm...", link: "#" },
    { title: "How to Talk to a Therapist", content: "Simple strategies to communicate openly...", link: "#" },
    { title: "Daily Self-Care", content: "Quick habits to improve mental well-being...", link: "#" },
  ];

  if (!user) {
    return <Navigate to="/login" replace />;
  }

  return (
    <div className="grid grid-cols-1 md:grid-cols-3 gap-6 p-6 bg-gray-100 min-h-screen">
      <div className="bg-white shadow-lg rounded-xl p-5">
        <h2 className="text-lg font-bold mb-4">Upcoming Sessions</h2>
        {bookings.length > 0 ? (
          <ul className="space-y-4">
            {bookings.map((b) => (
              <li key={b._id} className="p-4 border rounded-lg hover:shadow-md bg-gray-50">
                <p><strong>Date:</strong> {new Date(b.date).toLocaleDateString()}</p>
                <p><strong>Time:</strong> {b.timeSlot}</p>
                <p><strong>Doctor:</strong> {b.doctor}</p>
                <p><strong>Location:</strong> {b.location}</p>
              </li>
            ))}
          </ul>
        ) : (
          <p className="text-gray-500">No bookings</p>
        )}
      </div>

      <div className="bg-white shadow-lg rounded-xl p-5">
        <h2 className="text-lg font-bold mb-4">Mood History (7 Days)</h2>
        <ResponsiveContainer width="100%" height={250}>
          <LineChart data={chartData}>
            <CartesianGrid strokeDasharray="3 3" />
            <XAxis dataKey="date" />
            <YAxis ticks={[1, 2, 3]} tickFormatter={(v) => v === 1 ? "Sad" : v === 2 ? "Neutral" : "Happy"} />
            <Tooltip formatter={(v) => v === 1 ? "Sad" : v === 2 ? "Neutral" : "Happy"} />
            <Line type="monotone" dataKey="mood" stroke="#4F46E5" strokeWidth={3} dot={{ r: 5 }} />
          </LineChart>
        </ResponsiveContainer>
      </div>

      <div className="bg-white shadow-lg rounded-xl p-5">
        <h2 className="text-lg font-bold mb-4">Recommended Resources</h2>
        <ul className="space-y-4">
          {resources.map((r, i) => (
            <li key={i} className="p-4 border rounded-lg hover:shadow-md bg-gray-50">
              <a href={r.link} className="text-blue-600 font-semibold hover:underline">{r.title}</a>
              <p className="text-gray-600 text-sm mt-1">{r.content}</p>
            </li>
          ))}
        </ul>
      </div>

    </div>
  );
};

export default Dashboard;
