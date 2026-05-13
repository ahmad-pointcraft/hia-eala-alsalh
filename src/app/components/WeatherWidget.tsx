import { Droplets } from "lucide-react";
import { Cloud } from "@mui/icons-material";
import { Language } from "../utils/translations";
import type { Translations } from "../utils/translations";
import Box from "@mui/material/Box";
import Typography from "@mui/material/Typography";
import {
	toArabicNumerals,
	getFontFamily,
	getDirection,
} from "../utils/helpers";

interface WeatherWidgetProps {
	language: Language;
	translations: Translations;
}

export function WeatherWidget({ language, translations }: WeatherWidgetProps) {
	const temperature = language === "ar" ? toArabicNumerals("28") : "28";
	const humidity = language === "ar" ? toArabicNumerals("75") : "75";

	return (
		<Box
			dir={getDirection(language)}
			sx={{
				display: "flex",
				alignItems: "center",
				gap: 2,
				py: 1.5,
				px: 2.5,
			}}
		>
			<Cloud
				sx={{
					fontSize: { xs: 36, sm: 40, lg: 44 },
					color: "text.whiteMuted",
					flexShrink: 0,
				}}
			/>

			<Box sx={{ flex: 1 }}>
				<Typography
					sx={{
						color: "text.primary",
						fontSize: { xs: "1.5rem", sm: "1.75rem", lg: "2.25rem" },
						fontWeight: 800,
						lineHeight: 1.1,
					}}
				>
					{temperature}°C
				</Typography>
				<Typography
					sx={{
						color: "text.whiteMuted",
						fontSize: "12px",
						mt: 0.25,
						fontFamily: getFontFamily(language),
					}}
				>
					{language === "ar" ? "هانوي" : "Hanoi"}
				</Typography>
			</Box>

			<Box sx={{ textAlign: "end" }}>
				<Typography
					sx={{
						color: "text.whiteSoft",
						fontSize: { xs: "0.75rem", sm: "0.875rem", lg: "0.875rem" },
						fontFamily: getFontFamily(language),
					}}
				>
					{translations.weather?.partlyCloudy || "Partly Cloudy"}
				</Typography>
				<Box
					sx={{
						display: "flex",
						alignItems: "center",
						gap: 0.5,
						color: "text.whiteMuted",
						fontSize: "12px",
						mt: 0.25,
						justifyContent: "flex-end",
					}}
				>
					<Droplets style={{ width: "1em", height: "1em" }} />
					<Typography component="span" sx={{ fontSize: "12px" }}>
						{humidity}%
					</Typography>
				</Box>
			</Box>
		</Box>
	);
}
