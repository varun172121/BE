import UpcomingIcon from "@mui/icons-material/Upcoming";
// import EqualizerIcon from "@mui/icons-material/Equalizer";
import PersonIcon from "@mui/icons-material/Person";
import VpnKeyIcon from "@mui/icons-material/VpnKey";
import SchoolIcon from "@mui/icons-material/School";
import AddIcon from "@mui/icons-material/Add";
import VideocamIcon from "@mui/icons-material/Videocam";
import MyExams from "../SupervisorPages/MyExams";
import UpcomingExams from "../StudentPages/UpcomingExams";
// import MyResults from "../StudentPages/MyResults";
import CreateExam from "../SupervisorPages/CreateExam";
import StudentMonitoring from "../SupervisorPages/StudentMonitoring";
// import Results from "../SupervisorPages/Results";
import Profile from "../CommonPages/Profile";
import ChangePassword from "../CommonPages/ChangePassword";
import HistoryIcon from "@mui/icons-material/History";
import ExamHistory from "../StudentPages/ExamHistory";
import OngoingExams from "../StudentPages/OngoingExams";
import NotificationsActiveIcon from "@mui/icons-material/NotificationsActive";

const studentDrawerItems = [
    {
        subheader: "Exam",
        items: [
            {
                text: "Ongoing Exams",
                icon: <NotificationsActiveIcon />,
                to: "/dashboard/exam/ongoing",
                component: OngoingExams,
            },
            {
                text: "Upcoming Exams",
                icon: <UpcomingIcon />,
                to: "/dashboard/exam/upcoming",
                component: UpcomingExams,
            },
            // {
            //     text: "My Results",
            //     icon: <EqualizerIcon />,
            //     to: "/dashboard/exam/results",
            //     component: MyResults,
            // },
            {
                text: "Exam History",
                icon: <HistoryIcon />,
                to: "/dashboard/exam/history",
                component: ExamHistory,
            },
        ],
    },
];

const supervisorDrawerItems = [
    {
        subheader: "Exam",
        items: [
            {
                text: "My Exams",
                icon: <SchoolIcon />,
                to: "/dashboard/exam/my-exams",
                component: MyExams,
            },
            {
                text: "Create Exam",
                icon: <AddIcon />,
                to: "/dashboard/exam/create-exam",
                component: CreateExam,
            },
            {
                text: "Student Monitoring",
                icon: <VideocamIcon />,
                to: "/dashboard/exam/student-monitoring",
                component: StudentMonitoring,
            },
            // {
            //     text: "Analytics",
            //     icon: <EqualizerIcon />,
            //     to: "/dashboard/exam/analytics",
            //     component: Results,
            // },
        ],
    },
];

const commonDrawerItems = [
    {
        subheader: "Profile",
        items: [
            {
                text: "Profile",
                icon: <PersonIcon />,
                to: "/dashboard/profile",
                component: Profile,
            },
            {
                text: "Change Password",
                icon: <VpnKeyIcon />,
                to: "/dashboard/change-password",
                component: ChangePassword,
            },
        ],
    },
];

export const drawerItems = {
    student: [...studentDrawerItems, ...commonDrawerItems],
    supervisor: [...supervisorDrawerItems, ...commonDrawerItems],
};
