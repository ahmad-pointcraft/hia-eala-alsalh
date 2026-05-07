import { useEffect, useRef } from "react";
import { Megaphone } from "lucide-react";
import { Language } from "../utils/translations";
import logoSvg from "../../imports/logo.png";

interface AnnouncementsTickerProps {
  language: Language;
  announcementsLabel: string;
  announcements: string[];
}

export function AnnouncementsTicker({
  language,
  announcementsLabel,
  announcements,
}: AnnouncementsTickerProps) {
  const isRTL = language === "ar";
  const fontFamily =
    language === "ar"
      ? "Noto Naskh Arabic, serif"
      : "Open Sans, sans-serif";
  const scrollRef = useRef<HTMLDivElement>(null);

  useEffect(() => {
    const element = scrollRef.current;
    if (!element) return;

    let animationId: number;
    let position = 0;
    const speed = isRTL ? 0.4 : -0.4; // Reverse direction for RTL

    const animate = () => {
      position += speed;

      // For RTL, scroll right to left
      if (isRTL) {
        if (position >= element.scrollWidth / 2) {
          position = 0;
        }
      } else {
        // For LTR, scroll left to right
        if (position <= -element.scrollWidth / 2) {
          position = 0;
        }
      }

      element.style.transform = `translateX(${position}px)`;
      animationId = requestAnimationFrame(animate);
    };

    animationId = requestAnimationFrame(animate);
    return () => cancelAnimationFrame(animationId);
  }, [isRTL]);

  const separator = language === "ar" ? " • " : " • ";
  const fullText =
    announcements.join(separator) +
    separator +
    announcements.join(separator);

  return (
    <div
      className="w-full bg-black/40 backdrop-blur-sm border-t border-[#D4AF37]/30 overflow-hidden"
      dir={isRTL ? "rtl" : "ltr"}
    >
      <div className="flex items-center h-8 sm:h-9 lg:h-10">
        {/* Logo on far left (or far right in RTL) */}
        <div className="px-2 sm:px-3 h-full flex items-center justify-center shrink-0 bg-black/60">
          <img
            src={logoSvg}
            alt="Logo"
            className="h-5 sm:h-6 lg:h-7 w-auto"
          />
        </div>

        {/* Scrolling announcements text in the middle */}
        <div className="flex-1 overflow-hidden relative">
          <div
            ref={scrollRef}
            className="flex items-center gap-4 sm:gap-6 whitespace-nowrap px-3 sm:px-4"
            style={{ willChange: "transform" }}
          >
            <span
              className="text-white text-xs sm:text-sm lg:text-base"
              style={{ fontFamily }}
            >
              {fullText}
            </span>
          </div>
        </div>

        {/* Announcements label on far right (or far left in RTL) */}
        <div className="bg-[#D4AF37] px-2 sm:px-3 h-full flex items-center justify-center shrink-0">
          <Megaphone className="w-3 h-3 sm:w-4 sm:h-4 text-black" />
        </div>
      </div>
    </div>
  );
}