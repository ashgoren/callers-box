import { Spinner, ErrorMessage } from '@/components/shared';
import { useDance } from '@/hooks/useDances';
import { columns } from './columns';
import { HeadlessDetailTable } from '@/components/HeadlessDetailTable';

export const DanceDetails = ({ id }: { id: number }) => {
  const { data: dance, isLoading, error } = useDance(Number(id));

  if (isLoading) return <Spinner />;
  if (error) return <ErrorMessage error={error} />;
  if (!dance) return <ErrorMessage error={new Error('Dance not found')} />;

  return (
    <HeadlessDetailTable
      data={dance}
      columns={columns}
      title={`Dance: ${dance.title}`}
    />
  );
};
