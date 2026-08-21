import { useRef, useState } from 'react';
import { Box, Button, Card, CardMedia, IconButton, Typography } from '@mui/material';
import { CloudUpload as UploadIcon, Delete as DeleteIcon } from '@mui/icons-material';
import { api } from '@/shared/api';
import { validateImageFile } from '@/admin/utils/content/imageGuard';
import { useToast } from '@/admin/components/ToastProvider';
import { useSession } from '@/admin/store/useSession';

// EVENT IMAGE IS AN ATTRIBUTE — ASSIGNED VIA updateEvent({ imageUrl }) ON SAVE
export interface EventImagePickerProps {
  imageUrl: string | null;
  onImageSelected: (url: string | null) => void;
}

export function EventImagePicker({ imageUrl, onImageSelected }: EventImagePickerProps) {
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
      const stored = await api.uploadImage(masjidId, file, 'event');
      onImageSelected(stored.url);
      toast.success('Image uploaded — click Save to attach it to the event');
    } catch {
      toast.error('Failed to upload image');
    } finally {
      setBusy(false);
    }
  }

  function handleRemove() {
    onImageSelected(null);
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
      {imageUrl ? (
        <Card sx={{ position: 'relative', mt: 1 }}>
          <CardMedia component="img" src={imageUrl} alt="Event" sx={{ maxHeight: 200, objectFit: 'contain' }} />
          <IconButton
            size="small"
            color="error"
            aria-label="Remove image"
            onClick={handleRemove}
            sx={{ position: 'absolute', top: 4, right: 4, bgcolor: 'background.paper' }}
          >
            <DeleteIcon fontSize="small" />
          </IconButton>
        </Card>
      ) : (
        <>
          <Button
            fullWidth
            variant="outlined"
            startIcon={<UploadIcon />}
            disabled={busy}
            onClick={() => inputRef.current?.click()}
            sx={{ mt: 1, py: 2, borderStyle: 'dashed' }}
          >
            {busy ? 'Uploading…' : 'Upload image (optional)'}
          </Button>
          <Typography variant="caption" color="text.secondary" sx={{ display: 'block', mt: 0.5 }}>
            Max file size: 2MB
          </Typography>
        </>
      )}
    </Box>
  );
}
