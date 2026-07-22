import { useState } from 'react';

import {
  Box,
  Tab,
  Tabs,
  Grid,
  Stack,
  Dialog,
  Button,
  Select,
  MenuItem,
  TextField,
  InputLabel,
  Typography,
  FormControl,
  DialogTitle,
  ToggleButton,
  DialogContent,
  DialogActions,
  ToggleButtonGroup,
} from '@mui/material';

import { useMosqueConfigStore } from '@/display/store/mosqueConfigStore';
import type { Language } from '@/display/types/i18n';
import type { AdhanMethod, Madhab, HighLatitudeRule, IqamaPrayerConfig } from '@/display/types/mosqueConfig';

interface AdminSettingsDialogProps {
  open: boolean;
  onClose: () => void;
  language: Language;
}

const ADHAN_METHODS: { value: AdhanMethod; label: string }[] = [
  { value: 'MuslimWorldLeague', label: 'Muslim World League' },
  { value: 'Egyptian', label: 'Egyptian General Authority of Survey' },
  { value: 'Karachi', label: 'University of Islamic Sciences, Karachi' },
  { value: 'UmmAlQura', label: 'Umm Al-Qura University, Makkah' },
  { value: 'Dubai', label: 'Dubai' },
  { value: 'Qatar', label: 'Qatar' },
  { value: 'Kuwait', label: 'Kuwait' },
  { value: 'MoonsightingCommittee', label: 'Moonsighting Committee' },
  { value: 'Singapore', label: 'Majlis Ugama Islam Singapura' },
  { value: 'Turkey', label: 'Diyanet İşleri Başkanlığı, Turkey' },
  { value: 'Tehran', label: 'Institute of Geophysics, University of Tehran' },
  { value: 'NorthAmerica', label: 'ISNA (North America)' },
];

const HIGH_LATITUDE_RULES: { value: HighLatitudeRule; label: string }[] = [
  { value: 'MiddleOfTheNight', label: 'Middle of the Night' },
  { value: 'SeventhOfTheNight', label: 'Seventh of the Night' },
  { value: 'TwilightAngle', label: 'Twilight Angle' },
];

