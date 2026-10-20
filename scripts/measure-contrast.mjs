import { spawn } from 'node:child_process';
import { readFile, writeFile } from 'node:fs/promises';
import ffmpeg from 'ffmpeg-static';

// Every decoded video frame; 8px sampling grid over the full text boxes.
// Composite the exact CSS shade stops over pixels before measuring luminance.
const layouts = JSON.parse(await readFile('output/playwright/contrast-layouts.json', 'utf8'));
const lum = rgb => rgb.map(v => { const s = v / 255; return s <= .04045 ? s / 12.92 : ((s + .055) / 1.055) ** 2.4; }).reduce((s,v,i) => s + v * [.2126,.7152,.0722][i],0);
const mix = (rgb, shade, opacity) => rgb.map((v,i) => shade[i] * opacity + v * (1 - opacity));
const interpolate = (at, stops) => {
  for (let i = 1; i < stops.length; i++) if (at <= stops[i][0]) {
    const [x,a] = stops[i-1], [y,b] = stops[i]; return a + (b-a) * (at-x)/(y-x);
  }
  return stops.at(-1)[1];
};
const reports = [];
for (const { width, height, boxes } of layouts) {
  const scale = Math.max(width/1920, height/1080);
  const sw = Math.round(1920*scale), sh = Math.round(1080*scale);
  const minima = boxes.map(box => ({ selector: box.selector, contrast: Infinity, frame: 0 }));
  const samples = boxes.map(box => {
    const coords = [];
    for(let y = Math.ceil(box.y); y < Math.min(height,box.bottom); y+=8) for(let x = Math.ceil(box.x); x < Math.min(width,box.right); x+=8) coords.push([x,y]);
    return coords;
  });
  let count = 0, pending = Buffer.alloc(0);
  const frameSize = width * height * 3;
  const child = spawn(ffmpeg, ['-v','error','-i','public/media/hero.mp4','-vf',`scale=${sw}:${sh},crop=${width}:${height}:(iw-ow)*0.65:(ih-oh)*0.5`,'-f','rawvideo','-pix_fmt','rgb24','pipe:1'], { windowsHide: true });
  await new Promise((resolve,reject) => {
    child.stdout.on('data', chunk => {
      pending = Buffer.concat([pending, chunk]);
      while(pending.length >= frameSize) {
        const frame = pending.subarray(0,frameSize);
        for (let b=0;b<boxes.length;b++) for (const [x,y] of samples[b]) {
          const offset = (y*width+x)*3;
          let rgb = [frame[offset],frame[offset+1],frame[offset+2]];
          if(width > 760) {
            rgb = mix(rgb,[3,18,48],Math.max(0,(y/height-.3)/.7)*.63);
            rgb = mix(rgb,[3,18,48],interpolate(x/width,[[0,.77],[.46,.56],[.78,.06],[1,.06]]));
          } else {
            rgb = mix(rgb,[3,19,48],interpolate(1-y/height,[[0,245/255],[.44,179/255],[.8,10/255],[1,10/255]]));
          }
          const ratio = (lum(boxes[b].color)+.05)/(lum(rgb)+.05);
          if(ratio < minima[b].contrast) minima[b] = { selector: boxes[b].selector, contrast: ratio, frame: count };
        }
        pending = Buffer.from(pending.subarray(frameSize)); count++;
      }
    });
    child.stderr.on('data',d=>process.stderr.write(d));
    child.on('error',reject); child.on('close',code=>code===0 ? resolve() : reject(new Error(`ffmpeg ${code}`)));
  });
  const report = { width,height,decodedFrames:count,sampling:'8px grid across full text bounding boxes; CSS overlay composited numerically',minima:minima.map(m=>({...m,contrast:+m.contrast.toFixed(2)})) };
  reports.push(report); console.log(report);
}
await writeFile('output/playwright/contrast-report.json',JSON.stringify(reports,null,2));
