const path = require('path');
const { mergeFiles } = require('junit-report-merger');
const rimraf = require('rimraf');

/* eslint-disable no-console */
module.exports = on => {
	const reportFileGlob = `${__dirname}/../results/*.xml`;
	const combinedReportPath = path.join(__dirname, '..', 'results', 'combined.xml');

	// Delete any existing reports before the run starts
	on('before:run', () => {
		console.log('Deleting old test result reports...');

		return new Promise((resolve, reject) => {
			rimraf(reportFileGlob, err => {
				if (err) {
					console.error('Error while deleting old test result reports:', err);
					reject(err);
				} else {
					console.log('Deleted old test result reports');
					resolve();
				}
			});
		});
	});

	// Merge together junit reports from all spec files into single junit report
	on('after:run', results => {
		if (!results) {
			console.log('Skipping report merging (no test results)');
			return Promise.resolve();
		}

		console.log('Merging test result reports...');

		const options = {
			onFileMatched: ({ filePath }) => {
				console.log(`Merging: ${filePath}`);
			}
		};

		return mergeFiles(combinedReportPath, [reportFileGlob], options).then(() => {
			console.log(`Merged report generated at ${combinedReportPath}`);
		}).catch(e => {
			console.error(e);
		});
	});
};
