import { NextRequest, NextResponse } from 'next/server';

// TODO: Install @anthropic-ai/sdk package
// npm install @anthropic-ai/sdk

// TODO: Add your Claude API key to .env.local
// ANTHROPIC_API_KEY=your_api_key_here

// eslint-disable-next-line @typescript-eslint/no-unused-vars
interface Message {
  role: 'user' | 'assistant';
  content: string;
}

export async function POST(request: NextRequest) {
  try {
    const { message, history } = await request.json();

    // For now, return a placeholder response
    // Once you add your API key, uncomment the code below

    console.log('Received message:', message);
    console.log('Conversation history:', history);

    // Placeholder response
    return NextResponse.json({
      response: `Thanks for your message! You said: "${message}". (Add your Claude API key to enable real responses)`,
    });

    /*
    // UNCOMMENT THIS SECTION AFTER ADDING YOUR API KEY:

    const Anthropic = require('@anthropic-ai/sdk');

    const anthropic = new Anthropic({
      apiKey: process.env.ANTHROPIC_API_KEY,
    });

    // Build conversation context from history
    const conversationHistory = history.map((msg: Message) => ({
      role: msg.role,
      content: msg.content,
    }));

    // Add system message with your personalized tone
    const systemMessage = `You are Max McGee's AI assistant on his portfolio website.
    You have Max's friendly, professional, and technical personality.
    You're knowledgeable about Max's skills in software engineering, particularly in:
    - WebGL and graphics programming
    - Three.js and GPGPU simulations
    - React and Next.js development
    - Full-stack development

    Be helpful, engaging, and represent Max's work professionally while being conversational.
    If visitors ask about Max's projects, experience, or skills, provide accurate information based on the portfolio content.
    Keep responses concise but informative.`;

    const response = await anthropic.messages.create({
      model: 'claude-3-5-sonnet-20241022',
      max_tokens: 1024,
      system: systemMessage,
      messages: [
        ...conversationHistory,
        {
          role: 'user',
          content: message,
        },
      ],
    });

    return NextResponse.json({
      response: response.content[0].text,
    });
    */
  } catch (error) {
    console.error('Error in chat API:', error);
    return NextResponse.json(
      { error: 'Failed to process chat message' },
      { status: 500 }
    );
  }
}
