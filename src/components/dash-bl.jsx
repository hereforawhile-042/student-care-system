
const DashboardBottomLeft = () => {
  return (
    <div className="flex flex-col justify-between h-full ">
      {/* Daily Tip */}
      <div className="bg-stone-900 rounded-xl p-6 h-3/6 text-gray-200 shadow-md">
        <h3 className="font-semibold text-lg text-white mb-2">Daily Tip</h3>
        <p className="text-sm italic text-wrap ">
          “Your time is limited, so don’t waste it living someone else’s life Don’t be trapped by dogma”
        </p>
      </div>

      {/* Quick Actions */}
      <div className="bg-stone-900 rounded-xl p-4 text-gray-200 shadow-md">
        <h3 className="font-semibold text-lg text-white mb-2">Quick Actions</h3>
        <div className="flex flex-col gap-4">
          <button className="bg-blue-600 hover:bg-blue-700 text-white text-sm px-3 py-2 rounded-lg transition duration-200">
            Book a Session
          </button>
          <button className="bg-blue-600 hover:bg-blue-700 text-white text-sm px-3 py-2 rounded-lg transition duration-200">
            Explore Resources
          </button>
        </div>
      </div>
    </div>
  );
};

export default DashboardBottomLeft;
