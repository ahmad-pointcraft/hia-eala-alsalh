import { useMemo, useState } from 'react';
import type { z } from 'zod';
import { Box, Button, Chip, Stack, Typography } from '@mui/material';
import { Add as AddIcon } from '@mui/icons-material';
import { zodResolver } from '@hookform/resolvers/zod';
import { api } from '@/shared/api';
import type { MasjidEvent, Update } from '@/shared/api';
import { useSession } from '@/admin/store/useSession';
import { useCrudList } from '@/admin/hooks/useCrudList';
import { useBoolean } from '@/shared/hooks/useBoolean';
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

  const { items, loading, error, create, updateOptimistic, remove, refresh } =
    useCrudList<MasjidEvent, Update<MasjidEvent>>(masjidId, {
      list: api.listEvents,
      create: api.createEvent,
      update: api.updateEvent,
      remove: api.deleteEvent,
    });

  const form = useBoolean();
  const [editing, setEditing] = useState<MasjidEvent | null>(null);
  const [deleteTarget, setDeleteTarget] = useState<MasjidEvent | null>(null);
  const [draftImage, setDraftImage] = useState<string | null>(null);
  const toast = useToast();

  const sorted = useMemo(
    () => [...items].sort((a, b) => a.date.localeCompare(b.date)),
    [items],
  );

  const columns: Column<MasjidEvent>[] = [
    {
      header: 'Title',
      render: (item) => (
        <Stack direction="row" spacing={1} alignItems="center">
          <Typography noWrap sx={{ maxWidth: 260 }}>
            {item.title_en || item.title_ar}
          </Typography>
          {isPast(item.date) && <Chip size="small" label="past" variant="outlined" />}
        </Stack>
      ),
    },
    { header: 'Date', render: (item) => item.date },
    { header: 'Time', render: (item) => item.time, width: '90px' },
    {
      header: 'Speaker',
      render: (item) => (
        <Typography noWrap sx={{ maxWidth: 180 }}>
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
      if (editing) {
        await updateOptimistic(editing.id, { ...values, imageUrl: draftImage });
        toast.success('Event updated');
      } else {
        await create({
          ...values,
          imageUrl: draftImage,
          active: true,
        });
        toast.success('Event created');
      }
    } catch {
      toast.error('Failed to save event');
    }
  }

  async function handleDelete() {
    if (!deleteTarget) return;
    try {
      await remove(deleteTarget.id);
      toast.success('Event deleted');
    } catch {
      toast.error('Failed to delete event');
    } finally {
      setDeleteTarget(null);
    }
  }

  function openCreate() {
    setEditing(null);
    setDraftImage(null);
    form.onTrue();
  }

  function openEdit(item: MasjidEvent) {
    setEditing(item);
    setDraftImage(item.imageUrl);
    form.onTrue();
  }

  return (
    <Box>
      <Box sx={{ display: 'flex', justifyContent: 'flex-end', mb: 2 }}>
        <Button variant="contained" startIcon={<AddIcon />} onClick={openCreate}>
          Add Event
        </Button>
      </Box>

      <ContentList
        items={sorted}
        loading={loading}
        error={error}
        onRetry={refresh}
        emptyPrompt="No events yet — add your first"
        columns={columns}
        activeControl={{
          type: 'switch',
          isActive: (item) => item.active,
          onToggle: handleToggle,
          ariaLabel: (item) => `Toggle event ${item.title_en || item.title_ar}`,
        }}
        onEdit={openEdit}
        onDelete={(item) => setDeleteTarget(item)}
        getItemName={(item) => item.title_en || item.title_ar || 'event'}
        isRowFaded={(item) => isPast(item.date)}
      />

      <ContentFormDialog<EventFormValues>
        open={form.value}
        title={editing ? 'Edit Event' : 'Add Event'}
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
        defaultValues={editing ?? undefined}
        onSave={handleSave}
        onClose={() => { form.onFalse(); setEditing(null); }}
      >
        <EventImagePicker
          eventId={editing?.id ?? null}
          imageUrl={draftImage}
          onImageSelected={setDraftImage}
        />
      </ContentFormDialog>

      <ConfirmDeleteDialog
        open={deleteTarget !== null}
        itemName={deleteTarget ? (deleteTarget.title_en || deleteTarget.title_ar || 'this event') : ''}
        onConfirm={handleDelete}
        onCancel={() => setDeleteTarget(null)}
      />
    </Box>
  );
}
