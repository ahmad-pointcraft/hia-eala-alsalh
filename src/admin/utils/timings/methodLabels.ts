import type { AdhanMethod } from '@/shared/types';

interface MethodLabel {
  label: string;
  regionHint: string;
}

export const ADHAN_METHOD_LABELS: Record<AdhanMethod, MethodLabel> = {
  MuslimWorldLeague: { label: 'MWL', regionHint: 'Worldwide' },
  Egyptian: { label: 'Egyptian Authority', regionHint: 'Egypt' },
  Karachi: { label: 'Karachi', regionHint: 'Pakistan' },
  UmmAlQura: { label: 'Umm Al-Qura', regionHint: 'Saudi Arabia' },
  Dubai: { label: 'Dubai', regionHint: 'UAE' },
  Qatar: { label: 'Qatar', regionHint: 'Qatar' },
  Kuwait: { label: 'Kuwait', regionHint: 'Kuwait' },
  MoonsightingCommittee: { label: 'Moonsighting Committee', regionHint: 'North America' },
  Singapore: { label: 'Singapore', regionHint: 'Singapore' },
  Turkey: { label: 'Turkey (Diyanet)', regionHint: 'Turkey' },
  Tehran: { label: 'Tehran', regionHint: 'Iran' },
  NorthAmerica: { label: 'ISNA', regionHint: 'North America' },
};
