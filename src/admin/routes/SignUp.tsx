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
  CircularProgress,
  InputAdornment,
  Stack,
} from '@mui/material';
import {
  PersonOutline as PersonIcon,
  EmailOutlined as EmailIcon,
} from '@mui/icons-material';
import { useForm, useWatch } from 'react-hook-form';
import { zodResolver } from '@hookform/resolvers/zod';
import { useSession } from '@/admin/store/useSession';
import { signUpFormSchema, type SignUpFormData } from '@/admin/utils/auth';
import {
  AuthLayout,
  PasswordField,
  SignUpModeToggle,
  CreateMosqueFields,
  JoinTeamFields,
} from '@/admin/components/auth';

export function SignUp(): JSX.Element {
  const [error, setError] = useState('');
  const [loading, setLoading] = useState(false);
  const signUp = useSession((s) => s.signUp);
  const navigate = useNavigate();

  const {
    register,
    handleSubmit,
    setValue,
    control,
    formState: { errors, isValid },
  } = useForm<SignUpFormData>({
    resolver: zodResolver(signUpFormSchema),
    mode: 'onBlur',
    defaultValues: {
      mode: 'create',
      name: '',
      email: '',
      password: '',
      confirmPassword: '',
      masjidName_en: '',
      masjidName_ar: '',
      inviteCode: '',
    },
  });

  const mode = useWatch({ control, name: 'mode' }) ?? 'create';

  const handleModeChange = (newMode: 'create' | 'join') => {
    setValue('mode', newMode, { shouldValidate: true });
    setError('');
  };

  async function onSubmit(data: SignUpFormData) {
    setError('');
    setLoading(true);
    try {
      if (data.mode === 'create') {
        await signUp({
          mode: 'create',
          name: data.name,
          email: data.email,
          password: data.password,
          masjidName_en: data.masjidName_en ?? '',
          masjidName_ar: data.masjidName_ar ?? '',
        });
      } else {
        await signUp({
          mode: 'join',
          name: data.name,
          email: data.email,
          password: data.password,
          inviteCode: data.inviteCode ?? '',
        });
      }
      navigate('/');
    } catch (err) {
      setError(err instanceof Error ? err.message : 'Sign-up failed. Please try again.');
    } finally {
      setLoading(false);
    }
  }

  return (
    <AuthLayout maxWidth="sm">
      <Card
        elevation={0}
        sx={{
          maxWidth: 540,
          width: '100%',
          mx: 'auto',
          borderRadius: 3,
          border: '1px solid rgba(0, 0, 0, 0.08)',
          boxShadow: '0 16px 36px -12px rgba(0, 0, 0, 0.06), 0 1px 3px 0 rgba(0, 0, 0, 0.04)',
          bgcolor: '#ffffff',
        }}
      >
        <CardContent sx={{ p: { xs: 2.5, sm: 3 } }}>
          <SignUpModeToggle mode={mode} onChange={handleModeChange} />

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
            sx={{ display: 'flex', flexDirection: 'column', gap: 1.5 }}
          >
            <Stack direction={{ xs: 'column', sm: 'row' }} spacing={1.5}>
              <TextField
                {...register('name')}
                label="Full Name"
                placeholder="e.g. Bilal ibn Rabah"
                size="small"
                error={!!errors.name}
                helperText={errors.name?.message ?? ''}
                fullWidth
                autoComplete="name"
                disabled={loading}
                slotProps={{
                  input: {
                    startAdornment: (
                      <InputAdornment position="start">
                        <PersonIcon
                          fontSize="small"
                          sx={{ color: 'text.secondary', fontSize: '1.1rem' }}
                        />
                      </InputAdornment>
                    ),
                  },
                }}
              />

              <TextField
                {...register('email')}
                label="Email Address"
                type="email"
                placeholder="you@example.org"
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
                        <EmailIcon
                          fontSize="small"
                          sx={{ color: 'text.secondary', fontSize: '1.1rem' }}
                        />
                      </InputAdornment>
                    ),
                  },
                }}
              />
            </Stack>

            <Stack direction={{ xs: 'column', sm: 'row' }} spacing={1.5}>
              <PasswordField
                {...register('password')}
                label="Password"
                placeholder="Min. 8 characters"
                size="small"
                error={!!errors.password}
                helperText={errors.password?.message ?? ''}
                fullWidth
                autoComplete="new-password"
                disabled={loading}
              />

              <PasswordField
                {...register('confirmPassword')}
                label="Confirm Password"
                placeholder="Repeat password"
                size="small"
                error={!!errors.confirmPassword}
                helperText={errors.confirmPassword?.message ?? ''}
                fullWidth
                autoComplete="new-password"
                disabled={loading}
                showPasswordLabel="Show confirm password"
                hidePasswordLabel="Hide confirm password"
              />
            </Stack>

            {mode === 'create' ? (
              <CreateMosqueFields
                register={register}
                errors={errors}
                disabled={loading}
              />
            ) : (
              <JoinTeamFields
                register={register}
                errors={errors}
                disabled={loading}
              />
            )}

            <Button
              type="submit"
              variant="contained"
              fullWidth
              disabled={loading || !isValid}
              startIcon={loading ? <CircularProgress size={16} color="inherit" /> : null}
              sx={{
                mt: 0.75,
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
              {loading
                ? mode === 'create'
                  ? 'Creating Mosque…'
                  : 'Joining Team…'
                : mode === 'create'
                  ? 'Create Mosque & Admin Account'
                  : 'Join Team'}
            </Button>
          </Box>

          <Divider sx={{ my: 2 }} />

          <Typography
            variant="body2"
            sx={{ textAlign: 'center', color: 'text.secondary', fontSize: '0.82rem' }}
          >
            Already have an account?{' '}
            <Link
              component={RouterLink}
              to="/signin"
              fontWeight={700}
              sx={{
                color: 'primary.main',
                textDecoration: 'none',
                '&:hover': { textDecoration: 'underline' },
              }}
            >
              Sign in
            </Link>
          </Typography>
        </CardContent>
      </Card>
    </AuthLayout>
  );
}
