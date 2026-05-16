export default function UserForm({ formData, handleChange, handleSubmit }) {
  return (
    <form
      onSubmit={handleSubmit}
      className="max-w-5xl mx-auto bg-white p-5 rounded-xl shadow mb-8 grid gap-3"
    >
      <input name="name" value={formData.name} onChange={handleChange} placeholder="Name" className="border p-2 rounded" />
      <input name="email" value={formData.email} onChange={handleChange} placeholder="Email" className="border p-2 rounded" />
      <input name="phone" value={formData.phone} onChange={handleChange} placeholder="Phone" className="border p-2 rounded" />
      <input name="age" value={formData.age} onChange={handleChange} placeholder="Age" type="number" className="border p-2 rounded" />

      <button type="submit" className="bg-green-600 text-white py-2 rounded hover:bg-green-700">
        Save User
      </button>
    </form>
  );
}