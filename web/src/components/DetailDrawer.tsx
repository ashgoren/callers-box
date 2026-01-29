import { useEffect } from 'react';
import { Drawer, Box, Typography, IconButton, Button, Divider, ClickAwayListener } from '@mui/material';
import CloseIcon from '@mui/icons-material/Close';
import EditIcon from '@mui/icons-material/Edit';
import { flexRender, type Row } from '@tanstack/react-table';

type DetailDrawerProps<TData> = {
  open: boolean;
  onClose: () => void;
  onEdit?: () => void;
  row: Row<TData> | null;
  title?: string;
};

export const DetailDrawer = <TData extends Record<string, any>>({ open, onClose, onEdit, row, title }: DetailDrawerProps<TData>) => {
  useEffect(() => {
    if (!row) onClose();
  }, [row, onClose]);

  useEffect(() => {
    const handleEscape = (e: KeyboardEvent) => {
      if (e.key === 'Escape' && open) onClose();
    };    
    document.addEventListener('keydown', handleEscape);
    return () => document.removeEventListener('keydown', handleEscape);
  }, [open, onClose]);
  
  const handleClickAway = (event: MouseEvent | TouchEvent) => {
    const target = event.target as HTMLElement;
    if (target.closest('.MuiTable-root') || target.closest('.MuiTableContainer-root')) {
      return; // Don't close if clicking inside the table
    }
    onClose();
  };

  if (!row) return null;

  const cells = row.getVisibleCells();

  return (
    <ClickAwayListener onClickAway={handleClickAway}>
      <Drawer
        variant='persistent'
        anchor='right'
        open={open}
        sx={{
          '& .MuiDrawer-paper': { width: 400, height: '100vh', overflowY: 'auto'}
        }}
      >
        <Box sx={{ p: 2 }}>

          {/* Header */}
          <Box sx={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', mb: 2 }}>
            <Typography variant='h6' noWrap sx={{ flex: 1 }}>
              {title || 'Details'}
            </Typography>
            <IconButton onClick={onClose} size='small'>
              <CloseIcon />
            </IconButton>
          </Box>

          <Divider sx={{ mb: 2 }} />

          {/* Fields */}
          <Box sx={{ display: 'flex', flexDirection: 'column', gap: 2 }}>
            {cells.map((cell) => {
              const column = cell.column;

              if (column.id === 'id') return null; // Skip ID field

              const label = typeof column.columnDef.header === 'string' 
                ? column.columnDef.header 
                : column.id;

              return (
                <Box key={cell.id}>
                  <Typography variant='caption' color='text.secondary'>
                    {label}
                  </Typography>
                  <Typography variant='body1' component="div">
                     {flexRender(cell.column.columnDef.cell, cell.getContext())}
                  </Typography>
                </Box>
              );            
            })}
          </Box>

          <Divider sx={{ my: 2 }} />

          {/* Actions */}
          {onEdit && (
            <Button
              variant='contained'
              color='secondary'
              startIcon={<EditIcon />}
              onClick={onEdit}
              fullWidth
            >
              Edit
            </Button>
          )}
        </Box>
      </Drawer>
    </ClickAwayListener>
  );
};
