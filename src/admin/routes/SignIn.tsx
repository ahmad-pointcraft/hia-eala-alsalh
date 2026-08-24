import { useState } from 'react';
import { useNavigate, Link as RouterLink } from 'react-router-dom';
import {
  Box,
  Card,
  CardContent,
  TextField,
  Button,
  Typography,
  Link,
  Alert,
  Divider,
  Chip,
  Stack,
  CircularProgress,
} from '@mui/material';
import { useForm } from 'react-hook-form';
import { zodResolver } from '@hookform/resolvers/zod';
import { useSession } from '@/admin/store/useSession';
import { authFormSchema, type AuthFormData } from '@/admin/utils/auth';

const IS_MOCK_ENV =
  import.meta.env.VITE_MOCK === 'true' ||
  import.meta.env.VITE_API_ADAPTER === 'mock' ||
  !import.meta.env.VITE_API_ADAPTER;

export function SignIn(): JSX.Element {
  const {
    register,
    handleSubmit,
    setValue,
    formState: { errors, isValid },
  } = useForm<AuthFormData>({
    resolver: zodResolver(authFormSchema),
    mode: 'onBlur',
  });

  const [error, setError] = useState('');
  const [loading, setLoading] = useState(false);
  const signIn = useSession((s) => s.signIn);
  const navigate = useNavigate();

  async function onSubmit(data: AuthFormData) {
    setError('');
    setLoading(true);
    try {
      await signIn(data.email, data.password);
      navigate('/');
    } catch (err) {
      setError(err instanceof Error ? err.message : 'Invalid email or password');
    } finally {
      setLoading(false);
    }
  }

  function fillDemo(email: string, pass: string) {
    setValue('email', email, { shouldValidate: true, shouldDirty: true });
    setValue('password', pass, { shouldValidate: true, shouldDirty: true });
    setError('');
  }

  return (
    <Box
      sx={{
        display: 'flex',
        justifyContent: 'center',
        alignItems: 'center',
        minHeight: '100vh',
        p: 2,
        bgcolor: 'background.default',
      }}
    >
      <Card
        elevation={0}
        sx={{
          maxWidth: 420,
          width: '100%',
          border: 1,
          borderColor: 'divider',
          borderRadius: 3,
        }}
      >
        <CardContent sx={{ p: { xs: 3, sm: 4 } }}>
          <Typography variant="h5" component="h1" fontWeight={700} gutterBottom align="center">
            Admin Sign In
          </Typography>
          <Typography variant="body2" color="text.secondary" align="center" sx={{ mb: 3 }}>
            Enter your mosque management credentials
          </Typography>

          {error && (
            <Alert severity="error" sx={{ mb: 2.5, borderRadius: 2 }}>
              {error}
            </Alert>
          )}

          <Box
            component="form"
            onSubmit={handleSubmit(onSubmit)}
            sx={{ display: 'flex', flexDirection: 'column', gap: 2 }}
          >
            <TextField
              {...register('email')}
              label="Email"
              type="email"
              placeholder="admin@example.org"
              error={!!errors.email}
              helperText={errors.email?.message ?? ''}
              fullWidth
              autoComplete="email"
              disabled={loading}
            />

            <TextField
              {...register('password')}
              label="Password"
              type="password"
              placeholder="Min. 8 characters"
              error={!!errors.password}
              helperText={errors.password?.message ?? ''}
              fullWidth
              autoComplete="current-password"
              disabled={loading}
            />

            <Button
              type="submit"
              variant="contained"
              fullWidth
              size="large"
              disabled={loading || !isValid}
              startIcon={loading ? <CircularProgress size={18} color="inherit" /> : null}
              sx={{ mt: 1, py: 1.2, fontWeight: 600 }}
            >
              {loading ? 'Signing in…' : 'Sign In'}
            </Button>
          </Box>

          {IS_MOCK_ENV && (
            <Box sx={{ mt: 3, pt: 2, borderTop: 1, borderColor: 'divider' }}>
              <Typography
                variant="caption"
                color="text.secondary"
                sx={{ display: 'block', mb: 1, fontWeight: 600, textTransform: 'uppercase', letterSpacing: 0.5 }}
              >
                Demo Quick-Fill:
              </Typography>
              <Stack direction="row" spacing={1}>
                <Chip
                  label="Admin (All Access)"
                  size="small"
                  variant="outlined"
                  clickable
                  onClick={() => fillDemo('admin@alnoor.org', 'admin1234')}
                  sx={{ fontSize: '0.75rem', fontWeight: 600 }}
                />
                <Chip
                  label="Editor (Content Only)"
                  size="small"
                  variant="outlined"
                  clickable
                  onClick={() => fillDemo('editor@alnoor.org', 'editor1234')}
                  sx={{ fontSize: '0.75rem', fontWeight: 600 }}
                />
              </Stack>
            </Box>
          )}

          <Divider sx={{ my: 3 }} />

          <Typography variant="body2" sx={{ textAlign: 'center', color: 'text.secondary' }}>
            No account yet?{' '}
            <Link component={RouterLink} to="/signup" fontWeight={600}>
              Sign up
            </Link>
          </Typography>
        </CardContent>
      </Card>
    </Box>
  );
}
