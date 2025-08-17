import { useEffect } from "react";
import { Modal, Form, Input, DatePicker, Select } from "antd";
import moment from "moment";

const doctors = [
  { doctor: "Dr. Alice", location: "Building A - Room 407" },
  { doctor: "Dr. Smith", location: "Block B - 210" },
  { doctor: "Dr. John", location: "Clinic C - 102" },
  { doctor: "Dr. Emma", location: "Building D - 305" },
];

const timeSlots = [
  "09:00 - 10:00",
  "10:00 - 11:00",
  "11:00 - 12:00",
  "14:00 - 15:00",
  "15:00 - 16:00",
  "16:00 - 17:00",
];

export default function BookingForm({ visible, onCancel, onSave, initialData }) {
  const [form] = Form.useForm();

  useEffect(() => {
    if (initialData) {
      form.setFieldsValue({
        doctor: initialData.doctor,
        location: initialData.location,
        date: initialData.date ? moment(initialData.date) : null,
        timeSlot: initialData.timeSlot,
        notes: initialData.notes,
      });
    } else {
      form.resetFields();
    }
  }, [initialData, form]);

  const handleOk = () => {
    form.validateFields().then((values) => {
      if (values.date) {
        values.date = values.date.toISOString();
      }
      onSave(values);
      form.resetFields();
    });
  };

  const isEdit = !!initialData;

  return (
    <Modal
      title={isEdit ? "Edit Booking" : "Create Booking"}
      open={visible}
      onCancel={onCancel}
      onOk={handleOk}
      okText="Save"
    >
      <Form form={form} layout="vertical">
        <Form.Item
          name="doctor"
          label="Doctor"
          rules={[{ required: true, message: "Please select a doctor" }]}
        >
          <Select
            placeholder="Select a doctor"
            onChange={(value) => {
              const selected = doctors.find((d) => d.doctor === value);
              if (selected) {
                form.setFieldsValue({ location: selected.location });
              }
            }}
            disabled={isEdit}
          >
            {doctors.map((d) => (
              <Select.Option key={d.doctor} value={d.doctor}>
                {d.doctor}
              </Select.Option>
            ))}
          </Select>
        </Form.Item>

        <Form.Item
          name="location"
          label="Location"
          rules={[{ required: true, message: "Please select a location" }]}
        >
          <Select placeholder="Select location" disabled={isEdit}>
            {doctors.map((d) => (
              <Select.Option key={d.location} value={d.location}>
                {d.location}
              </Select.Option>
            ))}
          </Select>
        </Form.Item>

        <Form.Item
          name="date"
          label="Date"
          rules={[{ required: true, message: "Please select a date" }]}
        >
          <DatePicker style={{ width: "100%" }} disabled={isEdit} />
        </Form.Item>

        <Form.Item
          name="timeSlot"
          label="Time Slot"
          rules={[{ required: true, message: "Please select a time slot" }]}
        >
          <Select placeholder="Select a time slot" disabled={isEdit}>
            {timeSlots.map((slot) => (
              <Select.Option key={slot} value={slot}>
                {slot}
              </Select.Option>
            ))}
          </Select>
        </Form.Item>

        <Form.Item name="notes" label="Notes">
          <Input.TextArea rows={3} />
        </Form.Item>
      </Form>
    </Modal>
  );
}
