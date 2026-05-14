import { useState, useEffect, useRef, useMemo } from "react";
import { motion, AnimatePresence } from "motion/react";
import useMediaQuery from "@mui/material/useMediaQuery";
import Box from "@mui/material/Box";
import Stack from "@mui/material/Stack";

import { Header } from "./components/Header";
import { PrayerCard } from "./components/PrayerCard";
import { CountdownBar } from "./components/CountdownBar";
import { HadithPanel } from "./components/HadithPanel";
import { SunTimesWidget } from "./components/SunTimesWidget";
import { AnnouncementsTicker } from "./components/AnnouncementsTicker";
import { FundraisingOverlay } from "./components/FundraisingOverlay";
import { IslamicGeometricOverlay } from "./components/IslamicGeometricOverlay";
import { EventSlideshow } from "./components/EventSlideshow";
import type { EventSlide } from "./components/EventSlideshow";
import { translations, Language } from "./utils/translations";
import {
	getCurrentPrayer,
	getNextPrayer,
	getTimeToNextPrayer,
} from "./utils/prayerTimes";
import type { PrayerTime } from "./utils/prayerTimes";
import { useClock } from "./utils/useClock";
import { getDirection } from "./utils/helpers";
import { colors } from "./theme/tokens";
import mosque1 from "../assets/mosque-1.jpg";
import mosque2 from "../assets/mosque-2.jpg";
import mosque3 from "../assets/mosque-3.jpg";

const floatingCardSx = {
	bgcolor: "surface.raised",
	border: "1px solid",
	borderColor: "border.thin",
	borderRadius: "24px",
	backdropFilter: "blur(16px)",
	boxShadow: `0 8px 32px ${colors.surface.overlay}`,
} as const;

