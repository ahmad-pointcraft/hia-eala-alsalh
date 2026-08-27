import { useState, useEffect, useCallback } from 'react';
import { Box, Button, Typography } from '@mui/material';
import { PersonAdd as InviteIcon, PeopleOutline as TeamIcon } from '@mui/icons-material';
import { api, type User } from '@/shared/api';
import { useSession } from '@/admin/store';
import { useBoolean } from '@/shared/hooks/useBoolean';
import { useFocusHeading, useIsMobile } from '@/admin/hooks';
import { AsyncState, InviteDialog, TeamTable, TeamCardList } from '@/admin/components';

export function Team(): JSX.Element {
  const session = useSession((s) => s.session);
  const masjidId = session?.masjidId ?? '';
  const [members, setMembers] = useState<User[]>([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);
  const inviteDialog = useBoolean();
  const headingRef = useFocusHeading<HTMLHeadingElement>();
  const isPhone = useIsMobile('sm');

  const loadTeam = useCallback(async () => {
    if (!masjidId) return;
    setLoading(true);
    setError(null);
    try {
      const list = await api.listTeamMembers(masjidId);
      setMembers(list);
    } catch {
      setError('Failed to load team members. Please try again.');
    } finally {
      setLoading(false);
    }
  }, [masjidId]);

  useEffect(() => {
    void loadTeam();
  }, [loadTeam]);

  return (
    <Box sx={{ pb: 2 }}>
      {/* HEADER */}
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
            Team Management
          </Typography>
          <Typography variant="body2" color="text.secondary">
            Manage staff members and authorization roles for this mosque.
          </Typography>
        </Box>

        <Button
          variant="contained"
          startIcon={<InviteIcon />}
          onClick={inviteDialog.onTrue}
          sx={{ alignSelf: { xs: 'stretch', sm: 'auto' } }}
        >
          Invite Member
        </Button>
      </Box>

      {/* MEMBERS LIST */}
      <AsyncState
        loading={loading}
        error={error}
        isEmpty={members.length === 0}
        onRetry={loadTeam}
        skeleton="list"
        empty={{
          icon: <TeamIcon sx={{ fontSize: 48, color: 'text.secondary' }} />,
          title: 'No team members registered yet',
          description: 'Invite imams, administrators, and content editors to collaborate.',
          action: {
            label: 'Invite your first member',
            onClick: inviteDialog.onTrue,
          },
        }}
      >
        {isPhone ? <TeamCardList members={members} /> : <TeamTable members={members} />}
      </AsyncState>

      {/* INVITE MODAL */}
      <InviteDialog
        open={inviteDialog.value}
        onClose={inviteDialog.onFalse}
        masjidId={masjidId}
        onInviteCreated={loadTeam}
      />
    </Box>
  );
}
