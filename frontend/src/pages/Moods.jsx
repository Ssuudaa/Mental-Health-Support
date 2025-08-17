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
    <div className="min-h-screen flex justify-center items-start py-10 px-4 bg-gradient-to-br from-blue-50 to-blue-100">
      <div className="flex w-full max-w-4xl gap-6">
        <Card
          style={{ flex: 1, backdropFilter: "blur(10px)", backgroundColor: "rgba(255,255,255,0.7)" }}
          bordered={false}
        >
          <Title level={4} className="text-center mb-4">Recent Moods (7 Days)</Title>
          <List
            dataSource={recentMoods}
            renderItem={item => (
              <List.Item>
                <Text>{dayjs(item.date).format("MMM D")}</Text>
                <Tag color={moodColor[item.mood]} style={{ marginLeft: 8 }}>
                  {item.mood}
                </Tag>
              </List.Item>
            )}
            locale={{ emptyText: "No moods recorded" }}
          />
        </Card>

        <Card
          style={{ flex: 1, backdropFilter: "blur(10px)", backgroundColor: "rgba(255,255,255,0.7)" }}
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
