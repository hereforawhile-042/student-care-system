import {
  BrowserRouter as Router,
  Route,
  Routes,
  Navigate,
} from "react-router";
import { ToastContainer } from "react-toastify";
import "react-toastify/dist/ReactToastify.css";
import { useState, useEffect } from "react";

// Common/Auth Components
import Login from "./commons/login";

// Student Pages
import Overview from "./pages/overview";
import Chat from "./pages/chat";
import Resources from "./pages/resources";
import Agent from "./pages/agent";
import Feedback from "./pages/feedback";
import Schedule from "./pages/schedule";

// Counsellor Pages
import CounsellorOverview from "./commons/dashboard/counsellor/CouncellorOverview";
import CounsellorChat from "./commons/dashboard/counsellor/Counsellor-chat";
// import CounsellorAppointments from "./commons/dashboard/counsellor/CounsellorAppointments";
// import CounsellorAssessments from "./commons/dashboard/counsellor/CounsellorAssessments";
// import CounsellorAnalytics from "./commons/dashboard/counsellor/CounsellorAnalytics";
// import CounsellorResources from "./commons/dashboard/counsellor/CounsellorResources";
// import CounsellorSupport from "./commons/dashboard/counsellor/CounsellorSupport";

// Supabase Configuration
const SUPABASE_CONFIG = {
  url: "https://hnsbzokqpqfulncdmatq.supabase.co",
  anonKey:
    "eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJpc3MiOiJzdXBhYmFzZSIsInJlZiI6Imhuc2J6b2txcHFmdWxuY2RtYXRxIiwicm9sZSI6ImFub24iLCJpYXQiOjE3NDg1ODg0NDEsImV4cCI6MjA2NDE2NDQ0MX0.Y5tIh8vs9Uej--ZZ_KyA0LKHp4tiJERXuLSmyz78Hgo",
};

function App() {
  const [collapse, setCollapse] = useState(false);
  const [user, setUser] = useState(null);
  const [loading, setLoading] = useState(true);
  const [userRole, setUserRole] = useState(null); // 'student' or 'counsellor'

  // Initialize authentication state
  useEffect(() => {
    // Check if user is logged in (you'll implement this with Supabase)
    const checkAuth = async () => {
      try {
        // Add your Supabase auth check here
        // const { data: { session } } = await supabase.auth.getSession();
        // setUser(session?.user || null);
        // setUserRole(session?.user?.user_metadata?.role || 'student');

        // Temporary mock - remove when implementing real auth
        setUser(null);
        setUserRole("student");
      } catch (error) {
        console.error("Auth check failed:", error);
      } finally {
        setLoading(false);
      }
    };

    checkAuth();
  }, []);

  // Show loading screen while checking auth
  if (loading) {
    return (
      <div className="min-h-screen bg-gradient-to-br from-teal-50 to-blue-50 flex items-center justify-center">
        <div className="text-center">
          <div className="w-16 h-16 border-4 border-teal-500 border-t-transparent rounded-full animate-spin mx-auto mb-4"></div>
          <p className="text-teal-600 font-medium">Loading MindCare...</p>
        </div>
      </div>
    );
  }

  return (
    <>
      {/* Toast Notifications */}
      <ToastContainer
        position="top-right"
        autoClose={5000}
        hideProgressBar={false}
        newestOnTop={false}
        closeOnClick
        rtl={false}
        pauseOnFocusLoss
        draggable
        pauseOnHover
        theme="light"
        toastClassName="shadow-lg"
      />

      <Router>
        <Routes>
          {/* Public Routes */}
          <Route
            path="/"
            element={user ? <Navigate to="/dashboard" replace /> : <Login />}
          />
          <Route
            path="/login"
            element={user ? <Navigate to="/dashboard" replace /> : <Login />}
          />

          {/* Student Routes */}
          <Route
            path="/dashboard"
            element={<Overview collapse={collapse} setCollapse={setCollapse} />}
          />
          <Route
            path="/chat"
            element={<Chat collapse={collapse} setCollapse={setCollapse} />}
          />
          <Route
            path="/resources"
            element={
              <Resources collapse={collapse} setCollapse={setCollapse} />
            }
          />
          <Route
            path="/appointments"
            element={<Schedule collapse={collapse} setCollapse={setCollapse} />}
          />
          <Route
            path="/ai-companion"
            element={<Agent collapse={collapse} setCollapse={setCollapse} />}
          />

          <Route
            path="/feedback"
            element={<Feedback collapse={collapse} setCollapse={setCollapse} />}
          />

          {/* Quick Access Routes */}
          

          {/* Crisis Support - Available to all authenticated users */}

          {/* Legacy Routes - Redirect to new paths */}
          <Route
            path="/agent"
            element={<Navigate to="/ai-companion" replace />}
          />
          <Route
            path="/schedule"
            element={<Navigate to="/appointments" replace />}
          />
          <Route
            path="/emergency"
            element={<Navigate to="/crisis-support" replace />}
          />

          {/* Counsellor Routes */}
          <Route
            path="/counsellor/dashboard"
            element={
              <CounsellorOverview
                collapse={collapse}
                setCollapse={setCollapse}
              />
            }
          />
          <Route
            path="/counsellor/chat"
            element={
              <CounsellorChat collapse={collapse} setCollapse={setCollapse} />
            }
          />

        

          {/* Legacy Counsellor Routes - Redirect to new paths */}
          <Route
            path="/counsellor"
            element={<Navigate to="/counsellor/dashboard" replace />}
          />
          <Route
            path="/counsellor-chat"
            element={<Navigate to="/counsellor/chat" replace />}
          />

          {/* 404 Page */}
        </Routes>
      </Router>
    </>
  );
}

export default App;

// Export Supabase config for use in other components
export { SUPABASE_CONFIG };
