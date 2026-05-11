import { motion } from 'motion/react';
import Paper from '@mui/material/Paper';
import Chip from '@mui/material/Chip';
import Typography from '@mui/material/Typography';
import Box from '@mui/material/Box';
import Button from '@mui/material/Button';
import Grid from '@mui/material/Grid';
import CalendarMonth from '@mui/icons-material/CalendarMonth';
import AccessTime from '@mui/icons-material/AccessTime';
import LocationOn from '@mui/icons-material/LocationOn';
import Groups from '@mui/icons-material/Groups';
import { Language } from '../utils/translations';
import type { Translations } from '../utils/translations';
import { getFontFamily, getDirection } from '../utils/helpers';
import { colors } from '../theme/tokens';

interface EventModeDisplayProps {
  language: Language;
  translations: Translations;
}

export function EventModeDisplay({ language, translations }: EventModeDisplayProps) {
  const isRTL = language === 'ar';
  const dir = getDirection(language);
  const fontFamily = getFontFamily(language);

  return (
    <motion.div
      initial={{ opacity: 0 }}
      animate={{ opacity: 1 }}
      exit={{ opacity: 0 }}
      transition={{ duration: 0.5 }}
      style={{ position: 'absolute', inset: 0, display: 'flex', alignItems: 'center', justifyContent: 'center', padding: '12px' }}
      dir={dir}
    >
      <motion.div
        initial={{ scale: 0.9, opacity: 0, y: 50 }}
        animate={{ scale: 1, opacity: 1, y: 0 }}
        exit={{ scale: 0.9, opacity: 0, y: -50 }}
        transition={{ duration: 0.6, ease: 'easeInOut' }}
        style={{ position: 'relative', maxWidth: '1152px', width: '100%' }}
      >
        <Box sx={{ position: 'absolute', inset: -1, background: `linear-gradient(to right, ${colors.gold.main}, ${colors.gold.light}, ${colors.gold.main})`, borderRadius: 3, opacity: 0.3, filter: 'blur(20px)' }} />

        <Paper sx={{ position: 'relative', bgcolor: 'surface.deep', backdropFilter: 'blur(16px)', borderTop: '2px solid', borderTopColor: 'border.prominent', borderBottom: '2px solid', borderBottomColor: 'border.prominent', borderRadius: 3, p: { xs: 2, sm: 3, lg: 4 } }}>
          <Box sx={{ display: { xs: 'none', sm: 'block' }, position: 'absolute', top: 16, left: 16, width: 48, height: 48, borderTop: '2px solid', borderTopColor: 'border.strong' }} />
          <Box sx={{ display: { xs: 'none', sm: 'block' }, position: 'absolute', top: 16, right: 16, width: 48, height: 48, borderTop: '2px solid', borderTopColor: 'border.strong' }} />
          <Box sx={{ display: { xs: 'none', sm: 'block' }, position: 'absolute', bottom: 16, left: 16, width: 48, height: 48, borderBottom: '2px solid', borderBottomColor: 'border.strong' }} />
          <Box sx={{ display: { xs: 'none', sm: 'block' }, position: 'absolute', bottom: 16, right: 16, width: 48, height: 48, borderBottom: '2px solid', borderBottomColor: 'border.strong' }} />

          <motion.div
            initial={{ y: -20, opacity: 0 }}
            animate={{ y: 0, opacity: 1 }}
            transition={{ delay: 0.3 }}
            style={{ textAlign: 'center', marginBottom: '12px' }}
          >
            <Chip
              label={translations.event.badge}
              sx={{
                bgcolor: 'border.default',
                color: 'primary.main',
                borderColor: 'border.prominent',
                fontSize: { xs: '0.75rem', sm: '0.875rem' },
                fontWeight: 'bold',
                textTransform: 'uppercase',
                letterSpacing: '0.05em',
                fontFamily,
              }}
            />
          </motion.div>

          <motion.div
            initial={{ y: 20, opacity: 0 }}
            animate={{ y: 0, opacity: 1 }}
            transition={{ delay: 0.4 }}
            style={{ textAlign: 'center', marginBottom: '16px' }}
          >
            <Typography sx={{ color: 'primary.main', fontSize: { xs: '1.25rem', sm: '1.875rem', lg: '3rem' }, mb: { xs: 1, sm: 1.5 }, lineHeight: 1.2, fontFamily }}>
              {translations.event.title}
            </Typography>
            <Typography sx={{ color: 'grey.300', fontSize: { xs: '0.875rem', sm: '1rem' }, mb: 0.5, fontFamily }}>{translations.event.guestSpeaker}</Typography>
            <Typography sx={{ color: 'text.primary', fontSize: { xs: '1.125rem', sm: '1.5rem', lg: '1.875rem' }, fontWeight: 'bold', fontFamily }}>
              {translations.event.speakerName}
            </Typography>
            <Typography sx={{ color: 'grey.400', fontSize: { xs: '0.75rem', sm: '0.875rem' }, mt: 0.5, fontFamily }}>
              {translations.event.speakerTitle}
            </Typography>
          </motion.div>

          <motion.div
            initial={{ y: 20, opacity: 0 }}
            animate={{ y: 0, opacity: 1 }}
            transition={{ delay: 0.6 }}
          >
            <Grid container spacing={{ xs: 1, sm: 2, lg: 3 }} sx={{ mb: { xs: 2, sm: 3 } }}>
              {[
                { icon: <CalendarMonth />, label: translations.event.date, value: translations.event.tonight, sub: translations.event.dateValue },
                { icon: <AccessTime />, label: translations.event.time, value: translations.event.timeValue, sub: translations.event.afterPrayer },
                { icon: <LocationOn />, label: translations.event.location, value: translations.event.locationValue, sub: translations.event.floor },
              ].map((item, idx) => (
                <Grid key={idx} size={4}>
                  <Box sx={{ display: 'flex', flexDirection: 'column', alignItems: 'center', p: { xs: 1.5, sm: 2 }, bgcolor: 'surface.raised', borderRadius: 1, border: '1px solid', borderColor: 'border.default' }}>
                    <Box sx={{ color: 'primary.main', mb: { xs: 0.5, sm: 1 }, '& svg': { width: { xs: 24, sm: 32 }, height: { xs: 24, sm: 32 } } }}>
                      {item.icon}
                    </Box>
                    <Typography sx={{ color: 'grey.400', fontSize: { xs: '10px', sm: '0.75rem' }, textTransform: 'uppercase', letterSpacing: '0.05em', mb: 0.5, fontFamily }}>{item.label}</Typography>
                    <Typography sx={{ color: 'text.primary', fontSize: { xs: '0.875rem', sm: '1.125rem', lg: '1.25rem' }, fontWeight: 'bold', fontFamily }}>{item.value}</Typography>
                    <Typography sx={{ color: 'grey.300', fontSize: { xs: '10px', sm: '0.75rem' }, fontFamily }}>{item.sub}</Typography>
                  </Box>
                </Grid>
              ))}
            </Grid>
          </motion.div>

          <motion.div
            initial={{ y: 20, opacity: 0 }}
            animate={{ y: 0, opacity: 1 }}
            transition={{ delay: 0.7 }}
          >
            <Paper sx={{ bgcolor: 'surface.overlay', borderRadius: 1, p: { xs: 1.5, sm: 2.5, lg: 3 }, border: '1px solid', borderColor: 'border.default', mb: { xs: 2, sm: 2.5 } }}>
              <Typography sx={{ color: 'grey.300', fontSize: { xs: '0.75rem', sm: '0.875rem', lg: '1rem' }, lineHeight: 1.625, textAlign: 'center', fontFamily }}>
                {translations.event.description}
              </Typography>
            </Paper>
          </motion.div>

          <motion.div
            initial={{ y: 20, opacity: 0 }}
            animate={{ y: 0, opacity: 1 }}
            transition={{ delay: 0.8 }}
            style={{ textAlign: 'center' }}
          >
            <motion.div
              animate={{ scale: [1, 1.05, 1] }}
              transition={{ duration: 2, repeat: Infinity, ease: 'easeInOut' }}
            >
              <Button
                startIcon={<Groups />}
                sx={{
                  background: `linear-gradient(to right, ${colors.gold.main}, ${colors.gold.light})`,
                  borderRadius: 50,
                  color: colors.text.onGold,
                  fontWeight: 'bold',
                  fontSize: { xs: '0.875rem', sm: '1rem', lg: '1.125rem' },
                  px: { xs: 3, sm: 4 },
                  py: { xs: 1.5, sm: 2 },
                  boxShadow: `0 0 30px ${colors.glow.medium}`,
                  textTransform: 'none',
                  fontFamily,
                }}
              >
                {translations.event.cta}
              </Button>
            </motion.div>
          </motion.div>

          <motion.div
            style={{ position: 'absolute', top: 0, left: '50%', transform: 'translateX(-50%)', width: '100%', height: '100%', pointerEvents: 'none' }}
            animate={{ opacity: [0.1, 0.2, 0.1] }}
            transition={{ duration: 4, repeat: Infinity, ease: 'easeInOut' }}
          >
            <Box
              sx={{
                position: 'absolute',
                top: 0,
                left: '50%',
                transform: 'translateX(-50%)',
                width: '150%',
                height: '100%',
                background: `radial-gradient(ellipse at top, ${colors.border.light} 0%, transparent 60%)`,
              }}
            />
          </motion.div>
        </Paper>
      </motion.div>
    </motion.div>
  );
}
