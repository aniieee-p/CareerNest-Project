import { createBrowserRouter, RouterProvider, Navigate, Outlet } from "react-router-dom";
import { useEffect, Suspense, lazy } from "react";
import { useDispatch } from "react-redux";
import { setUser } from "./redux/authSlice";
import useGetSavedJobs from "./hooks/useGetSavedJobs";

// Lazy load all components
const Login = lazy(() => import('./components/auth/Login'));
const Signup = lazy(() => import('./components/auth/Signup'));
const ResetPassword = lazy(() => import('./components/auth/ResetPassword'));
const Home = lazy(() => import("./components/Home"));
const Jobs = lazy(() => import("./components/Jobs"));
const Browse = lazy(() => import("./components/Browse"));
const Profile = lazy(() => import("./components/Profile"));
const JobDescription = lazy(() => import("./components/JobDescription"));
const Companies = lazy(() => import("./components/admin/Companies"));
const CompanyCreate = lazy(() => import("./components/admin/CompanyCreate"));
const CompanySetup = lazy(() => import("./components/admin/CompanySetup"));
const AdminJobs = lazy(() => import("./components/admin/AdminJobs"));
const PostJob = lazy(() => import("./components/admin/PostJob"));
const Applicants = lazy(() => import("./components/admin/Applicants"));
const ApplicantsTable = lazy(() => import("./components/admin/ApplicantsTable"));
const RecruiterProfile = lazy(() => import("./components/admin/RecruiterProfile"));
const CareerAdvice = lazy(() => import("./components/CareerAdvice"));
const SavedJobs = lazy(() => import("./components/SavedJobs"));
const RecruitmentSolutions = lazy(() => import("./components/RecruitmentSolutions"));
const ContactSupport = lazy(() => import("./components/ContactSupport"));
const ProtectedRoute = lazy(() => import("./components/admin/ProtectedRoute"));
const StudentRoute = lazy(() => import("./components/auth/StudentRoute"));
const PublicProfile = lazy(() => import("./components/PublicProfile"));
const NotFound = lazy(() => import("./components/NotFound"));

// Loading spinner component
const LoadingSpinner = () => (
  <div className="min-h-screen flex items-center justify-center" style={{ background: "var(--cn-page)" }}>
    <div className="flex flex-col items-center gap-4">
      <div className="w-8 h-8 border-2 border-blue-500 border-t-transparent rounded-full animate-spin"></div>
      <p className="text-sm" style={{ color: "var(--cn-text-2)" }}>Loading...</p>
    </div>
  </div>
);

function AppShell() {
  return (
    <div className="min-h-screen flex flex-col">
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
        element: <Suspense fallback={<LoadingSpinner />}><Home /></Suspense>
      },
      {
        path: 'login',
        element: <Suspense fallback={<LoadingSpinner />}><Login /></Suspense>
      },
      {
        path: 'signup',
        element: <Suspense fallback={<LoadingSpinner />}><Signup /></Suspense>
      },
      {
        path: 'reset-password/:token',
        element: <Suspense fallback={<LoadingSpinner />}><ResetPassword /></Suspense>
      },
      {
        path: 'jobs',
        element: <Suspense fallback={<LoadingSpinner />}><StudentRoute><Jobs /></StudentRoute></Suspense>
      },
      {
        path: 'description/:id',
        element: <Suspense fallback={<LoadingSpinner />}><JobDescription /></Suspense>
      },
      {
        path: 'browse',
        element: <Suspense fallback={<LoadingSpinner />}><Browse /></Suspense>
      },
      {
        path: 'profile',
        element: <Suspense fallback={<LoadingSpinner />}><StudentRoute><Profile /></StudentRoute></Suspense>
      },
      {
        path: 'profile/:id',
        element: <Suspense fallback={<LoadingSpinner />}><PublicProfile /></Suspense>
      },
      {
        path: 'admin/companies',
        element: <Suspense fallback={<LoadingSpinner />}><ProtectedRoute><Companies /></ProtectedRoute></Suspense>
      },
      {
        path: 'admin/profile',
        element: <Suspense fallback={<LoadingSpinner />}><ProtectedRoute><RecruiterProfile /></ProtectedRoute></Suspense>
      },
      {
        path: 'admin/companies/create',
        element: <Suspense fallback={<LoadingSpinner />}><ProtectedRoute><CompanyCreate /></ProtectedRoute></Suspense>
      },
      {
        path: 'admin/companies/:id',
        element: <Suspense fallback={<LoadingSpinner />}><ProtectedRoute><CompanySetup /></ProtectedRoute></Suspense>
      },
      {
        path: 'admin/jobs',
        element: <Suspense fallback={<LoadingSpinner />}><ProtectedRoute><AdminJobs /></ProtectedRoute></Suspense>
      },
      {
        path: 'admin/jobs/create',
        element: <Suspense fallback={<LoadingSpinner />}><ProtectedRoute><PostJob /></ProtectedRoute></Suspense>
      },
      {
        path: 'admin/jobs/:id/applicants',
        element: <Suspense fallback={<LoadingSpinner />}><ProtectedRoute><Applicants /></ProtectedRoute></Suspense>
      },
      {
        path: 'admin/ApplicantsTable',
        element: <Suspense fallback={<LoadingSpinner />}><ProtectedRoute><ApplicantsTable /></ProtectedRoute></Suspense>
      },
      {
        path: 'career-advice',
        element: <Suspense fallback={<LoadingSpinner />}><CareerAdvice /></Suspense>
      },
      {
        path: 'saved-jobs',
        element: <Suspense fallback={<LoadingSpinner />}><StudentRoute><SavedJobs /></StudentRoute></Suspense>
      },
      {
        path: 'recruitment',
        element: <Suspense fallback={<LoadingSpinner />}><RecruitmentSolutions /></Suspense>
      },
      {
        path: 'contact',
        element: <Suspense fallback={<LoadingSpinner />}><ContactSupport /></Suspense>
      },
      {
        path: 'admin/*',
        element: <Suspense fallback={<LoadingSpinner />}><ProtectedRoute><Navigate to="/admin/jobs" replace /></ProtectedRoute></Suspense>
      },
      {
        path: "*",
        element: <Suspense fallback={<LoadingSpinner />}><NotFound /></Suspense>
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
