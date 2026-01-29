import { useEffect, useState } from 'react';
import { useTitle } from '@/contexts/TitleContext';
import { useDrawer } from '@/contexts/DrawerContext';
import { useTable } from '@/hooks/useTable';
import { useDances } from '@/hooks/useDances';
import { DataTable } from '@/components/DataTable';
import { DetailDrawer } from '../DetailDrawer';
import { QueryBuilderComponent } from '@/components/QueryBuilder';
import { fields, defaultQuery, columns, initialState } from './columns';
import { Spinner, ErrorMessage } from '@/components/shared';
import type { Dance } from '@/lib/types/database';
import type { Row } from '@tanstack/react-table';

export const Dances = () => {
  const [selectedRow, setSelectedRow] = useState<Row<Dance> | null>(null);
  const { setDrawerOpen } = useDrawer();

  const { setTitle } = useTitle();
  useEffect(() => setTitle('Dances'), [setTitle]);

  const { data, error, isLoading } = useDances();
  const { table, query, setQuery } = useTable(data, columns, defaultQuery, initialState);

  if (isLoading) return <Spinner />;
  if (error) return <ErrorMessage error={error} />;

  const handleRowClick = (row: Row<Dance>) => {
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
        title={selectedRow?.original.title}
        onEdit={() => {
          // navigate(`/dances/${selectedRow?.id}/edit`);
          // setSelectedRow(null);
        }}
      />

    </>
  );
};
