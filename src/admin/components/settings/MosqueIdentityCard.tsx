import { useRef, useState, useEffect } from 'react';
import {
  Box,
  Card,
  CardContent,
  Stack,
  Typography,
  TextField,
  InputLabel,
  Button,
} from '@mui/material';
import {
  CloudUpload as UploadIcon,
  Delete as DeleteIcon,
  Mosque as MosqueIcon,
} from '@mui/icons-material';
import { useDisplaySettingsForm } from '@/admin/store/useDisplaySettingsForm';
import { useToast } from '@/admin/components/ToastProvider';
import { validateImageFile } from '@/admin/utils/content/imageGuard';

interface MosqueIdentityCardProps {
  errors: Record<string, string>;
}

export function MosqueIdentityCard({ errors }: MosqueIdentityCardProps) {
  const draft = useDisplaySettingsForm((s) => s.draft);
  const setField = useDisplaySettingsForm((s) => s.setField);
  const fileInputRef = useRef<HTMLInputElement>(null);
  const toast = useToast();
  const [imgError, setImgError] = useState(false);

  const logoUrl = draft.logoUrl?.trim() || null;

  useEffect(() => {
    setImgError(false);
  }, [logoUrl]);

  const handleFileChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0];
    if (!file) return;
    const check = validateImageFile(file);
    if (!check.ok) {
      toast.error(check.message);
      return;
    }
    const blobUrl = URL.createObjectURL(file);
    setImgError(false);
    setField({ logoUrl: blobUrl });
    toast.success('Logo uploaded');
  };

  const handleRemoveLogo = () => {
    setField({ logoUrl: null });
    setImgError(false);
    if (fileInputRef.current) fileInputRef.current.value = '';
    toast.info('Logo removed');
  };

  const hasValidLogo = Boolean(logoUrl && !imgError);

  return (
    <Card
      sx={{
        height: '100%',
        borderRadius: 3,
        border: '1px solid rgba(0, 0, 0, 0.08)',
        boxShadow: '0 1px 3px rgba(0, 0, 0, 0.04), 0 4px 12px rgba(0, 0, 0, 0.02)',
      }}
    >
      <CardContent
        sx={{
          p: 2.5,
          display: 'flex',
          flexDirection: 'column',
          height: '100%',
          boxSizing: 'border-box',
        }}
      >
        <Box sx={{ display: 'flex', alignItems: 'center', gap: 1.25, mb: 2.5 }}>
          <Box
            sx={{
              width: 36,
              height: 36,
              borderRadius: 2,
              bgcolor: 'rgba(46, 125, 50, 0.1)',
              display: 'flex',
              alignItems: 'center',
              justifyContent: 'center',
              color: 'primary.main',
            }}
          >
            <MosqueIcon fontSize="small" />
          </Box>
          <Typography variant="h6" fontWeight={700} fontSize="1.05rem">
            Mosque Identity & Branding
          </Typography>
        </Box>

        <Stack spacing={2} sx={{ flexGrow: 1, justifyContent: 'space-between' }}>
          <Box>
            <InputLabel
              htmlFor="masjidName_en"
              required
              error={!!errors.masjidName_en}
              sx={{
                mb: 0.5,
                fontSize: '0.8rem',
                fontWeight: 600,
                textTransform: 'uppercase',
                letterSpacing: 0.4,
              }}
            >
              Masjid Name (English)
            </InputLabel>
            <TextField
              id="masjidName_en"
              fullWidth
              size="small"
              value={draft.masjidName_en ?? ''}
              onChange={(e) => setField({ masjidName_en: e.target.value })}
              error={!!errors.masjidName_en}
              helperText={errors.masjidName_en}
              placeholder="e.g. Masjid Al-Noor"
              sx={{ '& .MuiOutlinedInput-root': { borderRadius: 2 } }}
            />
          </Box>

          <Box>
            <InputLabel
              htmlFor="masjidName_ar"
              required
              error={!!errors.masjidName_ar}
              sx={{
                mb: 0.5,
                fontSize: '0.8rem',
                fontWeight: 600,
                textTransform: 'uppercase',
                letterSpacing: 0.4,
              }}
            >
              Masjid Name (Arabic)
            </InputLabel>
            <TextField
              id="masjidName_ar"
              fullWidth
              size="small"
              dir="rtl"
              value={draft.masjidName_ar ?? ''}
              onChange={(e) => setField({ masjidName_ar: e.target.value })}
              error={!!errors.masjidName_ar}
              helperText={errors.masjidName_ar}
              placeholder="مثال: مسجد النور"
              sx={{ '& .MuiOutlinedInput-root': { borderRadius: 2 } }}
            />
          </Box>

          <Box sx={{ pt: 0.5 }}>
            <Typography
              variant="caption"
              color="text.secondary"
              fontWeight={600}
              component="div"
              sx={{ mb: 1, textTransform: 'uppercase', letterSpacing: 0.4 }}
            >
              Mosque Logo
            </Typography>
            <Box
              sx={{
                display: 'flex',
                alignItems: 'center',
                justifyContent: 'space-between',
                gap: 2,
                p: 1.25,
                borderRadius: 2,
                bgcolor: '#fafafa',
                border: '1px solid rgba(0, 0, 0, 0.05)',
              }}
            >
              <Box
                sx={{
                  width: 52,
                  height: 52,
                  borderRadius: 2,
                  border: '1px solid',
                  borderColor: 'divider',
                  bgcolor: 'background.paper',
                  display: 'flex',
                  alignItems: 'center',
                  justifyContent: 'center',
                  overflow: 'hidden',
                  flexShrink: 0,
                }}
              >
                {hasValidLogo ? (
                  <Box
                    component="img"
                    src={logoUrl!}
                    alt="Mosque Logo"
                    onError={() => setImgError(true)}
                    sx={{ width: '100%', height: '100%', objectFit: 'contain' }}
                  />
                ) : (
                  <MosqueIcon sx={{ color: 'primary.main', fontSize: 28 }} />
                )}
              </Box>

              <Box
                sx={{ display: 'flex', flexDirection: 'column', alignItems: 'flex-end', gap: 0.5 }}
              >
                <input
                  ref={fileInputRef}
                  type="file"
                  accept="image/png,image/jpeg,image/svg+xml"
                  hidden
                  onChange={handleFileChange}
                />
                <Box sx={{ display: 'flex', alignItems: 'center', gap: 1 }}>
                  <Button
                    size="small"
                    variant="outlined"
                    startIcon={<UploadIcon />}
                    onClick={() => fileInputRef.current?.click()}
                    sx={{ borderRadius: 1.5, textTransform: 'none', fontWeight: 600 }}
                  >
                    {hasValidLogo ? 'Change Logo' : 'Upload Logo'}
                  </Button>
                  {draft.logoUrl && (
                    <Button
                      size="small"
                      color="error"
                      variant="text"
                      startIcon={<DeleteIcon />}
                      onClick={handleRemoveLogo}
                      sx={{ textTransform: 'none', fontWeight: 600 }}
                    >
                      Remove
                    </Button>
                  )}
                </Box>
                <Typography
                  variant="caption"
                  color="text.secondary"
                  sx={{ display: 'block', width: '100%', fontSize: '0.72rem' }}
                >
                  Max file size: 2MB
                </Typography>
              </Box>
            </Box>
          </Box>
        </Stack>
      </CardContent>
    </Card>
  );
}
