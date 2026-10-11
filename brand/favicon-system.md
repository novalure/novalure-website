# NovaLure favicon system

The mark is a compact, custom `n.` derived from the NovaLure wordmark. Its navy background and white letter stay identical across all divisions. Only the outline and period use the division's accent color.

| Variant | Accent | File |
| --- | --- | --- |
| Blue (main website) | `#5B83FF` | `public/favicons/blue.svg` |
| Teal | `#30BFA6` | `public/favicons/teal.svg` |
| Coral | `#E97876` | `public/favicons/coral.svg` |
| Violet | `#AD8BF2` | `public/favicons/violet.svg` |
| Gold | `#D6A44E` | `public/favicons/gold.svg` |

The main website uses `public/favicon.svg`, `public/favicon.ico`, the 16/32 px PNGs, and the Apple touch icon. All are generated from the blue variant by `npm run generate:favicons`. To assign a new division, choose one of the variants or add its accent to `scripts/generate-favicons.mjs` and regenerate. Do not alter the mark, dimensions, or navy background between divisions.
