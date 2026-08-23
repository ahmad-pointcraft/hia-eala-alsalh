import type { ReactNode } from 'react';
import { Box, Card, CardContent, Paper, Stack, Table, TableRow, TableBody, TableHead, TableCell, TableContainer, TablePagination, Typography, IconButton, Switch, Radio, type TablePaginationProps } from '@mui/material';
import { Edit as EditIcon, Delete as DeleteIcon } from '@mui/icons-material';
import { AsyncState } from '@/admin/components/states/AsyncState';
import type { EmptyStateAction } from '@/admin/components/states/EmptyState';
import { useIsMobile } from '@/admin/hooks/useIsMobile';
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
  /**
   * Pagination controls rendered under the table when provided (and the list
   * is non-empty). Omit entirely for unpaged lists (Devices pattern).
   * Spread the `paginationProps(totalCount)` bag from `usePagination`.
   */
  pagination?: TablePaginationProps;
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
  pagination,
}: ContentListProps<T>) {
  const actionCount = (onEdit ? 1 : 0) + (onDelete ? 1 : 0) + (onReorder ? 1 : 0);
  const hasActions = actionCount > 0;
  const isPhone = useIsMobile('sm');

  // SHARED PER-ROW ACTIONS (TABLE CELL AND PHONE CARD)
  const renderActions = (item: T, index: number, faded: boolean) => (
    <Box sx={{ display: 'flex', alignItems: 'center', gap: 0.5, opacity: faded ? 0.5 : 1 }}>
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
  );

  // PHONE LAYOUT — STACKED CARDS PRESERVING ALL DATA + ACTIONS
  const renderCards = () => (
    <Stack spacing={1.5}>
      {items.map((item, index) => {
        const faded = isRowFaded?.(item) ?? false;
        return (
          <Card key={item.id} sx={{ opacity: faded ? 0.6 : 1 }}>
            <CardContent sx={{ display: 'flex', flexDirection: 'column', gap: 1, '&:last-child': { pb: 2 } }}>
              {columns.map((col) => (
                <Box key={col.header} sx={{ minWidth: 0 }}>
                  <Typography variant="caption" color="text.secondary" component="div">
                    {col.header}
                  </Typography>
                  {/* LONG BILINGUAL TEXT WRAPS GRACEFULLY — NO LAYOUT BREAK */}
                  <Box sx={{ overflowWrap: 'anywhere' }}>{col.render(item)}</Box>
                </Box>
              ))}
              {(activeControl || hasActions) && (
                <Box sx={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between', pt: 0.5 }}>
                  {activeControl ? (
                    activeControl.type === 'switch' ? (
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
                    )
                  ) : <Box />}
                  {renderActions(item, index, faded)}
                </Box>
              )}
            </CardContent>
          </Card>
        );
      })}
    </Stack>
  );

  return (
    <Box>
      {/* SINGLE STATE PIPELINE — ASYNCSTATE INTERNALLY (NEVER NESTED STATE RENDERERS) */}
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
        {isPhone ? (
          renderCards()
        ) : (
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
                    {renderActions(item, index, isRowFaded?.(item) ?? false)}
                  </TableCell>
                )}
              </TableRow>
            ))}
          </TableBody>
        </Table>
      </TableContainer>
        )}
      </AsyncState>

      {/* PAGINATION — ONLY WHEN PROVIDED AND THE LIST IS NON-EMPTY (NEVER "PAGE 1 OF 0") */}
      {pagination && items.length > 0 && (
        <TablePagination
          {...pagination}
          sx={{
            flexWrap: { sm: 'wrap' },
            alignItems: { sm: 'center' },
            gap: { sm: 0.5 },
            '& .MuiTablePagination-toolbar': { flexWrap: { sm: 'wrap' }, gap: { sm: 0.5 } },
            '& .MuiTablePagination-spacer': { display: { sm: 'none' } },
          }}
        />
      )}
    </Box>
  );
}
