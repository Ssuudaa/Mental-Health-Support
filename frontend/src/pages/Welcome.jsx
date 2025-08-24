import { Card, Typography, List, Avatar, Tag } from "antd";
import { useAuth } from "../context/AuthContext";
import { Navigate, useNavigate } from "react-router-dom";
import { SmileOutlined, HeartOutlined, TeamOutlined, MedicineBoxOutlined } from "@ant-design/icons";

const { Title, Text } = Typography;

export default function WelcomePage() {
  const { user } = useAuth();
  const navigate = useNavigate();

  const doctors = [
    { name: "Dr. Alice Green", specialty: "Clinical Psychologist", avatar: "https://i.pravatar.cc/100?img=47" },
    { name: "Dr. John Smith", specialty: "Therapist", avatar: "https://i.pravatar.cc/100?img=32" },
    { name: "Dr. Maria Lopez", specialty: "Counselor", avatar: "https://i.pravatar.cc/100?img=12" },
  ];

  const services = [
    { icon: <MedicineBoxOutlined style={{ fontSize: 22, color: "#4f46e5" }} />, title: "Online Therapy", desc: "Book sessions with professional doctors online." },
    { icon: <HeartOutlined style={{ fontSize: 22, color: "#ec4899" }} />, title: "Self-Care Guides", desc: "Practical guides to manage stress & stay balanced." },
    { icon: <TeamOutlined style={{ fontSize: 22, color: "#10b981" }} />, title: "Community Support", desc: "Connect and share with others in safe spaces." },
  ];

  const moods = [
    { mood: "Happy", emoji: "😊", color: "green" },
    { mood: "Neutral", emoji: "😐", color: "blue" },
    { mood: "Sad", emoji: "😢", color: "red" },
  ];

  return (
    <div
      className="min-h-screen w-full flex justify-center px-4 py-10"
      style={{
        background:
          "radial-gradient(1200px 600px at 10% 10%, rgba(99,102,241,0.15), transparent), radial-gradient(1200px 600px at 90% 30%, rgba(16,185,129,0.16), transparent), linear-gradient(180deg, #F8FAFC 0%, #EEF2FF 100%)",
      }}
    >
      <div className="w-full max-w-6xl space-y-8">
        <div className="text-center">
          <Title level={2} style={{ color: "#1e293b" }}>
            Welcome {user?.name ? user.name : ""} 👋
          </Title>
          <Text type="secondary">We’re here to support your mental health journey.</Text>
        </div>

        <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
          <Card
            title="Our Doctors"
            style={{
              borderRadius: "16px",
              background: "rgba(255,255,255,0.3)",
              backdropFilter: "blur(12px)",
              border: "1px solid rgba(255,255,255,0.4)",
              boxShadow: "0 8px 24px rgba(0,0,0,0.08)",
              cursor: "pointer"
            }}
            bordered={false}
            onClick={() => navigate("/bookings")}
          >
            <List
              itemLayout="horizontal"
              dataSource={doctors}
              renderItem={(doc) => (
                <List.Item>
                  <List.Item.Meta
                    avatar={<Avatar src={doc.avatar} />}
                    title={<Text strong>{doc.name}</Text>}
                    description={doc.specialty}
                  />
                </List.Item>
              )}
            />
          </Card>

          <Card
            title="Services"
            style={{
              borderRadius: "16px",
              background: "rgba(255,255,255,0.3)",
              backdropFilter: "blur(12px)",
              border: "1px solid rgba(255,255,255,0.4)",
              boxShadow: "0 8px 24px rgba(0,0,0,0.08)",
            }}
            bordered={false}
          >
            <List
              dataSource={services}
              renderItem={(s) => (
                <List.Item>
                  <List.Item.Meta
                    avatar={s.icon}
                    title={<Text strong>{s.title}</Text>}
                    description={s.desc}
                  />
                </List.Item>
              )}
            />
          </Card>

          {/* Moods */}
          <Card
            title="Moods"
            style={{
              borderRadius: "16px",
              background: "rgba(255,255,255,0.3)",
              backdropFilter: "blur(12px)",
              border: "1px solid rgba(255,255,255,0.4)",
              boxShadow: "0 8px 24px rgba(0,0,0,0.08)",
              cursor: "pointer"
            }}
            bordered={false}
            onClick={() => navigate("/moods")}
          >
            <div className="flex justify-around">
              {moods.map((m) => (
                <div key={m.mood} className="text-center">
                  <div style={{ fontSize: 32 }}>{m.emoji}</div>
                  <Tag color={m.color} style={{ marginTop: 4 }}>
                    {m.mood}
                  </Tag>
                </div>
              ))}
            </div>
          </Card>
        </div>
      </div>
    </div>
  );
}
