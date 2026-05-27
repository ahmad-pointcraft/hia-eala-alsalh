export interface SheetAnnouncement {
  id: string;
  text_en: string;
  text_ar: string;
  active: boolean;
}

export interface SheetEvent {
  id: string;
  badge_en: string;
  badge_ar: string;
  title_en: string;
  title_ar: string;
  speaker_en: string;
  speaker_ar: string;
  date: string;
  time: string;
  location_en: string;
  location_ar: string;
  cta_en: string;
  cta_ar: string;
  active: boolean;
}
