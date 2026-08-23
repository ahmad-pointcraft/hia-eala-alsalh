import { Paper, Skeleton, Stack, Table, TableBody, TableCell, TableRow, TableContainer } from '@mui/material';

/** Layout preset for the loading skeleton. */
export type SkeletonVariant = 'list' | 'form' | 'detail';

export interface LoadingSkeletonProps {
  /** Which placeholder layout to render.
   * - `list`: skeleton table rows (mirrors ContentList)
   * - `form`: stacked labeled field rows (forms)
   * - `detail`: a single detail block
   */
  variant: SkeletonVariant;
  /** `list` only — skeleton row count. @default 4 */
  rows?: number;
  /** `list` only — skeleton column count. @default 3 */
  columns?: number;
}

export function LoadingSkeleton({ variant, rows = 4, columns = 3 }: LoadingSkeletonProps) {
  if (variant === 'form') {
    return (
      <Paper sx={{ p: 3 }}>
        <Stack spacing={3}>
          {Array.from({ length: rows }).map((_, i) => (
            <Stack key={i} spacing={1}>
              <Skeleton variant="text" width={120} />
              <Skeleton variant="rounded" height={40} />
            </Stack>
          ))}
        </Stack>
      </Paper>
    );
  }

  if (variant === 'detail') {
    return (
      <Paper sx={{ p: 3 }}>
        <Stack spacing={2}>
          <Skeleton variant="text" width="40%" />
          <Skeleton variant="rounded" height={160} />
          <Skeleton variant="text" width="60%" />
        </Stack>
      </Paper>
    );
  }

  return (
    <TableContainer component={Paper}>
      <Table size="small">
        <TableBody>
          {Array.from({ length: rows }).map((_, i) => (
            <TableRow key={i}>
              {Array.from({ length: columns }).map((_, j) => (
                <TableCell key={j}>
                  <Skeleton />
                </TableCell>
              ))}
              <TableCell>
                <Skeleton variant="rectangular" width={80} />
              </TableCell>
            </TableRow>
          ))}
        </TableBody>
      </Table>
    </TableContainer>
  );
}
