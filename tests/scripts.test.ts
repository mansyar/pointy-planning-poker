import { describe, it, expect, afterAll } from 'vitest';
import { execSync } from 'child_process';
import fs from 'fs';
import path from 'path';
import { checkFileLength } from '../scripts/check-file-length';

describe('check-file-length script', () => {
  const scriptPath = path.resolve(__dirname, '../scripts/check-file-length.ts');
  const tempDir = path.resolve(__dirname, '../temp_test_dir');

  if (!fs.existsSync(tempDir)) {
    fs.mkdirSync(tempDir);
  }

  afterAll(() => {
    if (fs.existsSync(tempDir)) {
      const files = fs.readdirSync(tempDir);
      for (const file of files) {
        fs.unlinkSync(path.join(tempDir, file));
      }
      fs.rmdirSync(tempDir);
    }
  });

  it('direct: should pass for small files in src', async () => {
    const mockSrcDir = path.resolve(process.cwd(), 'src/mock_direct');
    if (!fs.existsSync(mockSrcDir))
      fs.mkdirSync(mockSrcDir, { recursive: true });
    const mockFile = path.join(mockSrcDir, 'small.ts');
    fs.writeFileSync(mockFile, 'line 1\nline 2');

    try {
      await checkFileLength(mockFile);
      expect(true).toBe(true);
    } finally {
      if (fs.existsSync(mockFile)) fs.unlinkSync(mockFile);
      if (fs.existsSync(mockSrcDir)) fs.rmdirSync(mockSrcDir);
    }
  });

  it('direct: should ignore non-target dirs', async () => {
    const mockDir = path.resolve(process.cwd(), 'other_dir');
    if (!fs.existsSync(mockDir)) fs.mkdirSync(mockDir, { recursive: true });
    const mockFile = path.join(mockDir, 'small.ts');
    fs.writeFileSync(mockFile, 'line 1\nline 2');

    try {
      await checkFileLength(mockFile);
      expect(true).toBe(true);
    } finally {
      if (fs.existsSync(mockFile)) fs.unlinkSync(mockFile);
      if (fs.existsSync(mockDir)) fs.rmdirSync(mockDir);
    }
  });

  it('should pass for small files in src', () => {
    const filePath = path.join(tempDir, 'small.ts');
    fs.writeFileSync(filePath, 'line 1\nline 2');

    // We need to trick the script into thinking it's in a target dir
    // The script uses path.relative(process.cwd(), filePath)
    // So we'll create a file in a mock 'src' dir
    const mockSrcDir = path.resolve(process.cwd(), 'src/mock');
    if (!fs.existsSync(mockSrcDir))
      fs.mkdirSync(mockSrcDir, { recursive: true });
    const mockFile = path.join(mockSrcDir, 'small.ts');
    fs.writeFileSync(mockFile, 'line 1\nline 2');

    try {
      execSync(`pnpm tsx "${scriptPath}" "${mockFile}"`);
      expect(true).toBe(true);
    } finally {
      if (fs.existsSync(mockFile)) fs.unlinkSync(mockFile);
      if (fs.existsSync(mockSrcDir)) fs.rmdirSync(mockSrcDir);
    }
  });

  it('should fail for large files in src', () => {
    const mockSrcDir = path.resolve(process.cwd(), 'src/mock');
    if (!fs.existsSync(mockSrcDir))
      fs.mkdirSync(mockSrcDir, { recursive: true });
    const mockFile = path.join(mockSrcDir, 'large.ts');
    const largeContent = Array(501).fill('line').join('\n');
    fs.writeFileSync(mockFile, largeContent);

    try {
      execSync(`pnpm tsx "${scriptPath}" "${mockFile}"`, { stdio: 'pipe' });
      // Should not reach here
      expect(true).toBe(false);
    } catch (error: unknown) {
      if (error && typeof error === 'object' && 'status' in error) {
        const err = error as { status: number; stderr: Buffer };
        expect(err.status).toBe(1);
        expect(err.stderr.toString()).toContain('exceeds the 500 line limit');
      } else {
        throw error;
      }
    } finally {
      if (fs.existsSync(mockFile)) fs.unlinkSync(mockFile);
      if (fs.existsSync(mockSrcDir)) fs.rmdirSync(mockSrcDir);
    }
  });

  it('should ignore files in _generated', () => {
    const mockSrcDir = path.resolve(process.cwd(), 'src/_generated');
    if (!fs.existsSync(mockSrcDir))
      fs.mkdirSync(mockSrcDir, { recursive: true });
    const mockFile = path.join(mockSrcDir, 'large.ts');
    const largeContent = Array(600).fill('line').join('\n');
    fs.writeFileSync(mockFile, largeContent);

    try {
      execSync(`pnpm tsx "${scriptPath}" "${mockFile}"`);
      expect(true).toBe(true);
    } finally {
      if (fs.existsSync(mockFile)) fs.unlinkSync(mockFile);
      if (fs.existsSync(mockSrcDir)) fs.rmdirSync(mockSrcDir);
    }
  });
});
