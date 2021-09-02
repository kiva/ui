const express = require('express');
const log = require('./util/log');
const memJsUtils = require('./util/memJsUtils');
const drawLoanCard = require('./util/live-loan/live-loan-draw');
const fetchLoansByType = require('./util/live-loan/live-loan-fetch');

async function fetchRecommendedLoans(type, id, cache) {
	// If we have loan data in memjscache return that quickly
	try {
		const cachedLoanData = await memJsUtils.getFromCache(`recommendations-by-${type}-id-${id}`, cache);
		if (cachedLoanData) {
			return JSON.parse(cachedLoanData);
		}
	} catch (err) {
		log(`Error reading from memjs, ${err}`, 'error');
	}

	// Otherwise we need to hit the graphql endpoint.
	const loanData = await fetchLoansByType(type, id);

	// Set the loan data in memcache, return the loan data
	if (loanData.length) {
		const expires = 10 * 60; // 10 minutes
		memJsUtils.setToCache(`recommendations-by-${type}-id-${id}`, JSON.stringify(loanData), expires, cache)
			.catch(err => {
				log(`Error setting loan data to cache, ${err}`, 'error');
			});
		// Return before setting to the cache completes to speed up response times
		return loanData;
	}

	// future improvement, return a default set of 4 loans here
	throw new Error('No loans returned');
}

async function getLoanForRequest(type, cache, req) {
	// Use default values for id and offset if they are not numeric
	const id = req.params?.id || 0;
	const offset = req.params?.offset || 1;

	const loanData = await fetchRecommendedLoans(type, id, cache);
	return loanData[offset - 1];
}

async function redirectToUrl(type, cache, req, res) {
	try {
		const loan = await getLoanForRequest(type, cache, req);

		let redirect = `/lend/${loan.id}`;
		// If the original request had query params on it, forward those along
		const requestUrl = new URL(`${req.protocol}://${req.get('host')}${req.originalUrl}`);
		const queryParams = new URLSearchParams(requestUrl.search);
		if (queryParams) {
			redirect += `?${queryParams}`;
		}
		res.redirect(302, redirect);
	} catch (err) {
		log(`Error redirecting to url, ${err}`, 'error');
		res.redirect(302, '/lend-by-category/');
	}
}

async function serveImg(type, cache, req, res) {
	try {
		const loan = await getLoanForRequest(type, cache, req);

		let loanImg;
		const cachedLoanImg = await memJsUtils.getFromCache(`loan-card-img-${loan.id}`, cache);
		if (cachedLoanImg) {
			loanImg = cachedLoanImg;
		} else {
			loanImg = await drawLoanCard(loan);
			const expires = 10 * 60; // 10 minutes
			memJsUtils.setToCache(`loan-card-img-${loan.id}`, loanImg, expires, cache).catch(err => {
				log(`Error setting loan data to cache, ${err}`, 'error');
			});
			// Continue before setting to the cache completes to speed up response times
		}

		res.contentType('image/jpeg');
		res.send(loanImg);
	} catch (err) {
		log(`Error serving image, ${err}`, 'error');
		res.sendStatus(500);
	}
}

module.exports = function liveLoanRouter(cache) {
	const router = express.Router();

	// User URL Router
	router.use('/u/:id(\\d{0,})/url/:offset(\\d{0,})', async (req, res) => {
		await redirectToUrl('user', cache, req, res);
	});

	// User IMG Router
	router.use('/u/:id(\\d{0,})/img/:offset(\\d{0,})', async (req, res) => {
		await serveImg('user', cache, req, res);
	});

	// Loan-to-loan URL Router
	router.use('/l/:id(\\d{0,})/url/:offset(\\d{0,})', async (req, res) => {
		await redirectToUrl('loan', cache, req, res);
	});

	// Loan-to-loan IMG Router
	router.use('/l/:id(\\d{0,})/img/:offset(\\d{0,})', async (req, res) => {
		await serveImg('loan', cache, req, res);
	});

	// Filter URL Router
	router.use('/f/:id(([a-zA-Z]+_[a-zA-Z0-9%]+,?){0,})/url/:offset(\\d{0,})', async (req, res) => {
		await redirectToUrl('filter', cache, req, res);
	});

	// Filter IMG Router
	router.use('/f/:id(([a-zA-Z]+_[a-zA-Z0-9%]+,?){0,})/img/:offset(\\d{0,})', async (req, res) => {
		await serveImg('filter', cache, req, res);
	});

	// 404 any /live-loan/* routes that don't match above
	router.use((req, res) => {
		res.sendStatus(404);
	});

	return router;
};
