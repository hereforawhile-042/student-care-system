export default function UpcomingSessionsCalendar() {
  return (
    <div className="bg-[#1f1f1f] text-white w-4/5 h-full p-4 rounded-xl shadow-md">
      <h3 className="text-lg font-semibold mb-2">Upcoming Sessions</h3>
      <div className="flex flex-col gap-4 justify-between mb-2">
        <div>
          <div>
            <p className="text-sm text-gray-400">📅 Date:</p>
            <p className="text-base">June 10, 2025</p>
          </div>
          <div>
            <p className="text-sm text-gray-400">🕒 Time:</p>
            <p className="text-base">2:00 PM</p>
          </div>
        </div>
        <div>
          <div>
            <p className="text-sm text-gray-400">📅 Date:</p>
            <p className="text-base">August 15, 2025</p>
          </div>
          <div>
            <p className="text-sm text-gray-400">🕒 Time:</p>
            <p className="text-base">5:00 PM</p>
          </div>
        </div>
      </div>
      <button className="mt-2 w-full bg-blue-600 hover:bg-blue-700 text-sm text-white py-2 px-4 rounded-md transition">
        Modify Booking
      </button>
    </div>
  );
}
