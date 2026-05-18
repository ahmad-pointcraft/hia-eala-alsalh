import { Language } from "../utils/translations";
import type { Translations } from "../utils/translations";
import Box from "@mui/material/Box";
import Typography from "@mui/material/Typography";
import { getFontFamily, getDirection } from "../utils/helpers";

interface HadithPanelProps {
	language: Language;
	translations: Translations;
}

export function HadithPanel({ language, translations }: HadithPanelProps) {
	return (
		<Box
			dir={getDirection(language)}
			sx={{
				width: "100%",
				py: { xs: 1, sm: 1.5, md: 1.5, lg: 1.5 },
				px: { xs: 1.5, sm: 2, md: 2.5, lg: 2.5 },
				display: "flex",
				flexDirection: "column",
				justifyContent: "space-between",
				height: "100%",
			}}>
			<Box>
				<Typography
					sx={{
						color: "text.whiteMuted",
						textTransform: "uppercase",
						letterSpacing: "0.15em",
						fontWeight: 600,
						fontSize: { xs: "9px", sm: "10px", md: "11px", lg: "12px" },
						mb: 0.75,
						textAlign: "start",
					}}>
					{translations.hadithOfTheDay}
				</Typography>

				<Typography
					sx={{
						color: "text.whiteSoft",
						fontStyle: "italic",
						lineHeight: 1.6,
						fontSize: { xs: "13px", sm: "14px", md: "18px", lg: "24px" },
						fontFamily: getFontFamily(language),
						textAlign: "center",
					}}>
					&ldquo;{translations.hadithText}&rdquo;
				</Typography>
			</Box>

			<Typography
				sx={{
					color: "text.whiteMuted",
					fontSize: { xs: "10px", sm: "11px", md: "12px", lg: "13px" },
					mt: 1,
					fontFamily: getFontFamily(language),
					textAlign: "end",
				}}>
				{translations.hadithSource}
			</Typography>
		</Box>
	);
}
