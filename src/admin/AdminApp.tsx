import { useMemo } from 'react';
import { ThemeProvider } from '@mui/material/styles';
import CssBaseline from '@mui/material/CssBaseline';
import {
  createBrowserRouter,
  RouterProvider,
  createRoutesFromElements,
  Route,
  Navigate,
} from 'react-router-dom';
import { LocalizationProvider } from '@mui/x-date-pickers/LocalizationProvider';
import { AdapterDayjs } from '@mui/x-date-pickers/AdapterDayjs';
import { adminTheme } from '@/admin/theme/adminTheme';
import { AuthGate } from '@/admin/components/AuthGate';
import { RoleGate } from '@/admin/components/RoleGate';
import { AdminLayout } from '@/admin/components/layout';
import { SignIn } from '@/admin/routes/SignIn';
import { SignUp } from '@/admin/routes/SignUp';
import { Devices } from '@/admin/routes/Devices';
import { Timings } from '@/admin/routes/Timings';
import { Content } from '@/admin/routes/Content';
import { Images } from '@/admin/routes/Images';
import { DisplaySettings } from '@/admin/routes/DisplaySettings';
import { Team } from '@/admin/routes/Team';
import { NotAuthorized } from '@/admin/routes/NotAuthorized';
import { ToastProvider } from '@/admin/components/ToastProvider';
import { useSession } from '@/admin/store/useSession';
import { hasPermission } from '@/admin/utils/permissions';

function IndexRedirect() {
  const role = useSession((s) => s.session?.user?.role);
  const target = hasPermission(role, 'devices:manage') ? '/devices' : '/content';
  return <Navigate to={target} replace />;
}

export function AdminApp() {
  const adminBasename = `${import.meta.env.BASE_URL}admin`.replace(/\/+/g, '/');

  const router = useMemo(
    () =>
      createBrowserRouter(
        createRoutesFromElements(
          <>
            <Route path="/signin" element={<SignIn />} />
            <Route path="/signup" element={<SignUp />} />
            <Route element={<AuthGate />}>
              <Route element={<AdminLayout />}>
                <Route path="/" element={<IndexRedirect />} />
                <Route
                  path="/devices"
                  element={
                    <RoleGate permission="devices:manage">
                      <Devices />
                    </RoleGate>
                  }
                />
                <Route
                  path="/timings"
                  element={
                    <RoleGate permission="timings:manage">
                      <Timings />
                    </RoleGate>
                  }
                />
                <Route
                  path="/content"
                  element={
                    <RoleGate permission="content:manage">
                      <Content />
                    </RoleGate>
                  }
                />
                <Route
                  path="/images"
                  element={
                    <RoleGate permission="images:manage">
                      <Images />
                    </RoleGate>
                  }
                />
                <Route
                  path="/settings"
                  element={
                    <RoleGate permission="settings:manage">
                      <DisplaySettings />
                    </RoleGate>
                  }
                />
                <Route
                  path="/team"
                  element={
                    <RoleGate permission="team:manage">
                      <Team />
                    </RoleGate>
                  }
                />
                <Route path="/not-authorized" element={<NotAuthorized />} />
                <Route path="/setups" element={<Navigate to="/settings" replace />} />
              </Route>
            </Route>
            <Route path="*" element={<Navigate to="/" replace />} />
          </>
        ),
        { basename: adminBasename }
      ),
    [adminBasename]
  );

  return (
    <ThemeProvider theme={adminTheme}>
      <LocalizationProvider dateAdapter={AdapterDayjs}>
        <CssBaseline />
        <ToastProvider>
          <RouterProvider router={router} />
        </ToastProvider>
      </LocalizationProvider>
    </ThemeProvider>
  );
}

