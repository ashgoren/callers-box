import { useEffect, useState } from 'react';
import { useTitle } from '@/contexts/TitleContext';
import { useDrawer } from '@/contexts/DrawerContext';
import { useTable } from '@/hooks/useTable';
import { usePrograms } from '@/hooks/usePrograms';
import { DataTable } from '@/components/DataTable';
import { DetailDrawer } from '../DetailDrawer';
import { QueryBuilderComponent } from '@/components/QueryBuilder';
import { fields, defaultQuery, columns, initialState } from './columns';
import { Spinner, ErrorMessage } from '@/components/shared';
import { dateToLocaleString } from '@/lib/utils';
import type { Program } from '@/lib/types/database';
import type { Row } from '@tanstack/react-table';

export const Programs = () => {
  const [selectedRow, setSelectedRow] = useState<Row<Program> | null>(null);
  const { setDrawerOpen } = useDrawer();

  const { setTitle } = useTitle();
  useEffect(() => setTitle('Programs'), [setTitle]);

  const { data, error, isLoading } = usePrograms();
  const { table, query, setQuery } = useTable(data, columns, defaultQuery, initialState);

  if (isLoading) return <Spinner />;
  if (error) return <ErrorMessage error={error} />;

  const handleRowClick = (row: Row<Program>) => {
    setSelectedRow(row);
    setDrawerOpen(true);
  };

  const handleCloseDrawer = () => {
    setSelectedRow(null);
    setDrawerOpen(false);
  };

  return (
    <>
      <QueryBuilderComponent
        fields={fields}
        defaultQuery={defaultQuery}
        query={query}
        onQueryChange={setQuery}
      />

      <DataTable
        table={table}
        onRowClick={handleRowClick}
      />

      <DetailDrawer
        open={Boolean(selectedRow)}
        onClose={handleCloseDrawer}
        row={selectedRow}
        title={
          selectedRow?.original.date
            ? dateToLocaleString(new Date(selectedRow.original.date))
            : undefined
        }
        onEdit={() => {
          // navigate(`/programs/${selectedRow?.id}/edit`);
          // setSelectedRow(null);
        }}
      />
    </>
  );
};
