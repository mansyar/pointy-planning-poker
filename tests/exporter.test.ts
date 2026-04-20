import { describe, it, expect } from 'vitest';
import {
  generateMarkdown,
  generateSummary,
  generateCSV,
} from '../src/utils/exporter';

describe('Export Utilities', () => {
  const mockTopics = [
    { title: 'Feature A', finalEstimate: '5' },
    { title: 'Feature B', finalEstimate: '13' },
    { title: 'Feature C', finalEstimate: '?' },
  ];

  it('generates a Markdown table correctly', () => {
    const md = generateMarkdown('Test Room', mockTopics);
    expect(md).toContain('# Session Export: Test Room');
    expect(md).toContain('| Topic | Final Estimate |');
    expect(md).toContain('| Feature A | 5 |');
    expect(md).toContain('| Feature B | 13 |');
    expect(md).toContain('| Feature C | ? |');
  });

  it('generates a Summary List correctly', () => {
    const summary = generateSummary('Test Room', mockTopics);
    expect(summary).toContain('Session Summary: Test Room');
    expect(summary).toContain('- Feature A: 5');
    expect(summary).toContain('- Feature B: 13');
    expect(summary).toContain('- Feature C: ?');
  });

  it('generates a CSV string correctly', () => {
    const csv = generateCSV(mockTopics);
    expect(csv).toBe(
      'Topic,Final Estimate\n"Feature A","5"\n"Feature B","13"\n"Feature C","?"'
    );
  });
});
