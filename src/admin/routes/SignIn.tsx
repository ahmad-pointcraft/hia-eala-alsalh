import { useState } from 'react';
import { useNavigate, Link as RouterLink } from 'react-router-dom';
import { Box, Card, CardContent, TextField, Button, Typography, Link, Alert } from '@mui/material';
import { useForm } from 'react-hook-form';
import { zodResolver } from '@hookform/resolvers/zod';
import { useSession } from '@/admin/store/useSession';
import { authFormSchema } from '@/admin/utils/auth';

export function SignIn() {
  const { register, handleSubmit, formState: { errors, isValid } } = useForm({
    resolver: zodResolver(authFormSchema),
    mode: 'onBlur',
  });
  const [error, setError] = useState('');
  const [loading, setLoading] = useState(false);
  const signIn = useSession((s) => s.signIn);
  const navigate = useNavigate();

  async function onSubmit(data: { email: string; password: string }) {
    setError('');
    setLoading(true);
    try {
      await signIn(data.email, data.password);
      navigate('/');
    } catch {
      setError('Sign-in failed. Check your credentials.');
    } finally {
      setLoading(false);
    }
  }

  return (
    <Box sx={{ display: 'flex', justifyContent: 'center', alignItems: 'center', minHeight: '100vh' }}>
      <Card sx={{ maxWidth: 400, width: '100%' }}>
        <CardContent sx={{ p: 4 }}>
          <Typography variant="h5" gutterBottom align="center">
            Admin Sign In
          </Typography>
          {error && <Alert severity="error" sx={{ mb: 2 }}>{error}</Alert>}
          <Box component="form" onSubmit={handleSubmit(onSubmit)} sx={{ display: 'flex', flexDirection: 'column', gap: 2 }}>
            <TextField
              {...register('email')}
              label="Email"
              type="email"
              error={!!errors.email}
              helperText={errors.email?.message ?? ''}
              fullWidth
            />
            <TextField
              {...register('password')}
              label="Password"
              type="password"
              error={!!errors.password}
              helperText={errors.password?.message ?? ''}
              fullWidth
            />
            <Button type="submit" variant="contained" fullWidth disabled={loading || !isValid}>
              {loading ? 'Signing in…' : 'Sign In'}
            </Button>
          </Box>
          <Typography sx={{ mt: 2, textAlign: 'center' }}>
            No account?{' '}
            <Link component={RouterLink} to="/signup">Sign up</Link>
          </Typography>
        </CardContent>
      </Card>
    </Box>
  );
}
