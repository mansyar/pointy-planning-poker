import { describe, it, expect, vi, beforeEach } from 'vitest';
import { readFileSync, existsSync } from 'fs';
import { join } from 'path';

describe('PWA & Manifest', () => {
  it('should have a manifest.json file with correct branding', () => {
    const manifestPath = join(process.cwd(), 'public', 'manifest.json');
    expect(existsSync(manifestPath)).toBe(true);

    const manifest = JSON.parse(readFileSync(manifestPath, 'utf8'));
    expect(manifest.name).toBe('Pointy - Planning Poker');
    expect(manifest.short_name).toBe('Pointy');
    expect(manifest.display).toBe('standalone');
  });
});

describe('Service Worker Registration', () => {
  beforeEach(() => {
    vi.stubGlobal('navigator', {
      serviceWorker: {
        register: vi.fn().mockResolvedValue({}),
      },
    });
  });

  it('should attempt to register a service worker', async () => {
    // This will depend on where we register the service worker.
    // If it's in a side-effect of a component or a main script.
    // For now, let's assume it should be registered in __root.tsx or a dedicated script.
    // We'll manually trigger the registration logic if it's exported, or check side effects.

    // For now, I'll just check if there's any file containing serviceWorker.register
    const rootPath = join(process.cwd(), 'src', 'routes', '__root.tsx');
    const rootContent = readFileSync(rootPath, 'utf8');
    expect(rootContent).toContain('navigator.serviceWorker.register');
  });
});
