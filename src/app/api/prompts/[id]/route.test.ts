import { GET, DELETE } from './route';
import { NextRequest } from 'next/server';
import { getServerSession } from 'next-auth';
import { getPromptById, deletePrompt } from '@/lib/prompt-service';
import { getUserByEmail } from '@/lib/user-service';
import { describe, it, expect, vi, beforeEach } from 'vitest';

vi.mock('next-auth', () => ({
  getServerSession: vi.fn(),
}));
vi.mock('@/lib/prompt-service', () => ({
  getPromptById: vi.fn(),
  deletePrompt: vi.fn(),
}));
vi.mock('@/lib/user-service', () => ({
  getUserByEmail: vi.fn(),
}));

const createRequest = (url: string) => new NextRequest(url);

const mockSession = { user: { email: 'test@example.com' } };
const mockPrompt = { id: '123', userId: 'userId', text: 'Test prompt' };
const mockUser = { id: 'userId' };

describe('GET /api/prompts/[id]', () => {
  beforeEach(() => {
    vi.clearAllMocks();
  });

  it('returns 401 if the user is not authenticated', async () => {
    (getServerSession as vi.Mock).mockResolvedValue(null);

    const response = await GET(createRequest('http://localhost/api/prompts/123'), {
      params: Promise.resolve({ id: '123' }),
    });

    expect(response.status).toBe(401);
    expect(await response.json()).toEqual({ error: 'Unauthorized' });
  });

  it('returns 404 if the prompt is not found', async () => {
    (getServerSession as vi.Mock).mockResolvedValue(mockSession);
    (getPromptById as vi.Mock).mockResolvedValue(null);

    const response = await GET(createRequest('http://localhost/api/prompts/123'), {
      params: Promise.resolve({ id: '123' }),
    });

    expect(response.status).toBe(404);
    expect(await response.json()).toEqual({ error: 'Prompt not found' });
  });

  it('returns 403 if the prompt does not belong to the user', async () => {
    (getServerSession as vi.Mock).mockResolvedValue(mockSession);
    (getPromptById as vi.Mock).mockResolvedValue({ ...mockPrompt, userId: 'otherUserId' });
    (getUserByEmail as vi.Mock).mockResolvedValue(mockUser);

    const response = await GET(createRequest('http://localhost/api/prompts/123'), {
      params: Promise.resolve({ id: '123' }),
    });

    expect(response.status).toBe(403);
    expect(await response.json()).toEqual({ error: 'Unauthorized' });
  });

  it('returns the prompt if the user is authorized', async () => {
    (getServerSession as vi.Mock).mockResolvedValue(mockSession);
    (getPromptById as vi.Mock).mockResolvedValue(mockPrompt);
    (getUserByEmail as vi.Mock).mockResolvedValue(mockUser);

    const response = await GET(createRequest('http://localhost/api/prompts/123'), {
      params: Promise.resolve({ id: '123' }),
    });

    expect(response.status).toBe(200);
    expect(await response.json()).toEqual({ prompt: mockPrompt });
  });
});

describe('DELETE /api/prompts/[id]', () => {
  beforeEach(() => {
    vi.clearAllMocks();
  });

  it('returns 401 if the user is not authenticated', async () => {
    (getServerSession as vi.Mock).mockResolvedValue(null);

    const response = await DELETE(createRequest('http://localhost/api/prompts/123'), {
      params: Promise.resolve({ id: '123' }),
    });

    expect(response.status).toBe(401);
    expect(await response.json()).toEqual({ error: 'Unauthorized' });
  });

  it('returns 404 if the prompt is not found', async () => {
    (getServerSession as vi.Mock).mockResolvedValue(mockSession);
    (getPromptById as vi.Mock).mockResolvedValue(null);

    const response = await DELETE(createRequest('http://localhost/api/prompts/123'), {
      params: Promise.resolve({ id: '123' }),
    });

    expect(response.status).toBe(404);
    expect(await response.json()).toEqual({ error: 'Prompt not found' });
  });

  it('returns 403 if the prompt does not belong to the user', async () => {
    (getServerSession as vi.Mock).mockResolvedValue(mockSession);
    (getPromptById as vi.Mock).mockResolvedValue({ ...mockPrompt, userId: 'otherUserId' });
    (getUserByEmail as vi.Mock).mockResolvedValue(mockUser);

    const response = await DELETE(createRequest('http://localhost/api/prompts/123'), {
      params: Promise.resolve({ id: '123' }),
    });

    expect(response.status).toBe(403);
    expect(await response.json()).toEqual({ error: 'Unauthorized' });
  });

  it('deletes the prompt if the user is authorized', async () => {
    (getServerSession as vi.Mock).mockResolvedValue(mockSession);
    (getPromptById as vi.Mock).mockResolvedValue(mockPrompt);
    (getUserByEmail as vi.Mock).mockResolvedValue(mockUser);

    const response = await DELETE(createRequest('http://localhost/api/prompts/123'), {
      params: Promise.resolve({ id: '123' }),
    });

    expect(response.status).toBe(200);
    expect(await response.json()).toEqual({ success: true });
    expect(deletePrompt).toHaveBeenCalledWith('123');
  });
});