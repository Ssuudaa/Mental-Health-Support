import { useEffect, useState } from "react";
import { Navigate } from "react-router-dom";
import { useAuth } from "../context/AuthContext";
import BookingForm from "../components/BookingForm";
import { List, Card, Button, Space, Typography, message,Popconfirm } from "antd";

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
      message.error("Failed to cancelled");
    }
  };

  useEffect(() => {
    if (user) fetchBookings();
  }, [user]);

  if (!user) {
    return <Navigate to="/login" replace />;
  }

  return (
    <div style={{ padding: 24 }}>
      <Title level={2}>Bookings</Title>
      <Button type="primary" onClick={() => { setEditingBooking(null); setIsModalOpen(true); }}>
        + Create Booking
      </Button>

      <List
  grid={{ gutter: 16, column: 2 }}
  dataSource={bookings}
  style={{ marginTop: 20 }}
  renderItem={(booking) => (
    <List.Item>
      <Card
        title={booking.doctor}
        extra={
          <Space>
            <Button type="link" onClick={() => { setEditingBooking(booking); setIsModalOpen(true); }}>
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
        <p><Text strong>Date:</Text> {booking.date}</p>
        <p><Text strong>Time:</Text> {booking.timeSlot}</p>
        <p><Text strong>Location:</Text> {booking.location}</p>
        <p><Text strong>Notes:</Text> {booking.notes}</p>
      </Card>
    </List.Item>
  )}
/>

<BookingForm
  visible={isModalOpen}
  onCancel={() => setIsModalOpen(false)}
  onSave={(data) => {
    if (editingBooking) {
      updateBooking(editingBooking._id, {
        ...editingBooking,
        notes: data.notes
      });
    } else {
      addBooking(data);
    }
    setIsModalOpen(false);
  }}
  initialData={editingBooking}
/>


    </div>
  );
}
