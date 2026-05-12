import image_logo_masjid_design_1 from "../../assets/logo-masjid-design-1.png";
import { Language } from "../utils/translations";
import type { Translations } from "../utils/translations";
import { Box, Typography } from "@mui/material";
import {
	toArabicNumerals,
	getFontFamily,
	getDirection,
} from "../utils/helpers";

interface MasjidInfoProps {
	language: Language;
	translations: Translations;
	currentTime: Date;
}

export function MasjidInfo({ language, currentTime }: MasjidInfoProps) {
	const getHijriDate = () => {
		return language === "ar" ? "١٥ ذو القعدة ١٤٤٧" : "15 Dhul-Qa'dah 1447";
	};

	const getGregorianDate = () => {
		const dateStr = currentTime.toLocaleDateString(
			language === "ar" ? "ar-SA" : "en-US",
			{
				weekday: "long",
				year: "numeric",
				month: "long",
				day: "numeric",
			},
		);
		return language === "ar" ? toArabicNumerals(dateStr) : dateStr;
	};

	return (
		<Box
			sx={{ width: "100%", px: "20px", py: "12px" }}
			dir={getDirection(language)}>
			<Box
				sx={{
					display: "flex",
					alignItems: "center",
					justifyContent: "space-between",
					gap: { xs: 1.5, lg: 3 },
				}}>
				{/* Logo - Left */}
				<Box sx={{ flexShrink: 0 }}>
					<Box
						component="img"
						src={image_logo_masjid_design_1}
						alt="Masjid Logo"
						sx={{
							width: { xs: 40, sm: 48, lg: 64 },
							height: { xs: 40, sm: 48, lg: 64 },
							objectFit: "contain",
						}}
					/>
				</Box>

				{/* Dates - Right */}
				<Box
					sx={{
						display: "flex",
						alignItems: "center",
						gap: { xs: 1, sm: 1.5 },
						textAlign: "right",
					}}>
					<Typography
						component="span"
						sx={{
							color: "text.primary",
							fontSize: { xs: "0.75rem", sm: "0.875rem", lg: "1.125rem" },
							fontFamily: getFontFamily(language),
						}}>
						{getHijriDate()}
					</Typography>
					<Typography
						component="span"
						sx={{
							color: "text.secondary",
							fontSize: { xs: "0.875rem", lg: "1.125rem" },
						}}>
						•
					</Typography>
					<Typography
						component="span"
						sx={{
							color: "text.secondary",
							fontSize: { xs: "0.75rem", sm: "0.875rem", lg: "1.125rem" },
						}}>
						{getGregorianDate()}
					</Typography>
				</Box>
			</Box>
		</Box>
	);
}
