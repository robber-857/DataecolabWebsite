import { spawnSync } from 'node:child_process';
import { mkdir } from 'node:fs/promises';
import ffmpeg from 'ffmpeg-static';
import sharp from 'sharp';

// Reproducible export of the existing 8-second still-image motion concept.
// Remotion's bundled native compositor crashes on this Windows host (0xC0000005).
// Locked camera: identical framing throughout each shot. Crossfades alone
// provide motion, avoiding zoompan's integer crop stepping on architectural edges.
// The first and last shots also match the poster crop and each other.
await mkdir('public/media', { recursive: true });
for (const [source, name] of [['A-optical-glass', 'glass'], ['B-porcelain-blue-core', 'porcelain'], ['C-research-architecture', 'architecture']]) {
  await sharp(`design/hero-candidates/${source}.png`).resize(1920, 1080, { fit: 'cover' }).webp({ quality: 85 }).toFile(`public/media/${name}.webp`);
}
const run = (args) => {
  const result = spawnSync(ffmpeg, ['-hide_banner', '-y', ...args], { stdio: 'inherit', windowsHide: true });
  if (result.status !== 0) throw new Error(`FFmpeg failed: ${result.status}`);
};
const inputs = ['architecture', 'glass', 'porcelain', 'architecture'].flatMap(name => ['-loop', '1', '-framerate', '30', '-i', `public/media/${name}.webp`]);
const filter = [
  '[0:v]trim=duration=3.2,setpts=PTS-STARTPTS,format=yuv420p[a]',
  '[1:v]trim=duration=3.2,setpts=PTS-STARTPTS,format=yuv420p[b]',
  '[2:v]trim=duration=3.1,setpts=PTS-STARTPTS,format=yuv420p[c]',
  '[3:v]trim=duration=0.8,setpts=PTS-STARTPTS,format=yuv420p[d]',
  '[a][b]xfade=transition=fade:duration=0.8:offset=2.4[ab]',
  '[ab][c]xfade=transition=fade:duration=0.8:offset=4.8[abc]',
  '[abc][d]xfade=transition=fade:duration=0.7:offset=7.2[out]',
].join(';');
run([...inputs, '-filter_complex_threads', '2', '-filter_complex', filter, '-map', '[out]', '-t', '8', '-an', '-c:v', 'libx264', '-preset', 'medium', '-crf', '21', '-pix_fmt', 'yuv420p', '-g', '60', '-keyint_min', '60', '-sc_threshold', '0', '-movflags', '+faststart', 'public/media/hero.mp4']);
run(['-i', 'public/media/hero.mp4', '-c', 'copy', '-hls_time', '2', '-hls_playlist_type', 'vod', '-hls_segment_filename', 'public/media/hero-%02d.ts', 'public/media/hero.m3u8']);
