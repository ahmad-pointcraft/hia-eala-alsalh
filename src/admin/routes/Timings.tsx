import { useCallback, useEffect, useMemo, useState } from 'react';
import {
  Box,
  Stack,
  Typography,
  Button,
} from '@mui/material';
import SaveIcon from '@mui/icons-material/Save';
import { api } from '@/shared/api';
import type { MosqueConfig } from '@/shared/types';
import { useSession } from '@/admin/store/useSession';
import { useTimingsForm } from '@/admin/store/useTimingsForm';
import { useDirtyGuard } from '@/admin/hooks/useDirtyGuard';
import { useFocusHeading } from '@/admin/hooks/useFocusHeading';
import { AsyncState } from '@/admin/components/states/AsyncState';
import { useToast } from '@/admin/components/ToastProvider';
import { UnsavedChangesDialog } from '@/admin/components/UnsavedChangesDialog';
import { validateConfig, isValid } from '@/admin/utils/timings/validation';

import { LocationFields } from '@/admin/components/timings/LocationFields';
import { MethodSelect } from '@/admin/components/timings/MethodSelect';
import { MadhabToggle } from '@/admin/components/timings/MadhabToggle';
import { HighLatRuleSelect } from '@/admin/components/timings/HighLatRuleSelect';
import { TimezoneField } from '@/admin/components/timings/TimezoneField';
import { HijriOffsetControl } from '@/admin/components/timings/HijriOffsetControl';
import { IqamaEditor } from '@/admin/components/timings/IqamaEditor';

export function Timings() {
  const masjidId = useSession((s) => s.session?.masjidId ?? '');
  const [loadedConfig, setLoadedConfig] = useState<MosqueConfig | null>(null);
  const [loadError, setLoadError] = useState<string | null>(null);
  const headingRef = useFocusHeading<HTMLHeadingElement>();

  const draft = useTimingsForm((s) => s.draft);
  const dirty = useTimingsForm((s) => s.dirty);
  const saving = useTimingsForm((s) => s.saving);
  const loading = useTimingsForm((s) => s.loading);
  const init = useTimingsForm((s) => s.init);
  const reset = useTimingsForm((s) => s.reset);
  const revert = useTimingsForm((s) => s.revert);
  const save = useTimingsForm((s) => s.save);

  // LOAD CONFIG FROM THE API (admin session scoping — not the display kiosk store)
  const load = useCallback(() => {
    let cancelled = false;
    setLoadError(null);
    void api.getMasjidConfig(masjidId).then((config) => {
      if (!cancelled) {
        setLoadedConfig(config);
        init(config);
      }
    }).catch(() => {
      if (!cancelled) setLoadError('Failed to load timings. Please try again.');
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

  // DIRTY GUARD
  const blocker = useDirtyGuard(dirty);
  const toast = useToast();

  // VALIDATION
  const errors = useMemo(() => validateConfig(draft), [draft]);
  const formValid = isValid(errors);
  const canSave = dirty && formValid && !saving;

  // SAVE HANDLER
  async function handleSave() {
    if (!masjidId) return;
    const success = await save(masjidId, draft);
    if (success) {
      toast.success('Saved — paired displays updated');
    } else {
      toast.error(useTimingsForm.getState().error ?? 'Failed to save timings');
    }
  }

  return (
    <Box>
      <Typography variant="h5" component="h1" tabIndex={-1} ref={headingRef} gutterBottom>
        Timings Configuration
      </Typography>

      {/* SINGLE STATE PIPELINE — FORM SKELETON + RETRY (SINGLETON CONFIG — NO EMPTY STATE) */}
      <AsyncState
        loading={(loading || !loadedConfig) && loadError === null}
        error={loadError}
        onRetry={load}
        skeleton="form"
        skeletonRows={6}
      >
      {/* SINGLE-COLUMN BELOW SM — FULL WIDTH, COMPRESSED SPACING, REACHABLE SAVE */}
      <Stack spacing={{ xs: 2, sm: 3 }} sx={{ maxWidth: { sm: 700 } }}>
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
            onClick={() => {
              if (loadedConfig) revert(loadedConfig);
            }}
          >
            Cancel
          </Button>
        </Stack>
      </Stack>
      </AsyncState>

      {/* REUSABLE DIRTY GUARD DIALOG */}
      <UnsavedChangesDialog
        blocker={blocker}
        message="You have unsaved changes in Timings. Leave without saving?"
      />
    </Box>
  );
}

