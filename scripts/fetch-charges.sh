#!/usr/bin/env bash
# Fetch every successful GBP Stripe charge, shared by the donation-total
# step and the thank-you email script so the filter lives in one place.
# Writes a JSON array of charge objects to the file given as $1 — kept off
# stdout so donor details never appear in Action logs.
set -euo pipefail

out="${1:?usage: fetch-charges.sh <output-file>}"
if [ -z "${STRIPE_KEY:-}" ]; then
  echo "STRIPE_KEY env var is not set." >&2
  exit 1
fi

charges="[]"
starting_after=""
while true; do
  url="https://api.stripe.com/v1/charges?limit=100"
  if [ -n "$starting_after" ]; then
    url="${url}&starting_after=${starting_after}"
  fi
  response=$(curl --silent --show-error --user "${STRIPE_KEY}:" "$url")
  if [ "$(echo "$response" | jq 'has("error")')" = "true" ]; then
    echo "Stripe API error: $(echo "$response" | jq -r '.error.message')" >&2
    exit 1
  fi
  page=$(echo "$response" | jq '[.data[] | select(.paid == true and .status == "succeeded" and .currency == "gbp")]')
  charges=$(jq --null-input --argjson a "$charges" --argjson b "$page" '$a + $b')
  if [ "$(echo "$response" | jq -r '.has_more')" != "true" ]; then
    break
  fi
  starting_after=$(echo "$response" | jq -r '.data[-1].id')
done

printf '%s\n' "$charges" > "$out"
echo "Fetched $(printf '%s' "$charges" | jq 'length') successful GBP charges."
