import { IoChatbubblesSharp, IoHeartSharp, IoCalendarSharp } from "react-icons/io5";
import { GrResources } from "react-icons/gr";
import { GoHomeFill } from "react-icons/go";
import { MdFeedback, MdDashboard, MdPeople, MdAssessment } from "react-icons/md";
import { GrSchedule } from "react-icons/gr";
import { GiArtificialIntelligence } from "react-icons/gi";
import { FaHandHoldingMedical, FaUserFriends, FaChartLine, FaCalendarCheck } from "react-icons/fa";
import { BiSupport, BiHealth } from "react-icons/bi";
import { HiUserGroup, HiClipboardList } from "react-icons/hi";
import { BsJournalMedical, BsActivity } from "react-icons/bs";

// Navigation items for students
const navItems = [
  {
    label: "Dashboard",
    route: 1,
    path: "/dashboard",
    logo: <GoHomeFill className="h-6 w-6" />,
    description: "Overview of your mental health journey",
    badge: null
  },
  {
    label: "Chat Support",
    route: 2,
    path: "/chat",
    logo: <IoChatbubblesSharp className="h-6 w-6" />,
    description: "Connect with counsellors and peers",
    badge: null
  },
  {
    label: "Resources",
    route: 3,
    path: "/resources",
    logo: <GrResources className="h-6 w-6" />,
    description: "Mental health resources and articles",
    badge: null
  },
  {
    label: "Appointments",
    route: 4,
    path: "/appointments",
    logo: <IoCalendarSharp className="h-6 w-6" />,
    description: "Schedule and manage sessions",
    badge: null
  },
  {
    label: "AI Companion",
    route: 5,
    path: "/ai-companion",
    logo: <GiArtificialIntelligence className="h-6 w-6" />,
    description: "24/7 AI mental health support",
    badge: "NEW"
  },
  {
    label: "Wellness Tracker",
    route: 6,
    path: "/wellness",
    logo: <BsActivity className="h-6 w-6" />,
    description: "Track your mood and progress",
    badge: null
  },
  {
    label: "Feedback",
    route: 7,
    path: "/feedback",
    logo: <MdFeedback className="h-6 w-6" />,
    description: "Share your experience",
    badge: null
  },
];

// Navigation items for counsellors
const navGroup = [
  {
    label: "Dashboard",
    route: 1,
    path: "/counsellor/dashboard",
    logo: <MdDashboard className="h-6 w-6" />,
    description: "Professional dashboard overview",
    badge: null
  },
  {
    label: "Client Chat",
    route: 2,
    path: "/counsellor/chat",
    logo: <IoChatbubblesSharp className="h-6 w-6" />,
    description: "Communicate with clients",
    badge: null
  },
  {
    label: "Client Management",
    route: 3,
    path: "/counsellor/clients",
    logo: <HiUserGroup className="h-6 w-6" />,
    description: "Manage client profiles and cases",
    badge: null
  },
  {
    label: "Appointments",
    route: 4,
    path: "/counsellor/appointments",
    logo: <FaCalendarCheck className="h-6 w-6" />,
    description: "Schedule and manage sessions",
    badge: null
  },
  {
    label: "Assessment Tools",
    route: 5,
    path: "/counsellor/assessments",
    logo: <HiClipboardList className="h-6 w-6" />,
    description: "Mental health assessment tools",
    badge: null
  },
  {
    label: "Analytics",
    route: 6,
    path: "/counsellor/analytics",
    logo: <FaChartLine className="h-6 w-6" />,
    description: "Client progress and insights",
    badge: null
  },
  {
    label: "Resources",
    route: 7,
    path: "/counsellor/resources",
    logo: <BsJournalMedical className="h-6 w-6" />,
    description: "Professional resources and guides",
    badge: null
  },
  {
    label: "Support",
    route: 8,
    path: "/counsellor/support",
    logo: <BiSupport className="h-6 w-6" />,
    description: "Professional support and training",
    badge: null
  },
];

// Crisis support items (always visible)
const crisisItems = [
  {
    label: "Crisis Support",
    route: 999,
    path: "/crisis-support",
    logo: <IoHeartSharp className="h-6 w-6" />,
    description: "24/7 emergency mental health support",
    badge: "URGENT",
    isUrgent: true
  }
];

// Quick access items for students
const quickAccessItems = [
  {
    label: "Mood Check",
    path: "/mood-check",
    logo: <BiHealth className="h-6 w-6" />,
    description: "Quick mood assessment"
  },
  {
    label: "Breathing Exercise",
    path: "/breathing",
    logo: <IoHeartSharp className="h-6 w-6" />,
    description: "Guided breathing exercises"
  },
  {
    label: "Peer Support",
    path: "/peer-support",
    logo: <FaUserFriends className="h-6 w-6" />,
    description: "Connect with peer supporters"
  }
];

// Navigation data export
const navData = { 
  navItems, 
  navGroup, 
  crisisItems, 
  quickAccessItems 
};

export default navData;

// Helper functions for navigation
export const getNavItemByPath = (path, isCounsellor = false) => {
  const items = isCounsellor ? navGroup : navItems;
  return items.find(item => item.path === path);
};

export const getActiveNavItem = (currentPath, isCounsellor = false) => {
  const items = isCounsellor ? navGroup : navItems;
  return items.find(item => currentPath.startsWith(item.path));
};

export const getBadgeColor = (badge) => {
  const badgeColors = {
    'NEW': 'bg-green-500 text-white',
    'URGENT': 'bg-red-500 text-white animate-pulse',
    'BETA': 'bg-blue-500 text-white',
    'UPDATED': 'bg-yellow-500 text-gray-800'
  };
  return badgeColors[badge] || 'bg-gray-500 text-white';
};

// Route constants for better maintainability
export const ROUTES = {
  STUDENT: {
    DASHBOARD: '/dashboard',
    CHAT: '/chat',
    RESOURCES: '/resources',
    APPOINTMENTS: '/appointments',
    AI_COMPANION: '/ai-companion',
    WELLNESS: '/wellness',
    FEEDBACK: '/feedback',
    CRISIS: '/crisis-support'
  },
  COUNSELLOR: {
    DASHBOARD: '/counsellor/dashboard',
    CHAT: '/counsellor/chat',
    CLIENTS: '/counsellor/clients',
    APPOINTMENTS: '/counsellor/appointments',
    ASSESSMENTS: '/counsellor/assessments',
    ANALYTICS: '/counsellor/analytics',
    RESOURCES: '/counsellor/resources',
    SUPPORT: '/counsellor/support'
  }
};