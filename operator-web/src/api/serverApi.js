import { USE_MOCK, request } from './client';

export async function pingServer() {
  if (USE_MOCK) {
    await new Promise((r) => setTimeout(r, 150));
    return !window.__mockServerDown;
  }

  const controller = new AbortController();
  const timer = setTimeout(() => controller.abort(), 3000);
  try {
    await request('/health', { signal: controller.signal });
    return true;
  } catch {
    return false;
  } finally {
    clearTimeout(timer);
  }
}