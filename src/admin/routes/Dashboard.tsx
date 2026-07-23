import { useNavigate } from 'react-router-dom';
import Box from '@mui/material/Box';
import Typography from '@mui/material/Typography';
import Button from '@mui/material/Button';
import { useSession } from '@/admin/hooks/useSession';

export function Dashboard() {
  const session = useSession((s) => s.session);
  const signOut = useSession((s) => s.signOut);
  const navigate = useNavigate();

  async function handleSignOut() {
    await signOut();
    navigate('/signin');
  }

  return (
    <Box sx={{ p: 4 }}>
      <Typography variant="h5">
        Welcome, {session?.user.email ?? 'Admin'}
      </Typography>
      <Typography sx={{ mt: 1, color: 'text.secondary' }}>
        Devices page coming in Phase 4
      </Typography>
      <Button sx={{ mt: 2 }} variant="outlined" color="secondary" onClick={handleSignOut}>
        Sign Out
      </Button>
    </Box>
  );
}
