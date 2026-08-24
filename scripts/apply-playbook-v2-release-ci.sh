#!/usr/bin/env bash
set -euo pipefail

BRANCH="codex/managed-service-clarity-20260824"
PAYLOAD_SHA="95d3b6bb6f7db9f65134fb2abcd59d4403cd50c993cf6d4940ba96ecbde8fbef"

mkdir -p /tmp/playbook-v2-release
cat tmp/playbook-v2-release/part-* > /tmp/playbook-v2-release/payload.b64
base64 --decode /tmp/playbook-v2-release/payload.b64 > /tmp/playbook-v2-release/payload.tar.xz
echo "$PAYLOAD_SHA  /tmp/playbook-v2-release/payload.tar.xz" | sha256sum --check --strict
tar -tJf /tmp/playbook-v2-release/payload.tar.xz
tar -xJf /tmp/playbook-v2-release/payload.tar.xz -C .

cat > content/campaign-market-positioning.ts <<'EOF'
import "@/content/spanish-market-positioning";
import { relaunchCopy } from "@/content/relaunch-copy";
import type { Locale } from "@/lib/i18n";

const campaignMarketCopy: Record<Locale, { d: string; g: string }> = {
  de: {
    d: "Zielgruppengenaue Kampagnen in DACH, der EU und ausgewählten internationalen Märkten.",
    g: "Reichweite bei kaufbereiten Zielgruppen – in DACH, europaweit und international, statt bei unverbindlichen Klicks."
  },
  en: {
    d: "Precisely targeted campaigns across Ireland, the UK, the EU and selected international markets.",
    g: "Reach among ready-to-buy audiences – in Ireland, the UK, across the EU and internationally, not low-intent clicks."
  },
  es: {
    d: "Campañas segmentadas para España, la Unión Europea y mercados internacionales seleccionados.",
    g: "Alcance entre públicos con intención real de compra, en España, en la UE y en mercados internacionales."
  }
};

(["de", "en", "es"] as const).forEach((locale) => {
  const steps = relaunchCopy[locale].steps as unknown as Array<{ n: string; t: string; d: string; g: string }>;
  const index = steps.findIndex((step) => step.n === "04");
  if (index >= 0) steps[index] = { ...steps[index], ...campaignMarketCopy[locale] };
});
EOF

cat > components/relaunch/RelaunchHomePage.tsx <<'EOF'
import "@/content/campaign-market-positioning";
export { RelaunchHomePageManaged as RelaunchHomePage } from "@/components/relaunch/RelaunchHomePageManaged";
EOF

node scripts/apply-playbook-selection-v2.mjs

python - <<'PY'
from pathlib import Path

route = Path("app/api/playbook/route.ts")
source = route.read_text(encoding="utf-8")
old = "const unique = [...new Set(value)];"
new = "const unique = Array.from(new Set(value));"
if old not in source:
    raise SystemExit("Expected Set spread in Playbook route was not found")
route.write_text(source.replace(old, new, 1), encoding="utf-8")
PY

npm install --package-lock-only --ignore-scripts --no-audit --no-fund
npm ci --no-audit --no-fund
python scripts/render-playbook-v2.py .

cp public/playbooks/novalure-project-demand-de.pdf public/playbooks/bautraeger-pipeline-playbook-de.pdf
cp public/playbooks/novalure-owned-demand-de.pdf public/playbooks/makler-lead-playbook-de.pdf
cp public/playbooks/novalure-project-demand-en.pdf public/playbooks/developer-pipeline-playbook-en.pdf
cp public/playbooks/novalure-owned-demand-en.pdf public/playbooks/real-estate-agent-lead-playbook-en.pdf
cp public/playbooks/novalure-project-demand-es.pdf public/playbooks/novalure-playbook-promotores-es.pdf
cp public/playbooks/novalure-owned-demand-es.pdf public/playbooks/novalure-playbook-agencias-inmobiliarias-es.pdf
cp public/playbooks/covers/novalure-project-demand-de.png public/playbooks/covers/bautraeger-de-cover.png
cp public/playbooks/covers/novalure-owned-demand-de.png public/playbooks/covers/makler-de-cover.png
cp public/playbooks/covers/novalure-project-demand-en.png public/playbooks/covers/developer-en-cover.png
cp public/playbooks/covers/novalure-owned-demand-en.png public/playbooks/covers/agent-en-cover.png
cp public/playbooks/covers/novalure-project-demand-es.png public/playbooks/covers/promotores-es-cover.png
cp public/playbooks/covers/novalure-owned-demand-es.png public/playbooks/covers/agencias-es-cover.png

python - <<'PY'
from pathlib import Path
from pypdf import PdfReader
stems = [
    "novalure-project-demand-de", "novalure-owned-demand-de", "novalure-international-buyers-de",
    "novalure-project-demand-en", "novalure-owned-demand-en", "novalure-international-buyers-en",
    "novalure-project-demand-es", "novalure-owned-demand-es", "novalure-international-buyers-es",
]
for stem in stems:
    path = Path("public/playbooks") / f"{stem}.pdf"
    reader = PdfReader(str(path))
    if len(reader.pages) != 10:
        raise SystemExit(f"{path} has {len(reader.pages)} pages instead of 10")
    for index, page in enumerate(reader.pages, 1):
        width = float(page.mediabox.width)
        height = float(page.mediabox.height)
        if abs(width - 595.28) > 2 or abs(height - 841.89) > 2:
            raise SystemExit(f"{path} page {index} is not A4: {width} x {height}")
print("All nine Playbooks contain ten A4 pages.")
PY

npm run verify:playbooks
npm test
npm run lint
npm run typecheck
npm audit --audit-level=moderate
npm audit --omit=dev --audit-level=moderate
npm run build
npm run verify:managed-service

rm -f .codex/playbook-v2-payload.part-000 .codex/v2-000 .codex/v2-test4000
rm -rf tmp/playbook-suite-payload tmp/playbook-v2-release
rm -f tmp/playbook-suite-inspection.txt
rm -f .github/workflows/inspect-playbook-suite-payload.yml
rm -f .github/workflows/apply-playbook-v2-release.yml
rm -f .github/workflows/apply-playbook-v2-release-pr.yml
rm -f scripts/apply-playbook-v2-release-ci.sh

git config user.name "github-actions[bot]"
git config user.email "41898282+github-actions[bot]@users.noreply.github.com"
git add -A
if git diff --cached --quiet; then
  echo "No release changes to commit."
  exit 0
fi
git commit -m "Release multilingual Playbook V2 selection and delivery"
git push origin "HEAD:$BRANCH"
