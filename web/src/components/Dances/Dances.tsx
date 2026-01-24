import { useTable } from '@/hooks/useTable';
import { DataTable } from '@/components/DataTable';
import { columns, initialState } from './columns';
import { useDances } from '@/hooks/useDances';

export const Dances = () => {
  const { data, error, isLoading } = useDances();

  const table = useTable(data, columns, initialState);

  if (isLoading) {
    return <div>Loading...</div>;
  }

  if (error) {
    return <div>Error loading dances: {(error as Error).message}</div>;
  }

  return (
    <>
      <h1>Dances</h1>
      <DataTable table={table} />
    </>
  );
};
