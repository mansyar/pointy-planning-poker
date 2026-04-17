import { render, screen } from '@testing-library/react';
import { App } from '../src/routes/index';
import { describe, it, expect } from 'vitest';

describe('Landing Page', () => {
  it('should render a "Create Room" button', () => {
    render(<App />);
    const button = screen.getByRole('button', { name: /create room/i });
    expect(button).toBeDefined();
  });

  it('should render a nickname input', () => {
    render(<App />);
    const input = screen.getByPlaceholderText(/your nickname/i);
    expect(input).toBeDefined();
  });
});
