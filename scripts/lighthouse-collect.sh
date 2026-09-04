#!/usr/bin/env bash
set -euo pipefail

config="${1:?usage: lighthouse-collect.sh <lighthouserc path>}"
# Absolute form of the config argument, for the require() below.
config_path="$(cd "$(dirname "${config}")" && pwd)/$(basename "${config}")"
# The job summary when running in Actions, a throwaway file otherwise.
summary_file="${GITHUB_STEP_SUMMARY:-/dev/null}"

max_attempts=4
backoffs=(30 60 120)
collected=0
dropped=()
index=0

# Empty the directory that --additive accumulates reports into.
rm -rf .lighthouseci

# One URL per line from the config's collect.url list, blank lines removed.
urls=()
while IFS= read -r line; do
  urls+=("${line}")
done < <(node -e "require('${config_path}').ci.collect.url.forEach(u => console.log(u))" | grep -v '^[[:space:]]*$')
if [ "${#urls[@]}" -eq 0 ]; then
  echo "::error::No URLs read from ${config}"
  exit 1
fi

# Collect each URL on its own, retrying that URL alone when it fails.
for url in "${urls[@]}"; do
  index=$((index + 1))
  attempt=1
  while true; do
    # Timestamp reference for whatever reports this attempt writes.
    marker="$(mktemp)"
    echo "::group::Collect ${url} (attempt ${attempt}/${max_attempts})"
    if lhci collect --config="${config}" --url="${url}" --additive; then
      echo "::endgroup::"
      rm -f "${marker}"
      collected=$((collected + 1))
      break
    fi
    echo "::endgroup::"

    # Discard the reports the failed attempt had already written.
    if [ -d .lighthouseci ]; then
      find .lighthouseci -type f -newer "${marker}" -delete
    fi
    rm -f "${marker}"

    if [ "${attempt}" -ge "${max_attempts}" ]; then
      # A first URL that never collects ends the run instead of being dropped.
      if [ "${index}" -eq 1 ]; then
        echo "::error::${url} failed all ${max_attempts} attempts as the first URL, so the run is treated as broken rather than flaky"
        exit 1
      fi
      # Record the URL as dropped and carry on with the remaining ones.
      echo "::warning title=Lighthouse collect dropped a URL::${url} failed all ${max_attempts} attempts"
      dropped+=("${url}")
      break
    fi

    # Wait longer before each successive retry.
    sleep "${backoffs[attempt - 1]}"
    attempt=$((attempt + 1))
  done
done

# Report the collected and dropped tallies on the job summary.
{
  echo "### Lighthouse CI PROD"
  echo ""
  echo "Collected ${collected} of ${#urls[@]} URLs."
  if [ "${#dropped[@]}" -gt 0 ]; then
    echo ""
    echo "Dropped after ${max_attempts} attempts:"
    echo ""
    printf -- '- %s\n' "${dropped[@]}"
  fi
} >> "${summary_file}"
