# Main Color Scheme

**_"--" notation means defined as custom Tailwind CSS variable in `globals.css`_**

## Slate (Primary neutrals)

- `--slate-50`: #f8fafc
- `--slate-100`: #f1f5f9
- `--slate-200`: #e2e8f0
- `--slate-300`: #cbd5e1
- `--slate-400`: #94a3b8
- `--slate-500`: #64748b
- `--slate-600`: #475569
- `--slate-700`: #334155
- `--slate-800`: #1e293b
- `--slate-900`: #1e293b
- `--slate-950`: #020617

These form the neutral scale used for backgrounds, borders, and muted text.

## Forge (Accent / Brand)

- `--forge-orange`: #f97316
- `--forge-ember`: #ff6b35
- `--forge-ember-light`: #ff8c42

## Recommended variable mappings

- Dark background: `--slate-950` (#020617)
- App surface / page background (light): `--slate-50` (#f8fafc)
- Card / secondary surface: `--slate-100` (#f1f5f9) or `--slate-200` (#e2e8f0)
- Primary text (on light): `#0f172a` (recommended: `--slate-800` / `#1e293b`)
- Muted text / secondary copy: `--slate-500` (#64748b) or `--slate-600` (#475569)
- Brand main (buttons, highlights): `--forge-orange` (#f97316)
- Brand emphasis / badges: `--forge-ember` (#ff6b35)

Add or adjust Tailwind variables in `globals.css` to match these tokens.
