import { Language } from "../utils/translations";

interface HadithPanelProps {
  language: Language;
  translations: any;
}

export function HadithPanel({
  language,
  translations,
}: HadithPanelProps) {
  const isRTL = language === "ar";
  const fontFamily =
    language === "ar"
      ? "Noto Naskh Arabic, serif"
      : "Open Sans, sans-serif";

  return (
    <div
      className="w-full bg-black/30 backdrop-blur-sm border border-[#D4AF37]/30 rounded-lg p-1.5 px-[10px] py-[5px] mx-[0px] mt-[0px] mb-[10px]"
      dir={isRTL ? "rtl" : "ltr"}
    >
      <div className="flex flex-col gap-1 lg:gap-2">
        {/* Title - Top Left (Top Right for Arabic) */}
        <div
          className={`text-[#D4AF37] uppercase tracking-wider font-bold ${isRTL ? "text-right" : "text-left"} text-[10px]`}
          style={{ fontFamily }}
        >
          {translations.hadithOfTheDay}
        </div>

        {/* Hadith Text - Center, Full Width */}
        <p
          className="text-white italic leading-snug text-center w-full text-[24px]"
          style={{ fontFamily }}
        >
          {translations.hadithText}
        </p>

        {/* Source - Bottom Right (Bottom Left for Arabic) */}
        <p
          className={`text-gray-400 ${isRTL ? "text-left" : "text-right"} text-[11px]`}
          style={{ fontFamily }}
        >
          {translations.hadithSource}
        </p>
      </div>
    </div>
  );
}