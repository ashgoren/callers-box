import { RelationCell } from '@/components//RelationCell';
import type { MRT_ColumnDef } from 'material-react-table';
import type { Choreographer } from '@/lib/types/database';

// NEW RECORD CONFIG
  
export const newRecord = {
  name: ''
}


// TABLE CONFIG

export const columns: MRT_ColumnDef<Choreographer>[] = [
  // {
  //   accessorKey: 'id',
  //   header: 'ID',
  //   enableColumnFilter: false,
  //   size: 10,
  //   minSize: 5,
  // },
  {
    accessorKey: 'name',
    header: 'Name',
    size: 60,
    minSize: 60,
  },
  {
    id: 'dances',
    header: '🔗 Dances',
    size: 300,
    minSize: 100,
    Cell: ({row}) => <RelationCell
      items={row.original.dances_choreographers}
      model='dance'
      getId={(joinRow) => joinRow.dance.id}
      getLabel={(joinRow) => joinRow.dance.title}
    />
  }
];

export const tableInitialState = {
  sorting: [{ id: 'name', desc: false }],
  density: 'compact' as const,
  pagination: { pageSize: 100, pageIndex: 0 }
};


// QUERY CONFIG

export const queryFields = [
  { name: 'name', label: 'Name', inputType: 'string' },
];

export const defaultQuery = {
  combinator: 'and',
  rules: [{ field: 'name', operator: '=', value: '' }]
};
