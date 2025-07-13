import Layout from "../components/layout";
import { useState, useEffect } from "react";
import {
  FaCalendarAlt,
  FaClock,
  FaVideo,
  FaUser,
  FaTrash,
} from "react-icons/fa";

const Schedule = ({ Collapse, setCollapse }) => {
  const counselors = [
    {
      id: 1,
      name: "Dr. Aisha Bello",
      specialization: "Anxiety & Stress",
      rating: 4.8,
    },
    {
      id: 2,
      name: "Mr. John Adeyemi",
      specialization: "Academic Support",
      rating: 4.6,
    },
    {
      id: 3,
      name: "Ms. Tolu Adedeji",
      specialization: "Personal Issues",
      rating: 4.9,
    },
  ];

  const [formData, setFormData] = useState({
    date: "",
    time: "",
    sessionType: "Virtual",
    counselor: "",
    notes: "",
  });

  const [appointments, setAppointments] = useState([]);
  const [selectedCounselor, setSelectedCounselor] = useState(null);
  const [showSuccess, setShowSuccess] = useState(false);

  // Load appointments from localStorage
  useEffect(() => {
    const savedAppointments = localStorage.getItem("counselingAppointments");
    if (savedAppointments) {
      setAppointments(JSON.parse(savedAppointments));
    }
  }, []);

  // Save appointments to localStorage
  useEffect(() => {
    localStorage.setItem(
      "counselingAppointments",
      JSON.stringify(appointments)
    );
  }, [appointments]);

  const handleInputChange = (e) => {
    const { name, value } = e.target;
    setFormData({ ...formData, [name]: value });
  };

  const handleSubmit = (e) => {
    e.preventDefault();
    const newAppointment = {
      ...formData,
      id: Date.now(),
      counselorDetails: counselors.find((c) => c.name === formData.counselor),
    };

    setAppointments([...appointments, newAppointment]);
    setShowSuccess(true);

    // Reset form except counselor selection
    setFormData({
      date: "",
      time: "",
      sessionType: "Virtual",
      counselor: formData.counselor,
      notes: "",
    });

    // Hide success message after 3 seconds
    setTimeout(() => setShowSuccess(false), 3000);
  };

  const handleDelete = (id) => {
    setAppointments(appointments.filter((appt) => appt.id !== id));
  };

  return (
    <Layout collapse={Collapse} noPadding setCollapse={setCollapse}>
      <div className="bg-gradient-to-br from-blue-50 to-indigo-50 text-sm p-4 md:p-8">
        <div className="max-w-7xl mx-auto">
          <div className="mb-10 text-center">
            <h1 className="text-2xl md:text-2xl font-bold text-indigo-900 mb-2">
              Schedule Counseling Session
            </h1>
            <p className="text-gray-600 max-w-2xl mx-auto">
              Book a private session with our expert counselors. We're here to
              support your mental wellness journey with personalized care.
            </p>
          </div>

          <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">
            {/* Counselor Selection */}
            <div className="bg-white rounded-2xl shadow-lg p-6 h-fit">
              <h2 className="text-xl font-bold text-indigo-800 mb-4 flex items-center">
                <FaUser className="mr-2" /> Select Counselor
              </h2>

              <div className="space-y-2">
                {counselors.map((counselor) => (
                  <div
                    key={counselor.id}
                    className={`border-2 rounded-xl p-4 cursor-pointer transition-all ${
                      formData.counselor === counselor.name
                        ? "border-indigo-500 bg-indigo-50"
                        : "border-gray-200 hover:border-indigo-300"
                    }`}
                    onClick={() => {
                      setFormData({ ...formData, counselor: counselor.name });
                      setSelectedCounselor(counselor);
                    }}
                  >
                    <div className="flex items-center">
                      <div className="bg-gray-200 border-2 border-dashed rounded-xl w-14 h-14" />
                      <div className="ml-4">
                        <h3 className="font-semibold text-gray-900">
                          {counselor.name}
                        </h3>
                        <p className="text-sm text-gray-600">
                          {counselor.specialization}
                        </p>
                        <div className="flex items-center mt-1">
                          <span className="text-yellow-500">★</span>
                          <span className="text-sm ml-1 text-gray-700">
                            {counselor.rating}
                          </span>
                        </div>
                      </div>
                    </div>
                  </div>
                ))}
              </div>

              {selectedCounselor && (
                <div className="mt-6 p-4 bg-blue-50 rounded-xl border border-blue-200">
                  <h3 className="font-semibold text-blue-800 mb-2">
                    Selected Counselor
                  </h3>
                  <p className="text-blue-700">{selectedCounselor.name}</p>
                  <p className="text-sm text-blue-600">
                    {selectedCounselor.specialization}
                  </p>
                </div>
              )}
            </div>

            {/* Appointment Form */}
            <div className="bg-white rounded-2xl shadow-lg p-6">
              <h2 className="text-xl font-bold text-indigo-800 mb-4">
                Book Your Session
              </h2>

              {showSuccess && (
                <div className="mb-6 p-4 bg-green-100 text-green-700 rounded-lg">
                  Appointment booked successfully! An email confirmation has
                  been sent.
                </div>
              )}

              <form onSubmit={handleSubmit} className="space-y-5">
                <div className="grid grid-cols-1 md:grid-cols-2 gap-5">
                  <div className="space-y-1">
                    <label className="block text-sm font-medium text-gray-700 mb-1 flex items-center">
                      <FaCalendarAlt className="mr-2 text-indigo-600" /> Date
                    </label>
                    <input
                      type="date"
                      name="date"
                      value={formData.date}
                      onChange={handleInputChange}
                      required
                      min={new Date().toISOString().split("T")[0]}
                      className="w-full border border-gray-300 rounded-lg px-4 py-2 focus:ring-2 focus:ring-indigo-500 focus:border-indigo-500"
                    />
                  </div>

                  <div className="space-y-1">
                    <label className="block text-sm font-medium text-gray-700 mb-1 flex items-center">
                      <FaClock className="mr-2 text-indigo-600" /> Time
                    </label>
                    <input
                      type="time"
                      name="time"
                      value={formData.time}
                      onChange={handleInputChange}
                      required
                      className="w-full border border-gray-300 rounded-lg px-4 py-2 focus:ring-2 focus:ring-indigo-500 focus:border-indigo-500"
                    />
                  </div>
                </div>

                <div className="space-y-1">
                  <label className="block text-sm font-medium text-gray-700 mb-1 flex items-center">
                    <FaVideo className="mr-2 text-indigo-600" /> Session Type
                  </label>
                  <div className="grid grid-cols-2 gap-4">
                    {["Virtual", "In-Person"].map((type) => (
                      <button
                        key={type}
                        type="button"
                        onClick={() =>
                          setFormData({ ...formData, sessionType: type })
                        }
                        className={`py-3 px-4 rounded-xl border-2 text-center transition-colors ${
                          formData.sessionType === type
                            ? "border-indigo-500 bg-indigo-50 text-indigo-700 font-medium"
                            : "border-gray-200 text-gray-600 hover:bg-gray-50"
                        }`}
                      >
                        {type}
                      </button>
                    ))}
                  </div>
                </div>

                <div className="space-y-1">
                  <label className="block text-sm font-medium text-gray-700 mb-1">
                    Additional Notes
                  </label>
                  <textarea
                    name="notes"
                    value={formData.notes}
                    onChange={handleInputChange}
                    placeholder="Any specific concerns or topics you'd like to discuss?"
                    className="w-full border border-gray-300 rounded-lg px-4 py-2 h-32 focus:ring-2 focus:ring-indigo-500 focus:border-indigo-500"
                  />
                </div>

                <button
                  type="submit"
                  disabled={!formData.counselor}
                  className={`w-full py-3 rounded-xl font-medium text-white transition-colors ${
                    formData.counselor
                      ? "bg-indigo-600 hover:bg-indigo-700"
                      : "bg-gray-400 cursor-not-allowed"
                  }`}
                >
                  Book Appointment
                </button>
              </form>
            </div>

            {/* Upcoming Appointments */}
            <div className="bg-white rounded-2xl shadow-lg p-6">
              <div className="flex justify-between items-center mb-4">
                <h2 className="text-xl w-full font-bold text-indigo-800">
                  Upcoming Appointments
                </h2>
                <span className="bg-indigo-100 text-indigo-800 text-sm font-medium px-3 py-1 rounded-full">
                  {appointments.length}
                </span>
              </div>

              {appointments.length === 0 ? (
                <div className="text-center py-10">
                  <div className="bg-gray-200 border-2 border-dashed rounded-xl w-16 h-16 mx-auto" />
                  <p className="mt-4 text-gray-500">
                    No appointments scheduled
                  </p>
                  <p className="text-sm text-gray-400 mt-2">
                    Book your first session to get started
                  </p>
                </div>
              ) : (
                <div className="space-y-4 max-h-[500px] overflow-y-auto pr-2">
                  {appointments.map((appt) => (
                    <div
                      key={appt.id}
                      className="border border-gray-200 rounded-xl p-4 relative"
                    >
                      <button
                        onClick={() => handleDelete(appt.id)}
                        className="absolute top-4 right-4 text-gray-400 hover:text-red-500"
                      >
                        <FaTrash />
                      </button>

                      <div className="flex items-center mb-3">
                        <div className="bg-gray-200 border-2 border-dashed rounded-xl w-12 h-12" />
                        <div className="ml-3">
                          <h3 className="font-semibold text-gray-900">
                            {appt.counselorDetails?.name || appt.counselor}
                          </h3>
                          <p className="text-sm text-gray-500">
                            {appt.counselorDetails?.specialization}
                          </p>
                        </div>
                      </div>

                      <div className="grid grid-cols-2 gap-3 text-sm">
                        <div className="flex items-center text-gray-600">
                          <FaCalendarAlt className="mr-2 text-indigo-500" />
                          <span>
                            {new Date(appt.date).toLocaleDateString()}
                          </span>
                        </div>
                        <div className="flex items-center text-gray-600">
                          <FaClock className="mr-2 text-indigo-500" />
                          <span>{appt.time}</span>
                        </div>
                        <div className="flex items-center text-gray-600 col-span-2">
                          <FaVideo className="mr-2 text-indigo-500" />
                          <span>{appt.sessionType} Session</span>
                        </div>
                      </div>

                      {appt.notes && (
                        <div className="mt-3 pt-3 border-t border-gray-100">
                          <p className="text-sm text-gray-700">
                            <span className="font-medium">Notes:</span>{" "}
                            {appt.notes}
                          </p>
                        </div>
                      )}
                    </div>
                  ))}
                </div>
              )}
            </div>
          </div>
        </div>
      </div>
    </Layout>
  );
};

export default Schedule;
