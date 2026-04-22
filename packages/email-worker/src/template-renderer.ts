import Handlebars from 'handlebars';
import * as fs from 'fs';
import * as path from 'path';

/**
 * Compile and render Handlebars email templates.
 *
 * TODO:
 * - loadTemplate: Read .hbs file from templates/ directory
 * - renderEmail: Compile template + inject variables + wrap in _layout.hbs
 * - Register Handlebars helpers:
 *   - {{formatBytes size}} — human-readable file size
 *   - {{formatDate date}} — friendly date string
 *   - {{year}} — current year (for copyright in footer)
 * - Cache compiled templates (Lambda stays warm between invocations)
 */
const templateCache = new Map<string, HandlebarsTemplateDelegate>();
const TEMPLATE_DIR = path.join(__dirname, 'templates');

/** Register custom Handlebars helpers */
Handlebars.registerHelper('year', () => new Date().getFullYear());
Handlebars.registerHelper('formatBytes', (bytes: number) => {
  if (bytes === 0) return '0 B';
  const k = 1024;
  const sizes = ['B', 'KB', 'MB', 'GB'];
  const i = Math.floor(Math.log(bytes) / Math.log(k));
  return `${(bytes / Math.pow(k, i)).toFixed(1)} ${sizes[i]}`;
});

function loadTemplate(name: string): HandlebarsTemplateDelegate {
  if (templateCache.has(name)) return templateCache.get(name)!;

  const filePath = path.join(TEMPLATE_DIR, `${name}.hbs`);
  const source = fs.readFileSync(filePath, 'utf-8');
  const compiled = Handlebars.compile(source);
  templateCache.set(name, compiled);
  return compiled;
}

export function renderEmail(
  templateName: string,
  variables: Record<string, unknown>,
): string {
  // TODO: Load _layout.hbs as the outer wrapper
  // TODO: Render the inner template, then inject into layout's {{{content}}} slot
  const template = loadTemplate(templateName);
  return template(variables);
}
