import { useState, useMemo } from 'react';
import { usePersistState, loadPersistence } from './usePersistence';
import { useMaterialReactTable } from 'material-react-table';
import { evaluateQuery } from '@/components/QueryBuilder/queryEvaluator';
import type { RuleGroupType } from 'react-querybuilder';
import type { MRT_RowData, MRT_ColumnDef, MRT_TableOptions } from 'material-react-table';

export const useTable = <TData extends MRT_RowData>(
  tableId: string,
  data: TData[] | undefined,
  columns: MRT_ColumnDef<TData>[],
  defaultQuery : RuleGroupType,
  onRowClick?: (row: TData) => void,
  options?: Partial<MRT_TableOptions<TData>>
) => {
  const [initialState] = useState(() =>
    loadPersistence(`mrt_${tableId}`, {
      query: defaultQuery,
      sorting: options?.initialState?.sorting ?? [],
      columnVisibility: options?.initialState?.columnVisibility ?? {},
      columnOrder: options?.initialState?.columnOrder ?? [],
      columnPinning: options?.initialState?.columnPinning ?? {},
      columnSizing: options?.initialState?.columnSizing ?? {},
      density: options?.initialState?.density ?? 'comfortable',
    })
  );
  const [query, setQuery] = useState<RuleGroupType>(initialState.query);
  const [sorting, setSorting] = useState(initialState.sorting);
  const [columnVisibility, setColumnVisibility] = useState(initialState.columnVisibility);
  const [columnOrder, setColumnOrder] = useState<string[]>(initialState.columnOrder);
  const [columnPinning, setColumnPinning] = useState(initialState.columnPinning);
  const [columnSizing, setColumnSizing] = useState(initialState.columnSizing);
  const [density, setDensity] = useState(initialState.density);

  const filteredData = useMemo(
    () => (data ?? []).filter(row => evaluateQuery(row, query)),
    [data, query]
  );

  usePersistState(`mrt_${tableId}`, {
    sorting, columnVisibility, columnOrder, columnPinning, columnSizing, density, query
  });

  const table = useMaterialReactTable({
    columns,
    data: filteredData,
    state: { sorting, columnVisibility, columnOrder, columnPinning, columnSizing, density },
    onSortingChange: setSorting,
    onColumnVisibilityChange: setColumnVisibility,
    onColumnOrderChange: setColumnOrder,
    onColumnPinningChange: setColumnPinning,
    onColumnSizingChange: setColumnSizing,
    onDensityChange: setDensity,
    enableColumnPinning: true,
    enableColumnOrdering: true,
    enableColumnFilterModes: false,
    enableColumnFilters: false,
    enableGlobalFilter: false,
    enableFilterMatchHighlighting: false,
    layoutMode: 'grid',
    enableColumnResizing: true,
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
