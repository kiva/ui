// @vitest-environment node
import fs from 'fs';
import os from 'os';
import path from 'path';
import { spawnSync } from 'child_process';
import { fileURLToPath } from 'url';

const SCRIPT = path.resolve(
	fileURLToPath(new URL('.', import.meta.url)),
	'../../../../scripts/lighthouse-collect.sh',
);

/*
 * These stubs are bash rather than a JS mock because the subject under test is a shell script run
 * in its own process: the only seam available is what it finds on PATH, so the fake has to be a
 * real executable. The lhci stub reproduces the failure shape of the actual CLI, which saves each
 * run's report as it completes and only then throws. That ordering is what leaves partial reports
 * on disk for `--additive` to stack, so reproducing it here is what gives the cleanup assertions
 * something real to catch.
 */
const STUB_LHCI = `#!/usr/bin/env bash
cmd="$1"; shift
# Only collect is modelled; healthcheck, assert and upload are no-ops.
[ "$cmd" = "collect" ] || exit 0
url=""
for a in "$@"; do case "$a" in --url=*) url="\${a#--url=}" ;; esac; done
# Filename-safe form of the URL, used to key both attempt state and report names.
key="$(printf '%s' "$url" | tr -c 'a-zA-Z0-9' '_')"
mkdir -p "$STUB_STATE"
# Attempt number for this URL, carried across invocations on disk.
n=$(cat "$STUB_STATE/$key" 2>/dev/null || echo 0); n=$((n + 1)); echo "$n" > "$STUB_STATE/$key"
fail_for=$(awk -v u="$url" '$1==u{print $2}' "$STUB_FAILURES" 2>/dev/null); fail_for="\${fail_for:-0}"
mkdir -p .lighthouseci
/bin/sleep 0.05
# A failing attempt writes 2 of the 5 reports, then errors the way a PSI 500 does.
if [ "$n" -le "$fail_for" ]; then
  touch ".lighthouseci/lhr-\${key}-a\${n}-r1.json" ".lighthouseci/lhr-\${key}-a\${n}-r2.json"
  echo "PSI Failed (500): Lighthouse returned error: Something went wrong." >&2
  exit 1
fi
for r in 1 2 3 4 5; do touch ".lighthouseci/lhr-\${key}-a\${n}-r\${r}.json"; done
exit 0
`;

// Records each backoff duration instead of waiting it out.
const STUB_SLEEP = `#!/usr/bin/env bash
echo "$1" >> "$STUB_SLEEP_LOG"
`;

const writeExecutable = (file, contents) => {
	fs.writeFileSync(file, contents);
	fs.chmodSync(file, 0o755);
};

const reportsByUrl = workDir => {
	const dir = path.join(workDir, '.lighthouseci');
	if (!fs.existsSync(dir)) return {};
	return fs.readdirSync(dir).reduce((counts, file) => {
		const key = file.replace(/^lhr-/, '').replace(/-a\d+-r\d+\.json$/, '');
		return { ...counts, [key]: (counts[key] ?? 0) + 1 };
	}, {});
};

// Runs the real script against a stub lhci whose failures are scripted per URL.
const runCollect = ({ urls, failures = {} }) => {
	const workDir = fs.mkdtempSync(path.join(os.tmpdir(), 'lhci-collect-'));
	const binDir = path.join(workDir, 'bin');
	const stateDir = path.join(workDir, 'state');
	const failureSpec = path.join(workDir, 'failures.txt');
	const summaryFile = path.join(workDir, 'summary.md');
	const sleepLog = path.join(workDir, 'sleeps.txt');
	fs.mkdirSync(binDir);

	const config = JSON.stringify({ ci: { collect: { url: urls } } });
	fs.writeFileSync(path.join(workDir, 'config.cjs'), `module.exports = ${config};\n`);
	fs.writeFileSync(failureSpec, Object.entries(failures).map(([url, count]) => `${url}\t${count}`).join('\n'));
	fs.writeFileSync(summaryFile, '');
	fs.writeFileSync(sleepLog, '');
	writeExecutable(path.join(binDir, 'lhci'), STUB_LHCI);
	writeExecutable(path.join(binDir, 'sleep'), STUB_SLEEP);

	const result = spawnSync('bash', [SCRIPT, './config.cjs'], {
		cwd: workDir,
		encoding: 'utf8',
		env: {
			...process.env,
			PATH: `${binDir}:${process.env.PATH}`,
			GITHUB_STEP_SUMMARY: summaryFile,
			STUB_FAILURES: failureSpec,
			STUB_STATE: stateDir,
			STUB_SLEEP_LOG: sleepLog,
		},
	});

	return {
		workDir,
		status: result.status,
		output: `${result.stdout}${result.stderr}`,
		summary: fs.readFileSync(summaryFile, 'utf8'),
		backoffs: fs.readFileSync(sleepLog, 'utf8').split('\n').filter(Boolean),
		reports: reportsByUrl(workDir),
	};
};

const cleanupDirs = [];
const collect = args => {
	const run = runCollect(args);
	cleanupDirs.push(run.workDir);
	return run;
};

afterEach(() => {
	while (cleanupDirs.length) fs.rmSync(cleanupDirs.pop(), { recursive: true, force: true });
});

describe('lighthouse-collect.sh', () => {
	it('collects every URL when PSI is healthy', () => {
		const run = collect({ urls: ['https://www.kiva.org/', 'https://www.kiva.org/about'] });

		expect(run.status).toBe(0);
		expect(run.reports).toEqual({ https___www_kiva_org_: 5, https___www_kiva_org_about: 5 });
		expect(run.summary).toContain('Collected 2 of 2 URLs.');
	});

	it('discards the partial reports a failed attempt left behind before retrying', () => {
		const run = collect({
			urls: ['https://www.kiva.org/', 'https://www.kiva.org/about'],
			failures: { 'https://www.kiva.org/about': 2 },
		});

		expect(run.status).toBe(0);
		expect(run.reports.https___www_kiva_org_about).toBe(5);
		expect(run.backoffs).toEqual(['30', '60']);
		expect(run.summary).toContain('Collected 2 of 2 URLs.');
	});

	it('drops a URL that exhausts every attempt without discarding the other URLs', () => {
		const run = collect({
			urls: ['https://www.kiva.org/', 'https://www.kiva.org/about'],
			failures: { 'https://www.kiva.org/about': 4 },
		});

		expect(run.status).toBe(0);
		expect(run.reports).toEqual({ https___www_kiva_org_: 5 });
		expect(run.backoffs).toEqual(['30', '60', '120']);
		expect(run.output).toContain('::warning');
		expect(run.summary).toContain('Collected 1 of 2 URLs.');
		expect(run.summary).toContain('- https://www.kiva.org/about');
	});

	it('stops the run when the first URL exhausts every attempt', () => {
		const run = collect({
			urls: ['https://www.kiva.org/', 'https://www.kiva.org/about'],
			failures: { 'https://www.kiva.org/': 4 },
		});

		expect(run.status).toBe(1);
		expect(run.output).toContain('failed all 4 attempts as the first URL');
		expect(run.reports).toEqual({});
		expect(run.summary).toBe('');
	});

	it('fails when the config lists no URLs', () => {
		const run = collect({ urls: [] });

		expect(run.status).toBe(1);
		expect(run.output).toContain('No URLs read from');
	});
});
