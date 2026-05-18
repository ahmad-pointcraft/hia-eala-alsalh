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

const FUNDRAISING_PRAYER_GAP_SECONDS = 1 * 60;
const FUNDRAISING_MIN_SECONDS = 3;
const FUNDRAISING_MAX_SECONDS = 6;

function getRandomFundraisingDelay() {
	const range = FUNDRAISING_MAX_SECONDS - FUNDRAISING_MIN_SECONDS;
	const seconds = FUNDRAISING_MIN_SECONDS + Math.random() * range;
	return seconds * 1000;
}

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
			fundraisingTimerRef.current = setTimeout(() => {
				if (
					getTimeToNextPrayer(prayers, new Date()) >
					FUNDRAISING_PRAYER_GAP_SECONDS
				) {
					setShowFundraising(true);
				}
				scheduleFundraising();
			}, getRandomFundraisingDelay());
		};

		fundraisingTimerRef.current = setTimeout(() => {
			if (
				getTimeToNextPrayer(prayers, new Date()) >
				FUNDRAISING_PRAYER_GAP_SECONDS
			) {
				setShowFundraising(true);
			}
			scheduleFundraising();
		}, getRandomFundraisingDelay());

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
				"@media (prefers-reduced-motion: no-preference)": {
					animation: "pixelShift 60s ease-in-out infinite",
				},
				"@keyframes pixelShift": {
					"0%, 95%": { transform: "translate(0, 0)" },
					"100%": { transform: "translate(1px, 1px)" },
				},
			}}>
			<Box
				sx={{
					position: "absolute",
					inset: 0,
					bgcolor: "background.default",
				}}
			/>

			<Stack
				sx={{
					position: "relative",
					zIndex: 10,
					height: "100%",
					maxWidth: "2560px",
					mx: "auto",
					width: "100%",
				}}>
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
								gap: { xs: 1, sm: 1.5, md: 2, lg: 2 },
								px: { xs: 2, sm: 3, md: 4, lg: 6 },
								py: { xs: 1, sm: 1.5, md: 1.5, lg: 1.5 },
								overflow: "hidden",
							}}>
							<Box
								sx={{
									display: "flex",
									flexDirection: { xs: "column", sm: "row" },
									gap: { xs: 1, sm: 1.5, md: 2, lg: 2 },
									flex: 1,
									minHeight: 0,
								}}>
								<Box
									sx={{
										flex: { xs: "none", sm: 3.15 },
										minWidth: 0,
										minHeight: { xs: 220, sm: 0 },
									}}>
									<EventSlideshow
										events={eventSlides}
										images={carouselImages}
										interval={5000}
										language={language}
									/>
								</Box>
								<Box
									sx={{
										flex: { xs: "none", sm: 2 },
										...floatingCardSx,
										minWidth: 0,
										minHeight: { xs: 140, sm: 0 },
									}}>
									<CountdownBar
										nextPrayer={nextPrayer.name}
										nextPrayerTime={nextPrayer.time}
										nextPrayerIqamaTime={nextPrayer.iqamaTime}
										language={language}
										currentTime={currentTime}
									/>
								</Box>
							</Box>

							<Box
								sx={{
									display: "flex",
									flexDirection: { xs: "column", sm: "row" },
									gap: { xs: 1, sm: 1.5, md: 2, lg: 2 },
									flexShrink: 0,
								}}>
								<Box
									sx={{
										flex: { xs: "none", sm: 3 },
										...floatingCardSx,
										minWidth: 0,
									}}>
									<HadithPanel language={language} translations={t} />
								</Box>
								<Box
									sx={{
										flex: { xs: "none", sm: 2 },
										display: "flex",
										minWidth: 0,
									}}>
									<SunTimesWidget
										language={language}
										translations={t}
										sunriseTime={sunrisePrayer?.time ?? "--:--"}
										sunsetTime={sunsetTime}
									/>
								</Box>
							</Box>
						</Box>

						<Box
							sx={{ flexShrink: 0, px: { xs: 2, sm: 3, md: 4, lg: 6 }, pb: 1 }}>
							<Box
								dir={getDirection(language)}
								sx={{
									display: "grid",
									gridTemplateColumns: {
										xs: "repeat(2, 1fr)",
										sm: "repeat(3, 1fr)",
										md: "repeat(5, 1fr)",
										lg: "repeat(5, 1fr)",
									},
									gap: { xs: 1, sm: 1.5, md: 2, lg: 2 },
								}}>
								{prayerPrayers.map((prayer, index) => (
									<motion.div
										key={prayer.key}
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
