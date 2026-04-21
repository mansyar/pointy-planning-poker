import { describe, it, expect } from 'vitest';
import { existsSync, readFileSync } from 'fs';
import { join } from 'path';

describe('Route Restructuring', () => {
  it('should have a poker.$slug.tsx route file', () => {
    const routePath = join(process.cwd(), 'src', 'routes', 'poker.$slug.tsx');
    expect(existsSync(routePath)).toBe(true);

    const content = readFileSync(routePath, 'utf8');
    expect(content).toContain("createFileRoute('/poker/$slug')");
    expect(content).toContain('RoomPage');
  });
});
