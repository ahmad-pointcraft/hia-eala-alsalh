import { ThemeProvider } from '@mui/material/styles';
import CssBaseline from '@mui/material/CssBaseline';
import { BrowserRouter, Routes, Route, Navigate } from 'react-router-dom';
import { adminTheme } from '@/admin/theme/adminTheme';
import { AuthGate } from '@/admin/components/AuthGate';
import { SignIn } from '@/admin/routes/SignIn';
import { SignUp } from '@/admin/routes/SignUp';
import { Dashboard } from '@/admin/routes/Dashboard';

export function AdminApp() {
  return (
    <ThemeProvider theme={adminTheme}>
      <CssBaseline />
      <BrowserRouter basename="/admin">
        <Routes>
          <Route path="/signin" element={<SignIn />} />
          <Route path="/signup" element={<SignUp />} />
          <Route element={<AuthGate />}>
            <Route path="/" element={<Dashboard />} />
          </Route>
          <Route path="*" element={<Navigate to="/" replace />} />
        </Routes>
      </BrowserRouter>
    </ThemeProvider>
  );
}
