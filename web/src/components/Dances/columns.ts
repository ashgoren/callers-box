import { createColumnHelper } from "@tanstack/react-table";
import type { Dance } from '@/lib/types/database';

const columnHelper = createColumnHelper<Dance>();

export const columns = [
  columnHelper.accessor('id', { header: 'ID', enableColumnFilter: false }),
  columnHelper.accessor('title', { header: 'Title' }),
  columnHelper.accessor('choreographer', { header: 'Choreographer' }),
];

export const initialState = {
  sorting: [{ id: 'id', desc: false }],
};
