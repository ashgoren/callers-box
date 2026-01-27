import { createColumnHelper } from "@tanstack/react-table";
import type { Program } from '@/lib/types/database';

const columnHelper = createColumnHelper<Program>();

export const fields = [
  { name: 'date', label: 'Date', inputType: 'date' },
  { name: 'location', label: 'Location', inputType: 'string' },
];

export const defaultQuery = {
  combinator: 'and',
  rules: [{ field: 'date', operator: '=', value: '' }]
}

export const columns = [
  columnHelper.accessor('id', {
    header: 'ID',
    enableColumnFilter: false,
    size: 10,
    minSize: 10,
  }),
  columnHelper.accessor('date', {
    header: 'Date',
    size: 20,
    minSize: 20,
  }),
  columnHelper.accessor('location', {
    header: 'Location' 
  }),
];

export const initialState = {
  sorting: [{ id: 'date', desc: false }]
};
