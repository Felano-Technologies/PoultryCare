import { useState } from "react";

const BookingForm = () => {
  const [form, setForm] = useState({ name: "", date: "", expert: "" });

  const handleChange = (e) => {
    setForm({ ...form, [e.target.name]: e.target.value });
  };

  const handleSubmit = (e) => {
    e.preventDefault();
    alert(`Appointment booked with ${form.expert} on ${form.date}`);
    setForm({ name: "", date: "", expert: "" });
  };

  return (
    <form onSubmit={handleSubmit} className="mt-6 border-t pt-4">
      <h3 className="text-lg font-semibold mb-2">Book a Consultation</h3>
      <input
        type="text"
        name="name"
        placeholder="Your name"
        value={form.name}
        onChange={handleChange}
        className="w-full p-2 border rounded mb-2"
      />
      <input
        type="date"
        name="date"
        value={form.date}
        onChange={handleChange}
        className="w-full p-2 border rounded mb-2"
      />
      <select
        name="expert"
        value={form.expert}
        onChange={handleChange}
        className="w-full p-2 border rounded mb-2"
      >
        <option value="">Select Expert</option>
        <option value="Veterinarian">Veterinarian</option>
        <option value="Extension Officer">Extension Officer</option>
        <option value="Biotechnologist">Biotechnologist</option>
      </select>
      <button type="submit" className="bg-green-600 text-white px-4 py-2 rounded hover:bg-green-700">
        Book Now
      </button>
    </form>
  );
};

export default BookingForm;
