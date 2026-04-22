import { negotiateFormat, extToFormat, formatToMime } from '../format-negotiator';

describe('format-negotiator', () => {
  it('returns avif when Accept includes image/avif', () => {
    expect(negotiateFormat('image/avif,image/webp,*/*', 'jpg')).toBe('avif');
  });
  it('returns webp when Accept includes image/webp but not avif', () => {
    expect(negotiateFormat('image/webp,*/*', 'jpg')).toBe('webp');
  });
  it('falls back to original format', () => {
    expect(negotiateFormat('image/png,*/*', 'jpg')).toBe('jpg');
  });
  it('handles undefined Accept header', () => {
    expect(negotiateFormat(undefined, 'png')).toBe('png');
  });
  // TODO: Test extToFormat for all extensions
  // TODO: Test formatToMime for all formats
});
