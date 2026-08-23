import { useCallback, useEffect, useMemo, useState } from 'react';
import {
  Box,
  Button,
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
import { AsyncState } from '@/admin/components/states/AsyncState';
import { useToast } from '@/admin/components/ToastProvider';
import { UnsavedChangesDialog } from '@/admin/components/UnsavedChangesDialog';
import { validateDisplaySettings, isValid } from '@/admin/utils/settings/validation';

import {
  MosqueIdentityCard,
  ClockTimeCard,
  LanguageThemeCard,
  SlideshowTickerCard,
} from '@/admin/components/settings';

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
    <Box sx={{ pb: 2 }}>
      <Box sx={{ mb: { xs: 3, md: 4 } }}>
        <Typography
          variant="h5"
          component="h1"
          tabIndex={-1}
          ref={headingRef}
          fontWeight={600}
          gutterBottom
        >
          Display Settings
        </Typography>
        <Typography color="text.secondary" fontSize="0.95rem">
          Configure mosque branding, language, theme appearance, clock presentation, and slideshow speed.
        </Typography>
      </Box>

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
              },
              gap: 2.5,
            }}
          >
            <MosqueIdentityCard errors={errors} />
            <LanguageThemeCard />
            <ClockTimeCard />
            <SlideshowTickerCard />
          </Box>


          {/* STICKY SAVE / CANCEL ACTION BAR */}
          <Box
            sx={{
              display: 'flex',
              alignItems: 'center',
              justifyContent: { xs: 'center', md: 'flex-start' },
              gap: 2,
              pt: 2,
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

      {/* REUSABLE DIRTY GUARD DIALOG */}
      <UnsavedChangesDialog
        blocker={blocker}
        message="You have unsaved changes in Display Settings. Leave without saving?"
      />
    </Box>
  );
}

