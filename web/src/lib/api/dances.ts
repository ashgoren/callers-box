import { supabase } from '@/lib/supabase'

export const getDances = async () => {
  const { data, error } = await supabase
    .from('dances')
    .select('*, programs_dances(program:programs(*))');

  if (error) throw new Error(error.message);
  return data;
};

export const getDance = async (id: number) => {
  const { data, error } = await supabase
    .from('dances')
    .select('*, programs_dances(program:programs(*))')
    .eq('id', id)
    .single();

  if (error) throw new Error(error.message);
  return data;
};
