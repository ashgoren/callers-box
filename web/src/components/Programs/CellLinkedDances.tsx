import { Box } from '@mui/material';
import { useDrawerActions } from '@/contexts/DrawerContext';

export const CellLinkedDances = ({ programsDances }: { programsDances: any[] }) => {
  const { openDrawer } = useDrawerActions(); 
  return (
    <Box sx={{ display: 'flex', flexDirection: 'column', alignItems: 'flex-start', gap: 0.5 }}>
      {programsDances.map((pd) => (
        <Box
          key={pd.dance.id}
          onClick={(e) => {
            e.stopPropagation();
            openDrawer('dance', pd.dance.id);
          }}
          sx={{ cursor: 'pointer', textDecoration: 'underline', color: 'secondary.main', '&:hover': { color: 'secondary.dark' } }}
        >
          {pd.order} - {pd.dance.title}
        </Box>
      ))}
    </Box>
  );
};
