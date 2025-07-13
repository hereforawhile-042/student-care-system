import { useState, useEffect } from "react";
import Layout from "../../../components/layout";
import { supabase } from "../../../lib/supabaseClient";
import {
  Users,
  Calendar,
  MessageSquare,
  FileText,
  Clock,
  TrendingUp,
  AlertTriangle,
  Heart,
  CheckCircle,
  User,
  Phone,
  Video,
  Mail,
  MoreHorizontal,
  Filter,
  Search,
  Bell,
  Star,
} from "lucide-react";

const CounsellorOverview = () => {
  const [activeTab, setActiveTab] = useState("overview");
  const [notifications, setNotifications] = useState(3);
  const [searchTerm, setSearchTerm] = useState("");
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

  // Mock data - replace with actual Supabase queries
  const [dashboardData, setDashboardData] = useState({
    stats: {
      totalStudents: 142,
      activeSessions: 8,
      pendingAppointments: 12,
      completedSessions: 89,
      monthlyGrowth: 15.2,
      urgentCases: 3,
    },
    recentSessions: [
      {
        id: 1,
        studentName: "Sarah Johnson",
        studentId: "ST2024001",
        time: "10:00 AM",
        date: "Today",
        type: "video",
        status: "completed",
        priority: "normal",
        notes: "Follow-up on anxiety management techniques",
      },
      {
        id: 2,
        studentName: "Michael Chen",
        studentId: "ST2024002",
        time: "2:00 PM",
        date: "Today",
        type: "in-person",
        status: "upcoming",
        priority: "high",
        notes: "Initial consultation for academic stress",
      },
      {
        id: 3,
        studentName: "Emma Williams",
        studentId: "ST2024003",
        time: "4:30 PM",
        date: "Today",
        type: "phone",
        status: "in-progress",
        priority: "urgent",
        notes: "Crisis intervention session",
      },
    ],
    upcomingAppointments: [
      {
        id: 1,
        student: "Alex Thompson",
        time: "9:00 AM",
        date: "Tomorrow",
        type: "Initial Consultation",
        duration: "60 min",
      },
      {
        id: 2,
        student: "Jessica Brown",
        time: "11:00 AM",
        date: "Tomorrow",
        type: "Follow-up",
        duration: "45 min",
      },
      {
        id: 3,
        student: "David Wilson",
        time: "2:00 PM",
        date: "Dec 15",
        type: "Group Session",
        duration: "90 min",
      },
    ],
    urgentCases: [
      {
        id: 1,
        student: "Anonymous Student",
        concern: "Severe anxiety, panic attacks",
        submitted: "2 hours ago",
        priority: "urgent",
      },
      {
        id: 2,
        student: "John Doe",
        concern: "Depression, suicidal thoughts",
        submitted: "4 hours ago",
        priority: "critical",
      },
    ],
  });

  const StatCard = ({
    title,
    value,
    icon: Icon,
    trend,
    color,
    description,
  }) => (
    <div className="bg-white rounded-xl shadow-lg p-6 border border-gray-100 hover:shadow-xl transition-all duration-300">
      <div className="flex items-center justify-between mb-4">
        <div className={`p-3 rounded-lg ${color}`}>
          <Icon className="w-6 h-6 text-white" />
        </div>
        {trend && (
          <div className="flex items-center gap-4 text-green-600">
            <TrendingUp className="w-4 h-4" />
            <span className="text-sm font-medium">+{trend}%</span>
          </div>
        )}
      </div>
      <div className="space-y-1">
        <h3 className="text-2xl font-bold text-gray-900">{value}</h3>
        <p className="text-sm font-medium text-gray-600">{title}</p>
        {description && <p className="text-xs text-gray-500">{description}</p>}
      </div>
    </div>
  );

  const SessionCard = ({ session }) => {
    const getStatusColor = (status) => {
      switch (status) {
        case "completed":
          return "bg-green-100 text-green-800";
        case "upcoming":
          return "bg-blue-100 text-blue-800";
        case "in-progress":
          return "bg-yellow-100 text-yellow-800";
        default:
          return "bg-gray-100 text-gray-800";
      }
    };

    const getPriorityColor = (priority) => {
      switch (priority) {
        case "urgent":
          return "border-l-red-500 bg-red-50";
        case "high":
          return "border-l-orange-500 bg-orange-50";
        case "normal":
          return "border-l-blue-500 bg-blue-50";
        default:
          return "border-l-gray-500 bg-gray-50";
      }
    };

    const getTypeIcon = (type) => {
      switch (type) {
        case "video":
          return <Video className="w-4 h-4" />;
        case "phone":
          return <Phone className="w-4 h-4" />;
        case "in-person":
          return <User className="w-4 h-4" />;
        default:
          return <MessageSquare className="w-4 h-4" />;
      }
    };

    return (
      <div
        className={`bg-white rounded-lg p-4 border-l-4 shadow-sm hover:shadow-md transition-all duration-200 ${getPriorityColor(
          session.priority
        )}`}
      >
        <div className="flex items-center justify-between mb-3">
          <div className="flex items-center gap-3">
            <div className="w-10 h-10 bg-gray-200 rounded-full flex items-center justify-center">
              <User className="w-5 h-5 text-gray-600" />
            </div>
            <div>
              <h4 className="font-semibold text-gray-900">
                {session.studentName}
              </h4>
              <p className="text-sm text-gray-500">{session.studentId}</p>
            </div>
          </div>
          <div className="flex items-center gap-2">
            <span
              className={`px-2 py-1 rounded-full text-xs font-medium ${getStatusColor(
                session.status
              )}`}
            >
              {session.status}
            </span>
            <button className="p-1 hover:bg-gray-100 rounded">
              <MoreHorizontal className="w-4 h-4 text-gray-400" />
            </button>
          </div>
        </div>

        <div className="flex items-center gap-4 mb-3 text-sm text-gray-600">
          <div className="flex items-center gap-1">
            <Clock className="w-4 h-4" />
            <span>
              {session.time} - {session.date}
            </span>
          </div>
          <div className="flex items-center gap-1">
            {getTypeIcon(session.type)}
            <span className="capitalize">{session.type}</span>
          </div>
        </div>

        <p className="text-sm text-gray-700 bg-gray-50 p-3 rounded-lg">
          {session.notes}
        </p>
      </div>
    );
  };

  const UrgentCaseCard = ({ case: urgentCase }) => (
    <div className="bg-white rounded-lg p-4 border border-red-200 shadow-sm hover:shadow-md transition-all duration-200">
      <div className="flex items-start justify-between mb-3">
        <div className="flex items-center gap-2">
          <AlertTriangle className="w-5 h-5 text-red-500" />
          <span
            className={`px-2 py-1 rounded-full text-xs font-medium ${
              urgentCase.priority === "critical"
                ? "bg-red-100 text-red-800"
                : "bg-orange-100 text-orange-800"
            }`}
          >
            {urgentCase.priority}
          </span>
        </div>
        <span className="text-xs text-gray-500">{urgentCase.submitted}</span>
      </div>

      <h4 className="font-semibold text-gray-900 mb-2">{urgentCase.student}</h4>
      <p className="text-sm text-gray-700 mb-3">{urgentCase.concern}</p>

      <div className="flex gap-2">
        <button className="flex-1 bg-red-600 text-white py-2 px-3 rounded-lg text-sm font-medium hover:bg-red-700 transition-colors">
          Respond Now
        </button>
        <button className="px-3 py-2 border border-gray-300 rounded-lg text-sm text-gray-700 hover:bg-gray-50 transition-colors">
          View Details
        </button>
      </div>
    </div>
  );

  return (
    <Layout color={"bg-blue-500"} counsellor={true} currentUser={currentUser}>
      <div className="mx-auto sm:px-6 lg:px-10 py-9">
        {/* Header - Improved spacing and responsive layout */}
        <div className="flex flex-col sm:flex-row justify-between items-start gap-4 mb-6">
          <div className="flex-1 min-w-0">
            <h1 className="text-2xl md:text-3xl font-bold text-gray-900 truncate">
              Counsellor Dashboard
            </h1>
            <p className="text-gray-600 mt-1 truncate">
              Manage your sessions and support students effectively
            </p>
          </div>

          <div className="w-full sm:w-auto flex items-center gap-3">
            <div className="relative flex-1 min-w-[200px]">
              <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 w-4 h-4 text-gray-400" />
              <input
                type="text"
                placeholder="Search students..."
                className="w-full pl-10 pr-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent"
                value={searchTerm}
                onChange={(e) => setSearchTerm(e.target.value)}
              />
            </div>
            <button className="relative p-2 text-gray-400 hover:text-gray-600 transition-colors">
              <Bell className="w-5 h-5" />
              {notifications > 0 && (
                <span className="absolute -top-1 -right-1 w-5 h-5 bg-red-500 text-white text-xs rounded-full flex items-center justify-center">
                  {notifications}
                </span>
              )}
            </button>
          </div>
        </div>

        {/* Stats Grid - Responsive columns */}
        <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 lg:grid-cols-5 gap-4 mb-6">
          <StatCard
            title="Total Students"
            value={dashboardData.stats.totalStudents}
            icon={Users}
            color="bg-blue-500"
            description="Active caseload"
          />
          <StatCard
            title="Active Sessions"
            value={dashboardData.stats.activeSessions}
            icon={MessageSquare}
            color="bg-green-500"
            description="Currently ongoing"
          />
          <StatCard
            title="Pending Appointments"
            value={dashboardData.stats.pendingAppointments}
            icon={Calendar}
            color="bg-yellow-500"
            description="Awaiting confirmation"
          />
          <StatCard
            title="Completed Sessions"
            value={dashboardData.stats.completedSessions}
            icon={CheckCircle}
            color="bg-purple-500"
            trend={dashboardData.stats.monthlyGrowth}
            description="This month"
          />
          <StatCard
            title="Success Rate"
            value="94%"
            icon={Star}
            color="bg-indigo-500"
            description="Student satisfaction"
          />
        </div>

        {/* Main Content - Better grid organization */}
        <div className="grid grid-cols-1 lg:grid-cols-3 gap-5">
          {/* Recent Sessions - Prioritize width */}
          <div className="lg:col-span-2">
            <div className="bg-white rounded-xl shadow-lg p-5 border border-gray-100 h-full">
              <div className="flex flex-wrap items-center justify-between gap-3 mb-5">
                <h2 className="text-xl font-bold text-gray-900">
                  Recent Sessions
                </h2>
                <div className="flex items-center gap-2">
                  <button className="p-2 hover:bg-gray-100 rounded-lg transition-colors">
                    <Filter className="w-4 h-4 text-gray-400" />
                  </button>
                  <button className="text-blue-600 hover:text-blue-800 text-sm font-medium">
                    View All
                  </button>
                </div>
              </div>

              <div className="space-y-3">
                {dashboardData.recentSessions.map((session) => (
                  <SessionCard key={session.id} session={session} />
                ))}
              </div>
            </div>
          </div>

          {/* Sidebar Content - Better organization */}
          <div className="flex flex-col gap-5">
            {/* Urgent Cases */}
            <div className="bg-white rounded-xl shadow-lg p-5 border border-gray-100">
              <div className="flex items-center justify-between mb-5">
                <h2 className="text-xl font-bold text-gray-900 flex items-center gap-2">
                  <AlertTriangle className="w-5 h-5 text-red-500" />
                  <span>Urgent Cases</span>
                </h2>
                <span className="bg-red-100 text-red-800 px-2 py-1 rounded-full text-xs font-medium">
                  {dashboardData.urgentCases.length}
                </span>
              </div>

              <div className="space-y-3">
                {dashboardData.urgentCases.map((urgentCase) => (
                  <UrgentCaseCard key={urgentCase.id} case={urgentCase} />
                ))}
              </div>
            </div>

            {/* Upcoming Appointments */}
            <div className="bg-white rounded-xl shadow-lg p-5 border border-gray-100">
              <div className="flex items-center justify-between mb-5">
                <h2 className="text-xl font-bold text-gray-900">
                  Upcoming Appointments
                </h2>
                <button className="text-blue-600 hover:text-blue-800 text-sm font-medium">
                  View Calendar
                </button>
              </div>

              <div className="space-y-3">
                {dashboardData.upcomingAppointments.map((appointment) => (
                  <div
                    key={appointment.id}
                    className="flex items-center gap-3 p-3 bg-gray-50 rounded-lg hover:bg-gray-100 transition-colors"
                  >
                    <div className="min-w-[6px] w-1.5 h-1.5 bg-blue-500 rounded-full"></div>
                    <div className="flex-1 min-w-0">
                      <p className="font-medium text-gray-900 truncate">
                        {appointment.student}
                      </p>
                      <p className="text-sm text-gray-600 truncate">
                        {appointment.type}
                      </p>
                      <p className="text-xs text-gray-500">
                        {appointment.time} - {appointment.date}
                      </p>
                    </div>
                    <div className="text-xs text-gray-500 whitespace-nowrap">
                      {appointment.duration}
                    </div>
                  </div>
                ))}
              </div>
            </div>

            {/* Quick Actions - Consistent styling */}
            <div className="bg-white rounded-xl shadow-lg p-5 border border-gray-100">
              <h2 className="text-xl font-bold text-gray-900 mb-4">
                Quick Actions
              </h2>
              <div className="grid grid-cols-2 gap-3">
                <button className="flex flex-col items-center justify-center p-3 bg-blue-50 hover:bg-blue-100 rounded-lg transition-colors">
                  <Calendar className="w-5 h-5 text-blue-600 mb-1" />
                  <span className="text-sm font-medium text-blue-700">
                    Schedule
                  </span>
                </button>
                <button className="flex flex-col items-center justify-center p-3 bg-green-50 hover:bg-green-100 rounded-lg transition-colors">
                  <MessageSquare className="w-5 h-5 text-green-600 mb-1" />
                  <span className="text-sm font-medium text-green-700">
                    Message
                  </span>
                </button>
                <button className="flex flex-col items-center justify-center p-3 bg-purple-50 hover:bg-purple-100 rounded-lg transition-colors">
                  <FileText className="w-5 h-5 text-purple-600 mb-1" />
                  <span className="text-sm font-medium text-purple-700">
                    Reports
                  </span>
                </button>
                <button className="flex flex-col items-center justify-center p-3 bg-orange-50 hover:bg-orange-100 rounded-lg transition-colors">
                  <Heart className="w-5 h-5 text-orange-600 mb-1" />
                  <span className="text-sm font-medium text-orange-700">
                    Resources
                  </span>
                </button>
              </div>
            </div>
          </div>
        </div>
      </div>
    </Layout>
  );
};

export default CounsellorOverview;
