import { useUpdateProgram } from '@/hooks/usePrograms';
import { Spinner, ErrorMessage } from '@/components/shared';
import { useProgram } from '@/hooks/usePrograms';
import { columns } from '../Programs/columns';
import { DetailPanel } from '@/components/DetailPanel';
import { EditPanel } from '@/components/EditPanel';
import { useDrawerState, useDrawerActions } from '@/contexts/DrawerContext';
import { parseLocalDate } from '@/lib/utils';
import type { ProgramUpdate } from '@/lib/types/database';

export const ProgramDetails = ({ id }: { id: number }) => {
  const { isEditing } = useDrawerState();
  const { setIsEditing } = useDrawerActions();
  const { mutateAsync: updateProgram } = useUpdateProgram();
  const { data: program, isLoading, error } = useProgram(Number(id));

  if (isLoading) return <Spinner />;
  if (error) return <ErrorMessage error={error} />;
  if (!program) return <ErrorMessage error={new Error('Program not found')} />;

  if (isEditing) {
    return (
      <EditPanel
        data={program}
        columns={columns}
        title={`Edit Program: ${formatDate(program)}`}
        onSave={(updates: ProgramUpdate) => updateProgram({ id, updates })}
        onCancel={() => setIsEditing(false)}
      />
    );
  }

  return (
    <DetailPanel
      data={program}
      columns={columns}
      title={`Program: ${formatDate(program)}`}
      onEdit={() => setIsEditing(true)}
    />
  );
};

const formatDate = (program: { date?: string | null }) =>
  program.date ? parseLocalDate(program.date) : '';
