import { NextRequest } from 'next/server';
import OpenAI from 'openai';

if (!process.env.OPENAI_API_KEY) {
  throw new Error('Missing OpenAI API key');
}

const openai = new OpenAI({
  apiKey: process.env.OPENAI_API_KEY,
});

// Generate a deterministic but unpredictable effectiveness score using Web Crypto API
async function generateEffectiveness(content: string): Promise<number> {
  // Use content + current date as seed
  const date = new Date().toISOString().split('T')[0];
  const seed = content + date;
  
  // Create a hash using Web Crypto API
  const msgBuffer = new TextEncoder().encode(seed);
  const hashBuffer = await crypto.subtle.digest('SHA-256', msgBuffer);
  const hashArray = Array.from(new Uint8Array(hashBuffer));
  
  // Use first 4 bytes to generate number between 70-95
  const num = hashArray.slice(0, 4).reduce((acc, byte) => (acc << 8) + byte, 0);
  return 70 + (num % 26); // Range 70-95
}

export const config = {
  runtime: 'edge',
  api: {
    bodyParser: true,
  },
};

export async function OPTIONS() {
  return new Response(null, {
    status: 204,
    headers: {
      'Access-Control-Allow-Origin': '*',
      'Access-Control-Allow-Methods': 'GET, POST, OPTIONS',
      'Access-Control-Allow-Headers': 'Content-Type, Authorization',
    },
  });
}

export async function POST(request: NextRequest) {
  const headers = {
    'Access-Control-Allow-Origin': '*',
    'Access-Control-Allow-Methods': 'GET, POST, OPTIONS',
    'Access-Control-Allow-Headers': 'Content-Type, Authorization',
    'Content-Type': 'application/json',
  };

  try {
    const body = await request.json();
    const language = body.language || 'en';
    
    if (!['en', 'zh'].includes(language)) {
      return new Response(
        JSON.stringify({ error: 'Invalid language specified' }),
        { status: 400, headers }
      );
    }

    const systemContent = language === 'zh' 
      ? "生成简短的吸血鬼防御策略。格式：'策略：[名称和详情]' 然后 '大蒜使用方法：[说明]'。保持简洁。"
      : "Generate a brief vampire defense strategy. Format: 'Strategy: [name and details]' then 'Garlic Usage: [instructions]'. Keep it concise.";

    const userContent = language === 'zh'
      ? "创建一个简短的防御策略"
      : "Create a brief defense strategy";

    const completion = await openai.chat.completions.create({
      model: "gpt-3.5-turbo",
      messages: [
        { role: "system", content: systemContent },
        { role: "user", content: userContent }
      ],
      temperature: 0.7,
      max_tokens: 200,
    });

    const content = completion.choices[0].message.content;
    if (!content) {
      throw new Error('No content generated');
    }

    const sections = content.split('\n');
    const strategy = sections[0]?.replace(language === 'zh' ? /^策略：?\s*/i : /^Strategy:?\s*/i, '').trim();
    const garlicUsage = sections[1]?.replace(language === 'zh' ? /^大蒜使用方法：?\s*/i : /^Garlic Usage:?\s*/i, '').trim();

    if (!strategy || !garlicUsage) {
      throw new Error('Invalid response format');
    }

    const effectiveness = await generateEffectiveness(content);

    return new Response(
      JSON.stringify({ strategy, garlicUsage, effectiveness }),
      { status: 200, headers }
    );
  } catch (error: any) {
    console.error('API Error:', error);
    return new Response(
      JSON.stringify({
        error: error.message || 'Failed to generate strategy',
      }),
      { status: 500, headers }
    );
  }
} 