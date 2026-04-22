import { analyzeQuality } from '../quality-analyzer';

describe('quality-analyzer', () => {
  it('returns lower quality for avif (efficient format)', async () => {
    const q = await analyzeQuality(Buffer.alloc(0), 'avif');
    expect(q).toBeLessThan(80);
  });
  it('returns higher quality for jpeg', async () => {
    const q = await analyzeQuality(Buffer.alloc(0), 'jpg');
    expect(q).toBeGreaterThanOrEqual(80);
  });
  // TODO: Test with actual image buffers once image analysis is implemented
});
