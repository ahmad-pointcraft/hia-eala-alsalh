import { useState } from 'react';
import {
  Dialog,
  DialogTitle,
  DialogContent,
  DialogActions,
  Button,
  Typography,
  Alert,
  Box,
  RadioGroup,
  FormControlLabel,
  Radio,
  Paper,
  CircularProgress,
  IconButton,
  Tooltip,
} from '@mui/material';
import {
  ContentCopyOutlined as CopyIcon,
  CheckCircleOutline as CheckIcon,
  PersonAddOutlined as InviteIcon,
} from '@mui/icons-material';
import { api, type UserRole } from '@/shared/api';
import { useDialogFullScreen } from '@/admin/hooks/useIsMobile';

export interface InviteDialogProps {
  open: boolean;
  onClose: () => void;
  masjidId: string;
  onInviteCreated?: (code: string) => void;
}

export function InviteDialog({
  open,
  onClose,
  masjidId,
  onInviteCreated,
}: InviteDialogProps): JSX.Element {
  const isFullScreen = useDialogFullScreen();
  const [role, setRole] = useState<UserRole>('content_editor');
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState('');
  const [generatedCode, setGeneratedCode] = useState<string | null>(null);
  const [copied, setCopied] = useState(false);

  function handleClose() {
    setRole('content_editor');
    setError('');
    setGeneratedCode(null);
    setCopied(false);
    onClose();
  }

  async function handleGenerate() {
    setError('');
    setLoading(true);
    try {
      const result = await api.createInviteCode(masjidId, role);
      setGeneratedCode(result.code);
      onInviteCreated?.(result.code);
    } catch (err) {
      setError(err instanceof Error ? err.message : 'Failed to generate invite code');
    } finally {
      setLoading(false);
    }
  }

  async function handleCopy() {
    if (!generatedCode) return;
    try {
      await navigator.clipboard.writeText(generatedCode);
      setCopied(true);
      setTimeout(() => setCopied(false), 2000);
    } catch {
      // Fallback
    }
  }

  return (
    <Dialog
      open={open}
      onClose={handleClose}
      fullScreen={isFullScreen}
      maxWidth="xs"
      fullWidth
      PaperProps={{ sx: { borderRadius: isFullScreen ? 0 : 3 } }}
    >
      <DialogTitle sx={{ display: 'flex', alignItems: 'center', gap: 1.5, pb: 1 }}>
        <Box
          sx={{
            width: 36,
            height: 36,
            borderRadius: 2,
            bgcolor: 'primary.main',
            color: 'primary.contrastText',
            display: 'flex',
            alignItems: 'center',
            justifyContent: 'center',
          }}
        >
          <InviteIcon fontSize="small" />
        </Box>
        <Typography variant="h6" fontWeight={700}>
          Invite Team Member
        </Typography>
      </DialogTitle>

      <DialogContent sx={{ pt: 2 }}>
        {error && (
          <Alert severity="error" sx={{ mb: 2.5, borderRadius: 2 }}>
            {error}
          </Alert>
        )}

        {!generatedCode ? (
          <Box>
            <Typography variant="body2" color="text.secondary" sx={{ mb: 2 }}>
              Select the role for the new team member and generate a single-use invite code.
            </Typography>

            <RadioGroup
              value={role}
              onChange={(e) => setRole(e.target.value as UserRole)}
              sx={{ gap: 1.5 }}
            >
              <Paper
                elevation={0}
                variant="outlined"
                sx={{
                  p: 1.5,
                  borderRadius: 2,
                  borderColor: role === 'content_editor' ? 'primary.main' : 'divider',
                  bgcolor: role === 'content_editor' ? 'action.hover' : 'background.paper',
                  cursor: 'pointer',
                }}
                onClick={() => setRole('content_editor')}
              >
                <FormControlLabel
                  value="content_editor"
                  control={<Radio size="small" />}
                  label={
                    <Box>
                      <Typography variant="subtitle2" fontWeight={600}>
                        Content Editor
                      </Typography>
                      <Typography variant="caption" color="text.secondary">
                        Can manage announcements, events, donations, and photo slideshows.
                      </Typography>
                    </Box>
                  }
                  sx={{ m: 0, width: '100%', alignItems: 'flex-start' }}
                />
              </Paper>

              <Paper
                elevation={0}
                variant="outlined"
                sx={{
                  p: 1.5,
                  borderRadius: 2,
                  borderColor: role === 'masjid_admin' ? 'primary.main' : 'divider',
                  bgcolor: role === 'masjid_admin' ? 'action.hover' : 'background.paper',
                  cursor: 'pointer',
                }}
                onClick={() => setRole('masjid_admin')}
              >
                <FormControlLabel
                  value="masjid_admin"
                  control={<Radio size="small" />}
                  label={
                    <Box>
                      <Typography variant="subtitle2" fontWeight={600}>
                        Masjid Admin
                      </Typography>
                      <Typography variant="caption" color="text.secondary">
                        Full access to prayer timings, settings, display devices, and team invites.
                      </Typography>
                    </Box>
                  }
                  sx={{ m: 0, width: '100%', alignItems: 'flex-start' }}
                />
              </Paper>
            </RadioGroup>
          </Box>
        ) : (
          <Box sx={{ textAlign: 'center', py: 2 }}>
            <Typography variant="body2" color="text.secondary" gutterBottom>
              Share this 6-digit code with your team member. They can join by selecting <b>Join with Code</b> on the Sign Up page.
            </Typography>

            <Paper
              elevation={0}
              sx={{
                p: 3,
                my: 2.5,
                bgcolor: 'action.hover',
                border: '2px dashed',
                borderColor: 'primary.main',
                borderRadius: 2,
                display: 'flex',
                alignItems: 'center',
                justifyContent: 'center',
                gap: 2,
              }}
            >
              <Typography
                variant="h3"
                component="div"
                fontWeight={800}
                sx={{ letterSpacing: 8, fontFamily: 'monospace', color: 'primary.main' }}
              >
                {generatedCode}
              </Typography>
              <Tooltip title={copied ? 'Copied!' : 'Copy Code'}>
                <IconButton onClick={handleCopy} color={copied ? 'success' : 'default'} size="large">
                  {copied ? <CheckIcon /> : <CopyIcon />}
                </IconButton>
              </Tooltip>
            </Paper>

            <Typography variant="caption" color="text.secondary" display="block">
              ⏱ Valid for 24 hours • Single-use only
            </Typography>
          </Box>
        )}
      </DialogContent>

      <DialogActions sx={{ p: 2.5, pt: 1 }}>
        {!generatedCode ? (
          <>
            <Button onClick={handleClose} color="inherit" disabled={loading}>
              Cancel
            </Button>
            <Button
              onClick={handleGenerate}
              variant="contained"
              disabled={loading}
              startIcon={loading ? <CircularProgress size={18} color="inherit" /> : null}
            >
              {loading ? 'Generating…' : 'Generate Code'}
            </Button>
          </>
        ) : (
          <Button onClick={handleClose} variant="contained" fullWidth>
            Done
          </Button>
        )}
      </DialogActions>
    </Dialog>
  );
}
