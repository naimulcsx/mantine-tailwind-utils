import fs from 'fs';
import Handlebars from 'handlebars';
import path from 'path';
import { fileURLToPath } from 'url';

const __filename = fileURLToPath(import.meta.url);
const __dirname = path.dirname(__filename);

export function getCompiledTemplate(templateName: string) {
  const templateSource = fs.readFileSync(
    path.join(__dirname, `${templateName}.hbs`),
    'utf-8'
  );
  return Handlebars.compile(templateSource);
}
