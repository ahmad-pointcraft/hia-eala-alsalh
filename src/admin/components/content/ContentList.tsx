import type { ReactNode } from 'react';
import { Box, Paper, Table, TableRow, TableBody, TableHead, TableCell, TableContainer, Typography, IconButton, Button, Switch, Radio, Skeleton, Alert } from '@mui/material';
import { Edit as EditIcon, Delete as DeleteIcon } from '@mui/icons-material';
import { UpDownReorder } from './UpDownReorder';

 
export interface Column<T> {
  header: string;
  render: (item: T) => ReactNode;
  width?: string;
}

 
export interface ActiveControl<T> {
  type: 'switch' | 'radio';
  isActive: (item: T) => boolean;
  onToggle: (item: T) => void;
  ariaLabel: (item: T) => string;
}

export interface ContentListProps<T extends { id: string }> {
  items: T[];
  loading: boolean;
  error: string | null;
  onRetry: () => void;
  emptyPrompt: string;
  columns: Column<T>[];
  activeControl?: ActiveControl<T>;
  onEdit?: (item: T) => void;
  onDelete?: (item: T) => void;
  getItemName: (item: T) => string;
  onReorder?: (index: number, direction: 'up' | 'down') => void;
}

export function ContentList<T extends { id: string }>({
  items,
  loading,
  error,
  onRetry,
  emptyPrompt,
  columns,
  activeControl,
  onEdit,
  onDelete,
  getItemName,
  onReorder,
}: ContentListProps<T>) {
  const actionCount = (onEdit ? 1 : 0) + (onDelete ? 1 : 0) + (onReorder ? 1 : 0);
  const hasActions = actionCount > 0;

  if (loading) {
    return (
      <TableContainer component={Paper}>
        <Table size="small">
          <TableBody>
            {Array.from({ length: 4 }).map((_, i) => (
              <TableRow key={i}>
                {columns.map((col, j) => (
                  <TableCell key={j} sx={{ width: col.width }}>
                    <Skeleton />
                  </TableCell>
                ))}
                {activeControl && <TableCell><Skeleton variant="rectangular" width={40} /></TableCell>}
                {hasActions && <TableCell><Skeleton variant="rectangular" width={80} /></TableCell>}
              </TableRow>
            ))}
          </TableBody>
        </Table>
      </TableContainer>
    );
  }

  if (error) {
    return (
      <Alert
        severity="error"
        action={
          <Button color="inherit" size="small" onClick={onRetry}>
            Retry
          </Button>
        }
      >
        {error}
      </Alert>
    );
  }

  if (items.length === 0) {
    return (
      <Paper sx={{ p: 4, textAlign: 'center' }}>
        <Typography color="text.secondary">{emptyPrompt}</Typography>
      </Paper>
    );
  }

  return (
    <TableContainer component={Paper}>
      <Table size="small">
        <TableHead>
          <TableRow>
            {columns.map((col) => (
              <TableCell key={col.header} sx={{ width: col.width, fontWeight: 600 }}>
                {col.header}
              </TableCell>
            ))}
            {activeControl && <TableCell sx={{ fontWeight: 600 }}>Active</TableCell>}
            {hasActions && <TableCell sx={{ fontWeight: 600 }}>Actions</TableCell>}
          </TableRow>
        </TableHead>
        <TableBody>
          {items.map((item, index) => (
            <TableRow key={item.id} hover>
              {columns.map((col) => (
                <TableCell key={col.header} sx={{ width: col.width }}>
                  {col.render(item)}
                </TableCell>
              ))}
              {activeControl && (
                <TableCell>
                  {activeControl.type === 'switch' ? (
                    <Switch
                      size="small"
                      checked={activeControl.isActive(item)}
                      onChange={() => activeControl.onToggle(item)}
                      inputProps={{ 'aria-label': activeControl.ariaLabel(item) }}
                    />
                  ) : (
                    <Radio
                      size="small"
                      checked={activeControl.isActive(item)}
                      onChange={() => activeControl.onToggle(item)}
                      inputProps={{ 'aria-label': activeControl.ariaLabel(item) }}
                    />
                  )}
                </TableCell>
              )}
              {hasActions && (
                <TableCell>
                  <Box sx={{ display: 'flex', alignItems: 'center', gap: 0.5 }}>
                    {onReorder && (
                      <UpDownReorder
                        isFirst={index === 0}
                        isLast={index === items.length - 1}
                        onMoveUp={() => onReorder(index, 'up')}
                        onMoveDown={() => onReorder(index, 'down')}
                      />
                    )}
                    {onEdit && (
                      <IconButton size="small" onClick={() => onEdit(item)} aria-label={`Edit ${getItemName(item)}`}>
                        <EditIcon fontSize="small" />
                      </IconButton>
                    )}
                    {onDelete && (
                      <IconButton size="small" onClick={() => onDelete(item)} aria-label={`Delete ${getItemName(item)}`} color="error">
                        <DeleteIcon fontSize="small" />
                      </IconButton>
                    )}
                  </Box>
                </TableCell>
              )}
            </TableRow>
          ))}
        </TableBody>
      </Table>
    </TableContainer>
  );
}
