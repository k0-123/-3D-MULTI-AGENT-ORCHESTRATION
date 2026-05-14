import { describe, it, expect } from 'vitest';
import { parseDesignMd } from '../src/lib/design-systems/parser';

describe('Design MD Parser', () => {
  it('extracts primary colors correctly', () => {
    const md = `
# Test Design System
- **Primary** (#ff0000)
- **Secondary** (#00ff00)
    `;
    const tokens = parseDesignMd(md);
    expect(tokens.colors['primary']).toBe('#ff0000');
    expect(tokens.colors['secondary']).toBe('#00ff00');
  });

  it('handles hex codes without explicit labels', () => {
    const md = `
Background: #ffffff
Text: #333333
    `;
    const tokens = parseDesignMd(md);
    expect(Object.values(tokens.colors)).toContain('#ffffff');
    expect(Object.values(tokens.colors)).toContain('#333333');
  });

  it('extracts shadows', () => {
    const md = `
Elevated: rgba(0, 0, 0, 0.1) 0px 4px 12px
    `;
    const tokens = parseDesignMd(md);
    expect(tokens.shadows['shadow-0']).toBe('rgba(0, 0, 0, 0.1) 0px 4px 12px');
  });
});
