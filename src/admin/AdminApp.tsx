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
import { AdminLayout } from '@/admin/components/AdminLayout';
import { SignIn } from '@/admin/routes/SignIn';
import { SignUp } from '@/admin/routes/SignUp';
import { Devices } from '@/admin/routes/Devices';
import { Preview } from '@/admin/routes/Preview';
import { Timings } from '@/admin/routes/Timings';
import { ContentStub, ImagesStub, SetupsStub } from '@/admin/routes/Stubs';

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
                <Route path="/" element={<Navigate to="/devices" replace />} />
                <Route path="/devices" element={<Devices />} />
                <Route path="/timings" element={<Timings />} />
                <Route path="/content" element={<ContentStub />} />
                <Route path="/images" element={<ImagesStub />} />
                <Route path="/setups" element={<SetupsStub />} />
                <Route path="/preview" element={<Preview />} />
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
        <RouterProvider router={router} />
      </LocalizationProvider>
    </ThemeProvider>
  );
}