export function AdminSettingsDialog({ open, onClose, language }: AdminSettingsDialogProps) {
  const { config, setConfig } = useMosqueConfigStore();
  const [tabIndex, setTabIndex] = useState(0);

  // Form states initialized from store config
  const [masjidNameEn, setMasjidNameEn] = useState(config.masjidName_en);
  const [masjidNameAr, setMasjidNameAr] = useState(config.masjidName_ar);

  const [latitude, setLatitude] = useState(config.latitude);
  const [longitude, setLongitude] = useState(config.longitude);
  const [timeZone, setTimeZone] = useState(config.timeZone);
  const [calculationMethod, setCalculationMethod] = useState<AdhanMethod>(config.calculationMethod);
  const [madhab, setMadhab] = useState<Madhab>(config.madhab);
  const [highLatitudeRule, setHighLatitudeRule] = useState<HighLatitudeRule>(config.highLatitudeRule);
  const [hijriOffset, setHijriOffset] = useState(config.hijriOffset);
  
  // Iqama states
  const [iqamaFajr, setIqamaFajr] = useState<IqamaPrayerConfig>(config.iqamaConfigs.Fajr);
  const [iqamaDhuhr, setIqamaDhuhr] = useState<IqamaPrayerConfig>(config.iqamaConfigs.Dhuhr);
  const [iqamaAsr, setIqamaAsr] = useState<IqamaPrayerConfig>(config.iqamaConfigs.Asr);
  const [iqamaMaghrib, setIqamaMaghrib] = useState<IqamaPrayerConfig>(config.iqamaConfigs.Maghrib);
  const [iqamaIsha, setIqamaIsha] = useState<IqamaPrayerConfig>(config.iqamaConfigs.Isha);

  const t = (en: string, ar: string) => (language === 'ar' ? ar : en);

  const handleTabChange = (_: React.SyntheticEvent, newValue: number) => {
    setTabIndex(newValue);
  };

  const handleAutoDetect = () => {
    if (navigator.geolocation) {
      navigator.geolocation.getCurrentPosition(
        (position) => {
          setLatitude(parseFloat(position.coords.latitude.toFixed(6)));
          setLongitude(parseFloat(position.coords.longitude.toFixed(6)));
          const detectedTimeZone = Intl.DateTimeFormat().resolvedOptions().timeZone;
          if (detectedTimeZone) {
            setTimeZone(detectedTimeZone);
          }
        },
        (error) => {
          alert(t('Failed to get location: ', 'فشل في تحديد الموقع: ') + error.message);
        }
      );
    } else {
      alert(t('Geolocation is not supported by your browser.', 'تحديد الموقع الجغرافي غير مدعوم في متصفحك.'));
    }
  };

  const handleSave = () => {
    setConfig({
      masjidName_en: masjidNameEn,
      masjidName_ar: masjidNameAr,
      latitude,
      longitude,
      timeZone,
      calculationMethod,
      madhab,
      highLatitudeRule,
      hijriOffset,
      iqamaConfigs: {
        Fajr: iqamaFajr,
        Dhuhr: iqamaDhuhr,
        Asr: iqamaAsr,
        Maghrib: iqamaMaghrib,
        Isha: iqamaIsha,
      },
    });
    onClose();
  };

  const renderIqamaConfig = (
    label: string,
    state: IqamaPrayerConfig,
    setState: React.Dispatch<React.SetStateAction<IqamaPrayerConfig>>
  ) => {
    return (
      <Box sx={{ borderBottom: '1px solid rgba(255,255,255,0.08)', pb: 2, mb: 2 }}>
        <Typography variant="subtitle2" sx={{ mb: 1, color: 'text.soft' }}>{label}</Typography>
        <Stack direction="row" gap={2} alignItems="center">
          <ToggleButtonGroup
            value={state.mode}
            exclusive
            onChange={(_, val) => {
              if (val) {
                setState(
                  val === 'offset'
                    ? { mode: 'offset', value: 15 }
                    : { mode: 'fixed', value: '18:00' }
                );
              }
            }}
            size="small"
            sx={{
              gap: 1,
              '& .MuiToggleButtonGroup-grouped': {
                border: '1px solid !important',
                borderColor: 'border.thin !important',
                borderRadius: '12px !important',
                mx: '0px !important',
              },
            }}
          >
            <ToggleButton value="offset">
              {t('Offset (mins)', 'إزاحة (دقائق)')}
            </ToggleButton>
            <ToggleButton value="fixed">
              {t('Fixed Time', 'وقت ثابت')}
            </ToggleButton>
          </ToggleButtonGroup>

          {state.mode === 'offset' ? (
            <TextField
              type="number"
              label={t('Minutes after Adhan', 'دقائق بعد الأذان')}
              value={state.value}
              onChange={(e) => setState({ mode: 'offset', value: parseInt(e.target.value) || 0 })}
              size="small"
              sx={{ width: 180 }}
            />
          ) : (
            <TextField
              type="text"
              label={t('Time (HH:MM)', 'الوقت (ساعة:دقيقة)')}
              placeholder="e.g. 13:30"
              value={state.value}
              onChange={(e) => setState({ mode: 'fixed', value: e.target.value })}
              size="small"
              sx={{ width: 180 }}
            />
          )}
        </Stack>
      </Box>
    );
  };

  return (
    <Dialog
      open={open}
      onClose={onClose}
      maxWidth="md"
      fullWidth
      slotProps={{
        paper: {
          sx: {
            bgcolor: 'background.default',
            backgroundImage: 'none',
            borderRadius: '24px',
            border: '1px solid',
            borderColor: 'border.thin',
          },
        },
      }}
    >
      <DialogTitle sx={{ borderBottom: '1px solid rgba(255,255,255,0.08)', pb: 2 }}>
        {t('Mosque Administration Settings', 'إعدادات إدارة المسجد')}
      </DialogTitle>
      
      <Box sx={{ borderBottom: '1px solid rgba(255,255,255,0.08)' }}>
        <Tabs value={tabIndex} onChange={handleTabChange} variant="fullWidth">
          <Tab label={t('General', 'عام')} />
          <Tab label={t('Location & Calculation', 'الموقع والحساب')} />
          <Tab label={t('Iqama Times', 'أوقات الإقامة')} />
        </Tabs>
      </Box>

      <DialogContent sx={{ p: 3, minHeight: 380 }}>
        {tabIndex === 0 && (
          <Stack spacing={3}>
            <Typography variant="subtitle1" sx={{ color: 'primary.main', fontWeight: 600 }}>
              {t('Masjid Profile', 'ملف المسجد')}
            </Typography>
            <Grid container spacing={2}>
              <Grid size={{ xs: 12, sm: 6 }}>
                <TextField
                  fullWidth
                  label={t('Masjid Name (English)', 'اسم المسجد (إنجليزي)')}
                  value={masjidNameEn}
                  onChange={(e) => setMasjidNameEn(e.target.value)}
                />
              </Grid>
              <Grid size={{ xs: 12, sm: 6 }}>
                <TextField
                  fullWidth
                  label={t('Masjid Name (Arabic)', 'اسم المسجد (عربي)')}
                  value={masjidNameAr}
                  onChange={(e) => setMasjidNameAr(e.target.value)}
                />
              </Grid>
            </Grid>
          </Stack>
        )}

        {tabIndex === 1 && (
          <Stack spacing={3}>
            <Stack direction="row" justifyContent="space-between" alignItems="center">
              <Typography variant="subtitle1" sx={{ color: 'primary.main', fontWeight: 600 }}>
                {t('Coordinates & Timezone', 'الإحداثيات والمنطقة الزمنية')}
              </Typography>
              <Button variant="contained" color="secondary" onClick={handleAutoDetect} size="small">
                {t('Auto-Detect Current Location', 'تحديد تلقائي للموقع الحالي')}
              </Button>
            </Stack>

            <Grid container spacing={2}>
              <Grid size={{ xs: 12, sm: 4 }}>
                <TextField
                  fullWidth
                  type="number"
                  label={t('Latitude', 'خط العرض')}
                  value={latitude}
                  onChange={(e) => setLatitude(parseFloat(e.target.value) || 0)}
                />
              </Grid>
              <Grid size={{ xs: 12, sm: 4 }}>
                <TextField
                  fullWidth
                  type="number"
                  label={t('Longitude', 'خط الطول')}
                  value={longitude}
                  onChange={(e) => setLongitude(parseFloat(e.target.value) || 0)}
                />
              </Grid>
              <Grid size={{ xs: 12, sm: 4 }}>
                <TextField
                  fullWidth
                  label={t('Timezone', 'المنطقة الزمنية')}
                  value={timeZone}
                  onChange={(e) => setTimeZone(e.target.value)}
                />
              </Grid>
            </Grid>

            <Typography variant="subtitle1" sx={{ color: 'primary.main', fontWeight: 600, mt: 2 }}>
              {t('Calculation Rules', 'قواعد الحساب')}
            </Typography>

            <Grid container spacing={2}>
              <Grid size={{ xs: 12, sm: 6 }}>
                <FormControl fullWidth>
                  <InputLabel id="calc-method-label">{t('Adhan Calculation Method', 'طريقة حساب الأذان')}</InputLabel>
                  <Select
                    labelId="calc-method-label"
                    label={t('Adhan Calculation Method', 'طريقة حساب الأذان')}
                    value={calculationMethod}
                    onChange={(e) => setCalculationMethod(e.target.value as AdhanMethod)}
                  >
                    {ADHAN_METHODS.map((m) => (
                      <MenuItem key={m.value} value={m.value}>{m.label}</MenuItem>
                    ))}
                  </Select>
                </FormControl>
              </Grid>
              <Grid size={{ xs: 12, sm: 6 }}>
                <FormControl fullWidth>
                  <InputLabel id="madhab-label">{t('Madhab (Asr shadow ratio)', 'المذهب (حساب العصر)')}</InputLabel>
                  <Select
                    labelId="madhab-label"
                    label={t('Madhab (Asr shadow ratio)', 'المذهب (حساب العصر)')}
                    value={madhab}
                    onChange={(e) => setMadhab(e.target.value as Madhab)}
                  >
                    <MenuItem value="Shafi">{t('Standard (Shafi, Maliki, Hanbali)', 'الجمهور (شافعي، مالكي، حنبلي)')}</MenuItem>
                    <MenuItem value="Hanafi">{t('Hanafi (Double shadow)', 'حنبلي / حنفي (ظل مضاف)')}</MenuItem>
                  </Select>
                </FormControl>
              </Grid>
            </Grid>

            <Grid container spacing={2}>
              <Grid size={{ xs: 12, sm: 6 }}>
                <FormControl fullWidth>
                  <InputLabel id="high-lat-label">{t('High Latitude Rule', 'قاعدة خطوط العرض المرتفعة')}</InputLabel>
                  <Select
                    labelId="high-lat-label"
                    label={t('High Latitude Rule', 'قاعدة خطوط العرض المرتفعة')}
                    value={highLatitudeRule}
                    onChange={(e) => setHighLatitudeRule(e.target.value as HighLatitudeRule)}
                  >
                    {HIGH_LATITUDE_RULES.map((r) => (
                      <MenuItem key={r.value} value={r.value}>{r.label}</MenuItem>
                    ))}
                  </Select>
                </FormControl>
              </Grid>
              <Grid size={{ xs: 12, sm: 6 }}>
                <FormControl fullWidth>
                  <InputLabel id="hijri-offset-label">{t('Hijri Adjustment (Days)', 'تعديل التاريخ الهجري (أيام)')}</InputLabel>
                  <Select
                    labelId="hijri-offset-label"
                    label={t('Hijri Adjustment (Days)', 'تعديل التاريخ الهجري (أيام)')}
                    value={hijriOffset}
                    onChange={(e) => setHijriOffset(Number(e.target.value) as -2 | -1 | 0 | 1 | 2)}
                  >
                    <MenuItem value={-2}>{t('-2 Days', 'يومان للخلف')}</MenuItem>
                    <MenuItem value={-1}>{t('-1 Day', 'يوم للخلف')}</MenuItem>
                    <MenuItem value={0}>{t('No adjustment', 'لا يوجد تعديل')}</MenuItem>
                    <MenuItem value={1}>{t('+1 Day', 'يوم للأمام')}</MenuItem>
                    <MenuItem value={2}>{t('+2 Days', 'يومان للأمام')}</MenuItem>
                  </Select>
                </FormControl>
              </Grid>
            </Grid>
          </Stack>
        )}

        {tabIndex === 2 && (
          <Box sx={{ maxHeight: 420, overflowY: 'auto', pr: 1 }}>
            {renderIqamaConfig(t('Fajr Iqama', 'إقامة الفجر'), iqamaFajr, setIqamaFajr)}
            {renderIqamaConfig(t('Dhuhr Iqama', 'إقامة الظهر'), iqamaDhuhr, setIqamaDhuhr)}
            {renderIqamaConfig(t('Asr Iqama', 'إقامة العصر'), iqamaAsr, setIqamaAsr)}
            {renderIqamaConfig(t('Maghrib Iqama', 'إقامة المغرب'), iqamaMaghrib, setIqamaMaghrib)}
            {renderIqamaConfig(t('Isha Iqama', 'إقامة العشاء'), iqamaIsha, setIqamaIsha)}
          </Box>
        )}
      </DialogContent>

      <DialogActions sx={{ borderTop: '1px solid rgba(255,255,255,0.08)', p: 2, gap: 1.5 }}>
        <Button onClick={onClose} variant="outlined" color="inherit">
          {t('Cancel', 'إلغاء')}
        </Button>
        <Button onClick={handleSave} variant="contained" color="primary">
          {t('Save Changes', 'حفظ التعديلات')}
        </Button>
      </DialogActions>
    </Dialog>
  );
}
