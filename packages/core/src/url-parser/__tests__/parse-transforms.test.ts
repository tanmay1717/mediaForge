import { parseTransforms } from '../parse-transforms';

describe('parseTransforms', () => {
  it('parses width and height', () => {
    const result = parseTransforms('w_500,h_300');
    expect(result.width).toBe(500);
    expect(result.height).toBe(300);
  });

  it('parses format and quality', () => {
    const result = parseTransforms('f_auto,q_80');
    expect(result.format).toBe('auto');
    expect(result.quality).toBe(80);
  });

  it('parses quality auto', () => {
    const result = parseTransforms('q_auto');
    expect(result.quality).toBe('auto');
  });

  it('parses effects with value', () => {
    const result = parseTransforms('e_blur:10');
    expect(result.effect).toEqual({ name: 'blur', value: 10 });
  });

  it('returns empty params for empty string', () => {
    const result = parseTransforms('');
    expect(result).toEqual({});
  });

  // TODO: Add tests for crop, gravity, aspectRatio, dpr, bg, r, pg, fl
  // TODO: Add tests for unknown keys (should be ignored)
  // TODO: Add tests for malformed input (missing value, extra underscores)
});
