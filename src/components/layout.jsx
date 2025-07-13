/* eslint-disable react/prop-types */
import Sidebar from "./sideBar";
import { useState } from "react";

function Layout({
  children,
  noPadding = false,
  color = "bg-stone-800",
  counsellor,
  currentUser,
}) {
  const [collapse, setCollapse] = useState(false);

  return (
    <div className="flex flex-row">
      {/* Fixed Sidebar */}
      <Sidebar
        collapse={collapse}
        setCollapse={setCollapse}
        color={color}
        counsellor={counsellor}
        currentUser={currentUser}
      />

      {/* Scrollable Content Area */}
      <div
        className={`min-h-screen flex-grow ${
          noPadding ? "p-0" : "p-10"
        } transition-all duration-300 ${collapse ? "ml-24" : "ml-72"}`}
      >
        {children}
      </div>
    </div>
  );
}

export default Layout;
