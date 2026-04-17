import { describe, it, expect } from 'vitest';
import { readFileSync } from 'fs';
import { join } from 'path';

describe('Styling Fundamentals', () => {
  const stylesPath = join(process.cwd(), 'src', 'styles.css');
  const stylesContent = readFileSync(stylesPath, 'utf8');

  it('should import Inter font', () => {
    expect(stylesContent).toContain('Inter');
  });

  it('should import JetBrains Mono font', () => {
    expect(stylesContent).toContain('JetBrains Mono');
  });

  it('should have the primary background color defined in theme', () => {
    expect(stylesContent).toContain('--bg-primary: #0A0A0B');
  });

  it('should have the accent color defined in theme', () => {
    expect(stylesContent).toContain('--accent: #818CF8');
  });
});
