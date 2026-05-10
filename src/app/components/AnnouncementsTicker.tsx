import { useEffect, useRef } from "react";
import { Megaphone } from "lucide-react";
import { Language } from "../utils/translations";
import logo from "../../imports/logo.png";
import { Paper, Box, Typography } from "@mui/material";
import { getFontFamily, isRTL, getDirection } from '../utils/helpers';

interface AnnouncementsTickerProps {
	language: Language;
	announcements: string[];
}

export function AnnouncementsTicker({
	language,
	announcements,
}: AnnouncementsTickerProps) {
	const scrollRef = useRef<HTMLDivElement>(null);

	useEffect(() => {
		const element = scrollRef.current;
		if (!element) return;

		let animationId: number;
		let position = 0;
		const speed = isRTL(language) ? 0.4 : -0.4;

		const animate = () => {
			position += speed;

			if (isRTL(language)) {
				if (position >= element.scrollWidth / 2) {
					position = 0;
				}
			} else {
				if (position <= -element.scrollWidth / 2) {
					position = 0;
				}
			}

			element.style.transform = `translateX(${position}px)`;
			animationId = requestAnimationFrame(animate);
		};

		animationId = requestAnimationFrame(animate);
		return () => cancelAnimationFrame(animationId);
	}, [language]);

	const separator = language === "ar" ? " • " : " • ";
	const fullText =
		announcements.join(separator) + separator + announcements.join(separator);

	return (
		<Paper
			sx={{
				width: "100%",
				bgcolor: "rgba(0,0,0,0.4)",
				backdropFilter: "blur(4px)",
				borderTop: "1px solid",
				borderColor: "rgba(212,175,55,0.3)",
				overflow: "hidden",
				borderRadius: 0,
			}}
			dir={getDirection(language)}
			square>
			<Box
				sx={{
					display: "flex",
					alignItems: "center",
					height: { xs: 32, sm: 36, lg: 40 },
				}}>
				{/* Logo on far left (or far right in RTL) */}
				<Box
					sx={{
						px: { xs: 1, sm: 1.5 },
						height: "100%",
						display: "flex",
						alignItems: "center",
						justifyContent: "center",
						flexShrink: 0,
						bgcolor: "rgba(0,0,0,0.6)",
					}}>
					<Box
						component="img"
						src={logo}
						alt="Logo"
						sx={{ height: { xs: 20, sm: 24, lg: 28 }, width: "auto" }}
					/>
				</Box>

				{/* Scrolling announcements text in the middle */}
				<Box sx={{ flex: 1, overflow: "hidden", position: "relative" }}>
					<Box
						ref={scrollRef}
						sx={{
							display: "flex",
							alignItems: "center",
							gap: { xs: 2, sm: 3 },
							whiteSpace: "nowrap",
							px: { xs: 1.5, sm: 2 },
							willChange: "transform",
						}}>
						<Typography
							component="span"
							sx={{
								color: "text.primary",
								fontSize: { xs: "0.75rem", sm: "0.875rem", lg: "1rem" },
								fontFamily: getFontFamily(language),
							}}>
							{fullText}
						</Typography>
					</Box>
				</Box>

				{/* Announcements label on far right (or far left in RTL) */}
				<Box
					sx={{
						bgcolor: "primary.main",
						px: { xs: 1, sm: 1.5 },
						height: "100%",
						display: "flex",
						alignItems: "center",
						justifyContent: "center",
						flexShrink: 0,
					}}>
					<Megaphone style={{ width: "1em", height: "1em", color: "black" }} />
				</Box>
			</Box>
		</Paper>
	);
}
