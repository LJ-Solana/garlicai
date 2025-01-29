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

export async function POST(request: Request) {
  const controller = new AbortController();
  const timeoutId = setTimeout(() => controller.abort(), 25000); // 25s timeout

  try {
    const { language = 'en' } = await request.json();
    
    if (!['en', 'zh'].includes(language)) {
      return NextResponse.json(
        { error: 'Invalid language specified' },
        { status: 400 }
      );
    }

    const systemContent = language === 'zh' 
      ? "你是一位专门研究大蒜防御策略的吸血鬼防御专家。简短生成创意且略带幽默的防御策略。回复必须以'策略：'开头，然后是策略名称和详情，接着是'大蒜使用方法：'和具体说明。"
      : "You are a vampire defense expert. Generate a brief, creative and somewhat humorous defense strategy. Your response must start with 'Strategy:' followed by name and details, then 'Garlic Usage:' with instructions.";

    const userContent = language === 'zh'
      ? "生成一个简短的大蒜防御策略。包括策略名称和详情，以及具体的大蒜使用说明。"
      : "Generate a brief vampire defense strategy using garlic. Include strategy name, details, and garlic usage instructions.";

    const completion = await openai.chat.completions.create({
      model: "gpt-4-turbo-preview",
      messages: [
        { role: "system", content: systemContent },
        { role: "user", content: userContent }
      ],
      temperature: 0.7,
      max_tokens: 300, // Reduced token limit
    }, { signal: controller.signal });

    clearTimeout(timeoutId);

    const content = completion.choices[0].message.content;
    if (!content) {
      return NextResponse.json(
        { error: 'No content generated' },
        { status: 500 }
      );
    }

    const sections = content.split('\n\n');
    const strategy = sections[0]?.replace(language === 'zh' ? /^策略：?\s*/i : /^Strategy:?\s*/i, '').trim();
    const garlicUsage = sections[1]?.replace(language === 'zh' ? /^大蒜使用方法：?\s*/i : /^Garlic Usage:?\s*/i, '').trim();

    if (!strategy || !garlicUsage) {
      return NextResponse.json(
        { error: 'Missing required content' },
        { status: 500 }
      );
    }

    // Generate deterministic effectiveness score based on content
    const effectiveness = generateEffectiveness(content);

    return NextResponse.json({
      strategy,
      garlicUsage,
      effectiveness,
    });
  } catch (error: any) {
    clearTimeout(timeoutId);
    console.error('API Error:', error);
    return NextResponse.json(
      { error: error.name === 'AbortError' ? 'Request timed out' : (error.message || 'Failed to generate strategy') },
      { status: error.name === 'AbortError' ? 504 : 500 }
    );
  }
} 