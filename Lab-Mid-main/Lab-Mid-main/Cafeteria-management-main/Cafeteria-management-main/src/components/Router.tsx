import { MemberProvider } from '@/integrations';
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
import PhoneLoginPage from '@/components/pages/PhoneLoginPage';
import DashboardPage from '@/components/pages/DashboardPage';
import RoleRoute from '@/components/RoleRoute';

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
        element: <HomePage />,
      },
      {
        path: "menu",
        element: (
          <RoleRoute roles={['student']} allowGuest>
            <MenuPage />
          </RoleRoute>
        ),
      },
      {
        path: "menu/:id",
        element: <MenuItemDetailPage />,
      },
      {
        path: "orders",
        element: (
          <RoleRoute roles={['student', 'admin']}>
            <OrdersPage />
          </RoleRoute>
        ),
      },
      {
        path: "pos",
        element: (
          <RoleRoute roles={['admin']}>
            <POSPage />
          </RoleRoute>
        ),
      },
      {
        path: "admin",
        element: (
          <RoleRoute roles={['admin']}>
            <AdminPage />
          </RoleRoute>
        ),
      },
      {
        path: "login",
        element: <LoginPage />,
      },
      {
        path: "phone-login",
        element: <PhoneLoginPage />,
      },
      {
        path: "register",
        element: <RegisterPage />,
      },
      {
        path: "dashboard",
        element: <DashboardPage />,
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
  return (
    <MemberProvider>
      <RouterProvider router={router} />
    </MemberProvider>
  );
}
