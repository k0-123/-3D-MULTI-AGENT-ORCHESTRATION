import { describe, it, expect } from 'vitest';
import { DESIGN_SYSTEMS } from '../src/lib/design-systems/index';
import { SKILL_REGISTRY } from '../src/lib/skills/index';

describe('System Registries', () => {
  it('contains critical design systems', () => {
    expect(DESIGN_SYSTEMS).toHaveProperty('default');
    expect(DESIGN_SYSTEMS).toHaveProperty('apple');
    expect(DESIGN_SYSTEMS).toHaveProperty('airbnb');
  });

  it('contains expected number of design systems', () => {
    const count = Object.keys(DESIGN_SYSTEMS).length;
    expect(count).toBeGreaterThan(100);
  });

  it('contains critical skills', () => {
    expect(SKILL_REGISTRY).toHaveProperty('brainstorming');
    expect(SKILL_REGISTRY).toHaveProperty('frontend-design');
    expect(SKILL_REGISTRY).toHaveProperty('artifacts-builder');
  });

  it('contains expected number of skills', () => {
    const count = Object.keys(SKILL_REGISTRY).length;
    expect(count).toBeGreaterThan(50);
  });
});
