import { useState, useMemo } from 'react';
import { useMaterialReactTable } from 'material-react-table';
import { evaluateQuery } from '@/components/QueryBuilder/queryEvaluator';
import type { RuleGroupType } from 'react-querybuilder';
import type { MRT_RowData, MRT_ColumnDef, MRT_TableOptions } from 'material-react-table';

export const useTable = <TData extends MRT_RowData>(
  data: TData[] | undefined,
  columns: MRT_ColumnDef<TData>[],
  defaultQuery : RuleGroupType,
  onRowClick?: (row: TData) => void,
  options?: Partial<MRT_TableOptions<TData>>
) => {
  const [query, setQuery] = useState<RuleGroupType>(defaultQuery);

  const filteredData = useMemo(
    () => (data ?? []).filter(row => evaluateQuery(row, query)),
    [data, query]
  );

  const table = useMaterialReactTable({
    columns,
    data: filteredData,
    enableColumnPinning: true,
    enableColumnOrdering: true,
    enableColumnFilterModes: false,
    enableColumnFilters: false,
    enableGlobalFilter: false,
    enableFilterMatchHighlighting: false,
    layoutMode: 'grid',
    enableColumnResizing: true,
    // enableColumnVisibility: true,
    // enableSorting: true,
    columnResizeMode: 'onChange',
    muiTableBodyRowProps: ({ row }) => ({
      onClick: () => onRowClick?.(row.original),
      sx: {
        cursor: onRowClick ? 'pointer' : 'default',
      },
    }),
    ...options
  });

  return { table, query, setQuery };
};
