import { useState } from 'react';
import type { z } from 'zod';
import { Box, Button, Typography } from '@mui/material';
import { Add as AddIcon } from '@mui/icons-material';
import { zodResolver } from '@hookform/resolvers/zod';
import { api } from '@/shared/api';
import type { DonationCampaign } from '@/shared/api';
import { useSession } from '@/admin/store/useSession';
import { useCrudList } from '@/admin/hooks/useCrudList';
import { useBoolean } from '@/shared/hooks/useBoolean';
import { useToast } from '@/admin/components/ToastProvider';
import { donationFormSchema } from '@/admin/utils/content/validation';
import { ContentList } from './ContentList';
import type { Column } from './ContentList';
import { ContentFormDialog } from './ContentFormDialog';
import { ConfirmDeleteDialog } from './ConfirmDeleteDialog';
import { QrImagePicker } from './QrImagePicker';

type DonationFormValues = z.infer<typeof donationFormSchema>;

// PATCH SHAPE FOR DONATIONS — ACTIVE EXCLUDED; ACTIVATION FLOWS ONLY THROUGH setActiveDonationCampaign
type DonationPatch = Partial<Omit<DonationCampaign, 'id' | 'masjidId' | 'active'>>;

export function DonationsTab() {
  const masjidId = useSession((s) => s.session?.masjidId ?? '');

  const { items, loading, error, create, update, remove, refresh } =
    useCrudList<DonationCampaign, DonationPatch>(masjidId, {
      list: api.listDonations,
      create: api.createDonationCampaign,
      update: api.updateDonationCampaign,
      remove: api.deleteDonationCampaign,
    });

  const form = useBoolean();
  const [editing, setEditing] = useState<DonationCampaign | null>(null);
  const [deleteTarget, setDeleteTarget] = useState<DonationCampaign | null>(null);
  const [draftQr, setDraftQr] = useState<string | null>(null);
  const toast = useToast();

  const columns: Column<DonationCampaign>[] = [
    {
      header: 'Campaign',
      render: (item) => (
        <Typography noWrap sx={{ maxWidth: 280 }}>
          {item.title_en || item.title_ar}
        </Typography>
      ),
    },
    { header: 'Collected', render: (item) => `$${item.collected.toLocaleString()}`, width: '110px' },
    { header: 'Goal', render: (item) => `$${item.goal.toLocaleString()}`, width: '110px' },
    { header: 'Donors', render: (item) => item.donorCount, width: '80px' },
  ];

  // RADIO ACTIVATION — setActiveDonationCampaign DEACTIVATES THE REST ATOMICALLY
  async function handleActivate(item: DonationCampaign) {
    if (item.active) return;
    try {
      await api.setActiveDonationCampaign(masjidId, item.id);
      refresh();
      toast.success('Campaign activated');
    } catch {
      toast.error('Failed to activate campaign');
      refresh();
    }
  }

  async function handleSave(values: DonationFormValues) {
    const payload = { ...values, donateUrl: values.donateUrl || null, qrImageUrl: draftQr };
    try {
      if (editing) {
        await update(editing.id, payload);
        toast.success('Campaign updated');
      } else {
        await create({ ...payload, active: false });
        toast.success('Campaign created — activate it with the radio');
      }
    } catch {
      toast.error('Failed to save campaign');
    }
  }

  async function handleDelete() {
    if (!deleteTarget) return;
    const wasActive = deleteTarget.active;
    try {
      await remove(deleteTarget.id);
      toast.success(
        wasActive
          ? 'Active campaign deleted — overlay falls back until another is activated'
          : 'Campaign deleted',
      );
    } catch {
      toast.error('Failed to delete campaign');
    } finally {
      setDeleteTarget(null);
    }
  }

  function openCreate() {
    setEditing(null);
    setDraftQr(null);
    form.onTrue();
  }

  function openEdit(item: DonationCampaign) {
    setEditing(item);
    setDraftQr(item.qrImageUrl);
    form.onTrue();
  }

  return (
    <Box>
      <Box sx={{ display: 'flex', justifyContent: 'flex-end', mb: 2 }}>
        <Button variant="contained" startIcon={<AddIcon />} onClick={openCreate}>
          Add Campaign
        </Button>
      </Box>

      <ContentList
        items={items}
        loading={loading}
        error={error}
        onRetry={refresh}
        emptyPrompt="No campaigns yet — add your first"
        columns={columns}
        activeControl={{
          type: 'radio',
          isActive: (item) => item.active,
          onToggle: handleActivate,
          ariaLabel: (item) => `Activate campaign ${item.title_en || item.title_ar}`,
        }}
        onEdit={openEdit}
        onDelete={(item) => setDeleteTarget(item)}
        getItemName={(item) => item.title_en || item.title_ar || 'campaign'}
      />

      <ContentFormDialog<DonationFormValues>
        open={form.value}
        title={editing ? 'Edit Campaign' : 'Add Campaign'}
        fields={[
          { kind: 'bilingual', key: 'title', label: 'Title', required: true },
          { kind: 'bilingual', key: 'description', label: 'Description', required: true, multiline: true },
          { kind: 'number', key: 'collected', label: 'Collected ($)', required: true },
          { kind: 'number', key: 'goal', label: 'Goal ($)', required: true },
          { kind: 'number', key: 'donorCount', label: 'Donor count', required: true },
          { kind: 'text', key: 'donateUrl', label: 'Donate URL (optional)', placeholder: 'https://…' },
        ]}
        resolver={zodResolver(donationFormSchema)}
        defaultValues={editing ?? undefined}
        onSave={handleSave}
        onClose={() => { form.onFalse(); setEditing(null); }}
      >
        <QrImagePicker
          campaignId={editing?.id ?? null}
          qrImageUrl={draftQr}
          onQrSelected={setDraftQr}
        />
      </ContentFormDialog>

      <ConfirmDeleteDialog
        open={deleteTarget !== null}
        itemName={deleteTarget ? (deleteTarget.title_en || deleteTarget.title_ar || 'this campaign') : ''}
        onConfirm={handleDelete}
        onCancel={() => setDeleteTarget(null)}
      />
    </Box>
  );
}
