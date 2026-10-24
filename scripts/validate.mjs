#!/usr/bin/env node
// Validates this theme before it is published to the Camillia Community Hub:
// hub.json declares the extension id and the closed theme file set, and
// theme.json follows the theme contract (see extension-guidelines,
// docs/manifest-and-publishing.md "Theme contract").
// Zero dependencies; run with Node 22 or later:
//   node scripts/validate.mjs

import { readFile } from 'node:fs/promises';
import { join } from 'node:path';
import { fileURLToPath } from 'node:url';

const repoRoot = fileURLToPath(new URL('..', import.meta.url));
const KEBAB_ID = /^[a-z0-9](-?[a-z0-9]){2,39}$/;
const TOKEN_KEY = /^--[a-zA-Z0-9-]+$/;
const MAX_TOKENS = 64;
const MAX_VALUE_CHARS = 200;
// Theme values are plain colors or font stacks: anything that could load a
// resource, run code or inject markup is refused.
const FORBIDDEN_SNIPPETS = ['url(', 'expression(', 'javascript:', '@import'];
const LT = String.fromCharCode(60);
const GT = String.fromCharCode(62);
const ALLOWED_FILES = new Set(['theme.json', 'preview.png', 'preview.jpg']);

const failures = [];

function isForbiddenValue(value) {
  const compact = value.toLowerCase().replace(/\s+/g, '');
  return (
    FORBIDDEN_SNIPPETS.some((snippet) => compact.includes(snippet)) ||
    value.includes(LT) ||
    value.includes(GT)
  );
}

// 1. hub.json declares the extension id, the theme kind and the closed file set.
let hub;
try {
  hub = JSON.parse(await readFile(join(repoRoot, 'hub.json'), 'utf8'));
} catch {
  failures.push('hub.json is missing or not valid JSON.');
}
if (hub) {
  if (typeof hub.id !== 'string' || !KEBAB_ID.test(hub.id)) {
    failures.push("hub.json must declare a unique kebab-case extension 'id'.");
  }
  if (hub.kind !== 'theme') {
    failures.push(`hub.json kind must be 'theme' (found '${hub.kind}').`);
  }
  const include = Array.isArray(hub.include) ? hub.include : [];
  if (include.length === 0) {
    failures.push("hub.json must list the published files in 'include'.");
  }
  for (const rel of include) {
    if (!ALLOWED_FILES.has(rel)) {
      failures.push(
        `hub.json include: '${rel}' is outside the theme file set (theme.json, preview.png, preview.jpg).`,
      );
    }
  }
  if (!include.includes('theme.json')) {
    failures.push("hub.json include must contain 'theme.json'.");
  }
}

// 2. theme.json parses and follows the theme contract.
let theme;
try {
  theme = JSON.parse(await readFile(join(repoRoot, 'theme.json'), 'utf8'));
} catch {
  failures.push('theme.json is missing or not valid JSON.');
}
if (theme) {
  if (typeof theme.name !== 'string' || theme.name.trim().length === 0) {
    failures.push("theme.json must declare a non-empty 'name'.");
  }
  if (theme.base !== 'dark' && theme.base !== 'light') {
    failures.push(`theme.json base must be 'dark' or 'light' (found '${theme.base}').`);
  }
  const tokens = theme.tokens;
  if (typeof tokens !== 'object' || tokens === null || Array.isArray(tokens)) {
    failures.push("theme.json must carry a 'tokens' object.");
  } else {
    const entries = Object.entries(tokens);
    if (entries.length === 0) {
      failures.push('theme.json tokens must not be empty.');
    }
    if (entries.length > MAX_TOKENS) {
      failures.push(`theme.json declares ${entries.length} tokens; the maximum is ${MAX_TOKENS}.`);
    }
    for (const [key, value] of entries) {
      if (!TOKEN_KEY.test(key)) {
        failures.push(`token key '${key}' is not a CSS custom property (expected --* names).`);
      }
      if (typeof value !== 'string') {
        failures.push(`token '${key}' value must be a string.`);
        continue;
      }
      if (value.length === 0 || value.length > MAX_VALUE_CHARS) {
        failures.push(`token '${key}' value must be 1-${MAX_VALUE_CHARS} characters.`);
      }
      if (isForbiddenValue(value)) {
        failures.push(
          `token '${key}' value is not a plain color/font stack (forbidden: url(, expression(, javascript:, @import, markup).`,
        );
      }
    }
  }
}

if (failures.length > 0) {
  console.error('Theme validation failed:');
  for (const failure of failures) {
    console.error(`  - ${failure}`);
  }
  process.exit(1);
}

console.log(
  `OK: theme '${theme.name}' (base ${theme.base}) with ${Object.keys(theme.tokens).length} tokens.`,
);
