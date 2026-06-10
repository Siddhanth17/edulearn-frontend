import { lazy, Suspense } from 'react';
import { BrowserRouter, Routes, Route } from 'react-router-dom';
import { Toaster } from 'react-hot-toast';
import Layout from './components/layout/Layout';
import { ProtectedRoute, GuestRoute } from './components/layout/ProtectedRoute';
import Loading from './components/ui/Loading';

const Home = lazy(() => import('./pages/Home'));
const Login = lazy(() => import('./pages/auth/Login'));
const Register = lazy(() => import('./pages/auth/Register'));
const VerifyOTP = lazy(() => import('./pages/auth/VerifyOTP'));
const ForgotPassword = lazy(() => import('./pages/auth/ForgotPassword'));
const Search = lazy(() => import('./pages/Search'));
const NoteDetail = lazy(() => import('./pages/NoteDetail'));
const Subjects = lazy(() => import('./pages/Subjects'));
const SubjectDetail = lazy(() => import('./pages/SubjectDetail'));
const ChapterDetail = lazy(() => import('./pages/ChapterDetail'));
const Dashboard = lazy(() => import('./pages/Dashboard'));
const Settings = lazy(() => import('./pages/Settings'));
const Contact = lazy(() => import('./pages/Contact'));
const Notifications = lazy(() => import('./pages/Notifications'));

const AdminLayout = lazy(() => import('./pages/admin/AdminLayout'));
const AdminDashboard = lazy(() => import('./pages/admin/AdminDashboard'));
const AdminContent = lazy(() => import('./pages/admin/AdminContent'));
const AdminSubjects = lazy(() => import('./pages/admin/AdminSubjects'));
const AdminUsers = lazy(() => import('./pages/admin/AdminUsers'));
const AdminComments = lazy(() => import('./pages/admin/AdminComments'));
const AdminWebsite = lazy(() => import('./pages/admin/AdminWebsite'));

function App() {
  return (
    <BrowserRouter>
      <Toaster
        position="top-right"
        toastOptions={{
          duration: 3000,
          style: {
            background: 'var(--toast-bg, #1e293b)',
            color: '#fff',
            borderRadius: '12px',
          },
        }}
      />
      <Layout>
        <Suspense fallback={<Loading />}>
          <Routes>
            <Route path="/" element={<Home />} />
            <Route path="/search" element={<Search />} />
            <Route path="/notes/:id" element={<NoteDetail />} />
            <Route path="/subjects" element={<Subjects />} />
            <Route path="/subjects/:id" element={<SubjectDetail />} />
            <Route path="/chapters/:id" element={<ChapterDetail />} />

            <Route path="/login" element={<GuestRoute><Login /></GuestRoute>} />
            <Route path="/register" element={<GuestRoute><Register /></GuestRoute>} />
            <Route path="/verify-otp" element={<VerifyOTP />} />
            <Route path="/forgot-password" element={<GuestRoute><ForgotPassword /></GuestRoute>} />

            <Route path="/dashboard" element={<ProtectedRoute><Dashboard /></ProtectedRoute>} />
            <Route path="/settings" element={<ProtectedRoute><Settings /></ProtectedRoute>} />
            <Route path="/contact" element={<Contact />} />
            <Route path="/notifications" element={<ProtectedRoute><Notifications /></ProtectedRoute>} />

            <Route path="/admin" element={<ProtectedRoute role="admin"><AdminLayout /></ProtectedRoute>}>
              <Route index element={<AdminDashboard />} />
              <Route path="content" element={<AdminContent />} />
              <Route path="subjects" element={<AdminSubjects />} />
              <Route path="users" element={<AdminUsers />} />
              <Route path="comments" element={<AdminComments />} />
              <Route path="website" element={<AdminWebsite />} />
            </Route>
          </Routes>
        </Suspense>
      </Layout>
    </BrowserRouter>
  );
}

export default App;
