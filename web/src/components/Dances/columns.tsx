import { Box } from '@mui/material';
import { ExternalLink } from '@/components/shared';
import { TruncatedCell } from '@/components/TruncatedCell';
import { createColumnHelper, type CellContext } from '@tanstack/react-table';
import type { Dance } from '@/lib/types/database';

type CellInfo = CellContext<Dance, string | null>;

const columnHelper = createColumnHelper<Dance>();

export const fields = [
  { name: 'title', label: 'Title', inputType: 'string' },
  { name: 'choreographer', label: 'Choreographer', inputType: 'string' },
  { name: 'difficulty', label: 'Difficulty', inputType: 'number' },
  { name: 'notes', label: 'Notes', inputType: 'string' },
  { name: 'place_in_program', label: 'Place in Program', inputType: 'string' },
  { name: 'moves', label: 'Moves', inputType: 'string' },
  { name: 'swing_16', label: '16-beat swing?', inputType: 'boolean' },
  { name: 'programNames', label: 'Programs', inputType: 'string' },
];

export const defaultQuery = {
  combinator: 'and',
  rules: [{ field: 'title', operator: 'contains', value: '' }]
}

export const columns = [
  columnHelper.accessor('title', { 
    header: 'Title',
    cell: info => linkTitle(info),
    size: 250,
    minSize: 100
  }),
  columnHelper.accessor('id', {
    header: 'ID',
    enableColumnFilter: false,
    size: 60,
    minSize: 55,
  }),
  columnHelper.accessor('choreographer', {
    header: 'Choreographer',
    size: 200,
    minSize: 170
  }),
  columnHelper.accessor('difficulty', {
    header: 'Difficulty',
    size: 150,
    minSize: 130,
    filterFn: 'equalsString'
  }),
  columnHelper.accessor('notes', {
    header: 'Notes',
    size: 300,
    minSize: 120,
    filterFn: 'includesString',
    cell: info => info.getValue() ? <TruncatedCell content={info.getValue()} title={`Notes: ${info.row.original.title}`} /> : null
  }),
  columnHelper.accessor('place_in_program', {
    header: 'Place in Program',
    size: 250,
    minSize: 150,
    filterFn: 'includesString',
    cell: info => info.getValue() ? <TruncatedCell content={info.getValue()} title={`Place in Program: ${info.row.original.title}`} /> : null
  }),
  columnHelper.accessor('moves', {
    header: 'Moves',
    size: 200,
    minSize: 120,
    filterFn: 'includesString',
    cell: info => info.getValue() ? <TruncatedCell content={info.getValue()} title={`Moves: ${info.row.original.title}`} /> : null
  }),
  columnHelper.accessor('swing_16', {
    header: '16-beat swing?',
    size: 200,
    minSize: 120,
    filterFn: 'equalsString'
  }),
  columnHelper.accessor('video', {
    header: 'Video',
    cell: info => linkVideo(info),
    enableColumnFilter: false,
    enableSorting: false,
    enableResizing: false,
    size: 70,
    minSize: 70
  }),
  columnHelper.display({
    id: 'programs',
    header: '🔗 Programs',
    cell: info => info.row.original.programs_dances.map(pd =>
      <Box key={pd.program.id}>
        {pd.program.date} - {pd.program.location}
      </Box>
    ),
    enableColumnFilter: false,
    size: 300,
    minSize: 100,
  }),
];

export const initialState = {
  sorting: [{ id: 'id', desc: false }],
  columnPinning: { left: ['title'] }
};

const linkTitle = (info: CellInfo) => {
  const title = info.getValue();
  const url = info.row.original.url;
  return url ? <ExternalLink url={url} title={title!} /> : title;
};

const linkVideo = (info: CellInfo) => {
  const video = info.getValue();
  return video ? <ExternalLink url={video} title='Video' /> : null;
};
