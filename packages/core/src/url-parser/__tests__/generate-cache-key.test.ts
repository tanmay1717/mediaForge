import { generateCacheKey } from '../generate-cache-key';

describe('generateCacheKey', () => {
  it('generates consistent hash for same inputs', () => {
    const a = generateCacheKey({ width: 500, format: 'webp' }, 'test.jpg');
    const b = generateCacheKey({ width: 500, format: 'webp' }, 'test.jpg');
    expect(a).toBe(b);
  });

  it('generates different hash for different inputs', () => {
    const a = generateCacheKey({ width: 500 }, 'test.jpg');
    const b = generateCacheKey({ width: 600 }, 'test.jpg');
    expect(a).not.toBe(b);
  });

  it('returns 16 character hex string', () => {
    const key = generateCacheKey({ width: 100 }, 'test.jpg');
    expect(key).toHaveLength(16);
    expect(key).toMatch(/^[a-f0-9]+$/);
  });

  // TODO: Test that key order doesn't matter ({ width, format } === { format, width })
});
