import type { Language, Translations } from '@/display/types';

export type { Language, Translations };

export const translations: Record<Language, Translations> = {
  en: {
    donate: 'Donate',
    nextPrayer: 'Next prayer',
    hadithOfTheDay: 'Hadith of the Day',
    hadithText: 'The best of you are those who learn the Quran and teach it to others.',
    hadithSource: '— Sahih Bukhari —',
    sunset: 'Sunset',
    prayers: {
      fajr: 'Fajr',
      sunrise: 'Sunrise',
      dhuhr: 'Dhuhr',
      asr: 'Asr',
      maghrib: 'Maghrib',
      isha: 'Isha',
    },
    iqama: 'Iqama',
    pleaseObserveSilence: 'Please observe silence',
    fundraising: {
      title: 'Masjid Expansion Campaign',
      description: 'Help us build a larger prayer hall to accommodate our growing community',
      collected: 'Collected',
      goal: 'Goal',
      donors: 'Donors',
      progress: 'Progress',
      donateOnline: 'Donate online:',
      scanToDonate: 'Scan to Donate',
      autoClosing: 'Auto-closing in',
      seconds: 's',
    },
    // PRAYER WIDGET LOCALIZATION
    prayerWidget: {
      adhanLabel: 'Adhan',
      pleasePrepare: 'Please prepare for prayer',
      iqamaIn: 'Iqama In',
      iqamaPrayerLabel: 'Iqama Prayer',
      standStraighten: 'Stand & Straighten Rows',
      congregationStarting: 'Congregation is starting',
    },
  },
  ar: {
    donate: 'تبرع',
    nextPrayer: 'الصلاة القادمة',
    hadithOfTheDay: 'حديث اليوم',
    hadithText: 'خيركم من تعلم القرآن وعلمه',
    hadithSource: '— صحيح البخاري ',
    sunset: 'الغروب',
    prayers: {
      fajr: 'الفجر',
      sunrise: 'الشروق',
      dhuhr: 'الظهر',
      asr: 'العصر',
      maghrib: 'المغرب',
      isha: 'العشاء',
    },
    iqama: 'الإقامة',
    pleaseObserveSilence: 'يُرجى الالتزام بالهدوء',
    fundraising: {
      title: 'حملة توسعة المسجد',
      description: 'ساعدنا في بناء قاعة صلاة أكبر لاستيعاب مجتمعنا المتنامي',
      collected: 'تم جمعه',
      goal: 'الهدف',
      donors: 'المتبرعون',
      progress: 'التقدم',
      donateOnline: 'تبرع عبر الإنترنت:',
      scanToDonate: 'امسح للتبرع',
      autoClosing: 'إغلاق تلقائي بعد',
      seconds: 'ث',
    },
    // PRAYER WIDGET LOCALIZATION
    prayerWidget: {
      adhanLabel: 'آذان',
      pleasePrepare: 'يرجى الاستعداد للصلاة',
      iqamaIn: 'الإقامة بعد',
      iqamaPrayerLabel: 'إقامة صلاة',
      standStraighten: 'استووا واعتدلوا',
      congregationStarting: 'تقام الصلاة الآن',
    },
  },
};
