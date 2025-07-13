/* eslint-disable react/prop-types */
import { useState } from "react";
import navData from "../data.jsx";
import { FaAngleDoubleLeft, FaAngleDoubleRight } from "react-icons/fa";
import { NavLink } from "react-router";
import { useNavigate } from "react-router";
import { FiLogOut, FiUser, FiMail, FiShield } from "react-icons/fi";
import { supabase } from "../lib/supabaseClient.js";

function Sidebar({ collapse, setCollapse, color, counsellor, currentUser }) {
  const [isLoggingOut, setIsLoggingOut] = useState(false);
  const navigate = useNavigate();
  const handleEvent = (e) => {
    e.preventDefault();
    setCollapse(!collapse);
  };

  const handleLogout = async () => {
    setIsLoggingOut(true);
    try {
      // Add your logout logic here (e.g., Supabase auth.signOut())

      let { error } = await supabase.auth.signOut();
      if (!error) navigate("/");
      // Redirect to login or clear session
    } catch (error) {
      console.error("Logout failed:", error);
    } finally {
      setIsLoggingOut(false);
    }
  };

  // Determine user role and styling
  const userRole = counsellor ? "Professional Counsellor" : "Student";
  const roleColor = counsellor ? "text-emerald-300" : "text-teal-300";
  const roleIcon = counsellor ? (
    <FiShield className="w-3 h-3" />
  ) : (
    <FiUser className="w-3 h-3" />
  );

  return (
    <div
      className={`fixed left-0 top-0 flex flex-col justify-between ${color} h-screen ${
        collapse ? "w-20" : "w-80"
      } transition-all duration-300 z-10 shadow-2xl`}
    >
      {/* Gradient overlay for better visual appeal */}
      <div className="absolute inset-0 bg-gradient-to-b from-black/10 to-black/30 pointer-events-none"></div>

      <div className="relative z-10 flex flex-col h-full">
        {/* Collapse Button */}
        <button
          className="absolute -right-4 p-2 w-8 h-8 top-4 shadow-lg shadow-black/20 rounded-full bg-white flex items-center justify-center outline-none transform hover:scale-110 transition-all duration-200 hover:bg-gray-50 hover:shadow-xl"
          onClick={handleEvent}
          aria-label={collapse ? "Expand sidebar" : "Collapse sidebar"}
        >
          {collapse ? (
            <FaAngleDoubleRight className="text-gray-700 text-sm" />
          ) : (
            <FaAngleDoubleLeft className="text-gray-700 text-sm" />
          )}
        </button>

        {/* Header/Logo Section */}
        <div className="text-white px-6 py-8 border-b border-white/10">
          <div className="flex items-center justify-center">
            <div className="w-12 h-12 bg-gradient-to-br from-teal-400 to-blue-500 rounded-xl flex items-center justify-center shadow-lg">
              <span className="text-white font-bold text-lg">MH</span>
            </div>
            {!collapse && (
              <div className="ml-4">
                <h1 className="font-bold text-lg text-white">MindCare</h1>
                <p className="text-xs text-white/70">Mental Health Platform</p>
              </div>
            )}
          </div>
        </div>

        {/* User Profile */}
        <div className="text-white flex items-center mt-6 px-6">
          <div className="relative">
            <div className="flex items-center justify-center w-12 h-12 rounded-full bg-gradient-to-br from-teal-400 to-blue-500 overflow-hidden shadow-lg ring-2 ring-white/20">
              <img
                src="/Image.png"
                alt="User Avatar"
                className="w-full h-full object-cover"
                onError={(e) => {
                  e.target.style.display = "none";
                  e.target.nextSibling.style.display = "flex";
                }}
              />
              <div className="w-full h-full bg-gradient-to-br from-teal-400 to-blue-500 flex items-center justify-center text-white font-semibold text-lg hidden">
                EJ
              </div>
            </div>
            {/* Online status indicator */}
            <div className="absolute -bottom-1 -right-1 w-4 h-4 bg-green-500 rounded-full border-2 border-white shadow-sm"></div>
          </div>

          {!collapse && (
            <div className="ml-4 overflow-hidden flex-1">
              <h2 className="font-semibold text-sm truncate text-white">
                {currentUser?.user_metadata?.full_name}
              </h2>
              <div className="flex items-center gap-1 text-xs text-white/70 truncate mt-1">
                <FiMail className="w-3 h-3" />
                <span>{currentUser?.email}</span>
              </div>
              <div
                className={`flex items-center gap-1 text-xs ${roleColor} mt-1`}
              >
                {roleIcon}
                <span>{userRole}</span>
              </div>
            </div>
          )}
        </div>

        {/* Navigation Links with scrollable container */}
        <div className="flex-1 overflow-y-auto">
          <div className="text-white flex flex-col p-6 gap-2 mt-2">
            <div className="text-xs font-semibold text-white/50 uppercase tracking-wide mb-2">
              {!collapse && (counsellor ? "Counsellor Tools" : "Dashboard")}
            </div>

            {(counsellor ? navData.navGroup : navData.navItems).map((item) => (
              <NavLink
                to={`${item.path}`}
                key={item.path}
                className={({ isActive }) =>
                  `flex items-center p-3 rounded-xl transition-all duration-200 group relative ${
                    isActive
                      ? "bg-white/20 shadow-lg backdrop-blur-sm border border-white/30"
                      : "hover:bg-white/10 hover:shadow-md hover:backdrop-blur-sm"
                  } ${collapse ? "justify-center" : "justify-start gap-4"}`
                }
              >
                {/* Active indicator */}
                <div
                  className={`absolute left-0 top-0 h-full w-1 bg-white rounded-r-full transition-all duration-200 ${
                    window.location.pathname === item.path
                      ? "opacity-100"
                      : "opacity-0"
                  }`}
                ></div>

                <span className="text-xl text-white/90 group-hover:text-white transition-colors">
                  {item.logo}
                </span>

                {!collapse && (
                  <span className="text-sm transition-all duration-200 text-white/90 group-hover:text-white font-medium">
                    {item.label}
                  </span>
                )}

                {/* Tooltip for collapsed state */}
                {collapse && (
                  <div className="absolute left-16 bg-gray-800 text-white text-xs rounded-lg px-2 py-1 opacity-0 group-hover:opacity-100 transition-opacity duration-200 whitespace-nowrap z-20 shadow-lg">
                    {item.label}
                  </div>
                )}
              </NavLink>
            ))}
          </div>
        </div>
      </div>

      {/* Logout Button */}
      <div className="text-white p-6 mb-4 relative z-10">
        <button
          onClick={handleLogout}
          disabled={isLoggingOut}
          className={`w-full flex items-center p-3 rounded-xl bg-gradient-to-r from-red-500 to-red-600 hover:from-red-600 hover:to-red-700 transition-all duration-200 shadow-lg hover:shadow-xl transform hover:scale-[1.02] disabled:opacity-50 disabled:cursor-not-allowed ${
            collapse ? "justify-center" : "justify-center gap-3"
          }`}
        >
          <FiLogOut
            className={`text-white text-lg ${
              isLoggingOut ? "animate-spin" : ""
            }`}
          />
          {!collapse && (
            <span className="text-sm font-medium">
              {isLoggingOut ? "Logging out..." : "Logout"}
            </span>
          )}
        </button>

        {/* Help text for collapsed state */}
        {collapse && (
          <div className="mt-3 text-center">
            <div className="text-xs text-white/50">
              {counsellor ? "Counsellor" : "Student"}
            </div>
          </div>
        )}
      </div>
    </div>
  );
}

export default Sidebar;
