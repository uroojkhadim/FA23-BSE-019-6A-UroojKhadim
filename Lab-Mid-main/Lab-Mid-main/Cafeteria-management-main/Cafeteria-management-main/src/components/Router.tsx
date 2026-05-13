import { createBrowserRouter, RouterProvider, Navigate, Outlet } from 'react-router-dom';
import { ScrollToTop } from '@/lib/scroll-to-top';
import ErrorPage from '@/integrations/errorHandlers/ErrorPage';
import HomePage from '@/components/pages/HomePage';
import MenuPage from '@/components/pages/MenuPage';
import MenuItemDetailPage from '@/components/pages/MenuItemDetailPage';
import OrdersPage from '@/components/pages/OrdersPage';
import POSPage from '@/components/pages/POSPage';
import AdminPage from '@/components/pages/AdminPage';
import LoginPage from '@/components/pages/LoginPage';
import RegisterPage from '@/components/pages/RegisterPage';
import ForgotPasswordPage from '@/components/pages/ForgotPasswordPage';
import PhoneLoginPage from '@/components/pages/PhoneLoginPage';
import DashboardPage from '@/components/pages/DashboardPage';
import UnauthorizedPage from '@/components/pages/UnauthorizedPage';
import ProtectedRoute from '@/components/ProtectedRoute';
import PublicRoute from '@/components/PublicRoute';
import RoleBasedRedirect from '@/components/RoleBasedRedirect';
import DashboardLayout from '@/components/DashboardLayout';
import CreditPage from '@/components/pages/CreditPage';
import NotificationsPage from '@/components/pages/NotificationsPage';
import ProfilePage from '@/components/pages/ProfilePage';
import AddMenuPage from '@/components/pages/AddMenuPage';
import CreateOrderPage from '@/components/pages/CreateOrderPage';


// Layout component that includes ScrollToTop
function Layout() {
  return (
    <>
      <ScrollToTop />
      <Outlet />
    </>
  );
}

const router = createBrowserRouter([
  {
    path: "/",
    element: <Layout />,
    errorElement: <ErrorPage />,
    children: [
      {
        index: true,
        element: <RoleBasedRedirect />,
      },
      {
        path: "login",
        element: <PublicRoute><LoginPage /></PublicRoute>,
      },
      {
        path: "phone-login",
        element: <PublicRoute><PhoneLoginPage /></PublicRoute>,
      },
      {
        path: "register",
        element: <PublicRoute><RegisterPage /></PublicRoute>,
      },
      {
        path: "forgot-password",
        element: <PublicRoute><ForgotPasswordPage /></PublicRoute>,
      },
      {
        path: "unauthorized",
        element: <UnauthorizedPage />,
      },
      {
        element: <ProtectedRoute><DashboardLayout /></ProtectedRoute>,
        children: [
          {
            path: "dashboard",
            element: <DashboardPage />,
          },
          {
            path: "menu",
            element: <MenuPage />,
          },
          {
            path: "menu/:id",
            element: <MenuItemDetailPage />,
          },
          {
            path: "orders",
            element: <OrdersPage />,
          },
          {
            path: "credit",

            element: (
              <ProtectedRoute allowedRoles={['student', 'teacher', 'university_staff']}>
                <CreditPage />
              </ProtectedRoute>
            ),
          },
          {
            path: "notifications",
            element: <NotificationsPage />,
          },
          {
            path: "profile",
            element: <ProfilePage />,
          },
          {
            path: "pos",
            element: (
              <ProtectedRoute allowedRoles={['admin', 'staff']}>
                <POSPage />
              </ProtectedRoute>
            ),
          },
          {
            path: "admin",
            element: (
              <ProtectedRoute allowedRoles={['admin', 'super_admin']}>
                <AdminPage />
              </ProtectedRoute>
            ),
          },
          {
            path: "add-menu",
            element: (
              <ProtectedRoute allowedRoles={['admin', 'super_admin']}>
                <AddMenuPage />
              </ProtectedRoute>
            ),
          },
          {
            path: "create-order",
            element: (
              <ProtectedRoute allowedRoles={['admin', 'super_admin', 'staff']}>
                <CreateOrderPage />
              </ProtectedRoute>
            ),
          },
          // Role-specific dashboard routes
          {
            path: "super-admin/dashboard",
            element: (
              <ProtectedRoute allowedRoles={['super_admin']}>
                <DashboardPage />
              </ProtectedRoute>
            ),
          },
          {
            path: "admin/dashboard",
            element: (
              <ProtectedRoute allowedRoles={['admin']}>
                <DashboardPage />
              </ProtectedRoute>
            ),
          },
          {
            path: "teacher/dashboard",
            element: (
              <ProtectedRoute allowedRoles={['teacher']}>
                <DashboardPage />
              </ProtectedRoute>
            ),
          },
          {
            path: "university-staff/dashboard",
            element: (
              <ProtectedRoute allowedRoles={['university_staff']}>
                <DashboardPage />
              </ProtectedRoute>
            ),
          },
          {
            path: "student/dashboard",
            element: (
              <ProtectedRoute allowedRoles={['student']}>
                <DashboardPage />
              </ProtectedRoute>
            ),
          },
          {
            path: "staff/dashboard",
            element: (
              <ProtectedRoute allowedRoles={['staff']}>
                <DashboardPage />
              </ProtectedRoute>
            ),
          },


        ]
      },
      {
        path: "*",
        element: <Navigate to="/" replace />,
      },
    ],
  },
], {
  basename: import.meta.env.VITE_BASE_NAME || "/",
});

export default function AppRouter() {
  return <RouterProvider router={router} />;
}

