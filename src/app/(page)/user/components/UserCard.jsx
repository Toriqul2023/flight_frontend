export default function UserCard({ data }) {
  return (
    <div className="bg-white border rounded-2xl p-5 shadow-sm hover:shadow-xl transition">

      <div className="flex items-center gap-4 mb-4">
        <div className="w-14 h-14 rounded-full bg-gray-800 text-white flex items-center justify-center font-bold">
          {data.name?.charAt(0).toUpperCase()}
        </div>

        <div>
          <h2 className="text-lg font-semibold">{data.name}</h2>
          <p className="text-sm text-gray-500">{data.email}</p>
        </div>
      </div>

      <div className="bg-gray-50 p-3 rounded-lg flex justify-between text-sm">
        <p>📞 {data.phone}</p>
        <p>🎂 {data.age}</p>
      </div>

    </div>
  );
}