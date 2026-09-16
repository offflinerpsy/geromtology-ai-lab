import sharp from 'sharp';
import { mkdir, writeFile } from 'node:fs/promises';
import { fileURLToPath } from 'node:url';
import path from 'node:path';

const root = path.resolve(path.dirname(fileURLToPath(import.meta.url)), '..');
const output = path.join(root, 'public/media');
const sources = [
  { name: 'cells', file: 'cellular_longevity_1789393663268.jpg', cropBottom: 0.14 },
  { name: 'laboratory', file: 'epigenetic_sequencer_1789393650422.jpg', cropBottom: 0 },
  { name: 'epigenetics', file: 'proage_hero_biotech_1789390656972.jpg', cropBottom: 0 },
];
await mkdir(output, { recursive: true });
const manifest = [];
for (const source of sources) {
  const input = path.join(root, 'src/assets/images', source.file);
  const metadata = await sharp(input).metadata();
  if (!metadata.width || !metadata.height) throw new Error(`Invalid source image: ${source.file}`);
  for (const width of [640, 1280, 1920]) {
    let pipeline = sharp(input).rotate();
    if (source.cropBottom) pipeline = pipeline.extract({ left: 0, top: 0, width: metadata.width, height: Math.floor(metadata.height * (1 - source.cropBottom)) });
    const filename = `${source.name}-${width}.webp`;
    const result = await pipeline.resize({ width }).webp({ quality: 80, effort: 5 }).toFile(path.join(output, filename));
    manifest.push({ file: filename, width: result.width, height: result.height, bytes: result.size, source: source.file, classification: 'conceptual illustration, not experimental output' });
  }
}
await writeFile(path.join(output, 'manifest.json'), JSON.stringify(manifest, null, 2) + '\n');
console.log(`Prepared ${manifest.length} responsive WebP images from committed originals.`);
