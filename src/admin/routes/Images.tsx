import { useCallback, useEffect, useMemo, useRef, useState } from 'react';
import {
  Alert,
  Box,
  Button,
  Card,
  CardMedia,
  IconButton,
  Skeleton,
  Typography,
} from '@mui/material';
import { CloudUpload as UploadIcon, Delete as DeleteIcon } from '@mui/icons-material';
import { api } from '@/shared/api';
import type { StoredImage } from '@/shared/api';
import { useSession } from '@/admin/store/useSession';
import { useToast } from '@/admin/components/ToastProvider';
import { validateImageFile } from '@/admin/utils/content/imageGuard';
import { UpDownReorder } from '@/admin/components/content/UpDownReorder';
import { ConfirmDeleteDialog } from '@/admin/components/content/ConfirmDeleteDialog';

export function Images() {
  const masjidId = useSession((s) => s.session?.masjidId ?? '');
  const inputRef = useRef<HTMLInputElement>(null);
  const [images, setImages] = useState<StoredImage[] | null>(null);
  const [uploading, setUploading] = useState(false);
  const [deleteTarget, setDeleteTarget] = useState<StoredImage | null>(null);
  const toast = useToast();

  const load = useCallback(async () => {
    try {
      setImages(await api.listImages(masjidId, 'carousel'));
    } catch {
      setImages([]);
      toast.error('Failed to load carousel images');
    }
  }, [masjidId, toast]);

  useEffect(() => {
    if (images === null) void load();
  }, [images, load]);

  const sorted = useMemo(
    () => (images ? [...images].sort((a, b) => a.order - b.order) : []),
    [images],
  );

  if (images === null) {
    return (
      <Box sx={{ p: 3 }}>
        <Skeleton variant="text" width={200} height={40} />
        <Skeleton variant="rectangular" height={180} sx={{ my: 2 }} />
      </Box>
    );
  }

  async function handleUpload(file: File | undefined) {
    if (!file) return;
    const guard = validateImageFile(file);
    if (!guard.ok) {
      toast.error(guard.message);
      return;
    }
    setUploading(true);
    try {
      await api.uploadImage(masjidId, file, 'carousel');
      await load();
      toast.success('Image uploaded — display carousel rotates it in');
    } catch (e) {
      toast.error(`Failed to upload image: ${e instanceof Error ? e.message : String(e)}`);
    } finally {
      setUploading(false);
    }
  }

  function handleReorder(index: number, direction: 'up' | 'down') {
    const target = direction === 'up' ? index - 1 : index + 1;
    if (target < 0 || target >= sorted.length) return;
    const reordered = [...sorted];
    const moved = reordered[index];
    const swap = reordered[target];
    if (!moved || !swap) return;
    reordered[index] = swap;
    reordered[target] = moved;
    setImages(reordered.map((img, i) => ({ ...img, order: i })));
    api.reorderCarouselImages(masjidId, reordered.map((i) => i.id)).catch(() => {
      toast.error('Failed to reorder — reverted');
      void load();
    });
  }

  async function handleDelete() {
    if (!deleteTarget) return;
    const wasLast = sorted.length === 1;
    try {
      await api.deleteImage(deleteTarget.id);
      setImages((prev) => (prev ? prev.filter((i) => i.id !== deleteTarget.id) : prev));
      toast.success(wasLast ? 'Removed — display falls back to static images' : 'Image deleted');
    } catch {
      toast.error('Failed to delete image');
    } finally {
      setDeleteTarget(null);
    }
  }

  return (
    <Box>
      <Typography variant="h5" gutterBottom>Carousel Images</Typography>
      <Typography color="text.secondary" sx={{ mb: 2 }}>
        Images ≤ 2MB rotate on the display. With none uploaded, the display serves its bundled static set.
      </Typography>

      <input
        ref={inputRef}
        type="file"
        accept="image/*"
        hidden
        onChange={(e) => {
          void handleUpload(e.target.files?.[0]);
          e.target.value = '';
        }}
      />
      <Button
        variant="contained"
        startIcon={<UploadIcon />}
        disabled={uploading}
        onClick={() => inputRef.current?.click()}
        sx={{ mb: 3 }}
      >
        {uploading ? 'Uploading…' : 'Upload Image'}
      </Button>

      {sorted.length === 0 ? (
        <Alert severity="info">
          No carousel images yet — upload your first mosque photo above.
        </Alert>
      ) : (
        <Box sx={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fill, minmax(220px, 1fr))', gap: 2 }}>
          {sorted.map((img, index) => (
            <Card key={img.id}>
              <CardMedia component="img" src={img.url} alt={img.name} sx={{ height: 140, objectFit: 'cover' }} />
              <Box sx={{ p: 1, display: 'flex', alignItems: 'center', justifyContent: 'space-between' }}>
                <Typography variant="caption" noWrap sx={{ maxWidth: 110 }}>
                  {img.name}
                </Typography>
                <Box sx={{ display: 'flex', alignItems: 'center' }}>
                  <UpDownReorder
                    isFirst={index === 0}
                    isLast={index === sorted.length - 1}
                    onMoveUp={() => handleReorder(index, 'up')}
                    onMoveDown={() => handleReorder(index, 'down')}
                  />
                  <IconButton
                    size="small"
                    color="error"
                    aria-label={`Delete ${img.name}`}
                    onClick={() => setDeleteTarget(img)}
                  >
                    <DeleteIcon fontSize="small" />
                  </IconButton>
                </Box>
              </Box>
            </Card>
          ))}
        </Box>
      )}

      <ConfirmDeleteDialog
        open={deleteTarget !== null}
        itemName={deleteTarget?.name ?? ''}
        onConfirm={handleDelete}
        onCancel={() => setDeleteTarget(null)}
      />
    </Box>
  );
}
