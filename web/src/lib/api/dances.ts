import { supabase } from '@/lib/supabase'

export const getDances = async () => {
  const { data, error } = await supabase
    .from('dances')
    .select('*, programs_dances(program:programs(*))');

  if (error) {
    throw new Error(error.message);
  }

  // console.log('Fetched dances:', data);
  return data;
};