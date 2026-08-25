import { useCallback, useEffect, useMemo, useState } from 'react';
import { Box } from '@mui/material';
import { api } from '@/shared/api';
import type { StoredImage } from '@/shared/api';
import { useSession } from '@/admin/store/useSession';
import { useToast } from '@/admin/components/ToastProvider';
import { useFocusHeading } from '@/admin/hooks/useFocusHeading';
import { AsyncState } from '@/admin/components/states/AsyncState';
import { validateImageFile } from '@/admin/utils/content/imageGuard';
import { ConfirmDeleteDialog } from '@/admin/components/content/ConfirmDeleteDialog';
import { PhotoGrid, PhotoUploadHeader } from '@/admin/components/images';

export function Images() {
  const masjidId = useSession((s) => s.session?.masjidId ?? '');
  const [images, setImages] = useState<StoredImage[] | null>(null);
  const [loadError, setLoadError] = useState<string | null>(null);
  const [uploading, setUploading] = useState(false);
  const [deleteTarget, setDeleteTarget] = useState<StoredImage | null>(null);
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

  return (
    <Box sx={{ pb: 2 }}>
      <PhotoUploadHeader
        uploading={uploading}
        onUploadFile={(file) => void handleUpload(file)}
        headingRef={headingRef}
      />

      {/* SINGLE STATE PIPELINE — SHARED PRIMITIVES */}
      <AsyncState
        loading={images === null && loadError === null}
        error={loadError}
        isEmpty={images !== null && sorted.length === 0}
        onRetry={load}
        empty={{
          title: 'No slideshow photos yet',
          description: 'Upload 16:9 widescreen photos (e.g. 1920 × 1080 px) of your mosque to fill the display when no events are active.',
          action: {
            label: 'Upload your first photo',
            onClick: () => {
              const input = document.createElement('input');
              input.type = 'file';
              input.accept = 'image/*';
              input.onchange = (e) => {
                const file = (e.target as HTMLInputElement).files?.[0];
                if (file) void handleUpload(file);
              };
              input.click();
            },
          },
        }}
      >
        <PhotoGrid
          images={sorted}
          onReorder={handleReorder}
          onDelete={setDeleteTarget}
          onUploadFile={(file) => void handleUpload(file)}
        />
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
