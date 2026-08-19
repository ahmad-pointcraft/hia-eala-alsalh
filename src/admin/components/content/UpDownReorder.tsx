import { IconButton } from '@mui/material';
import { ArrowUpward as ArrowUpwardIcon, ArrowDownward as ArrowDownwardIcon } from '@mui/icons-material';

 
export interface UpDownReorderProps {
  isFirst: boolean;
  isLast: boolean;
  onMoveUp: () => void;
  onMoveDown: () => void;
}

export function UpDownReorder({ isFirst, isLast, onMoveUp, onMoveDown }: UpDownReorderProps) {
  return (
    <>
      <IconButton
        size="small"
        onClick={onMoveUp}
        disabled={isFirst}
        aria-label="Move up"
      >
        <ArrowUpwardIcon fontSize="small" />
      </IconButton>
      <IconButton
        size="small"
        onClick={onMoveDown}
        disabled={isLast}
        aria-label="Move down"
      >
        <ArrowDownwardIcon fontSize="small" />
      </IconButton>
    </>
  );
}
