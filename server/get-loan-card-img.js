const express = require('express');
const puppeteer = require('puppeteer');

module.exports = function personalizedCardsRouter() {
	const router = express.Router();

	router.use('/', async (req, res) => {
		// TODO: Move all of this code to an AWS cloud function that returns the image.
		// Perhaps we call the cloud function url directly for the images or keep this route as a passthrough.

		const loginId = req.query.loginId || 0;
		const dynamicLoanPage = `https://dev-vm-01.kiva.org/lend/loan-card-img?loginId=${loginId}`; // TODO subdomain

		let browser;
		let page;
		let image;

		try {
			browser = await puppeteer.launch({
				headless: true,
				ignoreHTTPSErrors: true, // for the vm, TODO: remove for prod
				args: ['--no-sandbox', '--disable-setuid-sandbox'],
			});

			page = await browser.newPage();
			await page.setViewport({ width: 1024, height: 768, deviceScaleFactor: 2 }); // double the res for 2x images
			await page.goto(dynamicLoanPage);
			await page.waitForNavigation({ waitUntil: 'load' }); // wait until all fonts and images are downloaded
			const loanCardEl = await page.$('.grid-loan-card');
			image = await loanCardEl.screenshot({ type: 'jpeg', quality: 80 });
			await page.close();
			await browser.close();

			res.set('Content-Type', 'image/jpeg');
			res.send(image);
		} catch (err) {
			console.error(err);
			if (browser) {
				browser.close();
			}
			res.sendStatus(500);
		} finally {
			// try to make sure we don't have anything sticking around in memory
			browser = null;
			page = null;
			image = null;
		}
	});

	return router;
};