export default function App() {
	const [showFundraising, setShowFundraising] = useState(false);
	const [language, setLanguage] = useState<Language>("en");
	const { currentTime } = useClock();
	const fundraisingTimerRef = useRef<ReturnType<typeof setTimeout> | null>(
		null,
	);
	const prefersReducedMotion = useMediaQuery(
		"(prefers-reduced-motion: reduce)",
	);
	const defaultTransition = useMemo(
		() => (prefersReducedMotion ? { duration: 0 } : undefined),
		[prefersReducedMotion],
	);

	const carouselImages = [mosque1, mosque2, mosque3];

	const t = translations[language];

	const eventSlides: EventSlide[] = t.events.map((e) => ({
		title: e.title,
		speakerName: e.speakerName,
		dateValue: e.dateValue,
		timeValue: e.timeValue,
		locationValue: e.locationValue,
		badge: e.badge,
		cta: e.cta,
	}));

	const prayers: PrayerTime[] = [
		{ name: t.prayers.fajr, key: "Fajr", time: "05:30", iqamaTime: "05:45" },
		{
			name: t.prayers.sunrise,
			key: "Sunrise",
			time: "06:52",
			iqamaTime: "\u2014",
		},
		{ name: t.prayers.dhuhr, key: "Dhuhr", time: "12:45", iqamaTime: "13:00" },
		{ name: t.prayers.asr, key: "Asr", time: "16:15", iqamaTime: "16:30" },
		{
			name: t.prayers.maghrib,
			key: "Maghrib",
			time: "19:28",
			iqamaTime: "19:30",
		},
		{ name: t.prayers.isha, key: "Isha", time: "20:45", iqamaTime: "21:00" },
	];

	const activePrayer = getCurrentPrayer(prayers, currentTime);
	const nextPrayer = getNextPrayer(prayers, currentTime);

	useEffect(() => {
		const scheduleFundraising = () => {
			if (fundraisingTimerRef.current) {
				clearTimeout(fundraisingTimerRef.current);
			}
			fundraisingTimerRef.current = setTimeout(
				() => {
					if (getTimeToNextPrayer(prayers, new Date()) > 10 * 60) {
						setShowFundraising(true);
					}
					scheduleFundraising();
				},
				10 * 60 * 1000,
			);
		};

		fundraisingTimerRef.current = setTimeout(
			() => {
				if (getTimeToNextPrayer(prayers, new Date()) > 10 * 60) {
					setShowFundraising(true);
				}
				scheduleFundraising();
			},
			1 * 60 * 1000,
		);

		return () => {
			if (fundraisingTimerRef.current) {
				clearTimeout(fundraisingTimerRef.current);
			}
		};
	}, [prayers]);

	const toggleLanguage = () => {
		setLanguage((prev) => (prev === "en" ? "ar" : "en"));
	};

	const prayerPrayers = prayers.filter((p) => p.key !== "Sunrise");
	const sunrisePrayer = prayers.find((p) => p.key === "Sunrise");
	const sunsetTime = prayers.find((p) => p.key === "Maghrib")?.time ?? "19:28";

	const isPraying = useMemo(() => {
		const nowMinutes = currentTime.getHours() * 60 + currentTime.getMinutes();
		return prayerPrayers.some((p) => {
			if (p.iqamaTime === "\u2014") return false;
			const [ih = 0, im = 0] = p.iqamaTime.split(":").map(Number);
			const iqamaMinutes = ih * 60 + im;
			return nowMinutes >= iqamaMinutes && nowMinutes < iqamaMinutes + 5;
		});
	}, [currentTime, prayerPrayers]);

	return (
		<Box
			sx={{
				position: "relative",
				width: "100%",
				height: "100vh",
				overflow: "hidden",
			}}>
			<Box
				sx={{
					position: "absolute",
					inset: 0,
					bgcolor: "background.default",
				}}
			/>

			<Stack sx={{ position: "relative", zIndex: 10, height: "100%" }}>
				<Header
					language={language}
					onToggleLanguage={toggleLanguage}
					onShowFundraising={() => setShowFundraising(true)}
					translations={t}
					currentTime={currentTime}
				/>

				{isPraying && (
					<Box
						role="alert"
						aria-label={
							language === "en" ? "Prayer in progress" : "الصلاة جارية"
						}
						sx={{
							position: "absolute",
							inset: 0,
							zIndex: 20,
							display: "flex",
							alignItems: "center",
							justifyContent: "center",
							bgcolor: `${colors.background.default}D9`,
						}}>
						<Box sx={{ opacity: 0.3, position: "absolute", inset: 0 }}>
							<IslamicGeometricOverlay />
						</Box>
					</Box>
				)}

				<AnimatePresence mode="wait">
					<motion.div
						key="normal-mode"
						initial={{ opacity: 0 }}
						animate={{ opacity: 1 }}
						exit={{ opacity: 0 }}
						transition={
							defaultTransition ?? { duration: 0.5, ease: [0.25, 1, 0.5, 1] }
						}
						style={{
							flex: 1,
							display: "flex",
							flexDirection: "column",
							overflow: "hidden",
						}}>
						<Box
							sx={{
								flex: 1,
								display: "flex",
								flexDirection: "column",
								gap: 1.5,
								px: "48px",
								py: 1.5,
								overflow: "hidden",
							}}>
							<Box sx={{ display: "flex", gap: 2, flex: 1, minHeight: 0 }}>
								<Box sx={{ flex: 3.15, minWidth: 0 }}>
									<EventSlideshow
										events={eventSlides}
										images={carouselImages}
										interval={5000}
										language={language}
									/>
								</Box>
								<Box sx={{ flex: 2, ...floatingCardSx, minWidth: 0 }}>
									<CountdownBar
										nextPrayer={nextPrayer.name}
										nextPrayerTime={nextPrayer.time}
										nextPrayerIqamaTime={nextPrayer.iqamaTime}
										language={language}
										currentTime={currentTime}
									/>
								</Box>
							</Box>

							<Box sx={{ display: "flex", gap: 2, flexShrink: 0 }}>
								<Box sx={{ flex: 3, ...floatingCardSx, minWidth: 0 }}>
									<HadithPanel language={language} translations={t} />
								</Box>
								<Box sx={{ flex: 2, display: "flex", minWidth: 0 }}>
									<SunTimesWidget
										language={language}
										translations={t}
										sunriseTime={sunrisePrayer?.time ?? "--:--"}
										sunsetTime={sunsetTime}
									/>
								</Box>
							</Box>
						</Box>

						<Box sx={{ flexShrink: 0, px: "48px", pb: 1 }}>
							<Box
								dir={getDirection(language)}
								sx={{
									display: "flex",
									gap: 1.5,
									alignItems: "stretch",
								}}>
								{prayerPrayers.map((prayer, index) => (
									<Box
										key={prayer.key}
										sx={{ flex: prayer.key === activePrayer?.key ? 1.5 : 1 }}>
										<motion.div
											initial={{ opacity: 0, y: 20 }}
											animate={{ opacity: 1, y: 0 }}
											transition={
												defaultTransition ?? {
													delay: index * 0.05,
													duration: 0.3,
												}
											}>
											<PrayerCard
												name={prayer.name}
												time={prayer.time}
												iqamaTime={prayer.iqamaTime}
												isActive={prayer.key === activePrayer?.key}
												language={language}
												iqamaLabel={t.iqama}
												prayerKey={prayer.key}
											/>
										</motion.div>
									</Box>
								))}

							</Box>
						</Box>
					</motion.div>
				</AnimatePresence>

				<AnnouncementsTicker
					language={language}
					announcements={t.announcementsList}
				/>
			</Stack>

			{showFundraising && (
				<FundraisingOverlay
					onClose={() => setShowFundraising(false)}
					language={language}
					translations={t}
				/>
			)}

		</Box>
	);
}
