import {cp, mkdir, readFile, writeFile} from 'node:fs/promises';
import {fileURLToPath} from 'node:url';
import path from 'node:path';

const root = path.dirname(fileURLToPath(import.meta.url));
const dist = path.resolve(root, process.argv[2] || 'dist');
const domain = process.env.SITE_URL || process.env.VERCEL_PROJECT_PRODUCTION_URL || process.env.VERCEL_URL;
let html = await readFile(path.join(root,'index.html'), 'utf8');
if (domain) {
  const site = new URL(domain.includes('://') ? domain : `https://${domain}`);
  if (site.protocol !== 'https:' || site.username || site.password || site.search || site.hash) {
    throw new Error('SITE_URL geçerli bir HTTPS yayın adresi olmalıdır.');
  }
  if (!site.pathname.endsWith('/')) site.pathname += '/';
  const attr = value => value.replaceAll('&','&amp;').replaceAll('"','&quot;').replaceAll('<','&lt;').replaceAll('>','&gt;');
  const base = attr(site.href);
  const cover = attr(new URL('assets/paylasim.png', site).href);
  html = html.replace('content="./assets/paylasim.png"', `content="${cover}"`).replace('</head>',
    `  <link rel="canonical" href="${base}">\n  <meta property="og:url" content="${base}">\n</head>`);
}
await mkdir(dist, {recursive:true});
await Promise.all([
  writeFile(path.join(dist,'index.html'),html),
  ...['style.css','app.js','questions.js','content.js','assets'].map(name => cp(path.join(root,name),path.join(dist,name),{recursive:true}))
]);
