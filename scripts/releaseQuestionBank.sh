#!/usr/bin/env bash
set -euo pipefail

cd "$(dirname "$0")/.."
[[ "$(git branch --show-current)" == "main" ]] || {
  printf '%s\n' "Stop: this release is intended for main." >&2
  exit 1
}
[[ "$(git remote get-url origin)" == "https://github.com/vn9ttrkd54-ui/MAO-practice.git" ]] || {
  printf '%s\n' "Stop: origin is not the reviewed MAO-practice repository." >&2
  exit 1
}
if ! git diff --cached --quiet; then
  printf '%s\n' "Stop: there are already staged changes. Review them separately before running this release." >&2
  exit 1
fi

# Only the question-bank work reviewed in this chat, not unrelated pending work.
paths=(
  AGENTS.md
  components/math/MathText.tsx
  components/practice/question-detail.module.css
  components/multiplayer/MatchQuestion.tsx
  components/multiplayer/MatchResults.tsx
  components/multiplayer/SpectatorView.tsx
  data/questions/mu.ts
  data/question-references/README.md
  data/question-references/muNationals.ts
  docs/chiles-statewide-2025-audit.md
  docs/february-regional-2026-audit.md
  docs/february-regional-2025-audit.md
  docs/february-regional-2024-audit.md
  docs/january-regional-2025-audit.md
  docs/january-invitational-2024-audit.md
  docs/january-regional-2024-audit.md
  docs/january-regional-2026-audit.md
  docs/january-statewide-2026-audit.md
  docs/king-statewide-2025-audit.md
  docs/king-statewide-2024-audit.md
  docs/march-regional-2026-audit.md
  docs/march-regional-2025-audit.md
  docs/march-regional-2024-audit.md
  docs/mu-national-permission.md
  docs/state-convention-2024-audit.md
  docs/state-convention-2025-audit.md
  docs/state-convention-2026-audit.md
  public/questions/mu-146-original.svg
  public/questions/mu-194-original-solution.svg
  public/questions/mu-196-original-solution.svg
  public/questions/mu-201-original-solution.svg
  public/questions/mu-207-210-original.svg
  public/questions/mu-217-original-solution.svg
  public/questions/mu-227-original-solution.svg
  public/questions/mu-238-240-original.svg
  public/questions/mu-250-original.svg
  public/questions/mu-302-solution.svg
  public/questions/mu-313-solution.svg
  public/questions/mu-320-solution.svg
  public/questions/mu-325-solution.svg
  public/questions/mu-336-338-original.svg
  public/questions/mu-345-original-solution.svg
  public/questions/mu-348-original.svg
  public/questions/mu-360-362-original.svg
  public/questions/mu-442-444-original.svg
  public/questions/mu-483-table.svg
  public/questions/mu-502-fold.svg
  public/questions/mu-502-solution.svg
  public/questions/mu-554-parabolas.svg
  public/questions/mu-558-solution.svg
  public/questions/mu-march-regional-2024-function.svg
  public/questions/mu-march-regional-2024-derivative.svg
  public/questions/mu-march-regional-2024-table.svg
  tests/browserFixtures/questionSources.tsx
  tests/integralPropertiesLabels.test.mjs
  tests/questionVectors.test.mjs
  tests/mu2024Source.test.mjs
  tests/mu2024State.test.mjs
  tests/muChilesStatewide2025.test.mjs
  tests/muFebruaryRegional2026.test.mjs
  tests/muFebruaryRegional2025.test.mjs
  tests/muFebruaryRegional2024.test.mjs
  tests/muFebruaryStatewide2026.test.mjs
  tests/muJanuaryRegional2025.test.mjs
  tests/muJanuaryInvitational2024.test.mjs
  tests/muJanuaryRegional2024.test.mjs
  tests/muJanuaryRegional2026.test.mjs
  tests/muJanuaryState.test.mjs
  tests/muKingStatewide2025.test.mjs
  tests/muKingStatewide2024.test.mjs
  tests/muMarchRegional2026.test.mjs
  tests/muMarchRegional2025.test.mjs
  tests/muMarchRegional2024.test.mjs
  tests/muNationalPublication.test.mjs
  tests/muStateConvention2024.test.mjs
  tests/muStateConvention2025.test.mjs
  tests/muStateConvention2026.test.mjs
  tests/multiplayerRoundFeedback.test.mjs
  tests/questionLabelConsistency.test.mjs
  tests/questionSources.browser.mjs
  tests/trainerPerformance.test.mjs
  scripts/releaseQuestionBank.sh
)
for path in "${paths[@]}"; do
  [[ -f "$path" ]] || {
    printf 'Stop: expected release file is missing: %s\n' "$path" >&2
    exit 1
  }
done

node --experimental-strip-types --test tests/*.test.mjs
npm run build -- --webpack
git diff --check -- "${paths[@]}"
git add -- "${paths[@]}"
# Include deleted raster counterparts of the explicitly reviewed SVG assets.
for path in "${paths[@]}"; do
  if [[ "$path" == public/questions/*.svg ]]; then
    png="${path%.svg}.png"
    if [[ ! -e "$png" ]] && git ls-files --error-unmatch -- "$png" >/dev/null 2>&1; then
      git add -u -- "$png"
    fi
  fi
done
git diff --cached --check
if git diff --cached --quiet; then
  printf '%s\n' "No question-bank changes remain to commit." >&2
  exit 1
fi
git diff --cached --stat
git commit -m "Update Mu question bank, source reviews, and national publication hold"
git push origin main
printf '%s\n' "Pushed question-bank work to origin/main. If main is your hosting production branch, its Git integration will deploy this commit. Verify the hosting deployment before treating the changes as live."
