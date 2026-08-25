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
  const masjidId = useSession((state) => state.session?.masjidId ?? '');
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
        <Card
          sx={{
            position: 'relative',
            mt: 1,
            borderRadius: 2,
            overflow: 'hidden',
            border: '1px solid rgba(0, 0, 0, 0.12)',
            aspectRatio: '16/9',
            maxHeight: 220,
            bgcolor: '#1a1a1a',
            display: 'flex',
            alignItems: 'center',
            justifyContent: 'center',
          }}
        >
          <CardMedia
            component="img"
            src={imageUrl}
            alt="Event Preview"
            sx={{
              width: '100%',
              height: '100%',
              objectFit: 'cover',
              objectPosition: 'center 20%',
            }}
          />
          <Box
            sx={{
              position: 'absolute',
              bottom: 8,
              left: 8,
              bgcolor: 'rgba(0, 0, 0, 0.65)',
              color: '#ffffff',
              px: 1,
              py: 0.3,
              borderRadius: 1,
              fontSize: '0.7rem',
              fontWeight: 600,
              letterSpacing: 0.5,
              backdropFilter: 'blur(4px)',
            }}
          >
            16:9 KIOSK PREVIEW
          </Box>
          <IconButton
            size="small"
            color="error"
            aria-label="Remove image"
            onClick={handleRemove}
            sx={{
              position: 'absolute',
              top: 8,
              right: 8,
              bgcolor: 'rgba(255, 255, 255, 0.9)',
              boxShadow: '0 2px 6px rgba(0, 0, 0, 0.2)',
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
            {busy ? 'Uploading…' : 'Upload Banner Image (Optional)'}
          </Button>
          <Box sx={{ mt: 1, px: 0.5 }}>
            <Typography
              variant="caption"
              color="text.primary"
              fontWeight={600}
              sx={{ display: 'block', fontSize: '0.76rem' }}
            >
              Recommended: 16:9 landscape format (e.g. 1920 × 1080 px)
            </Typography>
            <Typography
              variant="caption"
              color="text.secondary"
              sx={{ display: 'block', fontSize: '0.72rem', mt: 0.25 }}
            >
              Landscape images fit the widescreen kiosk without cropping • Max 2MB.
            </Typography>
          </Box>
        </Box>
      )}
    </Box>
  );
}
