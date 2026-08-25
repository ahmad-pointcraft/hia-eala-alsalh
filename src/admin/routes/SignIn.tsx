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
  InputAdornment,
} from '@mui/material';
import {
  EmailOutlined as EmailIcon,
  FlashOnOutlined as QuickFillIcon,
} from '@mui/icons-material';
import { useForm } from 'react-hook-form';
import { zodResolver } from '@hookform/resolvers/zod';
import { useSession } from '@/admin/store/useSession';
import { authFormSchema, type AuthFormData } from '@/admin/utils/auth';
import { AuthLayout, PasswordField } from '@/admin/components/auth';

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
    <AuthLayout maxWidth="xs">
      <Card
        elevation={0}
        sx={{
          maxWidth: 420,
          width: '100%',
          mx: 'auto',
          borderRadius: 3,
          border: '1px solid rgba(0, 0, 0, 0.08)',
          boxShadow: '0 16px 36px -12px rgba(0, 0, 0, 0.06), 0 1px 3px 0 rgba(0, 0, 0, 0.04)',
          bgcolor: '#ffffff',
        }}
      >
        <CardContent sx={{ p: { xs: 2.5, sm: 3.5 } }}>
          <Box sx={{ mb: 2.5, textAlign: 'center' }}>
            <Typography variant="h6" component="h2" fontWeight={700} sx={{ color: 'text.primary', fontSize: '1.2rem' }}>
              Admin Sign In
            </Typography>
            <Typography variant="caption" color="text.secondary" sx={{ display: 'block', mt: 0.25 }}>
              Enter your credentials to access the admin portal
            </Typography>
          </Box>

          {error && (
            <Alert
              severity="error"
              sx={{
                mb: 2,
                py: 0.5,
                borderRadius: 2,
                fontSize: '0.85rem',
                '& .MuiAlert-message': { fontWeight: 500 },
              }}
            >
              {error}
            </Alert>
          )}

          <Box
            component="form"
            onSubmit={handleSubmit(onSubmit)}
            sx={{ display: 'flex', flexDirection: 'column', gap: 1.75 }}
          >
            <TextField
              {...register('email')}
              label="Email Address"
              type="email"
              placeholder="admin@alnoor.org"
              size="small"
              error={!!errors.email}
              helperText={errors.email?.message ?? ''}
              fullWidth
              autoComplete="email"
              disabled={loading}
              slotProps={{
                input: {
                  startAdornment: (
                    <InputAdornment position="start">
                      <EmailIcon fontSize="small" sx={{ color: 'text.secondary', fontSize: '1.1rem' }} />
                    </InputAdornment>
                  ),
                },
              }}
            />

            <PasswordField
              {...register('password')}
              label="Password"
              placeholder="••••••••"
              size="small"
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
              disabled={loading || !isValid}
              startIcon={loading ? <CircularProgress size={16} color="inherit" /> : null}
              sx={{
                mt: 0.5,
                py: 1.1,
                fontSize: '0.9rem',
                fontWeight: 700,
                borderRadius: 2,
                boxShadow: '0 3px 10px rgba(46, 125, 50, 0.22)',
                '&:hover': {
                  boxShadow: '0 5px 14px rgba(46, 125, 50, 0.32)',
                },
              }}
            >
              {loading ? 'Signing in…' : 'Sign In'}
            </Button>
          </Box>

          {IS_MOCK_ENV && (
            <Box
              sx={{
                mt: 2.5,
                p: 1.5,
                borderRadius: 2,
                bgcolor: 'rgba(46, 125, 50, 0.04)',
                border: '1px dashed rgba(46, 125, 50, 0.2)',
              }}
            >
              <Stack direction="row" alignItems="center" spacing={0.75} sx={{ mb: 1 }}>
                <QuickFillIcon sx={{ fontSize: 14, color: 'primary.main' }} />
                <Typography
                  variant="caption"
                  sx={{ fontWeight: 700, textTransform: 'uppercase', letterSpacing: 0.5, color: 'primary.dark', fontSize: '0.7rem' }}
                >
                  Quick Demo Accounts
                </Typography>
              </Stack>
              <Stack direction="row" spacing={1}>
                <Chip
                  label="Admin"
                  size="small"
                  clickable
                  onClick={() => fillDemo('admin@alnoor.org', 'admin1234')}
                  sx={{
                    flex: 1,
                    fontWeight: 600,
                    fontSize: '0.75rem',
                    bgcolor: '#ffffff',
                    border: '1px solid rgba(0, 0, 0, 0.12)',
                    '&:hover': { bgcolor: 'rgba(46, 125, 50, 0.08)', borderColor: 'primary.main' },
                  }}
                />
                <Chip
                  label="Editor"
                  size="small"
                  clickable
                  onClick={() => fillDemo('editor@alnoor.org', 'editor1234')}
                  sx={{
                    flex: 1,
                    fontWeight: 600,
                    fontSize: '0.75rem',
                    bgcolor: '#ffffff',
                    border: '1px solid rgba(0, 0, 0, 0.12)',
                    '&:hover': { bgcolor: 'rgba(46, 125, 50, 0.08)', borderColor: 'primary.main' },
                  }}
                />
              </Stack>
            </Box>
          )}

          <Divider sx={{ my: 2 }} />

          <Typography variant="body2" sx={{ textAlign: 'center', color: 'text.secondary', fontSize: '0.82rem' }}>
            Don't have an account?{' '}
            <Link
              component={RouterLink}
              to="/signup"
              fontWeight={700}
              sx={{
                color: 'primary.main',
                textDecoration: 'none',
                '&:hover': { textDecoration: 'underline' },
              }}
            >
              Sign up
            </Link>
          </Typography>
        </CardContent>
      </Card>
    </AuthLayout>
  );
}
