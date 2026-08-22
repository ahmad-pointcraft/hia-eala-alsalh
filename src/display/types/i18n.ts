export type Language = 'ar' | 'en';

export interface Translations {
  donate: string;
  nextPrayer: string;
  hadithOfTheDay: string;
  hadithText: string;
  hadithSource: string;
  sunset: string;
  iqama: string;
  pleaseObserveSilence: string;
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
  // PRAYER WIDGET TRANSLATION STRUCT
  prayerWidget: {
    adhanLabel: string;
    pleasePrepare: string;
    iqamaIn: string;
    iqamaPrayerLabel: string;
    standStraighten: string;
    congregationStarting: string;
  };
}
