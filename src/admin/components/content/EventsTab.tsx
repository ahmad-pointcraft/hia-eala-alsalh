import { useMemo } from 'react';
import type { z } from 'zod';
import { Box, Button, Chip, Stack, Typography } from '@mui/material';
import { Add as AddIcon } from '@mui/icons-material';
import { zodResolver } from '@hookform/resolvers/zod';
import { api } from '@/shared/api';
import type { MasjidEvent, Update } from '@/shared/api';
import { useSession } from '@/admin/store/useSession';
import { useCrudList } from '@/admin/hooks/useCrudList';
import { useCrudDialogs } from '@/admin/hooks/useCrudDialogs';
import { usePagination } from '@/admin/hooks/usePagination';
import { useToast } from '@/admin/components/ToastProvider';
import { eventFormSchema } from '@/admin/utils/content/validation';
import { ContentList } from './ContentList';
import type { Column } from './ContentList';
import { ContentFormDialog } from './ContentFormDialog';
import { ConfirmDeleteDialog } from './ConfirmDeleteDialog';
import { EventImagePicker } from './EventImagePicker';

type EventFormValues = z.infer<typeof eventFormSchema>;

function isPast(date: string): boolean {
  return date < new Date().toISOString().slice(0, 10);
}

export function EventsTab() {
  const masjidId = useSession((s) => s.session?.masjidId ?? '');

  const { items, loading, error, create, updateOptimistic, remove, refresh } = useCrudList<
    MasjidEvent,
    Update<MasjidEvent>
  >(masjidId, {
    list: api.listEvents,
    create: api.createEvent,
    update: api.updateEvent,
    remove: api.deleteEvent,
  });

  const dialogs = useCrudDialogs<MasjidEvent>((e) => e.imageUrl);
  const toast = useToast();
  const pager = usePagination<MasjidEvent>();

  const sorted = useMemo(() => [...items].sort((a, b) => a.date.localeCompare(b.date)), [items]);

  const columns: Column<MasjidEvent>[] = [
    {
      header: 'Title',
      render: (item) => (
        <Stack direction="row" spacing={1} alignItems="center">
          <Typography noWrap sx={{ maxWidth: 260, fontWeight: 600 }}>
            {item.title_en || item.title_ar}
          </Typography>
          {isPast(item.date) && (
            <Chip
              size="small"
              label="Past"
              variant="outlined"
              sx={{ borderRadius: 1.5, fontSize: '0.72rem', height: 20, color: 'text.secondary' }}
            />
          )}
        </Stack>
      ),
    },
    { header: 'Date', render: (item) => item.date },
    { header: 'Time', render: (item) => item.time, width: '90px' },
    {
      header: 'Speaker',
      render: (item) => (
        <Typography noWrap sx={{ maxWidth: 180, color: item.speaker_en || item.speaker_ar ? 'text.primary' : 'text.disabled' }}>
          {item.speaker_en || item.speaker_ar || '—'}
        </Typography>
      ),
    },
  ];

  function handleToggle(item: MasjidEvent) {
    updateOptimistic(item.id, { active: !item.active }).catch(() => {
      toast.error('Failed to toggle — reverted');
    });
  }

  async function handleSave(values: EventFormValues) {
    try {
      if (dialogs.editing) {
        await updateOptimistic(dialogs.editing.id, { ...values, imageUrl: dialogs.draftImage });
        toast.success('Event updated');
      } else {
        await create({
          ...values,
          imageUrl: dialogs.draftImage,
          active: true,
        });
        pager.reset(); // NEW ROW STAYS VISIBLE
        toast.success('Event created');
      }
    } catch (e) {
      toast.error(`Failed to save event: ${e instanceof Error ? e.message : String(e)}`);
    }
  }

  async function handleDelete() {
    if (!dialogs.deleteTarget) return;
    try {
      await remove(dialogs.deleteTarget.id);
      pager.reset(); // AFFECTED ROWS STAY VISIBLE
      toast.success('Event deleted');
    } catch {
      toast.error('Failed to delete event');
    } finally {
      dialogs.clearDelete();
    }
  }

  const isImageDirty = dialogs.draftImage !== (dialogs.editing?.imageUrl ?? null);

  return (
    <Box>
      <Box sx={{ display: 'flex', justifyContent: 'flex-end', mb: 2.5 }}>
        <Button
          variant="contained"
          startIcon={<AddIcon />}
          sx={{
            borderRadius: 2,
            px: 2.5,
            fontWeight: 700,
            boxShadow: '0 2px 8px rgba(46, 125, 50, 0.25)',
            transition: 'all 0.2s ease-in-out',
            '&:hover': {
              transform: 'scale(1.03)',
              boxShadow: '0 4px 12px rgba(46, 125, 50, 0.35)',
            },
          }}
          onClick={dialogs.openCreate}
        >
          Add Event
        </Button>
      </Box>


      <ContentList
        items={pager.slice(sorted)}
        loading={loading}
        error={error}
        onRetry={refresh}
        emptyPrompt="No events yet"
        emptyAction={{ label: 'Create your first', onClick: dialogs.openCreate }}
        pagination={pager.paginationProps(sorted.length)}
        columns={columns}
        activeControl={{
          type: 'switch',
          isActive: (item) => item.active,
          onToggle: handleToggle,
          ariaLabel: (item) => `Toggle event ${item.title_en || item.title_ar}`,
        }}
        onEdit={dialogs.openEdit}
        onDelete={dialogs.requestDelete}
        getItemName={(item) => item.title_en || item.title_ar || 'event'}
        isRowFaded={(item) => isPast(item.date)}
      />

      <ContentFormDialog<EventFormValues>
        open={dialogs.formOpen}
        title={dialogs.editing ? 'Edit Event' : 'Add Event'}
        fields={[
          { kind: 'bilingual', key: 'title', label: 'Title', required: true },
          { kind: 'bilingual', key: 'badge', label: 'Badge' },
          { kind: 'bilingual', key: 'speaker', label: 'Speaker' },
          { kind: 'date', key: 'date', label: 'Date', required: true },
          { kind: 'time', key: 'time', label: 'Time', required: true },
          { kind: 'bilingual', key: 'location', label: 'Location' },
          { kind: 'bilingual', key: 'cta', label: 'Call to action' },
        ]}
        resolver={zodResolver(eventFormSchema)}
        defaultValues={dialogs.editing ?? undefined}
        extraDirty={isImageDirty}
        onSave={handleSave}
        onClose={dialogs.closeForm}
      >
        <EventImagePicker imageUrl={dialogs.draftImage} onImageSelected={dialogs.setDraftImage} />
      </ContentFormDialog>

      <ConfirmDeleteDialog
        open={dialogs.deleteTarget !== null}
        itemName={
          dialogs.deleteTarget
            ? dialogs.deleteTarget.title_en || dialogs.deleteTarget.title_ar || 'this event'
            : ''
        }
        onConfirm={handleDelete}
        onCancel={dialogs.clearDelete}
      />
    </Box>
  );
}
