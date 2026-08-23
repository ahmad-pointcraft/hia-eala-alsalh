import { useState } from 'react';
import { Box } from '@mui/material';
import type { StoredImage } from '@/shared/api';
import { PhotoCard } from './PhotoCard';

export interface PhotoGridProps {
  images: StoredImage[];
  onReorder: (index: number, direction: 'up' | 'down') => void;
  onDelete: (image: StoredImage) => void;
  onUploadFile: (file: File) => void;
}

/**
 * Responsive photo grid with drag-and-drop file upload support.
 */
export function PhotoGrid({
  images,
  onReorder,
  onDelete,
  onUploadFile,
}: PhotoGridProps) {
  const [isDragging, setIsDragging] = useState(false);

  const handleDragOver = (e: React.DragEvent) => {
    e.preventDefault();
    setIsDragging(true);
  };

  const handleDragLeave = (e: React.DragEvent) => {
    e.preventDefault();
    setIsDragging(false);
  };

  const handleDrop = (e: React.DragEvent) => {
    e.preventDefault();
    setIsDragging(false);
    const file = e.dataTransfer.files?.[0];
    if (file) onUploadFile(file);
  };

  return (
    <Box
      onDragOver={handleDragOver}
      onDragLeave={handleDragLeave}
      onDrop={handleDrop}
      sx={{
        display: 'grid',
        gridTemplateColumns: {
          xs: '1fr',
          sm: 'repeat(auto-fill, minmax(260px, 1fr))',
        },
        gap: 2.5,
        p: isDragging ? 2 : 0,
        borderRadius: 3,
        border: isDragging ? '2px dashed #2e7d32' : 'none',
        bgcolor: isDragging ? 'rgba(46, 125, 50, 0.04)' : 'transparent',
        transition: 'all 0.2s ease',
      }}
    >
      {images.map((img, index) => (
        <PhotoCard
          key={img.id}
          image={img}
          index={index}
          totalCount={images.length}
          onReorder={onReorder}
          onDelete={onDelete}
        />
      ))}
    </Box>
  );
}
