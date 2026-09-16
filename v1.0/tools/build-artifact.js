/* Builds the single-file version for publishing as an Artifact.
 *
 *   node tools/build-artifact.js
 *
 * index.html is the source of truth. This inlines styles.css and the three
 * scripts into one file, and drops the <!doctype>/<html>/<head>/<body>
 * wrapper, because the Artifact host supplies its own skeleton.
 *
 * Re-run after ANY change to index.html, styles.css, app.js or data/*.js,
 * then republish to the same Artifact URL.
 */

var fs = require('fs');
var path = require('path');

var root = path.join(__dirname, '..');
var read = function (p) { return fs.readFileSync(path.join(root, p), 'utf8'); };

var html = read('index.html');

/* The <head> bits the artifact still needs: the page name and the font link
 * (fonts.googleapis.com is one of the few hosts the Artifact CSP allows). */
var title = (html.match(/<title>([\s\S]*?)<\/title>/) || [])[1] || 'German Level Test';
var fontLink = (html.match(/<link rel="stylesheet" href="https:\/\/fonts\.googleapis\.com[^>]*>/) || [])[0] || '';

/* Everything between <body> and </body>, minus the external script tags. */
var body = (html.match(/<body[^>]*>([\s\S]*?)<\/body>/) || [])[1] || '';
var scriptSrcs = [];
body = body.replace(/[ \t]*<script src="([^"]+)"><\/script>\s*/g, function (_, src) {
  scriptSrcs.push(src);
  return '';
}).trim();

if (!scriptSrcs.length) throw new Error('No <script src> tags found in index.html — nothing to inline.');

var out = [
  '<title>' + title + '</title>',
  fontLink,
  '<style>',
  read('styles.css').trim(),
  '</style>',
  '',
  body,
  ''
];

scriptSrcs.forEach(function (src) {
  out.push('<script>');
  out.push('/* ===== ' + src + ' ===== */');
  out.push(read(src).trim());
  out.push('</script>');
});

var dist = path.join(root, 'dist');
if (!fs.existsSync(dist)) fs.mkdirSync(dist);

var file = path.join(dist, 'level-test.html');
var text = out.join('\n') + '\n';
fs.writeFileSync(file, text, 'utf8');

console.log('Wrote ' + file);
console.log('  inlined: styles.css, ' + scriptSrcs.join(', '));
console.log('  size: ' + (text.length / 1024).toFixed(1) + ' KB');
