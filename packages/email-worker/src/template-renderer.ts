import Handlebars from 'handlebars';

/** Register custom Handlebars helpers */
Handlebars.registerHelper('year', () => new Date().getFullYear());
Handlebars.registerHelper('formatBytes', (bytes: number) => {
  if (bytes === 0) return '0 B';
  const k = 1024;
  const sizes = ['B', 'KB', 'MB', 'GB'];
  const i = Math.floor(Math.log(bytes) / Math.log(k));
  return `${(bytes / Math.pow(k, i)).toFixed(1)} ${sizes[i]}`;
});

/** Inline templates — esbuild can't bundle .hbs files */
const TEMPLATES: Record<string, string> = {
  welcome: `
<!DOCTYPE html>
<html>
<head>
  <meta charset="utf-8">
  <meta name="viewport" content="width=device-width, initial-scale=1.0">
  <style>
    body { font-family: -apple-system, BlinkMacSystemFont, 'Segoe UI', sans-serif; margin: 0; padding: 20px; background: #f5f5f5; }
    .container { max-width: 600px; margin: 0 auto; background: #fff; border-radius: 8px; padding: 40px; }
    .btn { display: inline-block; background: #4f6df5; color: #fff; padding: 12px 24px; border-radius: 6px; text-decoration: none; font-weight: 500; }
    .code { background: #f0f0f0; padding: 8px 16px; border-radius: 4px; font-family: monospace; font-size: 14px; }
    .footer { margin-top: 32px; padding-top: 16px; border-top: 1px solid #eee; font-size: 12px; color: #999; }
    h1 { color: #1a1a1a; }
    h2 { color: #333; font-size: 16px; }
  </style>
</head>
<body>
  <div class="container">
    <h1>Welcome to MediaForge, {{name}}! 🚀</h1>
    <p>Your account is ready. Here's everything you need to get started:</p>

    <h2>Your delivery domain</h2>
    <p class="code">{{deliveryDomain}}</p>

    <h2>Quick start</h2>
    <ol>
      <li>Upload an image via the dashboard or API</li>
      <li>Use your delivery URL with transform params: <code>w_500,f_auto,q_auto</code></li>
      <li>Every variant is generated and cached automatically</li>
    </ol>

    <p><a href="{{dashboardUrl}}" class="btn">Open Dashboard</a></p>

    <div class="footer">
      <p>MediaForge — Self-hosted media delivery</p>
      <p>&copy; {{year}} MediaForge</p>
    </div>
  </div>
</body>
</html>`,

  'password-reset': `
<!DOCTYPE html>
<html>
<head><meta charset="utf-8"><style>body{font-family:sans-serif;padding:20px;background:#f5f5f5}.container{max-width:600px;margin:0 auto;background:#fff;border-radius:8px;padding:40px}.code{font-size:32px;font-weight:bold;letter-spacing:4px;text-align:center;padding:16px;background:#f0f0f0;border-radius:8px}.footer{margin-top:32px;padding-top:16px;border-top:1px solid #eee;font-size:12px;color:#999}</style></head>
<body><div class="container">
  <h1>Reset your password</h1>
  <p>Hi {{name}},</p>
  <p>Use this code to reset your MediaForge password:</p>
  <p class="code">{{resetCode}}</p>
  <p>This code expires in 15 minutes.</p>
  <p>If you didn't request this, you can safely ignore this email.</p>
  <div class="footer"><p>&copy; {{year}} MediaForge</p></div>
</div></body></html>`,

  'quota-warning': `
<!DOCTYPE html>
<html>
<head><meta charset="utf-8"><style>body{font-family:sans-serif;padding:20px;background:#f5f5f5}.container{max-width:600px;margin:0 auto;background:#fff;border-radius:8px;padding:40px}.footer{margin-top:32px;padding-top:16px;border-top:1px solid #eee;font-size:12px;color:#999}</style></head>
<body><div class="container">
  <h1>Storage quota warning</h1>
  <p>Hi {{name}},</p>
  <p>You've used <strong>{{usagePercent}}%</strong> of your storage.</p>
  <p>Used: {{formatBytes usedBytes}} / {{formatBytes limitBytes}}</p>
  <p><a href="{{dashboardUrl}}/settings/usage">View Usage</a></p>
  <div class="footer"><p>&copy; {{year}} MediaForge</p></div>
</div></body></html>`,
};

const compiledCache = new Map<string, HandlebarsTemplateDelegate>();

export function renderEmail(
  templateName: string,
  variables: Record<string, unknown>,
): string {
  if (!compiledCache.has(templateName)) {
    const source = TEMPLATES[templateName];
    if (!source) throw new Error(`Template not found: ${templateName}`);
    compiledCache.set(templateName, Handlebars.compile(source));
  }
  return compiledCache.get(templateName)!(variables);
}
