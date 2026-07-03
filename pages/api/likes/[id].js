import supabase from '../../../lib/supabase';

// API route for handling snippet likes
export default async function handler(req, res) {
  const { id } = req.query;
  
  if (!id) {
    return res.status(400).json({ error: 'Snippet ID is required' });
  }
  
  // Handle different HTTP methods
  switch (req.method) {
    case 'POST':
      return addLike(req, res, id);
    case 'DELETE':
      return removeLike(req, res, id);
    default:
      return res.status(405).json({ error: 'Method not allowed' });
  }
}

// POST - Add a like to a snippet
async function addLike(req, res, id) {
  try {
    // Get user identifier from request body or generate a fallback
    const userId = req.body.user_id || 
                   req.headers['x-forwarded-for'] || 
                   req.connection.remoteAddress || 
                   'anonymous';
    
    // Check if this user already liked this snippet
    const { data: existingLike, error: likeCheckError } = await supabase
      .from('snippet_likes')
      .select('id')
      .eq('snippet_id', id)
      .eq('user_id', userId)
      .single();
    
    // If there was an error but it's not "not found", throw it
    if (likeCheckError && likeCheckError.code !== 'PGRST116') {
      throw likeCheckError;
    }
    
    // If user already liked this snippet, return early
    if (existingLike) {
      return res.status(200).json({ message: 'Already liked' });
    }
    
    // Record this like
    const { error: insertError } = await supabase
      .from('snippet_likes')
      .insert([
        {
          snippet_id: id,
          user_id: userId
        }
      ]);
    
    if (insertError) throw insertError;
    
    // Increment the like count on the snippet
    const { data, error: updateError } = await supabase.rpc('increment_like_count', {
      snippet_id: id
    });
    
    if (updateError) throw updateError;
    
    return res.status(200).json({ success: true, likes: data });
  } catch (error) {
    console.error('Error adding like:', error);
    return res.status(500).json({ error: 'Failed to add like' });
  }
}

// DELETE - Remove a like from a snippet
async function removeLike(req, res, id) {
  try {
    // Get user identifier from request body or generate a fallback
    const userId = req.body.user_id || 
                   req.headers['x-forwarded-for'] || 
                   req.connection.remoteAddress || 
                   'anonymous';
    
    // Check if this user liked this snippet
    const { data: existingLike, error: likeCheckError } = await supabase
      .from('snippet_likes')
      .select('id')
      .eq('snippet_id', id)
      .eq('user_id', userId)
      .single();
    
    // If there was an error but it's not "not found", throw it
    if (likeCheckError && likeCheckError.code !== 'PGRST116') {
      throw likeCheckError;
    }
    
    // If user didn't like this snippet, return early
    if (!existingLike) {
      return res.status(200).json({ message: 'Not liked yet' });
    }
    
    // Delete this like
    const { error: deleteError } = await supabase
      .from('snippet_likes')
      .delete()
      .eq('snippet_id', id)
      .eq('user_id', userId);
    
    if (deleteError) throw deleteError;
    
    // Decrement the like count on the snippet
    const { data, error: updateError } = await supabase.rpc('decrement_like_count', {
      snippet_id: id
    });
    
    if (updateError) throw updateError;
    
    return res.status(200).json({ success: true, likes: data });
  } catch (error) {
    console.error('Error removing like:', error);
    return res.status(500).json({ error: 'Failed to remove like' });
  }
}
