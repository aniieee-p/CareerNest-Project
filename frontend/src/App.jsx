import { createBrowserRouter, RouterProvider, Navigate, Outlet } from "react-router-dom";
import { useEffect } from "react";
import { useDispatch } from "react-redux";
import { setUser } from "./redux/authSlice";
import useGetSavedJobs from "./hooks/useGetSavedJobs";
import { PulseIQRouteTracker } from "./hooks/usePulseIQ";
import Login from './components/auth/Login';
import Signup from './components/auth/Signup'
import ResetPassword from './components/auth/ResetPassword';
import Home from "./components/Home";
import Jobs from "./components/Jobs";
import Browse from "./components/Browse";
import Profile from "./components/Profile";
import JobDescription from "./components/JobDescription";
import Companies from "./components/admin/Companies";
import CompanyCreate from "./components/admin/CompanyCreate";
import CompanySetup from "./components/admin/CompanySetup";
import AdminJobs from "./components/admin/AdminJobs";
import PostJob from "./components/admin/PostJob";
import Applicants from "./components/admin/Applicants";
import ApplicantsTable from "./components/admin/ApplicantsTable";
import RecruiterProfile from "./components/admin/RecruiterProfile";
import CareerAdvice from "./components/CareerAdvice";
import SavedJobs from "./components/SavedJobs";
import RecruitmentSolutions from "./components/RecruitmentSolutions";
import ContactSupport from "./components/ContactSupport";
import ProtectedRoute from "./components/admin/ProtectedRoute";
import StudentRoute from "./components/auth/StudentRoute";
import PublicProfile from "./components/PublicProfile";
import NotFound from "./components/NotFound";

function AppShell() {
  return (
    <div className="min-h-screen flex flex-col">
      <PulseIQRouteTracker />
      <div className="flex-1">
        <Outlet />
      </div>
    </div>
  );
}

const appRouter = createBrowserRouter([
  {
    element: <AppShell />,
    children: [
      {
        index: true,
        element: <Home />
      },
      {
        path: 'login',
        element: <Login />
      },
      {
        path: 'signup',
        element: <Signup />
      },
      {
        path: 'reset-password/:token',
        element: <ResetPassword />
      },
      {
        path: 'jobs',
        element: <StudentRoute><Jobs /></StudentRoute>
      },
      {
        path: 'description/:id',
        element: <JobDescription />
      },
      {
        path: 'browse',
        element: <Browse />
      },
      {
        path: 'profile',
        element: <StudentRoute><Profile /></StudentRoute>
      },
      {
        path: 'profile/:id',
        element: <PublicProfile />
      },
      {
        path: 'admin/companies',
        element: <ProtectedRoute><Companies /></ProtectedRoute>
      },
      {
        path: 'admin/profile',
        element: <ProtectedRoute><RecruiterProfile /></ProtectedRoute>
      },
      {
        path: 'admin/companies/create',
        element: <ProtectedRoute><CompanyCreate /></ProtectedRoute>
      },
      {
        path: 'admin/companies/:id',
        element: <ProtectedRoute><CompanySetup /></ProtectedRoute>
      },
      {
        path: 'admin/jobs',
        element: <ProtectedRoute><AdminJobs /></ProtectedRoute>
      },
      {
        path: 'admin/jobs/create',
        element: <ProtectedRoute><PostJob /></ProtectedRoute>
      },
      {
        path: 'admin/jobs/:id/applicants',
        element: <ProtectedRoute><Applicants /></ProtectedRoute>
      },
      {
        path: 'admin/ApplicantsTable',
        element: <ProtectedRoute><ApplicantsTable /></ProtectedRoute>
      },
      {
        path: 'career-advice',
        element: <CareerAdvice />
      },
      {
        path: 'saved-jobs',
        element: <StudentRoute><SavedJobs /></StudentRoute>
      },
      {
        path: 'recruitment',
        element: <RecruitmentSolutions />
      },
      {
        path: 'contact',
        element: <ContactSupport />
      },
      {
        path: 'admin/*',
        element: <ProtectedRoute><Navigate to="/admin/jobs" replace /></ProtectedRoute>
      },
      {
        path: "*",
        element: <NotFound />
      },
    ],
  },
])
function App() {
  const dispatch = useDispatch();
  useGetSavedJobs();

  // Clear any stale localStorage-based auth (old "remember me" flow that didn't restore cookies)
  useEffect(() => {
    if (localStorage.getItem("rememberedUser")) {
      localStorage.removeItem("rememberedUser");
      localStorage.removeItem("rememberMe");
      localStorage.removeItem("token");
      dispatch(setUser(null));
    }
  }, [dispatch]);

  return (
    <div style={{ background: "var(--cn-page)", minHeight: "100vh" }}>
      <RouterProvider router ={appRouter} />
    </div>
  )
}

export default App
