import { NextResponse } from 'next/server';
import OpenAI from 'openai';
import { createHash } from 'crypto';

if (!process.env.OPENAI_API_KEY) {
  throw new Error('Missing OpenAI API key');
}

const openai = new OpenAI({
  apiKey: process.env.OPENAI_API_KEY,
});

// Generate a deterministic but unpredictable effectiveness score
function generateEffectiveness(content: string): number {
  // Use content + current date as seed
  const date = new Date().toISOString().split('T')[0]; // Use only the date part
  const seed = content + date;
  
  // Create a hash of the seed
  const hash = createHash('sha256').update(seed).digest('hex');
  
  // Use first 4 bytes of hash to generate number between 70-95
  const num = parseInt(hash.slice(0, 8), 16);
  return 70 + (num % 26); // Range 70-95
}

export const runtime = 'edge'; // Use edge runtime for better performance

export async function POST(request: Request) {
  const controller = new AbortController();
  const timeoutId = setTimeout(() => controller.abort(), 15000); // 15s timeout

  try {
    const { language = 'en' } = await request.json();
    
    if (!['en', 'zh'].includes(language)) {
      return NextResponse.json(
        { error: 'Invalid language specified' },
        { status: 400 }
      );
    }

    // Shorter, more focused prompts
    const systemContent = language === 'zh' 
      ? "生成简短的吸血鬼防御策略。格式：'策略：[名称和详情]' 然后 '大蒜使用方法：[说明]'。保持简洁。"
      : "Generate a brief vampire defense strategy. Format: 'Strategy: [name and details]' then 'Garlic Usage: [instructions]'. Keep it concise.";

    const userContent = language === 'zh'
      ? "创建一个简短的防御策略"
      : "Create a brief defense strategy";

    const completion = await openai.chat.completions.create({
      model: "gpt-3.5-turbo", // Use faster model
      messages: [
        { role: "system", content: systemContent },
        { role: "user", content: userContent }
      ],
      temperature: 0.7,
      max_tokens: 200, // Further reduced token limit
      presence_penalty: 0,
      frequency_penalty: 0,
    }, { signal: controller.signal });

    clearTimeout(timeoutId);

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

    const effectiveness = generateEffectiveness(content);

    return NextResponse.json({
      strategy,
      garlicUsage,
      effectiveness,
    });
  } catch (error: any) {
    clearTimeout(timeoutId);
    console.error('API Error:', error);
    
    if (error.name === 'AbortError') {
      return NextResponse.json(
        { error: 'Request timed out. Please try again.' },
        { status: 504 }
      );
    }

    return NextResponse.json(
      { error: error.message || 'Failed to generate strategy' },
      { status: error.code === 'ECONNABORTED' ? 504 : 500 }
    );
  }
} 