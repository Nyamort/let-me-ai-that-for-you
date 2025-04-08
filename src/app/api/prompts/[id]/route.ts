import { NextRequest } from 'next/server';
import { getServerSession } from 'next-auth';
import { getPromptById, deletePrompt } from '@/lib/prompt-service';
import { getUserByEmail } from '@/lib/user-service';
import { authOptions } from '@/utils/authOption';

export async function GET(
    request: NextRequest,
    { params }: { params: Promise<{ id: string }> }
) {
    const session = await getServerSession(authOptions);
    
    if (!session) {
        return new Response(JSON.stringify({ error: 'Unauthorized' }), {
            status: 401,
            headers: {
                'Content-Type': 'application/json',
            },
        });
    }

    try {
        const { id: promptId } = await params;
        
        const prompt = await getPromptById(promptId);
        
        if (!prompt) {
            return new Response(JSON.stringify({ error: 'Prompt not found' }), {
                status: 404,
                headers: {
                    'Content-Type': 'application/json',
                },
            });
        }

        const user = await getUserByEmail(session.user?.email || '');
        
        if (!user) {
            return new Response(JSON.stringify({ error: 'User not found' }), {
                status: 404,
                headers: {
                    'Content-Type': 'application/json',
                },
            });
        }

        // Check if the prompt belongs to the user
        if (prompt.userId !== user.id) {
            return new Response(JSON.stringify({ error: 'Unauthorized' }), {
                status: 403,
                headers: {
                    'Content-Type': 'application/json',
                },
            });
        }
        
        return new Response(JSON.stringify({ prompt }), {
            status: 200,
            headers: {
                'Content-Type': 'application/json',
            },
        });
    } catch (error) {
        console.error('Error fetching prompt:', error);
        return new Response(JSON.stringify({ error: 'Failed to fetch prompt' }), {
            status: 500,
            headers: {
                'Content-Type': 'application/json',
            },
        });
    }
}

export async function DELETE(
    request: NextRequest,
    { params }: { params: Promise<{ id: string }> }
) {
    const session = await getServerSession(authOptions);
    
    if (!session) {
        return new Response(JSON.stringify({ error: 'Unauthorized' }), {
            status: 401,
            headers: {
                'Content-Type': 'application/json',
            },
        });
    }

    try {
        const { id: promptId } = await params;
        
        const prompt = await getPromptById(promptId);
        
        if (!prompt) {
            return new Response(JSON.stringify({ error: 'Prompt not found' }), {
                status: 404,
                headers: {
                    'Content-Type': 'application/json',
                },
            });
        }

        const user = await getUserByEmail(session.user?.email || '');
        
        if (!user) {
            return new Response(JSON.stringify({ error: 'User not found' }), {
                status: 404,
                headers: {
                    'Content-Type': 'application/json',
                },
            });
        }

        // Check if the prompt belongs to the user
        if (prompt.userId !== user.id) {
            return new Response(JSON.stringify({ error: 'Unauthorized' }), {
                status: 403,
                headers: {
                    'Content-Type': 'application/json',
                },
            });
        }

        await deletePrompt(promptId);
        
        return new Response(JSON.stringify({ success: true }), {
            status: 200,
            headers: {
                'Content-Type': 'application/json',
            },
        });
    } catch (error) {
        console.error('Error deleting prompt:', error);
        return new Response(JSON.stringify({ error: 'Failed to delete prompt' }), {
            status: 500,
            headers: {
                'Content-Type': 'application/json',
            },
        });
    }
} 