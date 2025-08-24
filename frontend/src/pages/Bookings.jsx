import { useEffect, useState } from "react";
import { Navigate } from "react-router-dom";
import { useAuth } from "../context/AuthContext";
import BookingForm from "../components/BookingForm";
import { List, Card, Button, Space, Typography, message, Popconfirm } from "antd";

const { Title, Text } = Typography;

export default function BookingsPage() {
  const [bookings, setBookings] = useState([]);
  const [isModalOpen, setIsModalOpen] = useState(false);
  const [editingBooking, setEditingBooking] = useState(null);

  const { user } = useAuth();
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

  const addBooking = async (booking) => {
    const token = getToken();
    if (!token) return;

    try {
      await fetch("http://localhost:5001/api/bookings", {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
          Authorization: `Bearer ${token}`,
        },
        body: JSON.stringify(booking),
      });
      message.success("Booking created!");
      fetchBookings();
    } catch {
      message.error("Failed to create booking");
    }
  };

  const updateBooking = async (id, booking) => {
    const token = getToken();
    if (!token) return;

    try {
      await fetch(`http://localhost:5001/api/bookings/${id}`, {
        method: "PUT",
        headers: {
          "Content-Type": "application/json",
          Authorization: `Bearer ${token}`,
        },
        body: JSON.stringify(booking),
      });
      message.success("Booking updated!");
      fetchBookings();
    } catch {
      message.error("Failed to update booking");
    }
  };

  const deleteBooking = async (id) => {
    const token = getToken();
    if (!token) return;

    try {
      await fetch(`http://localhost:5001/api/bookings/${id}`, {
        method: "DELETE",
        headers: { Authorization: `Bearer ${token}` },
      });
      message.success("Booking cancelled!");
      fetchBookings();
    } catch {
      message.error("Failed to cancel");
    }
  };

  useEffect(() => {
    if (user) fetchBookings();
  }, [user]);

  if (!user) {
    return <Navigate to="/login" replace />;
  }

  return (
    <div
      className="min-h-screen w-full"
      style={{
        background:
          "radial-gradient(1200px 600px at 10% 10%, rgba(99,102,241,0.15), transparent), radial-gradient(1200px 600px at 90% 30%, rgba(16,185,129,0.16), transparent), linear-gradient(180deg, #F8FAFC 0%, #EEF2FF 100%)",
      }}
    >
      <div className="mx-auto max-w-6xl p-6 md:p-10">
        <div className="flex items-center justify-between mb-6">
          <Title level={2} style={{ margin: 0, color: "#1e293b" }}>
            Bookings
          </Title>
          <Button
            type="primary"
            onClick={() => {
              setEditingBooking(null);
              setIsModalOpen(true);
            }}
            style={{
              borderRadius: "12px",
              background: "linear-gradient(to right, #4f46e5, #10b981)",
              border: "none",
            }}
          >
            + Create Booking
          </Button>
        </div>

        <div className="rounded-2xl p-6 bg-white/30 backdrop-blur-xl border border-white/40 shadow-[0_8px_24px_rgba(0,0,0,0.08)]">
          <List
            grid={{ gutter: 16, column: 2 }}
            dataSource={bookings}
            renderItem={(booking) => (
              <List.Item>
                <Card
                  title={booking.doctor}
                  style={{
                    borderRadius: "16px",
                    background: "rgba(255,255,255,0.6)",
                    backdropFilter: "blur(10px)",
                    border: "1px solid rgba(255,255,255,0.4)",
                  }}
                  headStyle={{
                    borderBottom: "1px solid rgba(255,255,255,0.4)",
                    fontWeight: "600",
                  }}
                  extra={
                    <Space>
                      <Button
                        type="link"
                        onClick={() => {
                          setEditingBooking(booking);
                          setIsModalOpen(true);
                        }}
                      >
                        Edit
                      </Button>
                      <Popconfirm
                        title="Cancel Booking"
                        description="Are you sure you want to cancel this booking?"
                        okText="Yes"
                        cancelText="No"
                        onConfirm={() => deleteBooking(booking._id)}
                      >
                        <Button type="link" danger>
                          Cancel
                        </Button>
                      </Popconfirm>
                    </Space>
                  }
                >
                  <p>
                    <Text strong>Date:</Text> {booking.date}
                  </p>
                  <p>
                    <Text strong>Time:</Text> {booking.timeSlot}
                  </p>
                  <p>
                    <Text strong>Location:</Text> {booking.location}
                  </p>
                  <p>
                    <Text strong>Notes:</Text> {booking.notes}
                  </p>
                </Card>
              </List.Item>
            )}
          />
        </div>

        <BookingForm
          visible={isModalOpen}
          onCancel={() => setIsModalOpen(false)}
          onSave={(data) => {
            if (editingBooking) {
              updateBooking(editingBooking._id, {
                ...editingBooking,
                notes: data.notes,
              });
            } else {
              addBooking(data);
            }
            setIsModalOpen(false);
          }}
          initialData={editingBooking}
        />
      </div>
    </div>
  );
}
