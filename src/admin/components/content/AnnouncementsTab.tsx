import { useMemo, useState } from 'react';
import type { z } from 'zod';
import { Box, Button, Typography } from '@mui/material';
import { Add as AddIcon } from '@mui/icons-material';
import { zodResolver } from '@hookform/resolvers/zod';
import { api } from '@/shared/api';
import type { Announcement, Update } from '@/shared/api';
import { useSession } from '@/admin/store/useSession';
import { useCrudList } from '@/admin/hooks/useCrudList';
import { useBoolean } from '@/shared/hooks/useBoolean';
import { useToast } from '@/admin/components/ToastProvider';
import { announcementFormSchema } from '@/admin/utils/content/validation';
import { ContentList } from './ContentList';
import type { Column } from './ContentList';
import { ContentFormDialog } from './ContentFormDialog';
import { ConfirmDeleteDialog } from './ConfirmDeleteDialog';

type AnnouncementFormValues = z.infer<typeof announcementFormSchema>;

export function AnnouncementsTab() {
  const masjidId = useSession((s) => s.session?.masjidId ?? '');

  const { items, loading, error, create, updateOptimistic, remove, reorder, refresh } =
    useCrudList<Announcement, Update<Announcement>>(masjidId, {
      list: api.listAnnouncements,
      create: api.createAnnouncement,
      update: api.updateAnnouncement,
      remove: api.deleteAnnouncement,
      reorder: api.reorderAnnouncements,
    });

  const form = useBoolean();
  const [editing, setEditing] = useState<Announcement | null>(null);
  const [deleteTarget, setDeleteTarget] = useState<Announcement | null>(null);
  const toast = useToast();

  const sorted = useMemo(() => [...items].sort((a, b) => a.order - b.order), [items]);

  const columns: Column<Announcement>[] = [
    {
      header: 'Text',
      render: (item) => (
        <Typography noWrap sx={{ maxWidth: 420 }}>
          {item.text_en || item.text_ar}
        </Typography>
      ),
    },
  ];

  function handleToggle(item: Announcement) {
    updateOptimistic(item.id, { active: !item.active }).catch(() => {
      toast.error('Failed to toggle — reverted');
    });
  }

  function handleReorder(index: number, direction: 'up' | 'down') {
    const target = direction === 'up' ? index - 1 : index + 1;
    if (target < 0 || target >= sorted.length) return;
    const ids = sorted.map((i) => i.id);
    const a = ids[index];
    const b = ids[target];
    if (a === undefined || b === undefined) return;
    ids[index] = b;
    ids[target] = a;
    reorder?.(ids).catch(() => {
      toast.error('Failed to reorder — reverted');
    });
  }

  async function handleSave(values: AnnouncementFormValues) {
    try {
      if (editing) {
        await updateOptimistic(editing.id, values);
        toast.success('Announcement updated');
      } else {
        await create({ ...values, active: true, order: 0 });
        toast.success('Announcement created');
      }
    } catch {
      toast.error('Failed to save announcement');
    }
  }

  async function handleDelete() {
    if (!deleteTarget) return;
    try {
      await remove(deleteTarget.id);
      toast.success('Announcement deleted');
    } catch {
      toast.error('Failed to delete announcement');
    } finally {
      setDeleteTarget(null);
    }
  }

  return (
    <Box>
      <Box sx={{ display: 'flex', justifyContent: 'flex-end', mb: 2 }}>
        <Button
          variant="contained"
          startIcon={<AddIcon />}
          onClick={() => { setEditing(null); form.onTrue(); }}
        >
          Add Announcement
        </Button>
      </Box>

      <ContentList
        items={sorted}
        loading={loading}
        error={error}
        onRetry={refresh}
        emptyPrompt="No announcements yet — add your first"
        columns={columns}
        activeControl={{
          type: 'switch',
          isActive: (item) => item.active,
          onToggle: handleToggle,
          ariaLabel: (item) => `Toggle announcement ${item.text_en || item.text_ar}`,
        }}
        onEdit={(item) => { setEditing(item); form.onTrue(); }}
        onDelete={(item) => setDeleteTarget(item)}
        getItemName={(item) => item.text_en || item.text_ar || 'announcement'}
        onReorder={handleReorder}
      />

      <ContentFormDialog<AnnouncementFormValues>
        open={form.value}
        title={editing ? 'Edit Announcement' : 'Add Announcement'}
        fields={[{ kind: 'bilingual', key: 'text', label: 'Text', required: true, multiline: true }]}
        resolver={zodResolver(announcementFormSchema)}
        defaultValues={editing ? { text_en: editing.text_en, text_ar: editing.text_ar } : undefined}
        onSave={handleSave}
        onClose={() => { form.onFalse(); setEditing(null); }}
      />

      <ConfirmDeleteDialog
        open={deleteTarget !== null}
        itemName={deleteTarget ? (deleteTarget.text_en || deleteTarget.text_ar || 'this announcement') : ''}
        onConfirm={handleDelete}
        onCancel={() => setDeleteTarget(null)}
      />
    </Box>
  );
}
