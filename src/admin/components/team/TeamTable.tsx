import {
  Table,
  TableBody,
  TableCell,
  TableContainer,
  TableHead,
  TableRow,
  Paper,
  Chip,
} from '@mui/material';
import type { User } from '@/shared/api';

export interface TeamTableProps {
  members: User[];
}

export function TeamTable({ members }: TeamTableProps): JSX.Element {
  return (
    <TableContainer component={Paper} elevation={0} variant="outlined" sx={{ borderRadius: 2 }}>
      <Table>
        <TableHead sx={{ bgcolor: 'action.hover' }}>
          <TableRow>
            <TableCell sx={{ fontWeight: 700 }}>Name</TableCell>
            <TableCell sx={{ fontWeight: 700 }}>Email</TableCell>
            <TableCell sx={{ fontWeight: 700 }}>Role</TableCell>
            <TableCell sx={{ fontWeight: 700 }}>Added</TableCell>
          </TableRow>
        </TableHead>
        <TableBody>
          {members.map((member) => (
            <TableRow key={member.id} hover>
              <TableCell sx={{ fontWeight: 600 }}>{member.name || 'Team Member'}</TableCell>
              <TableCell color="text.secondary">{member.email}</TableCell>
              <TableCell>
                <Chip
                  label={member.role === 'masjid_admin' ? 'Admin' : 'Editor'}
                  color={member.role === 'masjid_admin' ? 'primary' : 'default'}
                  size="small"
                  sx={{ fontWeight: 600, fontSize: '0.75rem' }}
                />
              </TableCell>
              <TableCell color="text.secondary">
                {member.createdAt ? new Date(member.createdAt).toLocaleDateString() : '—'}
              </TableCell>
            </TableRow>
          ))}
        </TableBody>
      </Table>
    </TableContainer>
  );
}
