import { Stack } from '@mui/material';
import type { User } from '@/shared/api';
import { TeamCard } from './TeamCard';

export interface TeamCardListProps {
  members: User[];
}

export function TeamCardList({ members }: TeamCardListProps): JSX.Element {
  return (
    <Stack spacing={2}>
      {members.map((member) => (
        <TeamCard key={member.id} member={member} />
      ))}
    </Stack>
  );
}
