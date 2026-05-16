export default function UserHeader({ onAddClick }) {
  return (
    <div className="flex justify-between items-center max-w-5xl mx-auto mb-8">
      <h1 className="text-3xl font-bold text-gray-800">
        👥 User List
      </h1>

      <button
        onClick={onAddClick}
        className="bg-gray-800 text-white px-4 py-2 rounded-lg hover:bg-gray-700 transition"
      >
        + Add User
      </button>
    </div>
  );
}