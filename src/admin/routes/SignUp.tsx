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
} from '@mui/material';
import {
  AddBusinessOutlined as CreateIcon,
  GroupAddOutlined as JoinIcon,
} from '@mui/icons-material';
import { useForm, useWatch } from 'react-hook-form';
import { zodResolver } from '@hookform/resolvers/zod';
import { useSession } from '@/admin/store/useSession';
import { signUpFormSchema, type SignUpFormData } from '@/admin/utils/auth';

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
          maxWidth: 480,
          width: '100%',
          border: 1,
          borderColor: 'divider',
          borderRadius: 3,
        }}
      >
        <CardContent sx={{ p: { xs: 3, sm: 4 } }}>
          <Typography variant="h5" component="h1" fontWeight={700} gutterBottom align="center">
            {mode === 'create' ? 'Create Mosque Portal' : 'Join Mosque Team'}
          </Typography>
          <Typography variant="body2" color="text.secondary" align="center" sx={{ mb: 3 }}>
            {mode === 'create'
              ? 'Register your mosque and start managing displays'
              : 'Enter your invite code to join an existing team'}
          </Typography>

          <ToggleButtonGroup
            value={mode}
            exclusive
            onChange={handleModeChange}
            fullWidth
            size="small"
            sx={{ mb: 3 }}
          >
            <ToggleButton
              value="create"
              sx={{ textTransform: 'none', gap: 1, py: 1, fontWeight: 600 }}
            >
              <CreateIcon fontSize="small" />
              Create Masjid
            </ToggleButton>
            <ToggleButton
              value="join"
              sx={{ textTransform: 'none', gap: 1, py: 1, fontWeight: 600 }}
            >
              <JoinIcon fontSize="small" />
              Join with Code
            </ToggleButton>
          </ToggleButtonGroup>

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
              {...register('name')}
              label="Full Name"
              placeholder="e.g. Bilal ibn Rabah"
              error={!!errors.name}
              helperText={errors.name?.message ?? ''}
              fullWidth
              autoComplete="name"
              disabled={loading}
            />

            <TextField
              {...register('email')}
              label="Email"
              type="email"
              placeholder="you@example.org"
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
              autoComplete="new-password"
              disabled={loading}
            />

            <TextField
              {...register('confirmPassword')}
              label="Confirm Password"
              type="password"
              placeholder="Repeat your password"
              error={!!errors.confirmPassword}
              helperText={errors.confirmPassword?.message ?? ''}
              fullWidth
              autoComplete="new-password"
              disabled={loading}
            />

            {mode === 'create' ? (
              <>
                <Divider sx={{ my: 1 }}>
                  <Typography variant="caption" color="text.secondary" sx={{ fontWeight: 600 }}>
                    MOSQUE INFORMATION
                  </Typography>
                </Divider>

                <TextField
                  {...register('masjidName_en')}
                  label="Mosque Name (English)"
                  placeholder="e.g. Masjid Al-Noor"
                  error={!!errors.masjidName_en}
                  helperText={errors.masjidName_en?.message ?? ''}
                  fullWidth
                  disabled={loading}
                />

                <TextField
                  {...register('masjidName_ar')}
                  label="Mosque Name (Arabic)"
                  placeholder="e.g. مسجد النور"
                  error={!!errors.masjidName_ar}
                  helperText={errors.masjidName_ar?.message ?? ''}
                  fullWidth
                  dir="rtl"
                  disabled={loading}
                />
              </>
            ) : (
              <>
                <Divider sx={{ my: 1 }}>
                  <Typography variant="caption" color="text.secondary" sx={{ fontWeight: 600 }}>
                    INVITATION
                  </Typography>
                </Divider>

                <TextField
                  {...register('inviteCode')}
                  label="6-Digit Invite Code"
                  placeholder="123456"
                  error={!!errors.inviteCode}
                  helperText={errors.inviteCode?.message ?? 'Provided by your mosque administrator'}
                  fullWidth
                  inputProps={{ maxLength: 6 }}
                  disabled={loading}
                />
              </>
            )}

            <Button
              type="submit"
              variant="contained"
              fullWidth
              size="large"
              disabled={loading || !isValid}
              startIcon={loading ? <CircularProgress size={18} color="inherit" /> : null}
              sx={{ mt: 1, py: 1.2, fontWeight: 600 }}
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

          <Divider sx={{ my: 3 }} />

          <Typography variant="body2" sx={{ textAlign: 'center', color: 'text.secondary' }}>
            Already have an account?{' '}
            <Link component={RouterLink} to="/signin" fontWeight={600}>
              Sign in
            </Link>
          </Typography>
        </CardContent>
      </Card>
    </Box>
  );
}
