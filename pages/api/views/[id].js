 
import supabase from '../../../lib/supabase';

// API route for tracking snippet views
export default async function handler(req, res) {
  // Only allow POST requests
  if (req.method !== 'POST') {
    return res.status(405).json({ error: 'Method not allowed' });
  }
  
  const { id } = req.query;
  
  if (!id) {
    return res.status(400).json({ error: 'Snippet ID is required' });
  }
  
  try {
    // Get client IP address for simple duplicate view checking
    const clientIp = req.headers['x-forwarded-for'] || 
                     req.connection.remoteAddress || 
                     'unknown';
                     
    // Use a combination of snippet ID and client IP as view key
    const viewKey = `${id}_${clientIp}`;
    
    // Check if this view is already recorded in recent views (last 30 minutes)
    const { data: existingView, error: viewCheckError } = await supabase
      .from('snippet_views')
      .select('id')
      .eq('view_key', viewKey)
      .gt('created_at', new Date(Date.now() - 30 * 60 * 1000).toISOString()) // 30 minutes ago
      .single();
    
    // If there was an error but it's not "not found", throw it
    if (viewCheckError && viewCheckError.code !== 'PGRST116') {
      throw viewCheckError;
    }
    
    // If this view is already recorded, return early without incrementing
    if (existingView) {
      return res.status(200).json({ message: 'View already counted' });
    }
    
    // Record this view
    const { error: insertError } = await supabase
      .from('snippet_views')
      .insert([
        {
          snippet_id: id,
          view_key: viewKey,
          ip_address: clientIp
        }
      ]);
    
    if (insertError) throw insertError;
    
    // Increment the view count on the snippet
    const { data, error: updateError } = await supabase.rpc('increment_view_count', {
      snippet_id: id
    });
    
    if (updateError) throw updateError;
    
    return res.status(200).json({ success: true, views: data });
  } catch (error) {
    console.error('Error tracking snippet view:', error);
    return res.status(500).json({ error: 'Failed to track snippet view' });
  }
}