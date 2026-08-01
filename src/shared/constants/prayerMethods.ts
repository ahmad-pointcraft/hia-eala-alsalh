import type { AdhanMethod, HighLatitudeRule, Madhab } from '../types/mosqueConfig';

export interface MethodOption<T> {
  value: T;
  label: string;
}

export const ADHAN_METHODS: MethodOption<AdhanMethod>[] = [
  { value: 'MuslimWorldLeague', label: 'Muslim World League' },
  { value: 'Egyptian', label: 'Egyptian General Authority of Survey' },
  { value: 'Karachi', label: 'University of Islamic Sciences, Karachi' },
  { value: 'UmmAlQura', label: 'Umm Al-Qura University, Makkah' },
  { value: 'Dubai', label: 'Dubai' },
  { value: 'Qatar', label: 'Qatar' },
  { value: 'Kuwait', label: 'Kuwait' },
  { value: 'MoonsightingCommittee', label: 'Moonsighting Committee' },
  { value: 'Singapore', label: 'Majlis Ugama Islam Singapura' },
  { value: 'Turkey', label: 'Diyanet İşleri Başkanlığı, Turkey' },
  { value: 'Tehran', label: 'Institute of Geophysics, University of Tehran' },
  { value: 'NorthAmerica', label: 'ISNA (North America)' },
];

export const HIGH_LATITUDE_RULES: MethodOption<HighLatitudeRule>[] = [
  { value: 'MiddleOfTheNight', label: 'Middle of the Night' },
  { value: 'SeventhOfTheNight', label: 'Seventh of the Night' },
  { value: 'TwilightAngle', label: 'Twilight Angle' },
];

export const MADHAB_OPTIONS: MethodOption<Madhab>[] = [
  { value: 'Shafi', label: 'Shafi / Hanbali / Maliki' },
  { value: 'Hanafi', label: 'Hanafi' },
];
