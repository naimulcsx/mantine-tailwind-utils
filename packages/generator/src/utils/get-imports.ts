import path from 'path';
import fs from 'fs';
import Handlebars from 'handlebars';

export function getCompiledTemplate(templateName: string) {
  const templatePath = path.resolve(
    __dirname,
    '../templates',
    `${templateName}.hbs`
  );
  const templateSource = fs.readFileSync(templatePath, 'utf-8');
  return Handlebars.compile(templateSource);
}
