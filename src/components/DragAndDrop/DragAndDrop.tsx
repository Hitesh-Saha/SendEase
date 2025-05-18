import { CloudUpload } from '@mui/icons-material';
import { Box, Typography } from '@mui/material';
import React, { useCallback, useRef, useState } from 'react';

interface DragAndDropProps {
  onFileDrop: (file: File) => void;
  disabled?: boolean;
}

const DragAndDrop: React.FC<DragAndDropProps> = ({ onFileDrop, disabled }) => {
  const [isDragging, setIsDragging] = useState(false);
  const fileInputRef = useRef<HTMLInputElement>(null);

  const handleDragOver = useCallback((e: React.DragEvent<HTMLDivElement>) => {
    e.preventDefault();
    if (disabled) return;
    setIsDragging(true);
  }, [disabled]);

  const handleDragLeave = useCallback((e: React.DragEvent<HTMLDivElement>) => {
    e.preventDefault();
    setIsDragging(false);
  }, []);

  const handleDrop = useCallback((e: React.DragEvent<HTMLDivElement>) => {
    e.preventDefault();
    if (disabled) return;
    setIsDragging(false);

    const file = e.dataTransfer.files[0];
    if (file) {
      onFileDrop(file);
    }
  }, [onFileDrop, disabled]);

  const handleClick = () => {
    if (!disabled && fileInputRef.current) {
      fileInputRef.current.click();
    }
  };

  const handleFileChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    if (e.target.files && e.target.files[0]) {
      onFileDrop(e.target.files[0]);
    }
  };

  return (
    <>
      <input
        type="file"
        ref={fileInputRef}
        onChange={handleFileChange}
        style={{ display: 'none' }}
      />
      <Box
        onClick={handleClick}
        onDragOver={handleDragOver}
        onDragLeave={handleDragLeave}
        onDrop={handleDrop}
        sx={{
          border: (theme) => `2px dashed ${isDragging ? theme.palette.primary.main : theme.palette.divider}`,
          borderRadius: 2,
          p: 6,
          background: (theme) => isDragging 
            ? `${theme.palette.primary.main}08`
            : `${theme.palette.background.paper}40`,
          backdropFilter: 'blur(12px)',
          transition: 'all 0.3s ease',
          cursor: disabled ? 'not-allowed' : 'pointer',
          opacity: disabled ? 0.6 : 1,
          display: 'flex',
          flexDirection: 'column',
          alignItems: 'center',
          gap: 2,
          position: 'relative',
          overflow: 'hidden',
          '&::before': {
            content: '""',
            position: 'absolute',
            top: 0,
            left: 0,
            right: 0,
            height: '1px',
            background: (theme) => `linear-gradient(90deg, 
              transparent, 
              ${theme.palette.primary.main}40, 
              ${theme.palette.secondary.main}40, 
              transparent
            )`,
          },
          '&:hover': !disabled && {
            borderColor: 'primary.main',
            background: (theme) => `${theme.palette.primary.main}08`,
            '& .MuiSvgIcon-root': {
              color: 'primary.main',
            },
          },
        }}
      >
        <CloudUpload 
          sx={{ 
            fontSize: 48,
            color: (theme) => isDragging ? theme.palette.primary.main : theme.palette.text.secondary,
            transition: 'color 0.3s ease',
          }} 
        />
        <Box sx={{ textAlign: 'center' }}>
          <Typography 
            variant="h6" 
            sx={{ 
              color: (theme) => isDragging ? theme.palette.primary.main : theme.palette.text.primary,
              fontWeight: 600,
              mb: 1,
            }}
          >
            {isDragging ? 'Drop your file here' : 'Drag & Drop your file here'}
          </Typography>
          <Typography variant="body2" color="text.secondary">
            or click anywhere in this area to upload
          </Typography>
        </Box>
      </Box>
    </>
  );
};

export default DragAndDrop;
