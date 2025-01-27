export async function POST(request) {
  const body = await request.json();
  
  try {
    const response = await fetch('https://api.deepseek.com/v1/chat/completions', {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json',
        'Authorization': `Bearer ${process.env.NEXT_PUBLIC_DEEPSEEK_API_KEY.replace(/"/g, '')}`,
      },
      body: JSON.stringify(body)
    });

    if (!response.ok) {
      const error = await response.json();
      return Response.json(error, { status: response.status });
    }

    const data = await response.json();
    return Response.json(data);
  } catch (error) {
    console.error('DeepSeek API Error:', error);
    return Response.json(
      { error: 'Failed to connect to DeepSeek API' }, 
      { status: 500 }
    );
  }
} 