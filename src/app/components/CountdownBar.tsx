import { useRef, useEffect } from "react";
import { Language } from "../utils/translations";
import Box from "@mui/material/Box";
import Typography from "@mui/material/Typography";
import {
	toArabicNumerals,
	getFontFamily,
	getDirection,
} from "../utils/helpers";

interface CountdownBarProps {
	nextPrayer: string;
	nextPrayerTime: string;
	nextPrayerIqamaTime: string;
	language: Language;
	currentTime: Date;
}

export function CountdownBar({
	nextPrayer,
	nextPrayerTime,
	nextPrayerIqamaTime,
	language,
	currentTime,
}: CountdownBarProps) {
	const lastAnnouncedMinute = useRef<number>(-1);
	const pendingAnnouncement = useRef<string | undefined>(undefined);

	const [hours = 0, minutes = 0] = nextPrayerTime.split(":").map(Number);
	const target = new Date(currentTime);
	target.setHours(hours, minutes, 0, 0);

	if (target < currentTime) {
		target.setDate(target.getDate() + 1);
	}

	const diff = target.getTime() - currentTime.getTime();
	const h = Math.floor(diff / (1000 * 60 * 60));
	const m = Math.floor((diff % (1000 * 60 * 60)) / (1000 * 60));
	const s = Math.floor((diff % (1000 * 60)) / 1000);

	const countdown = `${String(h).padStart(2, "0")}:${String(m).padStart(2, "0")}:${String(s).padStart(2, "0")}`;
	const displayCountdown =
		language === "ar" ? toArabicNumerals(countdown) : countdown;

	const displayPrayerTime = language === "ar" ? toArabicNumerals(nextPrayerTime) : nextPrayerTime;
	const displayIqamaTime = language === "ar" ? toArabicNumerals(nextPrayerIqamaTime) : nextPrayerIqamaTime;

	const nextPrayerLabel = language === "en" ? "Next Prayer" : "الصلاة القادمة";

	const subtitleText = language === "en"
		? `${nextPrayer} at ${displayPrayerTime} · Iqama ${displayIqamaTime}`
		: `${nextPrayer} الساعة ${displayPrayerTime} · الإقامة ${displayIqamaTime}`;

	const currentMinute = m;
	useEffect(() => {
		if (currentMinute !== lastAnnouncedMinute.current) {
			lastAnnouncedMinute.current = currentMinute;
			pendingAnnouncement.current =
				language === "ar"
					? `${nextPrayer} ${toArabicNumerals(countdown)}`
					: `${nextPrayer} in ${countdown}`;
		} else {
			pendingAnnouncement.current = undefined;
		}
	});

	return (
		<Box
			dir={getDirection(language)}
			role="timer"
			sx={{
				display: "flex",
				flexDirection: "column",
				alignItems: "center",
				justifyContent: "center",
				height: "100%",
				py: { xs: 2, sm: 2.5, md: 3, lg: 3 },
				px: { xs: 1.5, sm: 2, md: 2, lg: 2 },
			}}
		>
			<Typography
				sx={{
					color: "text.whiteMuted",
					textTransform: "uppercase",
					letterSpacing: "0.15em",
				fontWeight: 600,
				fontSize: { xs: "10px", sm: "11px", md: "12px", lg: "13px" },
				fontFamily: getFontFamily(language),
				}}
			>
				{nextPrayerLabel}
			</Typography>

			<Typography
				sx={{
					color: "primary.main",
					fontWeight: 800,
					fontSize: { xs: "28px", sm: "34px", md: "37px", lg: "40px" },
					fontFamily: getFontFamily(language),
					mt: 1,
					lineHeight: 1.2,
				}}
			>
				{nextPrayer}
			</Typography>

			<Typography
				sx={{
					color: "text.primary",
					fontFamily: '"Roboto Mono", monospace',
					fontWeight: 700,
					letterSpacing: "0.05em",
					fontSize: { xs: "36px", sm: "48px", md: "54px", lg: "64px" },
					lineHeight: 1.1,
					mt: 1,
				}}
			>
				{displayCountdown}
			</Typography>

			<Typography
				sx={{
					color: "text.whiteMuted",
					fontSize: { xs: "11px", sm: "12px", md: "12px", lg: "13px" },
					fontFamily: getFontFamily(language),
					mt: 1.25,
				}}
			>
				{subtitleText}
			</Typography>

			{pendingAnnouncement.current !== undefined && (
				<Box
					component="span"
					role="status"
					aria-live="polite"
					aria-atomic="true"
					sx={{
						position: "absolute",
						width: 1,
						height: 1,
						padding: 0,
						margin: -1,
						overflow: "hidden",
						clip: "rect(0, 0, 0, 0)",
						whiteSpace: "nowrap",
						borderWidth: 0,
					}}
				>
					{pendingAnnouncement.current}
				</Box>
			)}
		</Box>
	);
}
