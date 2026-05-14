import { describe, it, expect } from 'vitest';
import { stripFrontmatter } from '../src/lib/skills/loader';

describe('Skills Loader', () => {
  it('strips frontmatter correctly', () => {
    const content = `---
name: Test
category: General
---
# Skill Content`;
    const stripped = stripFrontmatter(content);
    expect(stripped).toBe('# Skill Content');
  });

  it('handles content without frontmatter', () => {
    const content = '# Skill Content';
    const stripped = stripFrontmatter(content);
    expect(stripped).toBe('# Skill Content');
  });
});
