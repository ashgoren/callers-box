import { useTable } from '@/hooks/useTable';
import { DataTable } from '@/components/DataTable';
import { columns, initialState } from './columns';
import { useDancesPrograms } from '@/hooks/useDancesPrograms';

export const DancesPrograms = () => {
  const { data, error, isLoading } = useDancesPrograms();

  const table = useTable(data, columns, initialState);

  if (isLoading) {
    return <div>Loading...</div>;
  }

  if (error) {
    return <div>Error loading dances-programs join table: {(error as Error).message}</div>;
  }

  return (
    <>
      <h1>Dances-Programs Join Table</h1>
      <DataTable table={table} />
    </>
  );
};
