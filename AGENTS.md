# Presentation architecture

- Keep shared typography, spacing, content widths and elevation recipes in `src/styles.css`, with legacy utility aliases using the same tokens, so existing and new pages share one scale.
- Keep pixel-named spacing tokens on `:root`, not in Tailwind's spacing namespace, because legacy numeric utilities express base-unit multiples rather than literal pixels.
- Preserve compact table/navigation text and functional chart geometry when applying comfortable page and section spacing, so data-heavy views remain usable.