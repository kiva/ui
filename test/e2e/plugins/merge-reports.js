const path = require('path');
const { mergeFiles } = require('junit-report-merger');

/* eslint-disable no-console */
module.exports = on => {
	// Merge together junit reports from all spec files into single junit report
	on('after:run', results => {
		if (results) {
			console.log('Merging test result reports...');

			const outputFile = path.join(__dirname, '..', 'results', 'combined.xml');
			const inputFiles = [`${__dirname}/../results/*.xml`];
			const options = {
				onFileMatched: ({ filePath }) => {
					console.log(`Merging: ${filePath}`);
				}
			};

			mergeFiles(outputFile, inputFiles, options).then(() => {
				console.log(`Merged report generated at ${outputFile}`);
			}).catch(e => {
				console.error(e);
			});
		} else {
			console.log('Skipping report merging (no test results)');
		}
	});
};
