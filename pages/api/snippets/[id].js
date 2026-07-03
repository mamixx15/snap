import supabase from '../../../lib/supabase';

export default async function handler(req,res){
  if(req.method!=='GET') return res.status(405).json({error:'Method not allowed'});
  const { id } = req.query;
  if(!id) return res.status(400).json({error:'Missing id'});
  const { data, error } = await supabase
    .from('snippets')
    .select('*')
    .eq('id', id)
    .single();
  if(error) return res.status(404).json({error:error.message});
  return res.status(200).json(data);
}
