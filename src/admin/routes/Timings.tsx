import { useEffect, useMemo, useState } from 'react';
import {
  Box,
  Stack,
  Typography,
  Button,
  Alert,
  Snackbar,
  Skeleton,
  Dialog,
  DialogTitle,
  DialogContent,
  DialogActions,
} from '@mui/material';
import SaveIcon from '@mui/icons-material/Save';
import { useMosqueConfigStore } from '@/display/store/mosqueConfigStore';
import { useTimingsForm } from '@/admin/store/useTimingsForm';
import { useDirtyGuard } from '@/admin/hooks/useDirtyGuard';
import { validateConfig, isValid } from '@/admin/utils/timings/validation';

import { MasjidNameFields } from '@/admin/components/timings/MasjidNameFields';
import { LocationFields } from '@/admin/components/timings/LocationFields';
import { MethodSelect } from '@/admin/components/timings/MethodSelect';
import { MadhabToggle } from '@/admin/components/timings/MadhabToggle';
import { HighLatRuleSelect } from '@/admin/components/timings/HighLatRuleSelect';
import { TimezoneField } from '@/admin/components/timings/TimezoneField';
import { HijriOffsetControl } from '@/admin/components/timings/HijriOffsetControl';
import { IqamaEditor } from '@/admin/components/timings/IqamaEditor';

export function Timings() {
  const config = useMosqueConfigStore((s) => s.config);
  const masjidId = useMosqueConfigStore((s) => s.masjidId);

  const draft = useTimingsForm((s) => s.draft);
  const dirty = useTimingsForm((s) => s.dirty);
  const saving = useTimingsForm((s) => s.saving);
  const error = useTimingsForm((s) => s.error);
  const loading = useTimingsForm((s) => s.loading);
  const init = useTimingsForm((s) => s.init);
  const reset = useTimingsForm((s) => s.reset);
  const revert = useTimingsForm((s) => s.revert);
  const save = useTimingsForm((s) => s.save);

  // INIT ON MOUNT, RESET ON UNMOUNT
  useEffect(() => {
    init(config);
    return () => reset();
  }, [config, init, reset]);

  // DIRTY GUARD
  const blocker = useDirtyGuard(dirty);

  // SNACKBAR STATE
  const [snackbar, setSnackbar] = useState<{ open: boolean; message: string; severity: 'success' | 'error' }>({
    open: false,
    message: '',
    severity: 'success',
  });

  // VALIDATION
  const errors = useMemo(() => validateConfig(draft), [draft]);
  const formValid = isValid(errors);
  const canSave = dirty && formValid && !saving;

  // SAVE HANDLER
  async function handleSave() {
    if (!masjidId) return;
    const success = await save(masjidId, draft);
    if (success) {
      setSnackbar({ open: true, message: 'Saved — paired displays updated', severity: 'success' });
    } else {
      setSnackbar({ open: true, message: error ?? 'Failed to save timings', severity: 'error' });
    }
  }

  // LOADING STATE
  if (loading) {
    return (
      <Box sx={{ p: 3 }}>
        <Skeleton variant="text" width={200} height={40} />
        <Skeleton variant="rectangular" height={60} sx={{ my: 2 }} />
        <Skeleton variant="rectangular" height={60} sx={{ my: 2 }} />
        <Skeleton variant="rectangular" height={200} sx={{ my: 2 }} />
      </Box>
    );
  }

  return (
    <Box>
      <Typography variant="h5" gutterBottom>Timings Configuration</Typography>

      {error && <Alert severity="error" sx={{ mb: 2 }}>{error}</Alert>}

      <Stack spacing={3} sx={{ maxWidth: 700 }}>
        {/* MASJID IDENTITY */}
        <Box>
          <Typography variant="subtitle1" sx={{ fontWeight: 600, mb: 1.5 }}>Masjid Name</Typography>
          <MasjidNameFields errors={errors} />
        </Box>

        {/* LOCATION */}
        <Box>
          <Typography variant="subtitle1" sx={{ fontWeight: 600, mb: 1.5 }}>Location</Typography>
          <LocationFields errors={errors} />
        </Box>

        {/* CALCULATION */}
        <Box>
          <Typography variant="subtitle1" sx={{ fontWeight: 600, mb: 1.5 }}>Prayer Calculation</Typography>
          <Stack spacing={2}>
            <MethodSelect />
            <MadhabToggle />
            <HighLatRuleSelect />
          </Stack>
        </Box>

        {/* TIMEZONE */}
        <Box>
          <Typography variant="subtitle1" sx={{ fontWeight: 600, mb: 1.5 }}>Timezone</Typography>
          <TimezoneField />
        </Box>

        {/* HIJRI OFFSET */}
        <Box>
          <Typography variant="subtitle1" sx={{ fontWeight: 600, mb: 1.5 }}>Hijri Date Offset</Typography>
          <HijriOffsetControl />
        </Box>

        {/* IQAMA */}
        <Box>
          <IqamaEditor errors={errors} />
        </Box>

        {/* SAVE BAR */}
        <Stack direction="row" spacing={2} sx={{ pt: 2 }}>
          <Button
            variant="contained"
            startIcon={<SaveIcon />}
            disabled={!canSave}
            onClick={handleSave}
          >
            {saving ? 'Saving…' : 'Save'}
          </Button>
          <Button
            variant="outlined"
            disabled={!dirty || saving}
            onClick={() => revert(config)}
          >
            Cancel
          </Button>
        </Stack>
      </Stack>

      {/* SNACKBAR */}
      <Snackbar
        open={snackbar.open}
        autoHideDuration={4000}
        onClose={() => setSnackbar((s) => ({ ...s, open: false }))}
        anchorOrigin={{ vertical: 'bottom', horizontal: 'center' }}
      >
        <Alert
          severity={snackbar.severity}
          onClose={() => setSnackbar((s) => ({ ...s, open: false }))}
        >
          {snackbar.message}
        </Alert>
      </Snackbar>

      {/* DIRTY GUARD DIALOG */}
      {blocker.state === 'blocked' && (
        <Dialog open onClose={() => blocker.reset?.()}>
          <DialogTitle>Unsaved Changes</DialogTitle>
          <DialogContent>
            <Typography>You have unsaved changes. Leave without saving?</Typography>
          </DialogContent>
          <DialogActions>
            <Button onClick={() => blocker.reset?.()}>Stay</Button>
            <Button
              color="error"
              onClick={() => {
                blocker.proceed?.();
              }}
            >
              Leave
            </Button>
          </DialogActions>
        </Dialog>
      )}
    </Box>
  );
}
