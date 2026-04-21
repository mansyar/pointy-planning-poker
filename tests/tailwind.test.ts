import { describe, it, expect } from 'vitest';
import { readFileSync } from 'fs';
import { join } from 'path';

describe('Styling Fundamentals', () => {
  const stylesPath = join(process.cwd(), 'src', 'styles.css');
  const stylesContent = readFileSync(stylesPath, 'utf8');

  it('should import Space Grotesk font', () => {
    expect(stylesContent).toContain('Space Grotesk');
  });

  it('should import JetBrains Mono font', () => {
    expect(stylesContent).toContain('JetBrains Mono');
  });

  it('should have the primary background color defined in theme', () => {
    expect(stylesContent).toContain('--bg-primary: #ffffff');
  });

  it('should have the accent color defined in theme', () => {
    expect(stylesContent).toContain('--accent: #f7df1e');
  });
});
