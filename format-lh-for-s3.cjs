const fs = require('fs');
const path = require('path');
const manifest = require('./lhci/manifest.json');

const FINAL_DIR = './lhci/final';

// create directory for final reports if it does not exist
if (!fs.existsSync(FINAL_DIR)) {
	fs.mkdirSync(FINAL_DIR);
}

manifest.forEach(report => {
	fs.readFile(report.jsonPath, (readErr, data) => {
		if (readErr) throw readErr;

		// Get relevant data from report
		const body = JSON.parse(data);
		const relevantData = JSON.stringify({
			url: report?.url,
			fetchTime: body?.fetchTime,
			performanceScore: report?.summary?.performance,
			accessibilityScore: report?.summary?.accessibility,
			bestPracticesScore: report?.summary?.['best-practices'],
			seoScore: report?.summary?.seo,
			pwaScore: report?.summary?.pwa,
			runDuration: body?.timing?.total,
			runIsMedianResult: report?.isRepresentativeRun,
			lighthouseVersion: body?.lighthouseVersion,
			userAgent: body?.userAgent,
			formFactor: body?.configSettings?.formFactor,
			locale: body?.configSettings?.locale,
		});

		// Write final file
		const filename = path.basename(report.jsonPath);
		fs.writeFile(`${FINAL_DIR}/${filename}`, relevantData, writeErr => {
			if (writeErr) throw writeErr;
		});
	});
});
