import { afterEach, beforeEach, describe, expect, it } from 'vitest';
import { enhanceAccessibility } from '../src/index';

describe('enhanceAccessibility', () => {
  beforeEach(() => {
    // Clear document body before each test
    document.body.innerHTML = '';
  });

  afterEach(() => {
    document.body.innerHTML = '';
  });

  it('adds tabindex, role, and aria-label to code blocks when missing', () => {
    // Setup: create a highlight container with a pre block that has no accessibility attributes
    document.body.innerHTML = '<div class="highlight"><pre>const x = 1;</pre></div>';

    // Act: run the accessibility enhancement
    enhanceAccessibility(document);

    // Assert: verify actual DOM state, not mock calls
    const pre = document.querySelector('.highlight > pre');
    expect(pre).not.toBeNull();
    expect(pre?.getAttribute('tabindex')).toBe('0');
    expect(pre?.getAttribute('role')).toBe('region');
    expect(pre?.getAttribute('aria-label')).toBe('Code block');
  });

  it('does not overwrite existing attributes', () => {
    // Setup: pre block with existing attributes (different values to detect overwriting)
    document.body.innerHTML = `
      <div class="highlight">
        <pre tabindex="-1" role="code" aria-label="Custom label">const y = 2;</pre>
      </div>
    `;

    // Act
    enhanceAccessibility(document);

    // Assert: original values should be preserved
    const pre = document.querySelector('.highlight > pre');
    expect(pre).not.toBeNull();
    expect(pre?.getAttribute('tabindex')).toBe('-1'); // Not overwritten
    expect(pre?.getAttribute('role')).toBe('code'); // Not overwritten
    expect(pre?.getAttribute('aria-label')).toBe('Custom label'); // Not overwritten
  });

  it('handles multiple code blocks', () => {
    // Setup: multiple highlight blocks
    document.body.innerHTML = `
      <div class="highlight"><pre>block 1</pre></div>
      <div class="highlight"><pre>block 2</pre></div>
      <div class="highlight"><pre tabindex="1">block 3 (has tabindex)</pre></div>
    `;

    // Act
    enhanceAccessibility(document);

    // Assert: all blocks should have accessibility attributes
    const preElements = document.querySelectorAll('.highlight > pre');
    expect(preElements.length).toBe(3);

    // First two should have attributes added
    expect(preElements[0].getAttribute('tabindex')).toBe('0');
    expect(preElements[0].getAttribute('role')).toBe('region');
    expect(preElements[1].getAttribute('tabindex')).toBe('0');
    expect(preElements[1].getAttribute('role')).toBe('region');

    // Third should keep its original tabindex but get other attributes
    expect(preElements[2].getAttribute('tabindex')).toBe('1');
    expect(preElements[2].getAttribute('role')).toBe('region');
  });

  it('is safe when no pre blocks are present', () => {
    // Setup: empty document or document without highlight blocks
    document.body.innerHTML = '<div class="content"><p>No code here</p></div>';

    // Act & Assert: should not throw
    expect(() => enhanceAccessibility(document)).not.toThrow();
  });

  it('ignores pre blocks not inside .highlight container', () => {
    // Setup: pre block outside of highlight container
    document.body.innerHTML = '<pre>standalone pre</pre>';

    // Act
    enhanceAccessibility(document);

    // Assert: standalone pre should not be modified
    const pre = document.querySelector('pre');
    expect(pre).not.toBeNull();
    expect(pre?.hasAttribute('tabindex')).toBe(false);
    expect(pre?.hasAttribute('role')).toBe(false);
    expect(pre?.hasAttribute('aria-label')).toBe(false);
  });
});
