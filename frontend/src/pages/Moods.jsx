import { useEffect, useState } from "react";
import { Card, Radio, Button, Typography, message, List, Tag } from "antd";
import { useAuth } from '../context/AuthContext';
import { Navigate } from "react-router-dom";
import dayjs from "dayjs";

const { Title, Text } = Typography;

export default function MoodsPage() {
  const [moods, setMoods] = useState([]);
  const [selectedMood, setSelectedMood] = useState(null);
  const { user } = useAuth();
  const getToken = () => user?.token;
  const today = dayjs().format("YYYY-MM-DD");

  const fetchMoods = async () => {
    const token = getToken();
    if (!token) return;
    try {
      const res = await fetch("http://localhost:5001/api/moods", {
        headers: { Authorization: `Bearer ${token}` }
      });
      const data = await res.json();
      setMoods(data);

      const todayMood = data.find(m => dayjs(m.date).format("YYYY-MM-DD") === today);
      if (todayMood) setSelectedMood(todayMood.mood);
    } catch (err) {
      message.error("Failed to fetch moods");
    }
  };

  const saveMood = async (mood) => {
    const token = getToken();
    if (!token) return;

    try {
      const todayMood = moods.find(m => dayjs(m.date).format("YYYY-MM-DD") === today);
      if (todayMood) {
        await fetch(`http://localhost:5001/api/moods/${todayMood._id}`, {
          method: "PUT",
          headers: {
            "Content-Type": "application/json",
            Authorization: `Bearer ${token}`
          },
          body: JSON.stringify({ mood })
        });
        message.success("Mood updated!");
      } else {
        await fetch("http://localhost:5001/api/moods", {
          method: "POST",
          headers: {
            "Content-Type": "application/json",
            Authorization: `Bearer ${token}`
          },
          body: JSON.stringify({ date: today, mood })
        });
        message.success("Mood saved!");
      }
      fetchMoods();
    } catch {
      message.error("Failed to save mood");
    }
  };

  useEffect(() => {
    if (!user) return;
    fetchMoods();
  }, [user]);

  if (!user) {
    return <Navigate to="/login" replace />;
  }

  const last7Days = dayjs().subtract(6, 'day');
  const recentMoods = moods
    .filter(m => dayjs(m.date).isAfter(last7Days.subtract(1, 'day')))
    .sort((a,b)=> new Date(a.date)-new Date(b.date));

  const moodColor = {
    Happy: "green",
    Neutral: "blue",
    Sad: "red"
  };

  return (
    <div
      className="min-h-screen w-full flex justify-center items-start py-10 px-4"
      style={{
        background:
          "radial-gradient(1200px 600px at 10% 10%, rgba(99,102,241,0.15), transparent), radial-gradient(1200px 600px at 90% 30%, rgba(16,185,129,0.16), transparent), linear-gradient(180deg, #F8FAFC 0%, #EEF2FF 100%)",
      }}
    >
      <div className="flex w-full max-w-4xl gap-6">
        {/* Recent moods card */}
        <Card
          style={{
            flex: 1,
            borderRadius: "16px",
            background: "rgba(255,255,255,0.3)",
            backdropFilter: "blur(12px)",
            border: "1px solid rgba(255,255,255,0.4)",
            boxShadow: "0 8px 24px rgba(0,0,0,0.08)"
          }}
          bordered={false}
        >
          <Title level={4} className="text-center mb-4">Recent Moods (7 Days)</Title>
          <List
            dataSource={recentMoods}
            renderItem={item => (
              <List.Item
                style={{
                  background: "rgba(255,255,255,0.25)",
                  borderRadius: "12px",
                  marginBottom: "8px",
                  padding: "8px 12px",
                  backdropFilter: "blur(6px)",
                  border: "1px solid rgba(255,255,255,0.3)"
                }}
              >
                <Text>{dayjs(item.date).format("MMM D")}</Text>
                <Tag color={moodColor[item.mood]} style={{ marginLeft: 8 }}>
                  {item.mood}
                </Tag>
              </List.Item>
            )}
            locale={{ emptyText: "No moods recorded" }}
          />
        </Card>

        {/* Today's mood card */}
        <Card
          style={{
            flex: 1,
            borderRadius: "16px",
            background: "rgba(255,255,255,0.3)",
            backdropFilter: "blur(12px)",
            border: "1px solid rgba(255,255,255,0.4)",
            boxShadow: "0 8px 24px rgba(0,0,0,0.08)"
          }}
          bordered={false}
        >
          <Title level={4} className="text-center mb-4">Today's Mood</Title>
          <Text strong>Today: {dayjs().format("MMMM D, YYYY")}</Text>

          <div className="my-4">
            <Radio.Group
              value={selectedMood}
              onChange={(e) => setSelectedMood(e.target.value)}
              buttonStyle="solid"
            >
              <Radio.Button value="Happy">😊 Happy</Radio.Button>
              <Radio.Button value="Neutral">😐 Neutral</Radio.Button>
              <Radio.Button value="Sad">😢 Sad</Radio.Button>
            </Radio.Group>
          </div>

          <Button
            type="primary"
            block
            style={{
              borderRadius: "12px",
              background: "linear-gradient(to right, #4f46e5, #10b981)",
              border: "none"
            }}
            onClick={() => {
              if (!selectedMood) return message.warning("Please select a mood");
              saveMood(selectedMood);
            }}
          >
            Save Mood
          </Button>
        </Card>
      </div>
    </div>
  );
}
