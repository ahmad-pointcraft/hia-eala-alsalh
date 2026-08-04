import type { MosqueConfig } from '@/shared/types/mosqueConfig';

/**
 * Validate a MosqueConfig draft. Returns a map of field paths to error messages.
 * Empty object = valid. Used to gate the Save button.
 *
 * Note: calculationMethod validation is implicit — the MUI Select can only
 * return values from the AdhanMethod union, so invalid values are impossible
 * by construction.
 */
export function validateConfig(config: MosqueConfig): Record<string, string> {
  const errors: Record<string, string> = {};

  // Latitude: -90 to 90
  if (typeof config.latitude !== 'number' || config.latitude < -90 || config.latitude > 90) {
    errors['latitude'] = 'Latitude must be between -90 and 90';
  }

  // Longitude: -180 to 180
  if (typeof config.longitude !== 'number' || config.longitude < -180 || config.longitude > 180) {
    errors['longitude'] = 'Longitude must be between -180 and 180';
  }

  // Hijri offset: exactly {-2, -1, 0, 1, 2}
  if (![-2, -1, 0, 1, 2].includes(config.hijriOffset)) {
    errors['hijriOffset'] = 'Hijri offset must be -2, -1, 0, +1, or +2';
  }

  // Iqama per prayer (5 prayers, Sunrise excluded)
  const prayers = ['Fajr', 'Dhuhr', 'Asr', 'Maghrib', 'Isha'] as const;
  for (const prayer of prayers) {
    const iqama = config.iqamaConfigs[prayer];
    if (iqama.mode === 'offset') {
      if (typeof iqama.value !== 'number' || iqama.value < 0 || iqama.value > 60) {
        errors[`iqama.${prayer}.value`] = 'Offset must be 0–60 minutes';
      }
    } else {
      if (typeof iqama.value !== 'string' || !/^([01]\d|2[0-3]):[0-5]\d$/.test(iqama.value)) {
        errors[`iqama.${prayer}.value`] = 'Fixed time must be HH:MM format';
      }
    }
  }

  return errors;
}

export function isValid(errors: Record<string, string>): boolean {
  return Object.keys(errors).length === 0;
}
