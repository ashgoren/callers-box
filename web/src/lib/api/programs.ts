import { supabase } from '@/lib/supabase'

export const getPrograms = async () => {
  const { data, error } = await supabase
    .from('programs')
    .select('*, programs_dances(order, dance:dances(*))')
    .order('order', { referencedTable: 'programs_dances', ascending: true });

  if (error) throw new Error(error.message);
  return data;
};

export const getProgram = async (id: number) => {
  const { data, error } = await supabase
    .from('programs')
    .select('*, programs_dances(order, dance:dances(*))')
    .eq('id', id)
    .single();

  if (error) throw new Error(error.message);
  return data;
};
