import { NextResponse } from 'next/server';
import OpenAI from 'openai';

if (!process.env.OPENAI_API_KEY) {
  throw new Error('Missing OpenAI API key');
}

const openai = new OpenAI({
  apiKey: process.env.OPENAI_API_KEY,
});

export async function POST(request: Request) {
  try {
    const { language = 'en' } = await request.json();
    
    if (!['en', 'zh'].includes(language)) {
      return NextResponse.json(
        { error: 'Invalid language specified' },
        { status: 400 }
      );
    }

    const systemContent = language === 'zh' 
      ? "你是一位专门研究大蒜防御策略的吸血鬼防御专家。请生成创意且略带幽默的防御策略。回复必须以'策略：'开头，然后是策略名称和详情，接着是'大蒜使用方法：'和具体说明。"
      : "You are a vampire defense expert specializing in garlic-based protection strategies. Generate creative and somewhat humorous defense strategies. Your response must always start with 'Strategy:' followed by the strategy name and details, then 'Garlic Usage:' followed by specific instructions.";

    const userContent = language === 'zh'
      ? "生成一个使用大蒜的吸血鬼防御策略。包括策略名称和详情，以及具体的大蒜使用说明。"
      : "Generate a vampire defense strategy using garlic. Include a strategy name and details, followed by specific garlic usage instructions.";

    const completion = await openai.chat.completions.create({
      model: "gpt-4-turbo-preview",
      messages: [
        { role: "system", content: systemContent },
        { role: "user", content: userContent }
      ],
      temperature: 0.7,
      max_tokens: 500,
    });

    const content = completion.choices[0].message.content;
    if (!content) {
      return NextResponse.json(
        { error: 'No content generated' },
        { status: 500 }
      );
    }

    const sections = content.split('\n\n');
    if (sections.length < 2) {
      return NextResponse.json(
        { error: 'Invalid response format' },
        { status: 500 }
      );
    }

    const strategy = sections[0]?.replace(language === 'zh' ? /^策略：?\s*/i : /^Strategy:?\s*/i, '').trim();
    const garlicUsage = sections[1]?.replace(language === 'zh' ? /^大蒜使用方法：?\s*/i : /^Garlic Usage:?\s*/i, '').trim();

    if (!strategy || !garlicUsage) {
      return NextResponse.json(
        { error: 'Missing required content' },
        { status: 500 }
      );
    }

    const effectiveness = Math.floor(Math.random() * (100 - 70) + 70);

    return NextResponse.json({
      strategy,
      garlicUsage,
      effectiveness,
    });
  } catch (error: any) {
    console.error('API Error:', error);
    return NextResponse.json(
      { error: error.message || 'Failed to generate defense strategy' },
      { status: 500 }
    );
  }
} 