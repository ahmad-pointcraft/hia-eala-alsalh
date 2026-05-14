import { useState, useEffect, useCallback, useRef } from "react";
import { motion, AnimatePresence } from "motion/react";
import useMediaQuery from "@mui/material/useMediaQuery";
import Box from "@mui/material/Box";
import Typography from "@mui/material/Typography";
import IconButton from "@mui/material/IconButton";
import Close from "@mui/icons-material/Close";
import CalendarMonth from "@mui/icons-material/CalendarMonth";
import AccessTime from "@mui/icons-material/AccessTime";
import LocationOn from "@mui/icons-material/LocationOn";
import PeopleAlt from "@mui/icons-material/PeopleAlt";
import { Language } from "../utils/translations";
import { getFontFamily, getDirection } from "../utils/helpers";
import { colors } from "../theme/tokens";
import { ButtonBase } from "@mui/material";

interface EventDialogProps {
	language: Language;
	onClose?: () => void;
}

interface EventItem {
	category: string;
	title: string;
	speakerRole?: string;
	speakerName?: string;
	speakerBio?: string;
	dateLabel: string;
	dateDetail: string;
	timeLabel: string;
	timeDetail: string;
	locationLabel: string;
	locationDetail: string;
	description: string;
	footerText: string;
}

const eventsEn: EventItem[] = [
	{
		category: "SPECIAL ISLAMIC LECTURE",
		title: "The Science of the Quran",
		speakerRole: "Guest Speaker",
		speakerName: "Dr. Ahmed Hassan",
		speakerBio: "Islamic Scholar & Professor of Quranic Studies",
		dateLabel: "Tonight",
		dateDetail: "Wednesday, May 6",
		timeLabel: "7:30 PM - 9:00 PM",
		timeDetail: "After Maghrib Prayer",
		locationLabel: "Main Prayer Hall",
		locationDetail: "Second Floor",
		description:
			"Join us for an enlightening discussion exploring the scientific miracles mentioned in the Holy Quran. Dr. Ahmed Hassan will present fascinating insights into how modern scientific discoveries align with Quranic revelations from over 1400 years ago.",
		footerText: "Everyone Welcome • Free Admission",
	},
	{
		category: "YOUTH PROGRAM",
		title: "Youth Islamic Education Program",
		speakerRole: "Program Director",
		speakerName: "Shaykh Omar Suleiman",
		speakerBio: "Youth Counselor & Educator",
		dateLabel: "This Saturday",
		dateDetail: "Saturday, May 16",
		timeLabel: "10:00 AM - 12:00 PM",
		timeDetail: "Morning Session",
		locationLabel: "Community Center",
		locationDetail: "Building B",
		description:
			"An engaging weekend program designed specifically for our youth to learn about Islamic values, history, and character building through interactive activities and discussions.",
		footerText: "Ages 12-18 • Registration Required",
	},
	{
		category: "COMMUNITY SERVICE",
		title: "Community Food Bank Drive",
		speakerRole: "Coordinator",
		speakerName: "Sr. Aisha Rahman",
		speakerBio: "Head of Community Outreach",
		dateLabel: "This Sunday",
		dateDetail: "Sunday, May 17",
		timeLabel: "1:30 PM - 4:00 PM",
		timeDetail: "After Dhuhr Prayer",
		locationLabel: "Masjid Parking Lot",
		locationDetail: "Donation Tent",
		description:
			"Help us support local families in need. We are collecting non-perishable food items, canned goods, and essential supplies. Volunteers are welcome to assist with sorting and packaging.",
		footerText: "Donate or Volunteer • Every Contribution Helps",
	},
];

