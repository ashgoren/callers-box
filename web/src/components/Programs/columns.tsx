import { Box } from '@mui/material';
import { createColumnHelper } from "@tanstack/react-table";
import type { Program } from '@/lib/types/database';

const columnHelper = createColumnHelper<Program>();

export const fields = [
  { name: 'date', label: 'Date', inputType: 'date' },
  { name: 'location', label: 'Location', inputType: 'string' },
  { name: 'danceNames', label: 'Dances', inputType: 'string' },
];

export const defaultQuery = {
  combinator: 'and',
  rules: [{ field: 'date', operator: '=', value: '' }]
}

export const columns = [
  columnHelper.accessor('id', {
    header: 'ID',
    enableColumnFilter: false,
    size: 15,
    minSize: 15,
  }),
  columnHelper.accessor('date', {
    header: 'Date',
    size: 35,
    minSize: 30,
  }),
  columnHelper.accessor('location', {
    header: 'Location',
    size: 50,
    minSize: 40,
  }),
  columnHelper.display({
    id: 'dances',
    header: '🔗 Dances',
    cell: info => info.row.original.programs_dances.map(pd =>
      <Box sx={{ display: 'flex', flexDirection: 'column', gap: 0.5 }} key={pd.dance.id}>
        {pd.order} - {pd.dance.title}
      </Box>
    ),
    size: 300,
    minSize: 100,
  }),
];

export const initialState = {
  sorting: [{ id: 'date', desc: true }]
};
