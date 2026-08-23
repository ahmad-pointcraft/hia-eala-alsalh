import { useMemo } from 'react';
import type { z } from 'zod';
import { Box, Button, Typography } from '@mui/material';
import { Add as AddIcon } from '@mui/icons-material';
import { zodResolver } from '@hookform/resolvers/zod';
import { api } from '@/shared/api';
import type { Announcement, Update } from '@/shared/api';
import { useSession } from '@/admin/store/useSession';
import { useCrudList } from '@/admin/hooks/useCrudList';
import { useCrudDialogs } from '@/admin/hooks/useCrudDialogs';
import { usePagination } from '@/admin/hooks/usePagination';
import { useToast } from '@/admin/components/ToastProvider';
import { announcementFormSchema } from '@/admin/utils/content/validation';
import { ContentList } from './ContentList';
import type { Column } from './ContentList';
import { ContentFormDialog } from './ContentFormDialog';
import { ConfirmDeleteDialog } from './ConfirmDeleteDialog';

type AnnouncementFormValues = z.infer<typeof announcementFormSchema>;

export function AnnouncementsTab() {
  const masjidId = useSession((s) => s.session?.masjidId ?? '');

  const { items, loading, error, create, updateOptimistic, remove, reorder, refresh } = useCrudList<
    Announcement,
    Update<Announcement>
  >(masjidId, {
    list: api.listAnnouncements,
    create: api.createAnnouncement,
    update: api.updateAnnouncement,
    remove: api.deleteAnnouncement,
    reorder: api.reorderAnnouncements,
  });

  const dialogs = useCrudDialogs<Announcement>();
  const toast = useToast();
  const pager = usePagination<Announcement>();

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
    // CONTENT LIST PASSES SLICE-RELATIVE INDEX — OFFSET TO THE FULL SORTED LIST
    const fullIndex = pager.page * pager.rowsPerPage + index;
    const target = direction === 'up' ? fullIndex - 1 : fullIndex + 1;
    if (target < 0 || target >= sorted.length) return;
    const ids = sorted.map((i) => i.id);
    const a = ids[fullIndex];
    const b = ids[target];
    if (a === undefined || b === undefined) return;
    ids[fullIndex] = b;
    ids[target] = a;
    reorder?.(ids)
      .then(() => pager.reset()) // REORDER RESETS PAGE (FR-006)
      .catch(() => {
        toast.error('Failed to reorder — reverted');
      });
  }

  async function handleSave(values: AnnouncementFormValues) {
    try {
      if (dialogs.editing) {
        await updateOptimistic(dialogs.editing.id, values);
        toast.success('Announcement updated');
      } else {
        await create({ ...values, active: true, order: 0 });
        pager.reset(); // NEW ROW STAYS VISIBLE (FR-006)
        toast.success('Announcement created');
      }
    } catch (e) {
      toast.error(`Failed to save announcement: ${e instanceof Error ? e.message : String(e)}`);
    }
  }

  async function handleDelete() {
    if (!dialogs.deleteTarget) return;
    try {
      await remove(dialogs.deleteTarget.id);
      pager.reset(); // AFFECTED ROWS STAY VISIBLE (FR-006)
      toast.success('Announcement deleted');
    } catch {
      toast.error('Failed to delete announcement');
    } finally {
      dialogs.clearDelete();
    }
  }

  return (
    <Box>
      <Box sx={{ display: 'flex', justifyContent: 'flex-end', mb: 2 }}>
        <Button
          variant="contained"
          startIcon={<AddIcon />}
          sx={{
            fontWeight: '700',
            transition: 'all 0.2s ease-in-out',
            '&:hover': { transform: 'scale(1.05)' },
          }}
          onClick={dialogs.openCreate}
        >
          Add Announcement
        </Button>
      </Box>

      <ContentList
        items={pager.slice(sorted)}
        loading={loading}
        error={error}
        onRetry={refresh}
        emptyPrompt="No announcements yet"
        emptyAction={{ label: 'Create your first', onClick: dialogs.openCreate }}
        pagination={pager.paginationProps(sorted.length)}
        columns={columns}
        activeControl={{
          type: 'switch',
          isActive: (item) => item.active,
          onToggle: handleToggle,
          ariaLabel: (item) => `Toggle announcement ${item.text_en || item.text_ar}`,
        }}
        onEdit={dialogs.openEdit}
        onDelete={dialogs.requestDelete}
        getItemName={(item) => item.text_en || item.text_ar || 'announcement'}
        onReorder={handleReorder}
      />

      <ContentFormDialog<AnnouncementFormValues>
        open={dialogs.formOpen}
        title={dialogs.editing ? 'Edit Announcement' : 'Add Announcement'}
        fields={[
          { kind: 'bilingual', key: 'text', label: 'Text', required: true, multiline: true },
        ]}
        resolver={zodResolver(announcementFormSchema)}
        defaultValues={
          dialogs.editing
            ? { text_en: dialogs.editing.text_en, text_ar: dialogs.editing.text_ar }
            : undefined
        }
        onSave={handleSave}
        onClose={dialogs.closeForm}
      />

      <ConfirmDeleteDialog
        open={dialogs.deleteTarget !== null}
        itemName={
          dialogs.deleteTarget
            ? dialogs.deleteTarget.text_en || dialogs.deleteTarget.text_ar || 'this announcement'
            : ''
        }
        onConfirm={handleDelete}
        onCancel={dialogs.clearDelete}
      />
    </Box>
  );
}
