import { RouterClient } from 'ai-router-package';

export async function POST() {
  try {
    const client = new RouterClient({
        AI_ANALYSIS_API: process.env.AI_ANALYSIS_API,
    });
    await client.initialize();
    
    return Response.json({ 
      success: true, 
      message: 'Router client initialized successfully' 
    });
  } catch (error) {
    return Response.json({ 
      success: false, 
      error: error instanceof Error ? error.message : 'Unknown error' 
    }, { status: 500 });
  }
}