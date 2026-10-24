# Paper — Camillia theme

A warm paper light theme for Camillia workspaces: cream surfaces, sepia text and
a quiet amber accent — the calm of a printed page, tuned for reading-heavy work.

## What's inside

The theme is a single data file, `theme.json` (plus an optional
`preview.png`/`preview.jpg`):

```json
{
  "name": "Paper",
  "base": "light",
  "tokens": {
    "--cam-bg": "#f6f1e7",
    "--cam-accent": "#b45309"
  }
}
```

- `base` anchors the built-in light behavior (contrast, focus rings, scrolling
  shadows); `"dark"` or `"light"`.
- `tokens` overrides individual CSS custom properties on top of that base.

The token keys follow the product's `--cam-*` custom properties (`--cam-bg`,
`--cam-surface`, `--cam-text`, `--cam-accent`, `--cam-border`, …). The exact
variable catalog is finalized product-side; this theme ships a coherent core
set. Every value is a plain color or font stack — no `url(`, no `expression(`,
no `javascript:`, no `@import`, no markup — so a theme can change how the
product looks and nothing else.

## Palette

| Token | Value | Role |
|---|---|---|
| `--cam-bg` | `#f6f1e7` | app background, warm cream |
| `--cam-surface` | `#fdfaf3` | panels and cards |
| `--cam-surface-raised` | `#ffffff` | popovers, modals, hover states |
| `--cam-text` | `#3f382a` | primary text, warm sepia |
| `--cam-text-muted` | `#8a7d63` | secondary text and labels |
| `--cam-accent` | `#b45309` | primary actions, links, focus — amber |
| `--cam-accent-strong` | `#92400e` | accent hover/active |
| `--cam-on-accent` | `#fffaf0` | text on accent surfaces |
| `--cam-border` | `#e4d9c3` | hairlines and separators |
| `--cam-success` | `#4d7c0f` | success states, olive green |
| `--cam-danger` | `#b91c1c` | destructive and error states |
| `--cam-font-base` | `Georgia, 'Times New Roman', serif` | reading font, book serif |

## How to use

Install from the Camillia Community Hub, then pick **Paper** in the workspace's
appearance settings, alongside the built-in light/dark choice.

## Validation

`node scripts/validate.mjs` checks `hub.json` and the theme contract: parseable
`theme.json`, `base` dark|light, at most 64 tokens, `--*` token keys, plain
color/font-stack values, and the closed file set (`theme.json` plus optional
`preview.png`/`preview.jpg`). CI runs it on every push.

## License

MIT — see [LICENSE](LICENSE).
