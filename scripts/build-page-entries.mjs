import { mkdir, readFile, writeFile } from 'node:fs/promises';

// Real URL directories support direct links and refresh on static hosts,
// even without an SPA rewrite rule. The React entry renders by pathname.
const pages = JSON.parse(await readFile('src/site-map.json', 'utf8'));
const html = await readFile('dist/index.html', 'utf8');
const escape = text => text.replaceAll('&', '&amp;').replaceAll('<', '&lt;').replaceAll('"', '&quot;');
for (const page of [...pages.filter(page => page.path !== '/'), { ...pages[0], path: '/home' }]) {
  const directory = `dist${page.path}`;
  await mkdir(directory, { recursive: true });
  const document = html.replace(/<title>.*?<\/title>/, `<title>${escape(page.label)} | DataEco Lab</title>`)
    .replace(/<meta name="description" content="[^"]*"\s*\/>/, `<meta name="description" content="${escape(page.description)}" />`);
  await writeFile(`${directory}/index.html`, document);
}
await writeFile('dist/404.html', html.replace(/<title>.*?<\/title>/, '<title>Page not found | DataEco Lab</title>'));
console.log(`Built ${pages.length} pages plus /home alias and 404 entry.`);
