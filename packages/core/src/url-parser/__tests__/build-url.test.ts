import { buildDeliveryUrl } from '../build-url';

describe('buildDeliveryUrl', () => {
  it('builds a URL with transforms', () => {
    const url = buildDeliveryUrl(
      { width: 500, format: 'auto' },
      'products/hero.jpg',
      'cdn.example.com',
    );
    expect(url).toBe('https://cdn.example.com/v1/image/w_500,f_auto/products/hero.jpg');
  });

  it('uses raw type when no transforms', () => {
    const url = buildDeliveryUrl({}, 'docs/contract.pdf', 'cdn.example.com');
    expect(url).toBe('https://cdn.example.com/v1/raw/docs/contract.pdf');
  });

  // TODO: Add tests for video type detection
  // TODO: Add tests for all param types in the URL
  // TODO: Add tests for effect with value
});
