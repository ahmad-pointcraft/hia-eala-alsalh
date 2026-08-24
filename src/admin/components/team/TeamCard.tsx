import { Box, Card, CardContent, Typography, Chip } from '@mui/material';
import type { User } from '@/shared/api';

export interface TeamCardProps {
  member: User;
}

export function TeamCard({ member }: TeamCardProps): JSX.Element {
  return (
    <Card variant="outlined" sx={{ borderRadius: 2 }}>
      <CardContent sx={{ p: 2, '&:last-child': { pb: 2 } }}>
        <Box sx={{ display: 'flex', justifyContent: 'space-between', alignItems: 'flex-start', mb: 1 }}>
          <Typography variant="subtitle1" fontWeight={700}>
            {member.name || 'Team Member'}
          </Typography>
          <Chip
            label={member.role === 'masjid_admin' ? 'Admin' : 'Editor'}
            color={member.role === 'masjid_admin' ? 'primary' : 'default'}
            size="small"
            sx={{ fontWeight: 600, fontSize: '0.75rem' }}
          />
        </Box>
        <Typography variant="body2" color="text.secondary" sx={{ wordBreak: 'break-all' }}>
          {member.email}
        </Typography>
        {member.createdAt && (
          <Typography variant="caption" color="text.secondary" sx={{ display: 'block', mt: 1 }}>
            Added: {new Date(member.createdAt).toLocaleDateString()}
          </Typography>
        )}
      </CardContent>
    </Card>
  );
}
