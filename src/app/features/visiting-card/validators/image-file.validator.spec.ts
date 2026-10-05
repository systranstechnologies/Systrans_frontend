import { describe, expect, it } from 'vitest';
import { sanitizeSvg, validateLogoFile } from './image-file.validator';

describe('validateLogoFile', () => {
  it('accepts supported image types within the size limit', () => {
    expect(validateLogoFile(new File(['image'], 'logo.png', { type: 'image/png' }))).toBeNull();
    expect(validateLogoFile(new File(['image'], 'logo.jpeg', { type: 'image/jpeg' }))).toBeNull();
  });

  it('rejects unsupported types and files larger than 5 MB', () => {
    expect(validateLogoFile(new File(['text'], 'logo.gif', { type: 'image/gif' }))).toBe('type');
    expect(validateLogoFile(new File([new Uint8Array(5 * 1024 * 1024 + 1)], 'logo.png', { type: 'image/png' }))).toBe('size');
  });
});

describe('sanitizeSvg', () => {
  it('removes executable content and external references', () => {
    const sanitized = sanitizeSvg(
      '<svg xmlns="http://www.w3.org/2000/svg" onclick="alert(1)"><image href="https://example.com/image.png"/><path d="M0 0"/></svg>',
    );

    expect(sanitized).not.toBeNull();
    expect(sanitized).not.toContain('onclick');
    expect(sanitized).not.toContain('https://example.com');
    expect(sanitized).toContain('<path');
  });

  it('rejects malformed SVG and embedded HTML', () => {
    expect(sanitizeSvg('<svg><parsererror>invalid</parsererror></svg>')).toBeNull();
    expect(sanitizeSvg('<svg><foreignObject><div>unsafe</div></foreignObject></svg>')).toBeNull();
    expect(sanitizeSvg('<svg><script>alert(1)</script></svg>')).toBeNull();
  });
});
