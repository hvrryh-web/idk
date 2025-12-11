import { describe, test, expect } from 'vitest';
import { composeScene, loadAssetMetadata, listAssets } from '../../src/backend/ascii/generator';

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
          { assetName: 'man', x: 15, y: 6, anchor: 'bottom-center' as const },
          { assetName: 'woman', x: 30, y: 6, anchor: 'bottom-center' as const },
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

    test('composes scene with new assets', async () => {
      const spec = {
        background: 'cave',
        overlays: [{ assetName: 'elder', x: 9, y: 8 }],
      };
      const scene = await composeScene(spec);
      expect(scene).toEqual(expect.any(String));
      expect(scene).toMatch(/elder/);
    });

    test('composes scene with effects', async () => {
      const spec = {
        background: 'temple',
        overlays: [
          { assetName: 'cultivator', x: 17, y: 7 },
          { assetName: 'sparkles', x: 17, y: 3 },
        ],
      };
      const scene = await composeScene(spec);
      expect(scene).toEqual(expect.any(String));
      expect(scene).toMatch(/\*/); // sparkles contain asterisks
    });
  });

  describe('Asset Metadata', () => {
    test('loads metadata for asset with metadata file', async () => {
      const metadata = await loadAssetMetadata('forest');
      expect(metadata).not.toBeNull();
      expect(metadata?.name).toBe('forest');
      expect(metadata?.type).toBe('background');
      expect(metadata?.tags).toContain('nature');
    });

    test('returns null for asset without metadata', async () => {
      const metadata = await loadAssetMetadata('nonexistent');
      expect(metadata).toBeNull();
    });

    test('lists all assets', async () => {
      const assets = await listAssets();
      expect(assets).toBeInstanceOf(Array);
      expect(assets.length).toBeGreaterThan(0);
      expect(assets).toContain('forest');
      expect(assets).toContain('man');
    });

    test('lists assets by type - backgrounds', async () => {
      const backgrounds = await listAssets('background');
      expect(backgrounds).toBeInstanceOf(Array);
      expect(backgrounds).toContain('forest');
      expect(backgrounds).toContain('cave');
      expect(backgrounds).toContain('temple');
    });

    test('lists assets by type - characters', async () => {
      const characters = await listAssets('character');
      expect(characters).toBeInstanceOf(Array);
      expect(characters).toContain('man');
      expect(characters).toContain('cultivator');
      expect(characters).toContain('elder');
    });

    test('lists assets by type - effects', async () => {
      const effects = await listAssets('effect');
      expect(effects).toBeInstanceOf(Array);
      expect(effects).toContain('sparkles');
      expect(effects).toContain('energy');
    });
  });
});
