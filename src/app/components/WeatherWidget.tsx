import { Droplets } from "lucide-react";
import { Cloud } from "@mui/icons-material";
import { Language } from "../utils/translations";
import type { Translations } from "../utils/translations";
import { Paper, Box, Typography } from "@mui/material";
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
		<Paper
			dir={getDirection(language)}
			sx={{
				height: "100%",
				display: "flex",
				flexDirection: "column",
				justifyContent: "center",
				bgcolor: "background.paper",
				backdropFilter: "blur(4px)",
				border: "1px solid",
				borderColor: "border.medium",
				borderRadius: 2,
				p: { xs: 1, sm: 1.5 },
			}}>
			<Box
				sx={{
					display: "flex",
					alignItems: "center",
					justifyContent: "space-between",
					gap: { xs: 1, sm: 2 },
					width: "100%",
				}}>
				<Box
					sx={{
						display: "flex",
						alignItems: "center",
						gap: { xs: 1, sm: 1.5 },
					}}>
					<Cloud
						sx={{
							width: { xs: 32, sm: 40, lg: 48 },
							height: { xs: 32, sm: 40, lg: 48 },
							color: "text.secondary",
						}}
					/>
					<Box>
						<Typography
							sx={{
								color: "text.primary",
								fontSize: { xs: "1.25rem", sm: "1.5rem", lg: "1.875rem" },
								fontWeight: "bold",
							}}>
							{temperature}°C
						</Typography>
						<Typography
							sx={{
								color: "text.secondary",
								fontSize: { xs: "0.75rem", sm: "0.875rem", lg: "1rem" },
								mt: 0.5,
								fontFamily: getFontFamily(language),
							}}>
							{language === "ar" ? "هانوي" : "Hanoi"}
						</Typography>
					</Box>
				</Box>

				<Box sx={{ textAlign: "end" }}>
					<Typography
						sx={{
							color: "grey.300",
							fontSize: { xs: "0.75rem", sm: "0.875rem", lg: "1rem" },
							fontFamily: getFontFamily(language),
						}}>
						{translations.weather?.partlyCloudy || "Partly Cloudy"}
					</Typography>
					<Box
						sx={{
							display: "flex",
							alignItems: "center",
							gap: 0.5,
							color: "text.secondary",
							fontSize: { xs: "0.75rem", sm: "0.875rem" },
							mt: 0.5,
							justifyContent: "flex-end",
						}}>
						<Droplets style={{ width: "1.25em", height: "1.25em" }} />
						<Typography component="span">{humidity}%</Typography>
					</Box>
				</Box>
			</Box>
		</Paper>
	);
}
