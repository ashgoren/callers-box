import { createColumnHelper } from "@tanstack/react-table";
import type { DanceProgram } from '@/lib/types/database';

const columnHelper = createColumnHelper<DanceProgram>();

export const columns = [
  columnHelper.accessor('id', { header: 'ID' }),
  columnHelper.accessor('program_id', { header: 'Program ID' }),
  columnHelper.accessor('dance_id', { header: 'Dance ID' }),
  columnHelper.accessor('order', { header: 'Order' }),
];

export const initialState = {
  sorting: [{ id: 'program_id', desc: false }],
  columnVisibility: { id: false }
}
