import { useCallback, useEffect, useMemo, useState } from 'react';
import {
  Box,
  Button,
  Dialog,
  DialogActions,
  DialogContent,
  DialogTitle,
  Stack,
  Typography,
} from '@mui/material';
import SaveIcon from '@mui/icons-material/Save';
import { api } from '@/shared/api';
import type { MosqueConfig } from '@/shared/types';
import { useSession } from '@/admin/store/useSession';
import { useDisplaySettingsForm } from '@/admin/store/useDisplaySettingsForm';
import { useDirtyGuard } from '@/admin/hooks/useDirtyGuard';
import { useFocusHeading } from '@/admin/hooks/useFocusHeading';
import { useDialogFullScreen } from '@/admin/hooks/useIsMobile';
import { AsyncState } from '@/admin/components/states/AsyncState';
import { useToast } from '@/admin/components/ToastProvider';
import { validateDisplaySettings, isValid } from '@/admin/utils/settings/validation';

import { MosqueIdentityCard } from '@/admin/components/settings/MosqueIdentityCard';
import { ClockPresentationCard } from '@/admin/components/settings/ClockPresentationCard';
import { SlideshowTickerCard } from '@/admin/components/settings/SlideshowTickerCard';
import { PrayerSilenceCard } from '@/admin/components/settings/PrayerSilenceCard';
import { SpecialModesCard } from '@/admin/components/settings/SpecialModesCard';

export function DisplaySettings() {
  const masjidId = useSession((s) => s.session?.masjidId ?? '');
  const [loadedConfig, setLoadedConfig] = useState<MosqueConfig | null>(null);
  const [loadError, setLoadError] = useState<string | null>(null);
  const headingRef = useFocusHeading<HTMLHeadingElement>();

  const draft = useDisplaySettingsForm((s) => s.draft);
  const dirty = useDisplaySettingsForm((s) => s.dirty);
  const saving = useDisplaySettingsForm((s) => s.saving);
  const loading = useDisplaySettingsForm((s) => s.loading);
  const init = useDisplaySettingsForm((s) => s.init);
  const reset = useDisplaySettingsForm((s) => s.reset);
  const revert = useDisplaySettingsForm((s) => s.revert);
  const save = useDisplaySettingsForm((s) => s.save);

  const load = useCallback(() => {
    let cancelled = false;
    setLoadError(null);
    void api
      .getMasjidConfig(masjidId)
      .then((config) => {
        if (!cancelled) {
          setLoadedConfig(config);
          init(config);
        }
      })
      .catch(() => {
        if (!cancelled) setLoadError('Failed to load display settings. Please try again.');
      });
    return () => {
      cancelled = true;
    };
  }, [masjidId, init]);

  useEffect(() => {
    if (!masjidId) return;
    const cleanup = load();
    return () => {
      cleanup();
      reset();
    };
  }, [masjidId, load, reset]);

  const blocker = useDirtyGuard(dirty);
  const toast = useToast();
  const dialogFullScreen = useDialogFullScreen();

  const errors = useMemo(() => validateDisplaySettings(draft), [draft]);
  const formValid = isValid(errors);
  const canSave = dirty && formValid && !saving;

  async function handleSave() {
    if (!masjidId) return;
    const success = await save(masjidId, draft);
    if (success) {
      toast.success('Display settings saved — paired displays updated');
    } else {
      toast.error(useDisplaySettingsForm.getState().error ?? 'Failed to save display settings');
    }
  }

  return (
    <Box sx={{ pb: 6 }}>
      <Typography variant="h5" component="h1" tabIndex={-1} ref={headingRef} fontWeight={600} gutterBottom>
        Display Settings
      </Typography>
      <Typography color="text.secondary" sx={{ mb: 3 }}>
        Configure mosque branding, clock presentation, slideshow speed, and operational modes for paired TV displays.
      </Typography>

      <AsyncState
        loading={(loading || !loadedConfig) && loadError === null}
        error={loadError}
        onRetry={load}
        skeleton="form"
        skeletonRows={6}
      >
        <Stack spacing={3}>
          <Box
            sx={{
              display: 'grid',
              gridTemplateColumns: {
                xs: '1fr',
                md: 'repeat(2, 1fr)',
                lg: 'repeat(3, 1fr)',
              },
              gap: 2.5,
            }}
          >
            <MosqueIdentityCard errors={errors} />
            <ClockPresentationCard />
            <SlideshowTickerCard />
            <PrayerSilenceCard />
            <SpecialModesCard />
          </Box>

          {/* STICKY SAVE / CANCEL ACTION BAR */}
          <Box
            sx={{
              display: 'flex',
              alignItems: 'center',
              gap: 2,
              pt: 2,
              borderTop: '1px solid',
              borderColor: 'divider',
            }}
          >
            <Button
              variant="contained"
              color="primary"
              size="large"
              startIcon={<SaveIcon />}
              disabled={!canSave}
              onClick={handleSave}
              sx={{ px: 3, fontWeight: 600 }}
            >
              {saving ? 'Saving…' : 'Save Changes'}
            </Button>
            <Button
              variant="outlined"
              size="large"
              disabled={!dirty || saving}
              onClick={() => {
                if (loadedConfig) revert(loadedConfig);
              }}
              sx={{ px: 3 }}
            >
              Cancel
            </Button>
          </Box>
        </Stack>
      </AsyncState>

      {/* DIRTY GUARD DIALOG */}
      {blocker.state === 'blocked' && (
        <Dialog open onClose={() => blocker.reset?.()} fullScreen={dialogFullScreen}>
          <DialogTitle>Unsaved Changes</DialogTitle>
          <DialogContent>
            <Typography>You have unsaved changes in Display Settings. Leave without saving?</Typography>
          </DialogContent>
          <DialogActions>
            <Button onClick={() => blocker.reset?.()}>Stay</Button>
            <Button color="error" onClick={() => blocker.proceed?.()}>
              Leave
            </Button>
          </DialogActions>
        </Dialog>
      )}
    </Box>
  );
}
