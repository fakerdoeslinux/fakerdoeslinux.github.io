#!/usr/bin/env bash
# Publish this folder to GitHub Pages with the GitHub CLI.
set -euo pipefail
cd "$(dirname "$0")"

if ! command -v gh >/dev/null 2>&1; then
  echo "GitHub CLI (gh) is required: https://cli.github.com/" >&2
  exit 1
fi

if ! gh auth status >/dev/null 2>&1; then
  echo "Not signed in. Run 'gh auth login' first." >&2
  exit 1
fi

LOGIN="$(gh api user --jq .login)"
REPO="${1:-${LOGIN}.github.io}"

if [ ! -d .git ]; then
  git init -b main
fi

# Make the first commit possible even if git has no global identity.
if ! git config user.email >/dev/null 2>&1; then
  GH_ID="$(gh api user --jq .id)"
  git config user.name "${LOGIN}"
  git config user.email "${GH_ID}+${LOGIN}@users.noreply.github.com"
fi

git add -A
if ! git diff --cached --quiet; then
  git commit -m "Publish project site"
fi

if gh repo view "${LOGIN}/${REPO}" >/dev/null 2>&1; then
  if ! git remote get-url origin >/dev/null 2>&1; then
    git remote add origin "https://github.com/${LOGIN}/${REPO}.git"
  fi
  git push -u origin main
else
  gh repo create "${REPO}" --public --source=. --remote=origin --push \
    --description "BlackOnBlue project site"
fi

# Turn on Pages from main/(root). A failed POST usually means Pages already exists.
gh api --method POST "repos/${LOGIN}/${REPO}/pages" \
  -f 'source[branch]=main' -f 'source[path]=/' >/dev/null 2>&1 || \
gh api --method PUT "repos/${LOGIN}/${REPO}/pages" \
  -f 'source[branch]=main' -f 'source[path]=/' >/dev/null 2>&1 || true

echo
echo "Repository: https://github.com/${LOGIN}/${REPO}"
if [ "${REPO}" = "${LOGIN}.github.io" ]; then
  echo "Site:       https://${LOGIN}.github.io/"
else
  echo "Site:       https://${LOGIN}.github.io/${REPO}/"
fi
echo "Pages can take a minute to build the first time."
