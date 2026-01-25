import { createColumnHelper } from "@tanstack/react-table";
import type { Program } from '@/lib/types/database';

const columnHelper = createColumnHelper<Program>();

export const columns = [
  columnHelper.accessor('id', { header: 'ID', enableColumnFilter: false }),
  columnHelper.accessor('date', { header: 'Date' }),
  columnHelper.accessor('location', { header: 'Location' }),
];

export const initialState = {
  sorting: [{ id: 'date', desc: false }]
};
