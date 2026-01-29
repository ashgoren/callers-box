import { Box } from '@mui/material';
import { useDrawerActions } from '@/contexts/DrawerContext';

export const CellLinkedPrograms = ({ programsDances }: { programsDances: any[] }) => {
  const { openDrawer } = useDrawerActions(); 
  return (
    <Box sx={{ display: 'flex', flexDirection: 'column', alignItems: 'flex-start', gap: 0.5 }}>
      {programsDances.map((pd) => (
        <Box
          key={pd.program.id}
          onClick={(e) => {
            e.stopPropagation();
            openDrawer('program', pd.program.id);
          }}
          sx={{ cursor: 'pointer', textDecoration: 'underline', color: 'secondary.main', '&:hover': { color: 'secondary.dark' } }}
        >
          {pd.program.date} - {pd.program.location}
        </Box>
      ))}
    </Box>
  );
};
