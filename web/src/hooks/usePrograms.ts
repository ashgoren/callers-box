import { useQuery } from '@tanstack/react-query'
import { getProgram, getPrograms } from '@/lib/api/programs'
import type { Program } from '@/lib/types/database';

export const usePrograms = () => {
  return useQuery({
    queryKey: ['programs'],
    queryFn: getPrograms,
    select: data => data.map((program: Program) => buildProgram(program)),
  })
};

export const useProgram = (id: number) => {
  return useQuery({
    queryKey: ['program', id],
    queryFn: () => getProgram(id),
    select: data => buildProgram(data)
  })
};

const buildProgram = (program: Program) => ({
  ...program,
  danceNames: program.programs_dances.map(pd => pd.dance.title).join(', ')
});
