import React, { useEffect, useMemo, useState } from "react";
import { Navigate } from "react-router-dom";
import { LineChart, Line, XAxis, YAxis, CartesianGrid, Tooltip, ResponsiveContainer } from "recharts";
import { useAuth } from "../context/AuthContext";
import { message } from "antd";
import { CalendarDays, MapPin, Clock, User2, BookOpenText, Smile } from "lucide-react";

const Dashboard = () => {
  const { user } = useAuth();
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
    } catch {
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
      setMoodData(
        data.slice(-7).map((m) => ({
          date: new Date(m.date).toLocaleDateString("en-US", {
            month: "2-digit",
            day: "2-digit",
          }),
          mood: m.mood,
        }))
      );
    } catch {
      message.error("Failed to fetch moods");
    }
  };

  useEffect(() => {
    fetchBookings();
    fetchMoods();
  }, [user]);

  const moodMap = { Sad: 1, Neutral: 2, Happy: 3 };
  const moodEmoji = { 1: "😢", 2: "😐", 3: "😊" };
  const chartData = useMemo(
    () => moodData.map((m) => ({ date: m.date, mood: moodMap[m.mood] || 2 })),
    [moodData]
  );

  const resources = [
    {
      title: "Coping with Stress",
      content: "Practical techniques to reset your body & mind.",
      read: "3 min",
      link: "#",
      art: "🫧",
    },
    {
      title: "Mindfulness Basics",
      content: "Stay present with simple breathing exercises.",
      read: "5 min",
      link: "#",
      art: "🌿",
    },
    {
      title: "How to Talk to a Therapist",
      content: "Build trust and communicate what you need.",
      read: "4 min",
      link: "#",
      art: "🗣️",
    },
    {
      title: "Daily Self-Care",
      content: "Tiny rituals that compound into well-being.",
      read: "6 min",
      link: "#",
      art: "☕",
    },
  ];

  if (!user) return <Navigate to="/login" replace />;

  return (
    <div
      className="min-h-screen w-full"
      style={{
        background:
          "radial-gradient(1200px 600px at 10% 10%, rgba(99,102,241,0.15), transparent), radial-gradient(1200px 600px at 90% 30%, rgba(16,185,129,0.16), transparent), linear-gradient(180deg, #F8FAFC 0%, #EEF2FF 100%)",
      }}
    >
      <div className="mx-auto max-w-7xl p-6 md:p-10">
        <div className="mb-6 md:mb-8">
          <div className="flex items-end justify-between">
            <div>
              <h1 className="text-2xl md:text-3xl font-semibold text-gray-900">
                Hello{user?.name ? `, ${user.name}` : ""} 👋
              </h1>
              <p className="text-gray-600 mt-1">
                Hope everything is going well today. Here is your mental health dashboard.
              </p>
            </div>
            {chartData.length > 0 && (
              <div className="hidden md:flex items-center gap-2 text-sm px-3 py-2 rounded-2xl bg-white/40 backdrop-blur-md shadow-sm border border-white/40">
                <span className="opacity-70">Latest Mood</span>
                <span className="text-lg">
                  {moodEmoji[chartData[chartData.length - 1]?.mood || 2]}
                </span>
              </div>
            )}
          </div>
        </div>

        <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
          <div className="rounded-2xl p-5 md:p-6 bg-white/30 backdrop-blur-xl border border-white/40 shadow-[0_10px_30px_rgba(2,6,23,0.15)]">
            <h2 className="text-lg font-semibold mb-4 flex items-center gap-2">
              <CalendarDays className="w-5 h-5 text-indigo-600" />
              Upcoming Sessions
            </h2>
            {bookings.length > 0 ? (
              <ul className="space-y-4">
                {bookings.map((b) => {
                  const date = new Date(b.date).toLocaleDateString();
                  return (
                    <li
                      key={b._id}
                      className="p-4 rounded-xl bg-white/40 backdrop-blur-sm border border-white/30 hover:shadow-md transition-shadow"
                    >
                      <div className="flex items-center gap-3 text-sm text-slate-700">
                        <Clock className="w-4 h-4" />
                        <span>
                          <strong>{date}</strong> · {b.timeSlot}
                        </span>
                      </div>
                      <div className="mt-2 flex items-center gap-3 text-sm text-slate-700">
                        <User2 className="w-4 h-4" />
                        <span>Dr. {b.doctor}</span>
                      </div>
                      <div className="mt-2 flex items-center gap-3 text-sm text-slate-700">
                        <MapPin className="w-4 h-4" />
                        <span>{b.location}</span>
                      </div>
                    </li>
                  );
                })}
              </ul>
            ) : (
              <div className="text-slate-500 text-sm">
                No upcoming bookings. You can schedule one on the Bookings page.
              </div>
            )}
          </div>

          {/* Mood History */}
          <div className="rounded-2xl p-5 md:p-6 bg-white/30 backdrop-blur-xl border border-white/40 shadow-[0_10px_30px_rgba(2,6,23,0.15)]">
            <h2 className="text-lg font-semibold mb-4 flex items-center gap-2">
              <Smile className="w-5 h-5 text-green-600" />
              Mood History (7 Days)
            </h2>
            <div className="h-[260px]">
              <ResponsiveContainer width="100%" height="100%">
                <LineChart data={chartData} margin={{ top: 8, left: -18, right: 8 }}>
                  <CartesianGrid strokeDasharray="3 3" vertical={false} />
                  <XAxis dataKey="date" tick={{ fontSize: 12 }} />
                  <YAxis
                    ticks={[1, 2, 3]}
                    tickFormatter={(v) =>
                      v === 1 ? "😢" : v === 2 ? "😐" : "😊"
                    }
                    domain={[1, 3]}
                    width={50}
                  />
                  <Tooltip
                    formatter={(v) =>
                      v === 1 ? "Sad" : v === 2 ? "Neutral" : "Happy"
                    }
                    labelStyle={{ color: "#475569" }}
                    contentStyle={{
                      borderRadius: 12,
                      border: "1px solid #e2e8f0",
                      backdropFilter: "blur(8px)",
                      background: "rgba(255,255,255,0.8)",
                    }}
                  />
                  <Line
                    type="monotone"
                    dataKey="mood"
                    stroke="#4f46e5"
                    strokeWidth={3}
                    dot={{ r: 5, strokeWidth: 2, stroke: "#fff" }}
                    activeDot={{ r: 6 }}
                  />
                </LineChart>
              </ResponsiveContainer>
            </div>
            <div className="mt-3 text-xs text-slate-500">
              Tip: Mood fluctuations are normal. Try a short breathing exercise 🌬️
            </div>
          </div>

          {/* Recommended Resources */}
          <div className="rounded-2xl p-5 md:p-6 bg-white/30 backdrop-blur-xl border border-white/40 shadow-[0_10px_30px_rgba(2,6,23,0.15)]">
            <h2 className="text-lg font-semibold mb-4 flex items-center gap-2">
              <BookOpenText className="w-5 h-5 text-sky-600" />
              Recommended Resources
            </h2>
            <ul className="space-y-4">
              {resources.map((r, i) => (
                <li
                  key={i}
                  className="p-4 rounded-xl border border-white/30 bg-white/40 backdrop-blur-sm hover:shadow-md transition-shadow"
                >
                  <div className="flex items-start gap-3">
                    <div className="text-2xl select-none">{r.art}</div>
                    <div className="flex-1">
                      <a
                        href={r.link}
                        className="text-slate-900 font-medium hover:underline"
                      >
                        {r.title}
                      </a>
                      <p className="text-slate-600 text-sm mt-1">{r.content}</p>
                      <div className="text-xs text-slate-500 mt-2">
                        Read time · {r.read}
                      </div>
                    </div>
                  </div>
                </li>
              ))}
            </ul>
          </div>
        </div>
      </div>
    </div>
  );
};

export default Dashboard;
