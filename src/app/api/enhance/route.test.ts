import { POST } from './route';
import { NextRequest } from 'next/server';
import { getServerSession } from 'next-auth';
import { GoogleGenAI } from '@google/genai';
import { savePrompt } from '@/lib/prompt-service';
import { saveUser } from '@/lib/user-service';
import { describe, it, expect, vi, beforeEach } from 'vitest';

const generateContentMock = vi.fn();

vi.mock('next-auth', () => ({
  getServerSession: vi.fn(),
}));
vi.mock('@google/genai', () => ({
  GoogleGenAI: vi.fn().mockImplementation(() => ({
    models: {
      generateContent: generateContentMock
    },
  })),
}));
vi.mock('@/lib/prompt-service', () => ({
  savePrompt: vi.fn(),
}));
vi.mock('@/lib/user-service', () => ({
  saveUser: vi.fn(),
}));

const createRequest = (url: string, body: object) =>
  new NextRequest(url, {
    method: 'POST',
    body: JSON.stringify(body),
    headers: { 'Content-Type': 'application/json' },
  });

const mockSession = { user: { email: 'test@example.com', name: 'Test User', image: 'test.png' } };
const mockEnhancedText = 'Enhanced prompt text';
const mockUserId = 'mockUserId';
const mockPromptId = 'mockPromptId';

describe('POST /api/enhance', () => {
  beforeEach(() => {
    vi.clearAllMocks();
  });

  it('returns 401 if the user is not authenticated', async () => {
    (getServerSession as vi.Mock).mockResolvedValue(null);

    const response = await POST(createRequest('http://localhost/api/enhance', { text: 'Original prompt text' }));

    expect(response.status).toBe(401);
    expect(await response.json()).toEqual({ error: 'Unauthorized' });
  });

  it('returns enhanced text and saves data if the user is authenticated', async () => {
    (getServerSession as vi.Mock).mockResolvedValue(mockSession);
    generateContentMock.mockResolvedValue({ text: mockEnhancedText });
    (saveUser as vi.Mock).mockResolvedValue(mockUserId);
    (savePrompt as vi.Mock).mockResolvedValue(mockPromptId);

    const response = await POST(createRequest('http://localhost/api/enhance', { text: 'Original prompt text' }));

    expect(response.status).toBe(200);
    const body = await response.json();
    expect(body).toEqual({
      text: mockEnhancedText,
      promptId: mockPromptId,
    });

    expect(saveUser).toHaveBeenCalledWith({
      email: 'test@example.com',
      name: 'Test User',
      image: 'test.png',
    });

    expect(savePrompt).toHaveBeenCalledWith({
      originalText: 'Original prompt text',
      enhancedText: mockEnhancedText,
      userId: mockUserId,
    });
  });
});