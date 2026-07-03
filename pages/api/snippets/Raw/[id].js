import supabase from '../../../../lib/supabase';

// API route for getting the raw content of a snippet
export default async function handler(req, res) {
  // Only allow GET requests
  if (req.method !== 'GET') {
    return res.status(405).json({ error: 'Method not allowed' });
  }
  
  const { id } = req.query;
  
  if (!id) {
    return res.status(400).json({ error: 'Snippet ID is required' });
  }
  
  try {
    // Fetch snippet from database
    const { data, error } = await supabase
      .from('snippets')
      .select('content, language, title')
      .eq('id', id)
      .single();
    
    if (error) {
      if (error.code === 'PGRST116') {
        return res.status(404).json({ error: 'Snippet not found' });
      }
      throw error;
    }
    
    // Determine content type based on language
    let contentType = 'text/plain';
    
    if (data.language) {
      const languageContentTypes = {
        javascript: 'application/javascript',
        typescript: 'application/typescript',
        python: 'text/x-python',
        java: 'text/x-java',
        html: 'text/html',
        css: 'text/css',
        json: 'application/json',
        xml: 'application/xml',
      };
      
      contentType = languageContentTypes[data.language] || 'text/plain';
    }
    
    // Set headers for raw display
    res.setHeader('Content-Type', contentType);
    res.setHeader('Content-Disposition', `inline; filename="${data.title || 'snippet'}.${data.language || 'txt'}"`);
    
    // Return the raw content
    return res.send(data.content);
  } catch (error) {
    console.error('Error fetching raw snippet:', error);
    return res.status(500).json({ error: 'Failed to fetch raw snippet' });
  }
}