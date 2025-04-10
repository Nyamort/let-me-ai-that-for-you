import { test, expect } from '@playwright/test';
import { encode } from 'next-auth/jwt';
import { loadEnvConfig } from "@next/env";

loadEnvConfig(process.cwd());


test('has title', async ({ page }) => {
  const token = await encode({
    token: {
      sub: '123',
    },
    secret: process.env.NEXTAUTH_SECRET!,
  });

  await page.context().addCookies([
    {
      name: 'next-auth.session-token',
      value: token,
      domain: 'localhost',
      path: '/',
    }
  ]);

  await page.goto('http://localhost:3000/');

  await expect(page).toHaveTitle(/Let me AI that for you/);
});

test('send prompt', async ({ page }) => {
  const token = await encode({
    token: {
      sub: '123',
    },
    secret: process.env.NEXTAUTH_SECRET!,
  });

  await page.context().addCookies([
    {
      name: 'next-auth.session-token',
      value: token,
      domain: 'localhost',
      path: '/',
    }
  ]);

  await page.goto('http://localhost:3000/');
  await page.waitForTimeout(1000);

  const textarea = page.getByPlaceholder('Enter your text here...');
  await textarea.fill('This is a test prompt');

  const button = page.getByText('Enhance');
  
  await button.click();

  await page.waitForResponse('http://localhost:3000/api/enhance', {
    timeout: 60000,
  });

  const text = await page.locator('div[data-slot=card]:nth-child(2) > div > p').textContent();
  
  expect(text).not.toBe('');
  
});