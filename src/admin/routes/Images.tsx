import { useCallback, useEffect, useMemo, useRef, useState } from 'react';
import {
  Box,
  Button,
  Card,
  CardMedia,
  Chip,
  IconButton,
  Stack,
  Tooltip,
  Typography,
} from '@mui/material';
import {
  CloudUpload as UploadIcon,
  DeleteOutline as DeleteIcon,
  Collections as GalleryIcon,
} from '@mui/icons-material';
import { api } from '@/shared/api';
import type { StoredImage } from '@/shared/api';
import { useSession } from '@/admin/store/useSession';
import { useToast } from '@/admin/components/ToastProvider';
import { useFocusHeading } from '@/admin/hooks/useFocusHeading';
import { AsyncState } from '@/admin/components/states/AsyncState';
import { validateImageFile } from '@/admin/utils/content/imageGuard';
import { UpDownReorder } from '@/admin/components/content/UpDownReorder';
import { ConfirmDeleteDialog } from '@/admin/components/content/ConfirmDeleteDialog';

export function Images() {
  const masjidId = useSession((s) => s.session?.masjidId ?? '');
  const inputRef = useRef<HTMLInputElement>(null);
  const [images, setImages] = useState<StoredImage[] | null>(null);
  const [loadError, setLoadError] = useState<string | null>(null);
  const [uploading, setUploading] = useState(false);
  const [deleteTarget, setDeleteTarget] = useState<StoredImage | null>(null);
  const [isDragging, setIsDragging] = useState(false);
  const toast = useToast();
  const headingRef = useFocusHeading<HTMLHeadingElement>();

  const load = useCallback(async () => {
    setLoadError(null);
    try {
      setImages(await api.listImages(masjidId, 'carousel'));
    } catch {
      setLoadError('Failed to load slideshow photos. Please try again.');
    }
  }, [masjidId]);

  useEffect(() => {
    if (images === null && loadError === null) void load();
  }, [images, loadError, load]);

  const sorted = useMemo(
    () => (images ? [...images].sort((a, b) => a.order - b.order) : []),
    [images],
  );

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
      toast.success('Photo uploaded — it shows when no events are active');
    } catch (e) {
      toast.error(`Failed to upload photo: ${e instanceof Error ? e.message : String(e)}`);
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
    api
      .reorderCarouselImages(
        masjidId,
        reordered.map((i) => i.id),
      )
      .catch(() => {
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
      toast.success(
        wasLast ? 'Removed — display falls back to the static photo set' : 'Photo deleted',
      );
    } catch {
      toast.error('Failed to delete photo');
    } finally {
      setDeleteTarget(null);
    }
  }

  const handleDragOver = (e: React.DragEvent) => {
    e.preventDefault();
    setIsDragging(true);
  };

  const handleDragLeave = (e: React.DragEvent) => {
    e.preventDefault();
    setIsDragging(false);
  };

  const handleDrop = (e: React.DragEvent) => {
    e.preventDefault();
    setIsDragging(false);
    const file = e.dataTransfer.files?.[0];
    if (file) void handleUpload(file);
  };

  return (
    <Box sx={{ pb: 2 }}>
      {/* HEADER SECTION */}
      <Box
        sx={{
          display: 'flex',
          flexDirection: { xs: 'column', sm: 'row' },
          justifyContent: 'space-between',
          alignItems: { xs: 'flex-start', sm: 'center' },
          gap: 2,
          mb: { xs: 3, md: 4 },
        }}
      >
        <Box>
          <Typography
            variant="h5"
            component="h1"
            tabIndex={-1}
            ref={headingRef}
            fontWeight={600}
            gutterBottom
          >
            Slideshow Photos
          </Typography>
          <Typography color="text.secondary" fontSize="0.95rem">
            Photos (≤ 2MB) show in a rotating carousel on the kiosk display when no events are active.
          </Typography>
        </Box>

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
          sx={{
            borderRadius: 2,
            px: 2.5,
            fontWeight: 700,
            boxShadow: '0 2px 8px rgba(46, 125, 50, 0.25)',
            transition: 'all 0.2s ease-in-out',
            whiteSpace: 'nowrap',
            '&:hover': {
              transform: 'scale(1.03)',
              boxShadow: '0 4px 12px rgba(46, 125, 50, 0.35)',
            },
          }}
        >
          {uploading ? 'Uploading…' : 'Upload Photo'}
        </Button>
      </Box>

      {/* SINGLE STATE PIPELINE — SHARED PRIMITIVES */}
      <AsyncState
        loading={images === null && loadError === null}
        error={loadError}
        isEmpty={images !== null && sorted.length === 0}
        onRetry={load}
        empty={{
          title: 'No slideshow photos yet',
          description: 'Upload mosque photos to fill the display when no events are active.',
          action: { label: 'Upload your first photo', onClick: () => inputRef.current?.click() },
        }}
      >
        <Box
          onDragOver={handleDragOver}
          onDragLeave={handleDragLeave}
          onDrop={handleDrop}
          sx={{
            display: 'grid',
            gridTemplateColumns: {
              xs: '1fr',
              sm: 'repeat(auto-fill, minmax(260px, 1fr))',
            },
            gap: 2.5,
            p: isDragging ? 2 : 0,
            borderRadius: 3,
            border: isDragging ? '2px dashed #2e7d32' : 'none',
            bgcolor: isDragging ? 'rgba(46, 125, 50, 0.04)' : 'transparent',
            transition: 'all 0.2s ease',
          }}
        >
          {sorted.map((img, index) => (
            <Card
              key={img.id}
              sx={{
                borderRadius: 3,
                border: '1px solid rgba(0, 0, 0, 0.08)',
                boxShadow: '0 1px 3px rgba(0, 0, 0, 0.04), 0 4px 12px rgba(0, 0, 0, 0.02)',
                overflow: 'hidden',
                display: 'flex',
                flexDirection: 'column',
                transition: 'transform 0.2s ease, box-shadow 0.2s ease',
                '&:hover': {
                  transform: 'translateY(-3px)',
                  boxShadow: '0 6px 20px rgba(0, 0, 0, 0.08)',
                  '& .media-img': {
                    transform: 'scale(1.04)',
                  },
                },
              }}
            >
              {/* IMAGE WRAPPER WITH HOVER ZOOM & GLASS BADGE */}
              <Box sx={{ position: 'relative', height: 165, overflow: 'hidden', bgcolor: '#0f172a' }}>
                <CardMedia
                  component="img"
                  src={img.url}
                  alt={img.name}
                  className="media-img"
                  sx={{
                    height: '100%',
                    width: '100%',
                    objectFit: 'cover',
                    transition: 'transform 0.3s ease-in-out',
                  }}
                />
                <Chip
                  icon={<GalleryIcon sx={{ fontSize: '14px !important', color: '#fff' }} />}
                  label={`#${index + 1}`}
                  size="small"
                  sx={{
                    position: 'absolute',
                    top: 10,
                    left: 10,
                    bgcolor: 'rgba(15, 23, 42, 0.7)',
                    color: '#ffffff',
                    backdropFilter: 'blur(6px)',
                    fontWeight: 700,
                    fontSize: '0.75rem',
                    height: 24,
                    borderRadius: 1.5,
                  }}
                />
              </Box>

              {/* CARD DETAILS & ACTIONS */}
              <Box
                sx={{
                  p: 1.75,
                  display: 'flex',
                  alignItems: 'center',
                  justifyContent: 'space-between',
                  gap: 1,
                  bgcolor: '#ffffff',
                  borderTop: '1px solid rgba(0, 0, 0, 0.06)',
                }}
              >
                <Tooltip title={img.name}>
                  <Typography
                    variant="body2"
                    fontWeight={600}
                    noWrap
                    sx={{ maxWidth: 140, color: 'text.primary' }}
                  >
                    {img.name}
                  </Typography>
                </Tooltip>

                <Stack direction="row" spacing={0.75} alignItems="center">
                  <UpDownReorder
                    isFirst={index === 0}
                    isLast={index === sorted.length - 1}
                    onMoveUp={() => handleReorder(index, 'up')}
                    onMoveDown={() => handleReorder(index, 'down')}
                  />
                  <Tooltip title="Delete photo">
                    <IconButton
                      size="small"
                      color="error"
                      aria-label={`Delete ${img.name}`}
                      onClick={() => setDeleteTarget(img)}
                      sx={{
                        borderRadius: 1.5,
                        border: '1px solid rgba(211, 47, 47, 0.15)',
                        p: 0.5,
                        '&:hover': {
                          bgcolor: 'rgba(211, 47, 47, 0.08)',
                          borderColor: 'error.main',
                        },
                      }}
                    >
                      <DeleteIcon sx={{ fontSize: 17 }} />
                    </IconButton>
                  </Tooltip>
                </Stack>
              </Box>
            </Card>
          ))}
        </Box>
      </AsyncState>

      <ConfirmDeleteDialog
        open={deleteTarget !== null}
        itemName={deleteTarget?.name ?? ''}
        onConfirm={handleDelete}
        onCancel={() => setDeleteTarget(null)}
      />
    </Box>
  );
}

