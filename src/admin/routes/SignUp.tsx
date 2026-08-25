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
  ToggleButtonGroup,
  ToggleButton,
  Divider,
  CircularProgress,
  InputAdornment,
  IconButton,
  Stack,
} from '@mui/material';
import {
  AddBusinessOutlined as CreateIcon,
  GroupAddOutlined as JoinIcon,
  PersonOutline as PersonIcon,
  EmailOutlined as EmailIcon,
  LockOutlined as LockIcon,
  VisibilityOutlined as VisibilityIcon,
  VisibilityOffOutlined as VisibilityOffIcon,
  MosqueOutlined as MosqueIcon,
  VpnKeyOutlined as KeyIcon,
} from '@mui/icons-material';
import { useForm, useWatch } from 'react-hook-form';
import { zodResolver } from '@hookform/resolvers/zod';
import { useSession } from '@/admin/store/useSession';
import { signUpFormSchema, type SignUpFormData } from '@/admin/utils/auth';
import { AuthLayout } from '@/admin/components/auth';

export function SignUp(): JSX.Element {
  const [showPassword, setShowPassword] = useState(false);
  const [showConfirmPassword, setShowConfirmPassword] = useState(false);
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

  const handleModeChange = (
    _event: React.MouseEvent<HTMLElement>,
    newMode: 'create' | 'join' | null,
  ) => {
    if (newMode) {
      setValue('mode', newMode, { shouldValidate: true });
      setError('');
    }
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
          <Box sx={{ mb: 2, textAlign: 'center' }}>
            <Typography
              variant="h6"
              component="h2"
              fontWeight={700}
              sx={{ color: 'text.primary', fontSize: '1.2rem' }}
            >
              {mode === 'create' ? 'Create Mosque Portal' : 'Join Mosque Team'}
            </Typography>
            <Typography
              variant="caption"
              color="text.secondary"
              sx={{ display: 'block', mt: 0.25 }}
            >
              {mode === 'create'
                ? 'Register your mosque and begin managing prayer displays'
                : 'Enter your 6-digit invitation code to join your team'}
            </Typography>
          </Box>

          {/* MODE TOGGLE */}
          <Box sx={{ p: 0.4, bgcolor: 'rgba(0, 0, 0, 0.04)', borderRadius: 2.5, mb: 2 }}>
            <ToggleButtonGroup
              value={mode}
              exclusive
              onChange={handleModeChange}
              fullWidth
              size="small"
              sx={{
                '& .MuiToggleButton-root': {
                  border: 'none',
                  borderRadius: 2,
                  py: 0.6,
                  fontWeight: 600,
                  fontSize: '0.82rem',
                  textTransform: 'none',
                  color: 'text.secondary',
                  transition: 'all 0.15s ease',
                  '&.Mui-selected': {
                    bgcolor: '#ffffff',
                    color: 'primary.main',
                    boxShadow: '0 2px 6px rgba(0, 0, 0, 0.06)',
                    fontWeight: 700,
                    '&:hover': { bgcolor: '#ffffff' },
                  },
                },
              }}
            >
              <ToggleButton value="create" sx={{ gap: 0.75 }}>
                <CreateIcon fontSize="small" />
                Create New Masjid
              </ToggleButton>
              <ToggleButton value="join" sx={{ gap: 0.75 }}>
                <JoinIcon fontSize="small" />
                Join with Code
              </ToggleButton>
            </ToggleButtonGroup>
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
              <TextField
                {...register('password')}
                label="Password"
                type={showPassword ? 'text' : 'password'}
                placeholder="Min. 8 characters"
                size="small"
                error={!!errors.password}
                helperText={errors.password?.message ?? ''}
                fullWidth
                autoComplete="new-password"
                disabled={loading}
                slotProps={{
                  input: {
                    startAdornment: (
                      <InputAdornment position="start">
                        <LockIcon
                          fontSize="small"
                          sx={{ color: 'text.secondary', fontSize: '1.1rem' }}
                        />
                      </InputAdornment>
                    ),
                    endAdornment: (
                      <InputAdornment position="end">
                        <IconButton
                          aria-label={showPassword ? 'Hide password' : 'Show password'}
                          onClick={() => setShowPassword((prev) => !prev)}
                          edge="end"
                          size="small"
                          sx={{ color: 'text.secondary' }}
                        >
                          {showPassword ? (
                            <VisibilityOffIcon fontSize="small" />
                          ) : (
                            <VisibilityIcon fontSize="small" />
                          )}
                        </IconButton>
                      </InputAdornment>
                    ),
                  },
                }}
              />

              <TextField
                {...register('confirmPassword')}
                label="Confirm Password"
                type={showConfirmPassword ? 'text' : 'password'}
                placeholder="Repeat password"
                size="small"
                error={!!errors.confirmPassword}
                helperText={errors.confirmPassword?.message ?? ''}
                fullWidth
                autoComplete="new-password"
                disabled={loading}
                slotProps={{
                  input: {
                    startAdornment: (
                      <InputAdornment position="start">
                        <LockIcon
                          fontSize="small"
                          sx={{ color: 'text.secondary', fontSize: '1.1rem' }}
                        />
                      </InputAdornment>
                    ),
                    endAdornment: (
                      <InputAdornment position="end">
                        <IconButton
                          aria-label={
                            showConfirmPassword ? 'Hide confirm password' : 'Show confirm password'
                          }
                          onClick={() => setShowConfirmPassword((prev) => !prev)}
                          edge="end"
                          size="small"
                          sx={{ color: 'text.secondary' }}
                        >
                          {showConfirmPassword ? (
                            <VisibilityOffIcon fontSize="small" />
                          ) : (
                            <VisibilityIcon fontSize="small" />
                          )}
                        </IconButton>
                      </InputAdornment>
                    ),
                  },
                }}
              />
            </Stack>

            {mode === 'create' ? (
              <>
                <Divider sx={{ my: 0.25 }}>
                  <Typography
                    variant="caption"
                    sx={{
                      fontWeight: 700,
                      color: 'text.secondary',
                      letterSpacing: 0.5,
                      fontSize: '0.7rem',
                    }}
                  >
                    MOSQUE INFORMATION
                  </Typography>
                </Divider>

                <Stack direction={{ xs: 'column', sm: 'row' }} spacing={1.5}>
                  <TextField
                    {...register('masjidName_en')}
                    label="Mosque Name (English)"
                    placeholder="e.g. Masjid Al-Noor"
                    size="small"
                    error={!!errors.masjidName_en}
                    helperText={errors.masjidName_en?.message ?? ''}
                    fullWidth
                    disabled={loading}
                    slotProps={{
                      input: {
                        startAdornment: (
                          <InputAdornment position="start">
                            <MosqueIcon
                              fontSize="small"
                              sx={{ color: 'text.secondary', fontSize: '1.1rem' }}
                            />
                          </InputAdornment>
                        ),
                      },
                    }}
                  />

                  <TextField
                    {...register('masjidName_ar')}
                    label="Mosque Name (Arabic)"
                    placeholder="مسجد النور"
                    size="small"
                    error={!!errors.masjidName_ar}
                    helperText={errors.masjidName_ar?.message ?? ''}
                    fullWidth
                    dir="rtl"
                    disabled={loading}
                    slotProps={{
                      input: {
                        startAdornment: (
                          <InputAdornment position="start">
                            <MosqueIcon
                              fontSize="small"
                              sx={{ color: 'text.secondary', fontSize: '1.1rem' }}
                            />
                          </InputAdornment>
                        ),
                      },
                    }}
                  />
                </Stack>
              </>
            ) : (
              <>
                <Divider sx={{ my: 0.25 }}>
                  <Typography
                    variant="caption"
                    sx={{
                      fontWeight: 700,
                      color: 'text.secondary',
                      letterSpacing: 0.5,
                      fontSize: '0.7rem',
                    }}
                  >
                    TEAM INVITATION
                  </Typography>
                </Divider>

                <TextField
                  {...register('inviteCode')}
                  label="6-Digit Invite Code"
                  placeholder="123456"
                  size="small"
                  error={!!errors.inviteCode}
                  helperText={
                    errors.inviteCode?.message ??
                    'Enter the 6-digit code shared by your mosque administrator'
                  }
                  fullWidth
                  disabled={loading}
                  slotProps={{
                    htmlInput: {
                      maxLength: 6,
                      style: {
                        letterSpacing: 6,
                        fontFamily: 'monospace',
                        fontWeight: 700,
                        textAlign: 'center',
                      },
                    },
                    input: {
                      startAdornment: (
                        <InputAdornment position="start">
                          <KeyIcon
                            fontSize="small"
                            sx={{ color: 'text.secondary', fontSize: '1.1rem' }}
                          />
                        </InputAdornment>
                      ),
                    },
                  }}
                />
              </>
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
