import { useMemo } from 'react';
import type { z } from 'zod';
import { Box, Button, Typography } from '@mui/material';
import { Add as AddIcon } from '@mui/icons-material';
import { zodResolver } from '@hookform/resolvers/zod';
import { api } from '@/shared/api';
import type { DonationCampaign } from '@/shared/api';
import { useSession } from '@/admin/store';
import { useCrudList, useCrudDialogs, usePagination } from '@/admin/hooks';
import { useToast } from '@/admin/components';
import { donationFormSchema } from '@/admin/utils';
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

  const { items, loading, error, create, update, remove, refresh } = useCrudList<
    DonationCampaign,
    DonationPatch
  >(masjidId, {
    list: api.listDonations,
    create: api.createDonationCampaign,
    update: api.updateDonationCampaign,
    remove: api.deleteDonationCampaign,
  });

  const dialogs = useCrudDialogs<DonationCampaign>((c) => c.qrImageUrl);
  const toast = useToast();
  const pager = usePagination<DonationCampaign>();

  // STABLE SORT — CREATION ORDER SO PAGES DON'T RESHUFFLE (PAGINATION PREREQ)
  const sorted = useMemo(() => [...items].sort((a, b) => a.id.localeCompare(b.id)), [items]);

  const columns: Column<DonationCampaign>[] = [
    {
      header: 'Campaign',
      render: (item) => (
        <Typography noWrap sx={{ maxWidth: 280, fontWeight: 600 }}>
          {item.title_en || item.title_ar}
        </Typography>
      ),
    },
    {
      header: 'Collected',
      render: (item) => (
        <Typography fontWeight={700} color="success.dark">
          ${item.collected.toLocaleString()}
        </Typography>
      ),
      width: '120px',
    },
    {
      header: 'Goal',
      render: (item) => (
        <Typography color="text.secondary">
          ${item.goal.toLocaleString()}
        </Typography>
      ),
      width: '120px',
    },
    { header: 'Donors', render: (item) => item.donorCount, width: '90px' },
  ];

  // RADIO ACTIVATION — setActiveDonationCampaign DEACTIVATES THE REST ATOMICALLY
  // (PAGE PRESERVED — ACTIVATION DOESN'T MOVE ROWS)
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
    const payload = {
      ...values,
      donateUrl: values.donateUrl || null,
      qrImageUrl: dialogs.draftImage,
    };
    try {
      if (dialogs.editing) {
        await update(dialogs.editing.id, payload);
        toast.success('Campaign updated');
      } else {
        await create({ ...payload, active: false });
        pager.reset(); // NEW ROW STAYS VISIBLE (FR-006)
        toast.success('Campaign created — activate it with the radio');
      }
    } catch (e) {
      toast.error(`Failed to save campaign: ${e instanceof Error ? e.message : String(e)}`);
      throw e;
    }
  }

  async function handleDelete() {
    if (!dialogs.deleteTarget) return;
    const wasActive = dialogs.deleteTarget.active;
    try {
      await remove(dialogs.deleteTarget.id);
      pager.reset(); // AFFECTED ROWS STAY VISIBLE (FR-006)
      toast.success(
        wasActive
          ? 'Active campaign deleted — overlay falls back until another is activated'
          : 'Campaign deleted',
      );
    } catch {
      toast.error('Failed to delete campaign');
    } finally {
      dialogs.clearDelete();
    }
  }

  const isQrDirty = dialogs.draftImage !== (dialogs.editing?.qrImageUrl ?? null);

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
          Add Campaign
        </Button>
      </Box>


      <ContentList
        items={pager.slice(sorted)}
        loading={loading}
        error={error}
        onRetry={refresh}
        emptyPrompt="No campaigns yet"
        emptyAction={{ label: 'Create your first', onClick: dialogs.openCreate }}
        pagination={pager.paginationProps(sorted.length)}
        columns={columns}
        activeControl={{
          type: 'radio',
          isActive: (item) => item.active,
          onToggle: handleActivate,
          ariaLabel: (item) => `Activate campaign ${item.title_en || item.title_ar}`,
        }}
        onEdit={dialogs.openEdit}
        onDelete={dialogs.requestDelete}
        getItemName={(item) => item.title_en || item.title_ar || 'campaign'}
      />

      <ContentFormDialog<DonationFormValues>
        open={dialogs.formOpen}
        title={dialogs.editing ? 'Edit Campaign' : 'Add Campaign'}
        fields={[
          { kind: 'bilingual', key: 'title', label: 'Title', required: true },
          {
            kind: 'bilingual',
            key: 'description',
            label: 'Description',
            required: true,
            multiline: true,
          },
          { kind: 'number', key: 'collected', label: 'Collected ($)', required: true },
          { kind: 'number', key: 'goal', label: 'Goal ($)', required: true },
          { kind: 'number', key: 'donorCount', label: 'Donor count', required: true },
          {
            kind: 'text',
            key: 'donateUrl',
            label: 'Donate URL (optional)',
            placeholder: 'https://…',
          },
        ]}
        resolver={zodResolver(donationFormSchema)}
        defaultValues={dialogs.editing ?? undefined}
        extraDirty={isQrDirty}
        onSave={handleSave}
        onClose={dialogs.closeForm}
      >
        <QrImagePicker qrImageUrl={dialogs.draftImage} onQrSelected={dialogs.setDraftImage} />
      </ContentFormDialog>

      <ConfirmDeleteDialog
        open={dialogs.deleteTarget !== null}
        itemName={
          dialogs.deleteTarget
            ? dialogs.deleteTarget.title_en || dialogs.deleteTarget.title_ar || 'this campaign'
            : ''
        }
        onConfirm={handleDelete}
        onCancel={dialogs.clearDelete}
      />
    </Box>
  );
}
