import { useRef } from 'react';
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

  const handleFileChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0];
    if (!file) return;
    const check = validateImageFile(file);
    if (!check.ok) {
      toast.error(check.message);
      return;
    }
    const blobUrl = URL.createObjectURL(file);
    setField({ logoUrl: blobUrl });
    toast.success('Logo uploaded');
  };

  const handleRemoveLogo = () => {
    setField({ logoUrl: null });
    if (fileInputRef.current) fileInputRef.current.value = '';
    toast.info('Logo removed');
  };

  return (
    <Card sx={{ height: '100%', borderRadius: 2 }}>
      <CardContent sx={{ p: 2.5 }}>
        <Typography variant="h6" fontWeight={600} gutterBottom>
          Mosque Identity & Branding
        </Typography>
        <Typography variant="body2" color="text.secondary" sx={{ mb: 2 }}>
          Configure the mosque name in both languages and the official emblem.
        </Typography>

        <Stack spacing={2}>
          <Box>
            <InputLabel
              htmlFor="masjidName_en"
              required
              error={!!errors.masjidName_en}
              sx={{ mb: 0.5, fontSize: '0.875rem', fontWeight: 500 }}
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
            />
          </Box>

          <Box>
            <InputLabel
              htmlFor="masjidName_ar"
              required
              error={!!errors.masjidName_ar}
              sx={{ mb: 0.5, fontSize: '0.875rem', fontWeight: 500 }}
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
            />
          </Box>

          <Box sx={{ pt: 1 }}>
            <Typography variant="caption" color="text.secondary" fontWeight={500} component="div" sx={{ mb: 1 }}>
              Mosque Logo
            </Typography>
            <Box sx={{ display: 'flex', alignItems: 'center', gap: 2 }}>
              <Box
                sx={{
                  width: 64,
                  height: 64,
                  borderRadius: 2,
                  border: '1px solid',
                  borderColor: 'divider',
                  bgcolor: 'background.default',
                  display: 'flex',
                  alignItems: 'center',
                  justifyContent: 'center',
                  overflow: 'hidden',
                  flexShrink: 0,
                }}
              >
                {draft.logoUrl ? (
                  <Box
                    component="img"
                    src={draft.logoUrl}
                    alt="Mosque Logo"
                    sx={{ width: '100%', height: '100%', objectFit: 'contain' }}
                  />
                ) : (
                  <MosqueIcon sx={{ color: 'primary.main', fontSize: 32 }} />
                )}
              </Box>

              <Box sx={{ flexGrow: 1 }}>
                <input
                  ref={fileInputRef}
                  type="file"
                  accept="image/png,image/jpeg,image/svg+xml"
                  hidden
                  onChange={handleFileChange}
                />
                <Box sx={{ display: 'flex', gap: 1, flexWrap: 'wrap' }}>
                  <Button
                    size="small"
                    variant="outlined"
                    startIcon={<UploadIcon />}
                    onClick={() => fileInputRef.current?.click()}
                  >
                    {draft.logoUrl ? 'Change Logo' : 'Upload Logo'}
                  </Button>
                  {draft.logoUrl && (
                    <Button
                      size="small"
                      color="error"
                      variant="text"
                      startIcon={<DeleteIcon />}
                      onClick={handleRemoveLogo}
                    >
                      Remove
                    </Button>
                  )}
                </Box>
                <Typography variant="caption" color="text.secondary" sx={{ display: 'block', mt: 0.5 }}>
                  PNG, JPG or SVG max 2MB
                </Typography>
              </Box>
            </Box>
          </Box>
        </Stack>
      </CardContent>
    </Card>
  );
}
