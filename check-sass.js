import sass from 'sass';
import fs from 'fs';
import path from 'path';
import { fileURLToPath } from 'url';

const __filename = fileURLToPath(import.meta.url);
const __dirname = path.dirname(__filename);

try {
  // Compile the form-grid.scss file
  const result = sass.compile(path.resolve(__dirname, 'src/scss/components/_form-grid.scss'), {
    loadPaths: [path.resolve(__dirname, 'src/scss')]
  });

  console.log('SASS compilation successful!');

  // Write the compiled CSS to a file for inspection
  fs.writeFileSync('form-grid.css', result.css);
  console.log('Compiled CSS written to form-grid.css');
} catch (error) {
  console.error('SASS compilation error:', error.message);
}
