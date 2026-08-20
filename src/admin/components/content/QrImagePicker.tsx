import { useRef, useState } from 'react';
import { Box, Button, Card, CardMedia, IconButton } from '@mui/material';
import { CloudUpload as UploadIcon, Delete as DeleteIcon } from '@mui/icons-material';
import { api } from '@/shared/api';
import { validateImageFile } from '@/admin/utils/content/imageGuard';
import { useToast } from '@/admin/components/ToastProvider';

// QR IS AN ATTRIBUTE — UPLOADED VIA uploadImage(file,'qr'), STORED ON qrImageUrl
export interface QrImagePickerProps {
  campaignId: string | null;
  qrImageUrl: string | null;
  onQrSelected: (url: string | null) => void;
}

export function QrImagePicker({ campaignId, qrImageUrl, onQrSelected }: QrImagePickerProps) {
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
      const stored = await api.uploadImage(campaignId ?? 'draft', file, 'qr');
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
        <Card sx={{ position: 'relative', mt: 1 }}>
          <CardMedia component="img" src={qrImageUrl} alt="QR code" sx={{ maxHeight: 160, objectFit: 'contain' }} />
          <IconButton
            size="small"
            color="error"
            aria-label="Remove QR code"
            onClick={() => onQrSelected(null)}
            sx={{ position: 'absolute', top: 4, right: 4, bgcolor: 'background.paper' }}
          >
            <DeleteIcon fontSize="small" />
          </IconButton>
        </Card>
      ) : (
        <Button
          fullWidth
          variant="outlined"
          startIcon={<UploadIcon />}
          disabled={busy}
          onClick={() => inputRef.current?.click()}
          sx={{ mt: 1, py: 2, borderStyle: 'dashed' }}
        >
          {busy ? 'Uploading…' : 'Upload QR code (optional)'}
        </Button>
      )}
    </Box>
  );
}