const eventsAr: EventItem[] = [
	{
		category: "محاضرة إسلامية خاصة",
		title: "العلم في القرآن الكريم",
		speakerRole: "المتحدث الضيف",
		speakerName: "د. أحمد حسن",
		speakerBio: "عالم إسلامي وأستاذ الدراسات القرآنية",
		dateLabel: "الليلة",
		dateDetail: "الأربعاء، ٦ مايو",
		timeLabel: "٧:٣٠ م - ٩:٠٠ م",
		timeDetail: "بعد صلاة المغرب",
		locationLabel: "قاعة الصلاة الرئيسية",
		locationDetail: "الطابق الثاني",
		description:
			"انضموا إلينا في نقاش تنويري يستكشف المعجزات العلمية المذكورة في القرآن الكريم. سيقدم الدكتور أحمد حسن رؤى رائعة حول كيفية توافق الاكتشافات العلمية الحديثة مع الوحي القرآني منذ أكثر من ١٤٠٠ عام.",
		footerText: "الدعوة عامة • الدخول مجاني",
	},
	{
		category: "برنامج الشباب",
		title: "برنامج التعليم الإسلامي للشباب",
		speakerRole: "مدير البرنامج",
		speakerName: "الشيخ عمر سليمان",
		speakerBio: "مستشار ومعلم للشباب",
		dateLabel: "هذا السبت",
		dateDetail: "السبت، ١٦ مايو",
		timeLabel: "١٠:٠٠ ص - ١٢:٠٠ م",
		timeDetail: "الجلسة الصباحية",
		locationLabel: "المركز المجتمعي",
		locationDetail: "المبنى ب",
		description:
			"برنامج تفاعلي في عطلة نهاية الأسبوع مصمم خصيصًا لشبابنا لتعلم القيم الإسلامية والتاريخ وبناء الشخصية من خلال الأنشطة التفاعلية والمناقشات.",
		footerText: "الأعمار ١٢-١٨ • التسجيل مطلوب",
	},
	{
		category: "خدمة المجتمع",
		title: "حملة بنك الطعام المجتمعي",
		speakerRole: "المنسق",
		speakerName: "الأخت عائشة رحمن",
		speakerBio: "رئيسة قسم التواصل المجتمعي",
		dateLabel: "هذا الأحد",
		dateDetail: "الأحد، ١٧ مايو",
		timeLabel: "١:٣٠ م - ٤:٠٠ م",
		timeDetail: "بعد صلاة الظهر",
		locationLabel: "موقف سيارات المسجد",
		locationDetail: "خيمة التبرعات",
		description:
			"ساعدونا في دعم العائلات المحلية المحتاجة. نقوم بجمع المواد الغذائية غير القابلة للتلف والسلع المعلبة والإمدادات الأساسية. نرحب بالمتطوعين للمساعدة في الفرز والتعبئة.",
		footerText: "تبرع أو تطوع • كل مساهمة تصنع فرقاً",
	},
];

const IslamicStar = (props: React.SVGProps<SVGSVGElement>) => (
	<svg viewBox="0 0 100 100" fill="currentColor" {...props}>
		<rect x="25" y="25" width="50" height="50" />
		<rect x="25" y="25" width="50" height="50" transform="rotate(45 50 50)" />
	</svg>
);

