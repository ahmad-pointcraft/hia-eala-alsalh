import {
  Box,
  Card,
  CardMedia,
  Chip,
  IconButton,
  Stack,
  Tooltip,
  Typography,
} from '@mui/material';
import {
  DeleteOutline as DeleteIcon,
  Collections as GalleryIcon,
} from '@mui/icons-material';
import type { StoredImage } from '@/shared/api';
import { UpDownReorder } from '@/admin/components/content';

export interface PhotoCardProps {
  image: StoredImage;
  index: number;
  totalCount: number;
  onReorder: (index: number, direction: 'up' | 'down') => void;
  onDelete: (image: StoredImage) => void;
}

/**
 * Individual card item for slideshow photo gallery.
 */
export function PhotoCard({
  image,
  index,
  totalCount,
  onReorder,
  onDelete,
}: PhotoCardProps) {
  return (
    <Card
      sx={{
        borderRadius: 3,
        border: '1px solid rgba(0, 0, 0, 0.08)',
        boxShadow: '0 1px 3px rgba(0, 0, 0, 0.04), 0 4px 12px rgba(0, 0, 0, 0.02)',
        overflow: 'hidden',
        display: 'flex',
        flexDirection: 'column',
        transition: 'transform 0.2s ease, box-shadow 0.2s ease',
        '&:hover': {
          transform: 'translateY(-3px)',
          boxShadow: '0 6px 20px rgba(0, 0, 0, 0.08)',
          '& .media-img': {
            transform: 'scale(1.04)',
          },
        },
      }}
    >
      {/* IMAGE WRAPPER WITH HOVER ZOOM & GLASS BADGE */}
      <Box sx={{ position: 'relative', height: 165, overflow: 'hidden', bgcolor: '#0f172a' }}>
        <CardMedia
          component="img"
          src={image.url}
          alt={image.name}
          className="media-img"
          sx={{
            height: '100%',
            width: '100%',
            objectFit: 'cover',
            transition: 'transform 0.3s ease-in-out',
          }}
        />
        <Chip
          icon={<GalleryIcon sx={{ fontSize: '14px !important', color: '#fff' }} />}
          label={`#${index + 1}`}
          size="small"
          sx={{
            position: 'absolute',
            top: 10,
            left: 10,
            bgcolor: 'rgba(15, 23, 42, 0.7)',
            color: '#ffffff',
            backdropFilter: 'blur(6px)',
            fontWeight: 700,
            fontSize: '0.75rem',
            height: 24,
            borderRadius: 1.5,
          }}
        />
      </Box>

      {/* CARD DETAILS & ACTIONS */}
      <Box
        sx={{
          p: 1.75,
          display: 'flex',
          alignItems: 'center',
          justifyContent: 'space-between',
          gap: 1,
          bgcolor: '#ffffff',
          borderTop: '1px solid rgba(0, 0, 0, 0.06)',
        }}
      >
        <Tooltip title={image.name}>
          <Typography
            variant="body2"
            fontWeight={600}
            noWrap
            sx={{ maxWidth: 140, color: 'text.primary' }}
          >
            {image.name}
          </Typography>
        </Tooltip>

        <Stack direction="row" spacing={0.75} alignItems="center">
          <UpDownReorder
            isFirst={index === 0}
            isLast={index === totalCount - 1}
            onMoveUp={() => onReorder(index, 'up')}
            onMoveDown={() => onReorder(index, 'down')}
          />
          <Tooltip title="Delete photo">
            <IconButton
              size="small"
              color="error"
              aria-label={`Delete ${image.name}`}
              onClick={() => onDelete(image)}
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
        </Stack>
      </Box>
    </Card>
  );
}
