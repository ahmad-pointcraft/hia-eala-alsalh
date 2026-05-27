export type Language = 'ar' | 'en';

export interface Translations {
  masjidName: string;
  donate: string;
  comingEvent: string;
  exitEvent: string;
  nextPrayer: string;
  hadithOfTheDay: string;
  hadithText: string;
  hadithSource: string;
  announcements: string;
  sunset: string;
  iqama: string;
  prayers: {
    fajr: string;
    sunrise: string;
    dhuhr: string;
    asr: string;
    maghrib: string;
    isha: string;
  };
  fundraising: {
    title: string;
    description: string;
    collected: string;
    goal: string;
    donors: string;
    progress: string;
    donateOnline: string;
    scanToDonate: string;
    autoClosing: string;
    seconds: string;
  };
  days: {
    sunday: string;
    monday: string;
    tuesday: string;
    wednesday: string;
    thursday: string;
    friday: string;
    saturday: string;
  };
  months: {
    january: string;
    february: string;
    march: string;
    april: string;
    may: string;
    june: string;
    july: string;
    august: string;
    september: string;
    october: string;
    november: string;
    december: string;
  };
  announcementsList: string[];
  events: {
    badge: string;
    title: string;
    speakerName: string;
    dateValue: string;
    timeValue: string;
    locationValue: string;
    cta: string;
  }[];
}
