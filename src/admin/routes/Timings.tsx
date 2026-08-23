import { useCallback, useEffect, useMemo, useState } from 'react';
import {
  Box,
  Card,
  CardContent,
  Stack,
  Typography,
  Button,
} from '@mui/material';
import {
  Save as SaveIcon,
  LocationOn as LocationIcon,
  Tune as CalculationIcon,
  AccessTime as IqamaIcon,
} from '@mui/icons-material';
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
    void api
      .getMasjidConfig(masjidId)
      .then((config) => {
        if (!cancelled) {
          setLoadedConfig(config);
          init(config);
        }
      })
      .catch(() => {
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
      toast.success('Timings saved — paired displays updated');
    } else {
      toast.error(useTimingsForm.getState().error ?? 'Failed to save timings');
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
          Timings Configuration
        </Typography>
        <Typography color="text.secondary" sx={{ mb: 3 }}>
          Configure geographic location coordinates, prayer calculation rules, and congregational Iqama schedules.
        </Typography>
      </Box>

      {/* SINGLE STATE PIPELINE — FORM SKELETON + RETRY */}
      <AsyncState
        loading={(loading || !loadedConfig) && loadError === null}
        error={loadError}
        onRetry={load}
        skeleton="form"
        skeletonRows={6}
      >
        <Stack spacing={3}>
          {/* TOP ROW: LOCATION & CALCULATION IN 2-COLUMN GRID */}
          <Box
            sx={{
              display: 'grid',
              gridTemplateColumns: {
                xs: '1fr',
                lg: 'repeat(2, 1fr)',
              },
              gap: 2.5,
            }}
          >
            {/* CARD 1: LOCATION & TIMEZONE */}
            <Card
              sx={{
                height: '100%',
                borderRadius: 3,
                border: '1px solid rgba(0, 0, 0, 0.08)',
                boxShadow: '0 1px 3px rgba(0, 0, 0, 0.04), 0 4px 12px rgba(0, 0, 0, 0.02)',
              }}
            >
              <CardContent sx={{ p: 2.5, display: 'flex', flexDirection: 'column', height: '100%', boxSizing: 'border-box' }}>
                <Box sx={{ display: 'flex', alignItems: 'center', gap: 1.25, mb: 2.5 }}>
                  <Box
                    sx={{
                      width: 36,
                      height: 36,
                      borderRadius: 2,
                      bgcolor: 'rgba(46, 125, 50, 0.1)',
                      display: 'flex',
                      alignItems: 'center',
                      justifyContent: 'center',
                      color: 'primary.main',
                    }}
                  >
                    <LocationIcon fontSize="small" />
                  </Box>
                  <Typography variant="h6" fontWeight={700} fontSize="1.05rem">
                    Location & Timezone
                  </Typography>
                </Box>

                <Stack spacing={2.5} sx={{ flexGrow: 1, justifyContent: 'space-between' }}>
                  <LocationFields errors={errors} />
                  <TimezoneField />
                </Stack>
              </CardContent>
            </Card>

            {/* CARD 2: PRAYER CALCULATION & CONVENTIONS */}
            <Card
              sx={{
                height: '100%',
                borderRadius: 3,
                border: '1px solid rgba(0, 0, 0, 0.08)',
                boxShadow: '0 1px 3px rgba(0, 0, 0, 0.04), 0 4px 12px rgba(0, 0, 0, 0.02)',
              }}
            >
              <CardContent sx={{ p: 2.5, display: 'flex', flexDirection: 'column', height: '100%', boxSizing: 'border-box' }}>
                <Box sx={{ display: 'flex', alignItems: 'center', gap: 1.25, mb: 2.5 }}>
                  <Box
                    sx={{
                      width: 36,
                      height: 36,
                      borderRadius: 2,
                      bgcolor: 'rgba(46, 125, 50, 0.1)',
                      display: 'flex',
                      alignItems: 'center',
                      justifyContent: 'center',
                      color: 'primary.main',
                    }}
                  >
                    <CalculationIcon fontSize="small" />
                  </Box>
                  <Typography variant="h6" fontWeight={700} fontSize="1.05rem">
                    Calculation Rules
                  </Typography>
                </Box>

                <Stack spacing={2}>
                  <MethodSelect />
                  <MadhabToggle />
                  <HighLatRuleSelect />
                  <HijriOffsetControl />
                </Stack>
              </CardContent>
            </Card>
          </Box>

          {/* CARD 3: IQAMA TIMES & SCHEDULES (PROMINENT FULL-WIDTH CARD) */}
          <Card
            sx={{
              borderRadius: 3,
              border: '1px solid rgba(0, 0, 0, 0.08)',
              boxShadow: '0 1px 3px rgba(0, 0, 0, 0.04), 0 4px 12px rgba(0, 0, 0, 0.02)',
            }}
          >
            <CardContent sx={{ p: 2.5 }}>
              <Box sx={{ display: 'flex', alignItems: 'center', gap: 1.25, mb: 1 }}>
                <Box
                  sx={{
                    width: 36,
                    height: 36,
                    borderRadius: 2,
                    bgcolor: 'rgba(46, 125, 50, 0.1)',
                    display: 'flex',
                    alignItems: 'center',
                    justifyContent: 'center',
                    color: 'primary.main',
                  }}
                >
                  <IqamaIcon fontSize="small" />
                </Box>
                <Typography variant="h6" fontWeight={700} fontSize="1.05rem">
                  Iqama Times & Schedules
                </Typography>
              </Box>
              <Typography color="text.secondary" sx={{ mb: 2.5, fontSize: '0.88rem' }}>
                Set whether Iqama starts as a fixed clock time or an offset in minutes after the Adhan call.
              </Typography>

              <IqamaEditor errors={errors} />
            </CardContent>
          </Card>

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
        message="You have unsaved changes in Timings. Leave without saving?"
      />
    </Box>
  );
}


