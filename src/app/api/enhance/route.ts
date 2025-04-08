import { NextRequest } from 'next/server';
import { GoogleGenAI } from '@google/genai';
import { getServerSession } from 'next-auth';
import { authOptions } from '../auth/[...nextauth]/route';
import { savePrompt } from '@/lib/prompt-service';
import { saveUser } from '@/lib/user-service';

export async function POST(request: NextRequest) {
    const session = await getServerSession(authOptions);
    
    if (!session) {
        return new Response(JSON.stringify({ error: 'Unauthorized' }), {
            status: 401,
            headers: {
                'Content-Type': 'application/json',
            },
        });
    }

    const { text } = await request.json();
    const googleGenAI = new GoogleGenAI({
        apiKey: process.env.GEMINI_API_KEY,
    });

    const response = await googleGenAI.models.generateContent({
        contents: `
            You are a professional prompt engineer specializing in crafting precise, effective prompts.
            Your task is to enhance prompts by making them more specific, actionable, and effective.

            I want you to improve the user prompt that is wrapped in \`<original_prompt>\` tags.

            For valid prompts:
            - Make instructions explicit and unambiguous
            - Add relevant context and constraints
            - Remove redundant information
            - Maintain the core intent
            - Ensure the prompt is self-contained
            - Use professional language
            - Provide examples if necessary

            For invalid or unclear prompts:
            - Respond with clear, professional guidance
            - Keep responses concise and actionable
            - Maintain a helpful, constructive tone
            - Focus on what the user should provide
            - Use a standard template for consistency
            - Avoid unnecessary jargon or complexity

            IMPORTANT: Your response must ONLY contain the enhanced prompt text.
            IMPORTANT: Your response must be in the user's language
            Do not include any explanations, metadata, or wrapper tags.

            <original_prompt>
                ${text}
            </original_prompt>
        `,
        model: "gemini-2.0-flash",
    });

    const enhancedText = response.text as string;

    // Save user to Firebase if not already saved
    const userId = await saveUser({
        email: session.user?.email || '',
        name: session.user?.name || '',
        image: session.user?.image || undefined,
    });

    // Save prompt to Firebase
    const promptId = await savePrompt({
        originalText: text,
        enhancedText,
        userId,
    });

    return new Response(JSON.stringify({ 
        text: enhancedText,
        promptId,
    }), {
        status: 200,
        headers: {
            'Content-Type': 'application/json',
        },
    });
}