export function EventDialog({ language, onClose }: EventDialogProps) {
	const dir = getDirection(language);
	const fontFamily = getFontFamily(language);
	const events = language === "ar" ? eventsAr : eventsEn;
	const prefersReducedMotion = useMediaQuery(
		"(prefers-reduced-motion: reduce)",
	);

	const [slideIndex, setSlideIndex] = useState(0);
	const slideIntervalRef = useRef<ReturnType<typeof setInterval> | null>(null);

	const startSlideTimer = useCallback(() => {
		if (slideIntervalRef.current) clearInterval(slideIntervalRef.current);
		slideIntervalRef.current = setInterval(() => {
			setSlideIndex((prev) => (prev + 1) % events.length);
		}, 10000);
	}, [events.length]);

	useEffect(() => {
		startSlideTimer();
		return () => {
			if (slideIntervalRef.current) clearInterval(slideIntervalRef.current);
		};
	}, [startSlideTimer]);

	const handleDotClick = (index: number) => {
		setSlideIndex(index);
		startSlideTimer(); // Reset the 10s timer when manually clicking
	};

	const handleClose = useCallback(() => {
		onClose?.();
	}, [onClose]);

	useEffect(() => {
		const mainTimer = setTimeout(() => {
			handleClose();
		}, 32000);
		return () => clearTimeout(mainTimer);
	}, [handleClose]);

	const currentEvent = events[slideIndex];
	if (!currentEvent) return null;

	return (
		<AnimatePresence>
			<Box
				role="dialog"
				aria-modal="true"
				aria-label={currentEvent.title}
				sx={{
					position: "fixed",
					inset: 0,
					zIndex: 1300,
					display: "flex",
					alignItems: "center",
					justifyContent: "center",
					bgcolor: "surface.deep",
					backdropFilter: "blur(12px)",
				}}
				dir={dir}>
				<motion.div
					initial={{ opacity: 0, scale: 0.95 }}
					animate={{ opacity: 1, scale: 1 }}
					exit={{ opacity: 0, scale: 0.95 }}
					transition={
						prefersReducedMotion
							? { duration: 0 }
							: { duration: 0.4, ease: [0.25, 1, 0.5, 1] }
					}
					style={{
						width: "98%",
						height: "95%",
						maxWidth: "1600px",
						maxHeight: "1000px",
					}}>
					<Box
						sx={{
							position: "relative",
							width: "100%",
							height: "100%",
							bgcolor: "background.default",
							border: "1px solid",
							borderColor: "border.thin",
							borderRadius: "32px",
							overflow: "hidden",
							boxShadow: `0 24px 80px rgba(0,0,0,0.6)`,
							display: "flex",
							flexDirection: "column",
						}}>
						{/* Islamic Star Corners */}
						<Box
							sx={{
								position: "absolute",
								top: 32,
								left: 32,
								color: "gold.main",
								opacity: 0.3,
							}}>
							<IslamicStar width="24" height="24" />
						</Box>
						<Box
							sx={{
								position: "absolute",
								bottom: 32,
								left: 32,
								color: "gold.main",
								opacity: 0.3,
							}}>
							<IslamicStar width="24" height="24" />
						</Box>
						<Box
							sx={{
								position: "absolute",
								bottom: 32,
								right: 32,
								color: "gold.main",
								opacity: 0.3,
							}}>
							<IslamicStar width="24" height="24" />
						</Box>

						{/* Close Button */}
						<IconButton
							onClick={handleClose}
							sx={{
								position: "absolute",
								top: 24,
								right: 24,
								color: "text.whiteMuted",
								zIndex: 20,
								"&:hover": {
									color: "text.primary",
									bgcolor: "rgba(255,255,255,0.1)",
								},
							}}
							aria-label={language === "en" ? "Close" : "إغلاق"}>
							<Close />
						</IconButton>

						<Box sx={{ flex: 1, position: "relative" }}>
							<AnimatePresence mode="wait">
								<motion.div
									key={slideIndex}
									initial={{ opacity: 0, y: 20 }}
									animate={{ opacity: 1, y: 0 }}
									exit={{ opacity: 0, y: -20 }}
									transition={
										prefersReducedMotion
											? { duration: 0 }
											: { duration: 0.5, ease: [0.25, 1, 0.5, 1] }
									}
									style={{
										width: "100%",
										height: "100%",
										display: "flex",
										flexDirection: "column",
										justifyContent: "center",
										alignItems: "center",
										padding: "32px 64px",
									}}>
									<Box sx={{ textAlign: "center", mb: 6, maxWidth: "800px" }}>
										<Box
											sx={{
												display: "inline-block",
												px: 3,
												py: 0.75,
												borderRadius: "100px",
												border: "1px solid",
												borderColor: "gold.main",
												bgcolor: "rgba(212,175,55,0.1)",
												mb: 4,
											}}>
											<Typography
												sx={{
													color: "gold.main",
													fontSize: "0.875rem",
													fontWeight: 700,
													letterSpacing: "0.1em",
													textTransform: "uppercase",
													fontFamily,
												}}>
												{currentEvent.category}
											</Typography>
										</Box>

										<Typography
											sx={{
												color: "gold.light",
												fontSize: { xs: "2.5rem", lg: "3.5rem" },
												fontWeight: 600,
												fontFamily,
												mb: 3,
												lineHeight: 1.2,
											}}>
											{currentEvent.title}
										</Typography>

										{(currentEvent.speakerName || currentEvent.speakerRole) && (
											<Box sx={{ mb: 4 }}>
												<Typography
													sx={{
														color: "text.whiteMuted",
														fontSize: "1rem",
														mb: 0.5,
														fontFamily,
													}}>
													{currentEvent.speakerRole}
												</Typography>
												<Typography
													sx={{
														color: "text.primary",
														fontSize: "1.75rem",
														fontWeight: 600,
														fontFamily,
														mb: 0.5,
													}}>
													{currentEvent.speakerName}
												</Typography>
												<Typography
													sx={{
														color: "text.whiteSoft",
														fontSize: "1rem",
														fontFamily,
													}}>
													{currentEvent.speakerBio}
												</Typography>
											</Box>
										)}
									</Box>

									<Box sx={{ display: "flex", gap: 3, width: "100%", mb: 5 }}>
										{[
											{
												icon: (
													<CalendarMonth
														sx={{ color: "gold.main", mb: 1, fontSize: 32 }}
													/>
												),
												label: language === "en" ? "DATE" : "التاريخ",
												main: currentEvent.dateLabel,
												sub: currentEvent.dateDetail,
											},
											{
												icon: (
													<AccessTime
														sx={{ color: "gold.main", mb: 1, fontSize: 32 }}
													/>
												),
												label: language === "en" ? "TIME" : "الوقت",
												main: currentEvent.timeLabel,
												sub: currentEvent.timeDetail,
											},
											{
												icon: (
													<LocationOn
														sx={{ color: "gold.main", mb: 1, fontSize: 32 }}
													/>
												),
												label: language === "en" ? "LOCATION" : "المكان",
												main: currentEvent.locationLabel,
												sub: currentEvent.locationDetail,
											},
										].map((card, i) => (
											<Box
												key={i}
												sx={{
													flex: 1,
													bgcolor: "surface.raised",
													border: "1px solid",
													borderColor: "border.thin",
													borderRadius: "16px",
													p: 3,
													display: "flex",
													flexDirection: "column",
													alignItems: "center",
													textAlign: "center",
												}}>
												{card.icon}
												<Typography
													sx={{
														color: "text.whiteMuted",
														fontSize: "0.75rem",
														letterSpacing: "0.1em",
														fontWeight: 700,
														mb: 1,
														fontFamily,
													}}>
													{card.label}
												</Typography>
												<Typography
													sx={{
														color: "text.primary",
														fontSize: "1.25rem",
														fontWeight: 600,
														mb: 0.5,
														fontFamily,
													}}>
													{card.main}
												</Typography>
												<Typography
													sx={{
														color: "text.whiteSoft",
														fontSize: "0.875rem",
														fontFamily,
													}}>
													{card.sub}
												</Typography>
											</Box>
										))}
									</Box>

									<Box
										sx={{
											bgcolor: "surface.raised",
											border: "1px solid",
											borderColor: "border.thin",
											borderRadius: "16px",
											p: 4,
											width: "100%",
											mb: 6,
										}}>
										<Typography
											sx={{
												color: "text.whiteSoft",
												fontSize: "1.125rem",
												lineHeight: 1.6,
												textAlign: "center",
												fontFamily,
											}}>
											{currentEvent.description}
										</Typography>
									</Box>

									<Box
										sx={{
											display: "inline-flex",
											alignItems: "center",
											gap: 1.5,
											bgcolor: "gold.main",
											px: 4,
											py: 2,
											borderRadius: "100px",
											boxShadow: `0 0 40px ${colors.glow.medium}`,
										}}>
										<PeopleAlt sx={{ color: "text.onGold", fontSize: 24 }} />
										<Typography
											sx={{
												color: "text.onGold",
												fontWeight: 700,
												fontSize: "1.125rem",
												fontFamily,
											}}>
											{currentEvent.footerText}
										</Typography>
									</Box>
								</motion.div>
							</AnimatePresence>
						</Box>

						{/* Dots Indicator */}
						<Box
							sx={{
								display: "flex",
								justifyContent: "center",
								gap: 1.5,
								pb: 4,
								pt: 2,
								zIndex: 10,
								flexShrink: 0,
							}}>
							{events.map((_, index) => (
								<ButtonBase
									key={index}
									onClick={() => handleDotClick(index)}
									sx={{
										width: 12,
										height: 12,
										borderRadius: "50%",
										bgcolor:
											slideIndex === index
												? "gold.main"
												: "rgba(255,255,255,0.2)",
										transition: "all 0.3s ease",
										"&:hover": {
											bgcolor:
												slideIndex === index
													? "gold.main"
													: "rgba(255,255,255,0.4)",
										},
									}}
									aria-label={`Go to slide ${index + 1}`}
								/>
							))}
						</Box>
					</Box>
				</motion.div>
			</Box>
		</AnimatePresence>
	);
}
