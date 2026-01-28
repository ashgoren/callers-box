import { useQuery } from '@tanstack/react-query'
import { getDances } from '@/lib/api/dances'
import type { Dance } from '@/lib/types/database';

export const useDances = () => {
  return useQuery({
    queryKey: ['dances'],
    queryFn: getDances,
    select: (data => data.map((dance: Dance) => ({
      ...dance,
      programs_dances: dance.programs_dances?.toSorted((a, b) => {
        const dateA = a.program.date;
        const dateB = b.program.date;
        if (!dateA && !dateB) return 0;
        if (!dateA) return 1;
        if (!dateB) return -1;
        return dateA.localeCompare(dateB);
      }).reverse(),
      programNames: dance.programs_dances.map(pd => pd.program.location).join(', ')
    }))),
  })
};
