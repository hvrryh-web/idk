import { describe, test, expect } from 'vitest';
import { composeScene } from '../src/backend/ascii/generator';

describe('ASCII Generator', () => {
  describe('composeScene', () => {
    test('composes background with single overlay without throwing', async () => {
      const spec = {
        background: 'forest',
        overlays: [{ assetName: 'man', x: 10, y: 4, anchor: 'bottom-center' as const }],
      };
      const scene = await composeScene(spec);
      expect(scene).toEqual(expect.any(String));
      // Should contain a piece of the forest asset
      expect(scene).toMatch(/&&&/);
      // Should contain the 'man' marker
      expect(scene).toMatch(/\(man\)/);
    });

    test('composes forest scene with two characters', async () => {
      const spec = {
        background: 'forest',
        overlays: [
          { assetName: 'man', x: 20, y: 6, anchor: 'bottom-center' as const },
          { assetName: 'woman', x: 36, y: 6, anchor: 'bottom-center' as const },
        ],
      };
      const scene = await composeScene(spec);
      expect(scene).toEqual(expect.any(String));
      // Should contain forest elements
      expect(scene).toMatch(/&/);
      // Should contain both character markers
      expect(scene).toMatch(/\(man\)/);
      expect(scene).toMatch(/\(woman\)/);
    });

    test('overlay outside bounds is clipped gracefully', async () => {
      const spec = {
        background: 'forest',
        overlays: [{ assetName: 'man', x: -50, y: -50, anchor: 'bottom-center' as const }],
      };
      const scene = await composeScene(spec);
      // Still returns the background content without error
      expect(scene).toMatch(/&&&/);
      // Man should not appear since it's completely out of bounds
      expect(scene).not.toMatch(/\(man\)/);
    });

    test('overlay extending beyond right edge is clipped', async () => {
      const spec = {
        background: 'forest',
        overlays: [{ assetName: 'woman', x: 100, y: 3, anchor: 'bottom-center' as const }],
      };
      const scene = await composeScene(spec);
      // Should not throw and should return background
      expect(scene).toMatch(/&&&/);
    });

    test('center anchor positioning works', async () => {
      const spec = {
        background: 'forest',
        overlays: [{ assetName: 'man', x: 25, y: 3, anchor: 'center' as const }],
      };
      const scene = await composeScene(spec);
      expect(scene).toEqual(expect.any(String));
      expect(scene).toMatch(/\(man\)/);
    });
  });
});
