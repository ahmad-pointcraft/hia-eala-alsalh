import type { ReactNode } from 'react';
import { Box, Paper, Table, TableRow, TableBody, TableHead, TableCell, TableContainer, IconButton, Switch, Radio } from '@mui/material';
import { Edit as EditIcon, Delete as DeleteIcon } from '@mui/icons-material';
import { AsyncState } from '@/admin/components/states/AsyncState';
import type { EmptyStateAction } from '@/admin/components/states/EmptyState';
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
  emptyAction?: EmptyStateAction;
  columns: Column<T>[];
  activeControl?: ActiveControl<T>;
  onEdit?: (item: T) => void;
  onDelete?: (item: T) => void;
  getItemName: (item: T) => string;
  onReorder?: (index: number, direction: 'up' | 'down') => void;
  isRowFaded?: (item: T) => boolean;
}

export function ContentList<T extends { id: string }>({
  items,
  loading,
  error,
  onRetry,
  emptyPrompt,
  emptyAction,
  columns,
  activeControl,
  onEdit,
  onDelete,
  getItemName,
  onReorder,
  isRowFaded,
}: ContentListProps<T>) {
  const actionCount = (onEdit ? 1 : 0) + (onDelete ? 1 : 0) + (onReorder ? 1 : 0);
  const hasActions = actionCount > 0;

  return (
    // SINGLE STATE PIPELINE — ASYNCSTATE INTERNALLY (NEVER NESTED STATE RENDERERS)
    <AsyncState
      loading={loading}
      error={error}
      isEmpty={items.length === 0}
      skeleton="list"
      skeletonRows={4}
      skeletonColumns={columns.length + (activeControl ? 1 : 0) + (hasActions ? 1 : 0)}
      onRetry={onRetry}
      empty={{ title: emptyPrompt, action: emptyAction }}
    >
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
              <TableRow
                key={item.id}
                hover
                sx={isRowFaded?.(item) ? { '& td': { opacity: 0.5 } } : undefined}
              >
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
    </AsyncState>
  );
}
