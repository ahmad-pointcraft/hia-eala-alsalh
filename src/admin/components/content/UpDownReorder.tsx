import { IconButton, Tooltip, Stack } from '@mui/material';
import {
  ArrowUpward as ArrowUpwardIcon,
  ArrowDownward as ArrowDownwardIcon,
} from '@mui/icons-material';

export interface UpDownReorderProps {
  isFirst: boolean;
  isLast: boolean;
  onMoveUp: () => void;
  onMoveDown: () => void;
}

export function UpDownReorder({ isFirst, isLast, onMoveUp, onMoveDown }: UpDownReorderProps) {
  return (
    <Stack direction="row" spacing={0.5}>
      <Tooltip title="Move up">
        <span>
          <IconButton
            size="small"
            onClick={onMoveUp}
            disabled={isFirst}
            aria-label="Move up"
            sx={{
              borderRadius: 1.5,
              border: '1px solid rgba(0, 0, 0, 0.08)',
              p: 0.5,
              '&:hover:not(:disabled)': {
                bgcolor: 'rgba(46, 125, 50, 0.08)',
                color: 'primary.main',
                borderColor: 'primary.main',
              },
            }}
          >
            <ArrowUpwardIcon sx={{ fontSize: 16 }} />
          </IconButton>
        </span>
      </Tooltip>
      <Tooltip title="Move down">
        <span>
          <IconButton
            size="small"
            onClick={onMoveDown}
            disabled={isLast}
            aria-label="Move down"
            sx={{
              borderRadius: 1.5,
              border: '1px solid rgba(0, 0, 0, 0.08)',
              p: 0.5,
              '&:hover:not(:disabled)': {
                bgcolor: 'rgba(46, 125, 50, 0.08)',
                color: 'primary.main',
                borderColor: 'primary.main',
              },
            }}
          >
            <ArrowDownwardIcon sx={{ fontSize: 16 }} />
          </IconButton>
        </span>
      </Tooltip>
    </Stack>
  );
}

