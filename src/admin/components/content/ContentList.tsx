import type { ReactNode } from 'react';
import {
  Box,
  Card,
  CardContent,
  Stack,
  Table,
  TableRow,
  TableBody,
  TableHead,
  TableCell,
  TableContainer,
  TablePagination,
  Typography,
  IconButton,
  Switch,
  Radio,
  Tooltip,
  type TablePaginationProps,
} from '@mui/material';
import {
  EditOutlined as EditIcon,
  DeleteOutline as DeleteIcon,
} from '@mui/icons-material';
import { AsyncState, type EmptyStateAction } from '@/admin/components/states';
import { useIsMobile } from '@/admin/hooks';
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
    <Stack
      direction="row"
      spacing={0.75}
      alignItems="center"
      justifyContent="flex-end"
      sx={{ opacity: faded ? 0.5 : 1 }}
    >
      {onReorder && (
        <UpDownReorder
          isFirst={index === 0}
          isLast={index === items.length - 1}
          onMoveUp={() => onReorder(index, 'up')}
          onMoveDown={() => onReorder(index, 'down')}
        />
      )}
      {onEdit && (
        <Tooltip title={`Edit ${getItemName(item)}`}>
          <IconButton
            size="small"
            onClick={() => onEdit(item)}
            aria-label={`Edit ${getItemName(item)}`}
            sx={{
              borderRadius: 1.5,
              border: '1px solid rgba(0, 0, 0, 0.08)',
              p: 0.5,
              '&:hover': {
                bgcolor: 'rgba(46, 125, 50, 0.08)',
                color: 'primary.main',
                borderColor: 'primary.main',
              },
            }}
          >
            <EditIcon sx={{ fontSize: 17 }} />
          </IconButton>
        </Tooltip>
      )}
      {onDelete && (
        <Tooltip title={`Delete ${getItemName(item)}`}>
          <IconButton
            size="small"
            onClick={() => onDelete(item)}
            aria-label={`Delete ${getItemName(item)}`}
            color="error"
            sx={{
              borderRadius: 1.5,
              border: '1px solid rgba(211, 47, 47, 0.15)',
              p: 0.5,
              '&:hover': {
                bgcolor: 'rgba(211, 47, 47, 0.08)',
                borderColor: 'error.main',
              },
            }}
          >
            <DeleteIcon sx={{ fontSize: 17 }} />
          </IconButton>
        </Tooltip>
      )}
    </Stack>
  );

  // PHONE LAYOUT — STACKED CARDS PRESERVING ALL DATA + ACTIONS
  const renderCards = () => (
    <Stack spacing={2}>
      {items.map((item, index) => {
        const faded = isRowFaded?.(item) ?? false;
        return (
          <Card
            key={item.id}
            sx={{
              opacity: faded ? 0.6 : 1,
              borderRadius: 3,
              border: '1px solid rgba(0, 0, 0, 0.08)',
              boxShadow: '0 1px 3px rgba(0, 0, 0, 0.04), 0 4px 12px rgba(0, 0, 0, 0.02)',
            }}
          >
            <CardContent sx={{ p: 2.5, display: 'flex', flexDirection: 'column', gap: 1.5, '&:last-child': { pb: 2.5 } }}>
              {columns.map((col) => (
                <Box key={col.header} sx={{ minWidth: 0 }}>
                  <Typography variant="caption" color="text.secondary" fontWeight={600} component="div" sx={{ textTransform: 'uppercase', letterSpacing: 0.4, mb: 0.25 }}>
                    {col.header}
                  </Typography>
                  <Box sx={{ overflowWrap: 'anywhere' }}>{col.render(item)}</Box>
                </Box>
              ))}
              {(activeControl || hasActions) && (
                <Box
                  sx={{
                    display: 'flex',
                    alignItems: 'center',
                    justifyContent: 'space-between',
                    pt: 1.5,
                    borderTop: '1px solid rgba(0, 0, 0, 0.06)',
                  }}
                >
                  {activeControl ? (
                    <Box sx={{ display: 'flex', alignItems: 'center', gap: 1 }}>
                      <Typography variant="caption" color="text.secondary" fontWeight={600}>
                        {activeControl.isActive(item) ? 'Active' : 'Inactive'}
                      </Typography>
                      {activeControl.type === 'switch' ? (
                        <Switch
                          size="small"
                          checked={activeControl.isActive(item)}
                          onChange={() => activeControl.onToggle(item)}
                          slotProps={{ input: { 'aria-label': activeControl.ariaLabel(item) } }}
                        />
                      ) : (
                        <Radio
                          size="small"
                          checked={activeControl.isActive(item)}
                          onChange={() => activeControl.onToggle(item)}
                          slotProps={{ input: { 'aria-label': activeControl.ariaLabel(item) } }}
                        />
                      )}
                    </Box>
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
      {/* SINGLE STATE PIPELINE — ASYNCSTATE INTERNALLY */}
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
          <Card
            sx={{
              borderRadius: 3,
              border: '1px solid rgba(0, 0, 0, 0.08)',
              boxShadow: '0 1px 3px rgba(0, 0, 0, 0.04), 0 4px 12px rgba(0, 0, 0, 0.02)',
              overflow: 'hidden',
            }}
          >
            <TableContainer>
              <Table>
                <TableHead>
                  <TableRow sx={{ bgcolor: '#f8fafc' }}>
                    {columns.map((col, i) => (
                      <TableCell
                        key={col.header}
                        sx={{
                          width: col.width,
                          fontWeight: 700,
                          fontSize: '0.78rem',
                          color: 'text.secondary',
                          letterSpacing: 0.5,
                          py: 1.75,
                          pl: i === 0 ? 3 : 2,
                        }}
                      >
                        {col.header.toUpperCase()}
                      </TableCell>
                    ))}
                    {activeControl && (
                      <TableCell
                        sx={{
                          fontWeight: 700,
                          fontSize: '0.78rem',
                          color: 'text.secondary',
                          letterSpacing: 0.5,
                          py: 1.75,
                          width: '100px',
                        }}
                      >
                        STATUS
                      </TableCell>
                    )}
                    {hasActions && (
                      <TableCell
                        align="right"
                        sx={{
                          fontWeight: 700,
                          fontSize: '0.78rem',
                          color: 'text.secondary',
                          letterSpacing: 0.5,
                          py: 1.75,
                          pr: 3,
                          width: '160px',
                        }}
                      >
                        ACTIONS
                      </TableCell>
                    )}
                  </TableRow>
                </TableHead>
                <TableBody>
                  {items.map((item, index) => (
                    <TableRow
                      key={item.id}
                      sx={{
                        transition: 'background-color 0.15s ease',
                        '&:hover': { bgcolor: 'rgba(46, 125, 50, 0.02)' },
                        '&:last-child td': { borderBottom: pagination && items.length > 0 ? '1px solid rgba(0, 0, 0, 0.06)' : 0 },
                        ...(isRowFaded?.(item) ? { '& td': { opacity: 0.5 } } : {}),
                      }}
                    >
                      {columns.map((col, i) => (
                        <TableCell
                          key={col.header}
                          sx={{
                            width: col.width,
                            py: 2,
                            pl: i === 0 ? 3 : 2,
                          }}
                        >
                          {col.render(item)}
                        </TableCell>
                      ))}
                      {activeControl && (
                        <TableCell sx={{ py: 2 }}>
                          {activeControl.type === 'switch' ? (
                            <Switch
                              size="small"
                              checked={activeControl.isActive(item)}
                              onChange={() => activeControl.onToggle(item)}
                              slotProps={{ input: { 'aria-label': activeControl.ariaLabel(item) } }}
                            />
                          ) : (
                            <Radio
                              size="small"
                              checked={activeControl.isActive(item)}
                              onChange={() => activeControl.onToggle(item)}
                              slotProps={{ input: { 'aria-label': activeControl.ariaLabel(item) } }}
                            />
                          )}
                        </TableCell>
                      )}
                      {hasActions && (
                        <TableCell align="right" sx={{ py: 2, pr: 3 }}>
                          {renderActions(item, index, isRowFaded?.(item) ?? false)}
                        </TableCell>
                      )}
                    </TableRow>
                  ))}
                </TableBody>
              </Table>
            </TableContainer>

            {/* INTEGRATED CARD PAGINATION */}
            {pagination && items.length > 0 && (
              <TablePagination
                {...pagination}
                sx={{
                  borderTop: '1px solid rgba(0, 0, 0, 0.06)',
                  bgcolor: '#fafafa',
                  flexWrap: { xs: 'wrap', sm: 'nowrap' },
                  alignItems: 'center',
                  gap: { xs: 0.5, sm: 0 },
                  '& .MuiTablePagination-toolbar': { flexWrap: { xs: 'wrap', sm: 'nowrap' }, gap: { xs: 0.5, sm: 0 }, pr: 2 },
                  '& .MuiTablePagination-spacer': { display: { xs: 'none', sm: 'block' } },
                }}
              />
            )}
          </Card>
        )}
      </AsyncState>

      {/* PHONE-ONLY EXTERNAL PAGINATION */}
      {isPhone && pagination && items.length > 0 && (
        <Box sx={{ mt: 2, display: 'flex', justifyContent: 'center' }}>
          <TablePagination
            {...pagination}
            sx={{
              flexWrap: 'wrap',
              '& .MuiTablePagination-toolbar': { flexWrap: 'wrap', justifyContent: 'center' },
            }}
          />
        </Box>
      )}
    </Box>
  );
}

