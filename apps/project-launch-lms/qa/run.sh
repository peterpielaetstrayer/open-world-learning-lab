#!/usr/bin/env bash
set -euo pipefail
umask 077
app="$PWD"
scratch="$(mktemp -d)"
server_pid=
cleanup() {
  if [[ -n "$server_pid" ]]; then kill "$server_pid" 2>/dev/null || true; fi
  if [[ -f "$scratch/supabase/config.toml" ]]; then
    (cd "$scratch" && supabase stop --no-backup >"$scratch/stop.log" 2>&1) || true
  fi
  rm -f -- "$scratch/supabase/seed.sql" "$scratch/status.json" "$scratch/accounts.json"
}
trap cleanup EXIT
unset SUPABASE_ACCESS_TOKEN SUPABASE_DB_PASSWORD SUPABASE_URL NEXT_PUBLIC_SUPABASE_URL
unset SUPABASE_SERVICE_ROLE_KEY NEXT_PUBLIC_SUPABASE_PUBLISHABLE_KEY DEBUG
cd "$scratch"
supabase init >/dev/null
sed -i -E 's/^major_version = .*/major_version = 17/' supabase/config.toml
sed -i -E 's/^project_id = .*/project_id = "pll-acceptance"/' supabase/config.toml
mkdir -p supabase/migrations
cd "$app"
node qa/rebuild.mjs "$scratch/supabase/migrations" "$scratch/supabase/seed.sql"
unset PLL_QA_COURSE_SEED
cd "$scratch"
if ! supabase start -x studio,imgproxy,edge-runtime,logflare,vector,supavisor >"$scratch/start.log" 2>&1; then
  echo "Supabase start failed. Diagnostics are available in the encrypted report."
  if [[ -n "${PLL_QA_REPORT_KEY:-}" ]]; then
    tar -cz -C "$scratch" start.log | openssl enc -aes-256-cbc -pbkdf2 -salt -pass env:PLL_QA_REPORT_KEY -out "$RUNNER_TEMP/pll-report.enc"
  fi
  exit 1
fi
supabase status -o json >"$scratch/status.json" 2>"$scratch/status.log"
cd "$app"
export PLL_QA_SCRATCH="$scratch"
node qa/prepare.mjs
source "$scratch/local.env"
export NEXT_PUBLIC_SUPABASE_URL NEXT_PUBLIC_SUPABASE_PUBLISHABLE_KEY
npm run build >"$scratch/build.log" 2>&1
./node_modules/.bin/next start --hostname 127.0.0.1 --port 3000 >"$scratch/server.log" 2>&1 &
server_pid=$!
for _ in {1..60}; do
  if curl -fsS http://127.0.0.1:3000/login >/dev/null 2>&1; then break; fi
  sleep 1
done
results=0
node qa/browser.mjs >"$scratch/results.log" 2>&1 || results=$?
if [[ -n "${PLL_QA_REPORT_KEY:-}" ]]; then
  tar -cz --exclude=seed.sql --exclude=status.json --exclude=accounts.json --exclude=local.env \
    --exclude=supabase -C "$scratch" . |
    openssl enc -aes-256-cbc -pbkdf2 -salt -pass env:PLL_QA_REPORT_KEY -out "$RUNNER_TEMP/pll-report.enc"
fi
sed -n '/^PASS: /p; /^FAIL: /p' "$scratch/results.log"
exit "$results"
