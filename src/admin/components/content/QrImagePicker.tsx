import { useRef, useState } from 'react';
import { Box, Button, Card, CardMedia, IconButton, Typography } from '@mui/material';
import { CloudUpload as UploadIcon, Delete as DeleteIcon } from '@mui/icons-material';
import { api } from '@/shared/api';
import { validateImageFile } from '@/admin/utils/content/imageGuard';
import { useToast } from '@/admin/components/ToastProvider';
import { useSession } from '@/admin/store/useSession';

// QR IS AN ATTRIBUTE — UPLOADED VIA uploadImage(file,'qr'), STORED ON qrImageUrl
export interface QrImagePickerProps {
  qrImageUrl: string | null;
  onQrSelected: (url: string | null) => void;
}

export function QrImagePicker({ qrImageUrl, onQrSelected }: QrImagePickerProps) {
  const masjidId = useSession((state) => state.session?.masjidId ?? "");
  const inputRef = useRef<HTMLInputElement>(null);
  const [busy, setBusy] = useState(false);
  const toast = useToast();

  async function handleFile(file: File | undefined) {
    if (!file) return;
    const guard = validateImageFile(file);
    if (!guard.ok) {
      toast.error(guard.message);
      return;
    }
    setBusy(true);
    try {
      const stored = await api.uploadImage(masjidId, file, 'qr');
      if (qrImageUrl?.startsWith('blob:')) URL.revokeObjectURL(qrImageUrl);
      onQrSelected(stored.url);
      toast.success('QR uploaded — click Save to attach it to the campaign');
    } catch {
      toast.error('Failed to upload QR');
    } finally {
      setBusy(false);
    }
  }

  return (
    <Box>
      <input
        ref={inputRef}
        type="file"
        accept="image/*"
        hidden
        onChange={(e) => {
          void handleFile(e.target.files?.[0]);
          e.target.value = '';
        }}
      />
      {qrImageUrl ? (
        <Card
          sx={{
            position: 'relative',
            mt: 1,
            borderRadius: 2,
            overflow: 'hidden',
            border: '1px solid rgba(0, 0, 0, 0.12)',
            width: 140,
            height: 140,
            bgcolor: '#ffffff',
            display: 'flex',
            alignItems: 'center',
            justifyContent: 'center',
            p: 1.5,
            boxShadow: '0 2px 8px rgba(0, 0, 0, 0.06)',
          }}
        >
          <CardMedia
            component="img"
            src={qrImageUrl}
            alt="Donation QR Code"
            sx={{
              width: '100%',
              height: '100%',
              objectFit: 'contain',
            }}
          />
          <IconButton
            size="small"
            color="error"
            aria-label="Remove QR code"
            onClick={() => onQrSelected(null)}
            sx={{
              position: 'absolute',
              top: 6,
              right: 6,
              bgcolor: 'rgba(255, 255, 255, 0.95)',
              boxShadow: '0 2px 6px rgba(0, 0, 0, 0.15)',
              '&:hover': { bgcolor: '#ffffff' },
            }}
          >
            <DeleteIcon fontSize="small" />
          </IconButton>
        </Card>
      ) : (
        <Box sx={{ mt: 1 }}>
          <Button
            fullWidth
            variant="outlined"
            startIcon={<UploadIcon />}
            disabled={busy}
            onClick={() => inputRef.current?.click()}
            sx={{
              py: 1.75,
              borderStyle: 'dashed',
              borderRadius: 2,
              fontWeight: 600,
            }}
          >
            {busy ? 'Uploading…' : 'Upload QR Code Image (Optional)'}
          </Button>
          <Box sx={{ mt: 1, px: 0.5 }}>
            <Typography
              variant="caption"
              color="text.primary"
              fontWeight={600}
              sx={{ display: 'block', fontSize: '0.76rem' }}
            >
              Recommended: 1:1 square format (e.g. 512 × 512 px)
            </Typography>
            <Typography
              variant="caption"
              color="text.secondary"
              sx={{ display: 'block', fontSize: '0.72rem', mt: 0.25 }}
            >
              High-contrast square QR codes scan reliably on the kiosk display • Max 2MB (PNG, JPG)
            </Typography>
          </Box>
        </Box>
      )}
    </Box>
  );
}
