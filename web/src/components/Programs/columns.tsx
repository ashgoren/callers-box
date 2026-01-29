import { createColumnHelper } from "@tanstack/react-table";
import { CellLinkedDances } from "./CellLinkedDances";
import { dateToLocaleString } from '@/lib/utils';
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
};

export const columns = [
  columnHelper.accessor('id', {
    header: 'ID',
    enableColumnFilter: false,
    size: 20,
    minSize: 20,
  }),
  columnHelper.accessor('date', {
    header: 'Date',
    size: 50,
    minSize: 50,
    cell: info => info.row.original ? dateToLocaleString(new Date(info.getValue()!)) : '',
  }),
  columnHelper.accessor('location', {
    header: 'Location',
    size: 60,
    minSize: 60,
  }),
  columnHelper.display({
    id: 'dances',
    header: '🔗 Dances',
    cell: info => <CellLinkedDances programsDances={info.row.original.programs_dances} />,
    size: 300,
    minSize: 100,
  }),
];

export const initialState = {
  sorting: [{ id: 'date', desc: true }]
};
