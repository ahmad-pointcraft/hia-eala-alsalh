import { Sunrise, Sunset } from "lucide-react";
import { Language } from "../utils/translations";
import type { Translations } from "../utils/translations";
import Box from "@mui/material/Box";
import Typography from "@mui/material/Typography";
import { toArabicNumerals, getDirection } from "../utils/helpers";

interface SunTimesWidgetProps {
	language: Language;
	translations: Translations;
	sunriseTime: string;
	sunsetTime: string;
}

const cardSx = {
	flex: 1,
	display: "flex",
	flexDirection: "column",
	alignItems: "center",
	justifyContent: "center",
	gap: 0.5,
	bgcolor: "surface.raised",
	border: "1px solid",
	borderColor: "border.thin",
	borderRadius: "24px",
	backdropFilter: "blur(16px)",
	boxShadow: "0 8px 32px rgba(0,0,0,0.3)",
	py: 1.5,
	px: 2.5,
} as const;

const labelSx = {
	color: "text.whiteMuted",
	textTransform: "uppercase",
	letterSpacing: "0.15em",
	fontWeight: 600,
	fontSize: "9px",
	lineHeight: 1,
} as const;

const timeSx = {
	fontFamily: '"Roboto Mono", monospace',
	fontSize: { xs: "18px", sm: "20px", lg: "24px" },
	fontWeight: 700,
	color: "text.primary",
	letterSpacing: "0.05em",
	lineHeight: 1.1,
} as const;

export function SunTimesWidget({
	language,
	translations,
	sunriseTime,
	sunsetTime,
}: SunTimesWidgetProps) {
	const dir = getDirection(language);
	const displaySunrise =
		language === "ar" ? toArabicNumerals(sunriseTime) : sunriseTime;
	const displaySunset =
		language === "ar" ? toArabicNumerals(sunsetTime) : sunsetTime;

	return (
		<Box dir={dir} sx={{ display: "flex", gap: 1.5 }}>
			<Box sx={cardSx}>
				<Sunrise
					size={26}
					style={{ color: "rgba(255,255,255,0.4)", flexShrink: 0 }}
				/>
				<Typography sx={labelSx}>
					{translations.prayers.sunrise}
				</Typography>
				<Typography sx={timeSx}>{displaySunrise}</Typography>
			</Box>
			<Box sx={cardSx}>
				<Sunset
					size={26}
					style={{ color: "rgba(255,255,255,0.4)", flexShrink: 0 }}
				/>
				<Typography sx={labelSx}>{translations.sunset}</Typography>
				<Typography sx={timeSx}>{displaySunset}</Typography>
			</Box>
		</Box>
	);
}
