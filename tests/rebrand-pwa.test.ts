import { describe, it, expect } from 'vitest';
import { readFileSync } from 'fs';
import { join } from 'path';

describe('PWA Manifest Rebranding', () => {
  it('has updated description and colors', () => {
    const manifestPath = join(process.cwd(), 'public', 'manifest.json');
    const manifest = JSON.parse(readFileSync(manifestPath, 'utf8'));

    expect(manifest.name).toBe('Tempo');
    expect(manifest.short_name).toBe('Tempo');
    expect(manifest.description).toBe('Scrum Tools for Modern Teams');
    // Updated colors (Indigo-600 roughly #4f46e5 or #6366f1)
    expect(manifest.theme_color).toBe('#6366f1');
    expect(manifest.background_color).toBe('#ffffff');
  });
});
