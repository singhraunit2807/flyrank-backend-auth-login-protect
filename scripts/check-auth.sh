#!/usr/bin/env bash
set -euo pipefail

BASE_URL="${BASE_URL:-http://localhost:3000}"
EMAIL="${EMAIL:-test@example.com}"
PASSWORD="${PASSWORD:-password123}"

printf '\n1) Public route\n'
curl -i "$BASE_URL/public/info"

printf '\n2) Protected route without token (expect 401)\n'
curl -i "$BASE_URL/protected/profile"

printf '\n3) Signup (expect 201 on a fresh account)\n'
curl -i -X POST "$BASE_URL/auth/signup" \
  -H 'Content-Type: application/json' \
  -d "{\"email\":\"$EMAIL\",\"password\":\"$PASSWORD\"}"

printf '\n4) Login — copy access_token from the response\n'
curl -i -X POST "$BASE_URL/auth/login" \
  -H 'Content-Type: application/json' \
  -d "{\"email\":\"$EMAIL\",\"password\":\"$PASSWORD\"}"

echo
printf 'Set TOKEN manually, then run:\n'
echo 'TOKEN="paste-access-token-here"'
echo "curl -i $BASE_URL/protected/profile -H \"Authorization: Bearer \$TOKEN\""
echo "curl -i $BASE_URL/protected/profile -H \"Authorization: Bearer tampered-\$TOKEN\""
echo "curl -i -X POST $BASE_URL/auth/logout -H \"Authorization: Bearer \$TOKEN\""
