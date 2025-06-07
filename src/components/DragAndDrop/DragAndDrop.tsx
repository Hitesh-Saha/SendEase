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
          border: "2px dashed",
          borderColor: isDragging ? "primary.main" : "divider",
          borderRadius: 2,
          p: { xs: 2, sm: 3, md: 4 },
          display: "flex",
          flexDirection: "column",
          alignItems: "center",
          justifyContent: "center",
          minHeight: { xs: 160, sm: 200 },
          background: (theme) => isDragging
            ? `${theme.palette.primary.main}10`
            : `${theme.palette.background.paper}40`,
          backdropFilter: "blur(8px)",
          transition: "all 0.2s",
          cursor: disabled ? "not-allowed" : "pointer",
          opacity: disabled ? 0.5 : 1,
          gap: { xs: 1, sm: 2 },
        }}
      >
        <CloudUpload
          sx={{
            color: "primary.main",
            fontSize: { xs: "2.5rem", sm: "3rem" },
            mb: { xs: 1, sm: 2 },
          }}
        />
        <Typography
          variant="h6"
          component="p"
          sx={{
            textAlign: "center",
            color: "text.primary",
            fontSize: { xs: "1rem", sm: "1.25rem" },
          }}
        >
          {isDragging ? 'Drop your file here' : 'Drag & Drop your file here'}
        </Typography>
        <Typography
          variant="body2"
          sx={{
            color: "text.secondary",
            textAlign: "center",
            fontSize: { xs: "0.75rem", sm: "0.875rem" },
          }}
        >
          or click to select a file
        </Typography>
      </Box>
    </>
  );
};

export default DragAndDrop;
