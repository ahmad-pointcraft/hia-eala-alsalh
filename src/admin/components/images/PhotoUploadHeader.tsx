import { useRef } from 'react';
import { Box, Button, Typography } from '@mui/material';
import { CloudUpload as UploadIcon } from '@mui/icons-material';

export interface PhotoUploadHeaderProps {
  uploading: boolean;
  onUploadFile: (file: File) => void;
  headingRef?: React.Ref<HTMLHeadingElement>;
}


/**
 * Top header section for slideshow photos with title and upload action.
 */
export function PhotoUploadHeader({
  uploading,
  onUploadFile,
  headingRef,
}: PhotoUploadHeaderProps) {
  const inputRef = useRef<HTMLInputElement>(null);

  return (
    <Box
      sx={{
        display: 'flex',
        flexDirection: { xs: 'column', sm: 'row' },
        justifyContent: 'space-between',
        alignItems: { xs: 'flex-start', sm: 'center' },
        gap: 2,
        mb: { xs: 3, md: 4 },
      }}
    >
      <Box>
        <Typography
          variant="h5"
          component="h1"
          tabIndex={-1}
          ref={headingRef}
          fontWeight={600}
          gutterBottom
        >
          Slideshow Photos
        </Typography>
        <Typography color="text.secondary" fontSize="0.95rem">
          Photos (≤ 2MB) show in a rotating carousel on the kiosk display when no events are active.
        </Typography>
      </Box>

      <input
        ref={inputRef}
        type="file"
        accept="image/*"
        hidden
        onChange={(e) => {
          const file = e.target.files?.[0];
          if (file) onUploadFile(file);
          e.target.value = '';
        }}
      />

      <Button
        variant="contained"
        startIcon={<UploadIcon />}
        disabled={uploading}
        onClick={() => inputRef.current?.click()}
        sx={{
          borderRadius: 2,
          px: 2.5,
          fontWeight: 700,
          boxShadow: '0 2px 8px rgba(46, 125, 50, 0.25)',
          transition: 'all 0.2s ease-in-out',
          whiteSpace: 'nowrap',
          '&:hover': {
            transform: 'scale(1.03)',
            boxShadow: '0 4px 12px rgba(46, 125, 50, 0.35)',
          },
        }}
      >
        {uploading ? 'Uploading…' : 'Upload Photo'}
      </Button>
    </Box>
  );
}
