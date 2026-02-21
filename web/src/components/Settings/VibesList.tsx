import { useState, useEffect } from 'react';
import { Box, List, ListItem, ListItemText, TextField, IconButton, Tooltip, Button, InputAdornment, CircularProgress, Typography } from '@mui/material';
import SearchIcon from '@mui/icons-material/Search';
import EditIcon from '@mui/icons-material/Edit';
import DeleteIcon from '@mui/icons-material/Delete';
import CheckIcon from '@mui/icons-material/Check';
import CloseIcon from '@mui/icons-material/Close';
import AddIcon from '@mui/icons-material/Add';
import { Spinner, ErrorMessage } from '@/components/shared';
import { useTitle } from '@/contexts/TitleContext';
import { useVibes, useCreateVibe, useUpdateVibe, useDeleteVibe } from '@/hooks/useVibes';

export const VibesList = () => {
  const { setTitle } = useTitle();
  useEffect(() => setTitle('Vibes'), [setTitle]);
  
  const [searchTerm, setSearchTerm] = useState('');
  const [editingId, setEditingId] = useState<number | 'new' | null>(null);
  const [editValue, setEditValue] = useState('');

  const { data, isLoading, error } = useVibes();
  const { mutateAsync: createVibe, isPending: isCreating } = useCreateVibe();
  const { mutateAsync: updateVibe, isPending: isUpdating } = useUpdateVibe();
  const { mutateAsync: deleteVibe } = useDeleteVibe();

  if (isLoading) return <Spinner />;
  if (error) return <ErrorMessage error={error} />;

  const filtered = (data ?? []).filter(vibe =>
    vibe.name.toLowerCase().includes(searchTerm.toLowerCase())
  );

  const isSaving = isCreating || isUpdating;

  const handleEdit = (id: number, name: string) => {
    setEditingId(id);
    setEditValue(name);
  };

  const handleCancel = () => {
    setEditingId(null);
    setEditValue('');
  };

  const handleSave = async () => {
    const trimmed = editValue.trim();
    if (!trimmed) return;
    try {
      if (editingId === 'new') {
        await createVibe({ name: trimmed });
      } else if (editingId !== null) {
        await updateVibe({ id: editingId, updates: { name: trimmed } });
      }
      setEditingId(null);
      setEditValue('');
    } catch {
      // error already toasted by the hook
    }
  };

  const handleDelete = async (id: number) => {
    try {
      await deleteVibe({ id });
    } catch {
      // error already toasted by the hook
    }
  };

  const handleKeyDown = (e: React.KeyboardEvent) => {
    if (e.key === 'Enter') handleSave();
    if (e.key === 'Escape') handleCancel();
  };

  const editActions = (
    <Box sx={{ display: 'flex', gap: 0.5 }}>
      <IconButton size='small' onClick={handleSave} disabled={isSaving || !editValue.trim()}>
        {isSaving ? <CircularProgress size={16} /> : <CheckIcon fontSize='small' />}
      </IconButton>
      <IconButton size='small' onClick={handleCancel} disabled={isSaving}>
        <CloseIcon fontSize='small' />
      </IconButton>
    </Box>
  );

  const editField = (placeholder?: string) => (
    <TextField
      size='small'
      placeholder={placeholder}
      value={editValue}
      onChange={e => setEditValue(e.target.value)}
      onKeyDown={handleKeyDown}
      autoFocus
      variant='standard'
      sx={{ flexGrow: 1, mr: 10 }}
    />
  );

  return (
    <Box sx={{ maxWidth: 600, mx: 'auto', mt: 3, px: 2 }}>
      <TextField
        fullWidth
        size='small'
        placeholder='Search vibes...'
        value={searchTerm}
        onChange={e => setSearchTerm(e.target.value)}
        slotProps={{
          input: {
            startAdornment: (
              <InputAdornment position='start'>
                <SearchIcon fontSize='small' />
              </InputAdornment>
            ),
          },
        }}
        sx={{ mb: 1 }}
      />

      <List disablePadding>
        {filtered.map(vibe => {
          const isEditing = editingId === vibe.id;
          const hasLinkedDances = vibe.dances_vibes.length > 0;
          return (
            <ListItem
              key={vibe.id}
              disablePadding
              sx={{ borderBottom: '1px solid', borderColor: 'divider', py: 0.5 }}
              secondaryAction={
                isEditing ? editActions : (
                  <Box sx={{ display: 'flex', gap: 0.5 }}>
                    <IconButton
                      size='small'
                      onClick={() => handleEdit(vibe.id, vibe.name)}
                      disabled={editingId !== null}
                    >
                      <EditIcon fontSize='small' />
                    </IconButton>
                    <Tooltip title={hasLinkedDances ? 'Remove from linked dances before deleting' : ''}>
                      <span>
                        <IconButton
                          size='small'
                          onClick={() => handleDelete(vibe.id)}
                          disabled={hasLinkedDances || editingId !== null}
                          color='error'
                        >
                          <DeleteIcon fontSize='small' />
                        </IconButton>
                      </span>
                    </Tooltip>
                  </Box>
                )
              }
            >
              {isEditing ? editField() : (
                <ListItemText
                  primary={vibe.dances_vibes.length > 0 ? (
                    <>
                      {vibe.name}{' '}
                      <Tooltip title={`${vibe.dances_vibes.length} linked ${vibe.dances_vibes.length === 1 ? 'dance' : 'dances'}`}>
                        <Typography component='span' variant='body2' color='text.secondary'>
                          ({vibe.dances_vibes.length})
                        </Typography>
                      </Tooltip>
                    </>
                  ) : vibe.name}
                  sx={{ pr: 10 }}
                />
              )}
            </ListItem>
          );
        })}

        {editingId === 'new' && (
          <ListItem
            disablePadding
            sx={{ borderBottom: '1px solid', borderColor: 'divider', py: 0.5 }}
            secondaryAction={editActions}
          >
            {editField('New vibe...')}
          </ListItem>
        )}
      </List>

      {editingId !== 'new' && (
        <Button
          startIcon={<AddIcon />}
          onClick={() => { setEditingId('new'); setEditValue(''); }}
          sx={{ mt: 1 }}
          disabled={editingId !== null}
        >
          Add vibe
        </Button>
      )}
    </Box>
  );
};
