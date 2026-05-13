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
				py: 1.5,
				px: 2.5,
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
						fontSize: "9px",
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
						fontSize: { xs: "13px", sm: "14px", lg: "24px" },
						fontFamily: getFontFamily(language),
						textAlign: "center",
					}}>
					&ldquo;{translations.hadithText}&rdquo;
				</Typography>
			</Box>

			<Typography
				sx={{
					color: "text.whiteMuted",
					fontSize: "11px",
					mt: 1,
					fontFamily: getFontFamily(language),
					textAlign: "end",
				}}>
				{translations.hadithSource}
			</Typography>
		</Box>
	);
}
