/* eslint-disable global-require, no-console */
const istanbulCoverage = require('istanbul-lib-coverage');
const istanbulReport = require('istanbul-lib-report');
const istanbulReports = require('istanbul-reports');

const emptyFiles = {};
const mappedFilenames = new Set();
const map = istanbulCoverage.createCoverageMap();

console.log('Loading coverage reports...');
const coverageReports = [
	// require('./e2e/coverage/coverage-final.json'),
	require('./unit/coverage/coverage-final.json'),
];

// Add/merge files from each coverage report to the coverage map
console.log('Merging coverage reports...');
coverageReports.forEach(report => {
	Object.values(report).forEach(file => {
		if (Object.keys(file.branchMap || {}).length > 0) {
			// If file has coverage, add it to the coverage map
			map.addFileCoverage(file);
			mappedFilenames.add(file.path);
		} else if (!emptyFiles[file.path]) {
			// If the file has no coverage and it's not in the empty file list, add it to the empty file list
			emptyFiles[file.path] = file;
		}
	});
});

// Add empty files to coverage map only if they haven't already been added.
// Attempting to add empty files to the coverage map when the file is alredy in the coverage map results in this error:
// ui/node_modules/istanbul-reports/lib/lcovonly/index.js:53
//     const { line } = meta.loc.start;
//                           ^
// TypeError: Cannot read property 'loc' of undefined
console.log('Adding empty files...');
Object.keys(emptyFiles)
	.filter(filename => !mappedFilenames.has(filename))
	.forEach(filename => {
		map.addFileCoverage(emptyFiles[filename]);
	});

// Create combined coverage report
console.log('Creating combined coverage report...');
const context = istanbulReport.createContext({
	coverageMap: map,
	dir: 'test/coverage',
});
istanbulReports.create('lcov', {}).execute(context);

console.log('Coverage report created at test/coverage/lcov.info');
