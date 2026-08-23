import { Stack, Box } from '@mui/material';
import { useTimingsForm } from '@/admin/store/useTimingsForm';
import type { PrayerKey } from '@/shared/types';
import { IqamaPrayerCard } from './IqamaPrayerCard';

const IQAMA_PRAYERS = ['Fajr', 'Dhuhr', 'Asr', 'Maghrib', 'Isha'] as const;

export function IqamaEditor({ errors }: { errors: Record<string, string> }) {
  const draft = useTimingsForm((s) => s.draft);
  const setIqama = useTimingsForm((s) => s.setIqama);

  return (
    <Box>
      <Stack spacing={1.5}>
        {IQAMA_PRAYERS.map((prayer) => (
          <IqamaPrayerCard
            key={prayer}
            prayer={prayer as Exclude<PrayerKey, 'Sunrise'>}
            config={draft.iqamaConfigs[prayer as Exclude<PrayerKey, 'Sunrise'>]}
            error={errors[`iqama.${prayer}.value`]}
            onChange={(patch) => setIqama(prayer as Exclude<PrayerKey, 'Sunrise'>, patch)}
          />
        ))}
      </Stack>
    </Box>
  );
}

