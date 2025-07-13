import DashboardBottomLeft from "../components/dash-bl";
import Layout from "../components/layout";
import { supabase } from "../lib/supabaseClient";
import MoodTracker from "../components/moodChart";
import PersonalizedRecommendations from "../components/personalizedRecommendation";
import UpcomingSessionsCalendar from "../components/upcomingSessionCalendar";
import AssessmentModal from "./AssesmentModal";
import { useState, useEffect } from "react";
const Overview = ({ collapse, setCollapse }) => {
  const [currentUser, setCurrentUser] = useState([]);

  const getCurrentUser = async () => {
    const {
      data: { user },
    } = await supabase.auth.getUser();
    if (user) setCurrentUser(user);
    console.log(user);
  };

  useEffect(() => {
    getCurrentUser();
  }, []);
  return (
    <Layout
      collapse={collapse}
      noPadding
      setCollapse={setCollapse}
      counsellor={false}
      currentUser={currentUser}
    >
      {/* <h1 className="font-bold mb-3">Overview</h1> */}
      <AssessmentModal />
      <div className="flex pt-8 pl-12 pr-6 h-[97%] flex-row gap-6">
        <div className="flex flex-col w-full gap-6">
          <MoodTracker />
          <div className="flex gap-4 items-center h-full flex-row">
            <DashboardBottomLeft />
            <UpcomingSessionsCalendar />
          </div>
        </div>
        <div className="flex">
          <PersonalizedRecommendations userMood={"Happy"} />
        </div>
      </div>
    </Layout>
  );
};

export default Overview;
