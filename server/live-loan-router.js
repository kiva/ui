import express from 'express';
import { error } from './util/log.js';
import { getFromCache, setToCache } from './util/memJsUtils.js';
import drawLoanCard from './util/live-loan/live-loan-draw.js';
import fetchLoansByType, { QUERY_TYPE } from './util/live-loan/live-loan-fetch.js';
import { trace } from './util/mockTrace.js';

async function fetchRecommendedLoans(type, id, cache, queryType = QUERY_TYPE.DEFAULT) {
	const queryTypeSuffix = queryType !== QUERY_TYPE.DEFAULT ? `-${queryType}` : '';
	const loanCachedName = `recommendations-by-${type}-id-${id}${queryTypeSuffix}`;
	// If we have loan data in memjscache return that quickly
	try {
		const cachedLoanData = await getFromCache(loanCachedName, cache);
		if (cachedLoanData) {
			return JSON.parse(cachedLoanData);
		}
	} catch (err) {
		error(`Error reading from memjs, ${err}`, { error: err });
	}

	// Otherwise we need to hit the graphql endpoint.
	const loanData = await trace(
		'fetchLoansByType',
		{ resource: type },
		async () => fetchLoansByType(type, id, queryType)
	);

	// Set the loan data in memcache, return the loan data
	if (loanData && loanData.length) {
		const expires = 10 * 60; // 10 minutes
		setToCache(loanCachedName, JSON.stringify(loanData), expires, cache).catch(err => {
			error(`Error setting loan data to cache, ${err}`, { error: err, id, type });
		});
		// Return before setting to the cache completes to speed up response times
		return loanData;
	}

	// future improvement, return a default set of 4 loans here
	throw new Error('No loans returned');
}

async function getLoanForRequest(type, cache, req, queryType = QUERY_TYPE.DEFAULT) {
	// Use default values for id and offset if they are not numeric
	const id = req.params?.id || 0;
	const offset = req.params?.offset || 1;

	const loanData = await trace(
		'fetchRecommendedLoans',
		async () => fetchRecommendedLoans(type, id, cache, queryType)
	);

	// if there are fewer loan results than the offset, return the last result
	if (offset > loanData.length) {
		return loanData[loanData.length - 1];
	}
	return loanData[offset - 1];
}

async function redirectToUrl(type, cache, req, res, queryType = QUERY_TYPE.DEFAULT) {
	try {
		const loan = await trace('getLoanForRequest', async () => getLoanForRequest(type, cache, req, queryType));
		// Standard destination is the borrower profile page
		let redirect = `/lend/${loan.id}`;
		// If the original request had query params on it, forward those along
		const requestUrl = new URL(`${req.protocol}://${req.get('host')}${req.originalUrl}`);
		const queryParams = new URLSearchParams(requestUrl.search);
		if (queryParams) {
			// Update redirect destination for an Instant Lending add to basket flow
			if (queryParams.get('atb') === 'true') {
				const loanShareAmount = queryParams.get('amount') || '25';
				redirect = `/process-instant-lending/${loan.id}/${loanShareAmount}`;
			}
			// Apply and Pass all original query params
			redirect += `?${queryParams}`;
		}
		res.redirect(302, redirect);
	} catch (err) {
		error(`Error redirecting to url, ${err}`, { error: err, params: req.params, type });
		res.redirect(302, '/lend-by-category/');
	}
}

async function serveImg(type, style, cache, req, res, queryType = QUERY_TYPE.DEFAULT) {
	try {
		const loan = await trace('getLoanForRequest', async () => getLoanForRequest(type, cache, req, queryType));
		let loanImg;
		const queryTypeSuffix = queryType !== QUERY_TYPE.DEFAULT ? `-${queryType}` : '';
		const imgCachedName = `loan-card-img-${style}-${loan.id}${queryTypeSuffix}`;
		const cachedLoanImg = await getFromCache(imgCachedName, cache);
		if (cachedLoanImg) {
			loanImg = cachedLoanImg;
		} else {
			loanImg = await trace('drawLoanCard', { resource: loan.id }, async () => drawLoanCard(loan, style));
			const expires = 10 * 60; // 10 minutes
			setToCache(imgCachedName, loanImg, expires, cache).catch(err => {
				error(`Error setting loan data to cache, ${err}`, {
					error: err,
					params: req.params,
					loan,
					style,
					type,
				});
			});
			// Continue before setting to the cache completes to speed up response times
		}

		res.contentType('image/jpeg');
		res.set('Cache-Control', [
			'no-store, no-cache, must-revalidate, max-age=0, private',
			'post-check=0, pre-check=0'
		]);
		res.send(loanImg);
	} catch (err) {
		error(`Error serving image, ${err}`, {
			error: err,
			params: req.params,
			style,
			type,
		});
		res.sendStatus(500);
	}
}

export default function liveLoanRouter(cache) {
	const router = express.Router();

	// User URL Router
	router.use('/u/:id(\\d{0,})/url/:offset(\\d{0,})', async (req, res) => {
		await trace('live-loan.user.redirectToUrl', { resource: req.path }, async () => {
			await redirectToUrl('user', cache, req, res);
		});
	});

	// User IMG Router (Legacy)
	router.use('/u/:id(\\d{0,})/img/:offset(\\d{0,})', async (req, res) => {
		await trace('live-loan.user.serveImg', { resource: req.path }, async () => {
			await serveImg('user', 'legacy', cache, req, res);
		});
	});

	// User IMG Router (Kiva Classic)
	router.use('/u/:id(\\d{0,})/img2/:offset(\\d{0,})', async (req, res) => {
		await trace('live-loan.user.serveImg', { resource: req.path }, async () => {
			await serveImg('user', 'classic', cache, req, res);
		});
	});

	// User URL Router FLSS
	router.use('/flss/u/:id(\\d{0,})/url/:offset(\\d{0,})', async (req, res) => {
		await trace('live-loan.flss.user.redirectToUrl', { resource: req.path }, async () => {
			await redirectToUrl('user', cache, req, res, QUERY_TYPE.FLSS);
		});
	});

	// User IMG Router FLSS (Legacy)
	router.use('/flss/u/:id(\\d{0,})/img/:offset(\\d{0,})', async (req, res) => {
		await trace('live-loan.flss.user.serveImg', { resource: req.path }, async () => {
			await serveImg('user', 'legacy', cache, req, res, QUERY_TYPE.FLSS);
		});
	});

	// User IMG Router FLSS (Kiva Classic)
	router.use('/flss/u/:id(\\d{0,})/img2/:offset(\\d{0,})', async (req, res) => {
		await trace('live-loan.flss.user.serveImg', { resource: req.path }, async () => {
			await serveImg('user', 'classic', cache, req, res, QUERY_TYPE.FLSS);
		});
	});

	// User URL Router Recommendations
	router.use('/recommendations/u/:id(\\d{0,})/url/:offset(\\d{0,})', async (req, res) => {
		await trace('live-loan.flss.user.redirectToUrl', { resource: req.path }, async () => {
			await redirectToUrl('user', cache, req, res, QUERY_TYPE.RECOMMENDATIONS);
		});
	});

	// User IMG Router Recommendations (Legacy)
	router.use('/recommendations/u/:id(\\d{0,})/img/:offset(\\d{0,})', async (req, res) => {
		await trace('live-loan.recommendations.user.serveImg', { resource: req.path }, async () => {
			await serveImg('user', 'legacy', cache, req, res, QUERY_TYPE.RECOMMENDATIONS);
		});
	});

	// User IMG Router Recommendations (Kiva Classic)
	router.use('/recommendations/u/:id(\\d{0,})/img2/:offset(\\d{0,})', async (req, res) => {
		await trace('live-loan.recommendations.user.serveImg', { resource: req.path }, async () => {
			await serveImg('user', 'classic', cache, req, res, QUERY_TYPE.RECOMMENDATIONS);
		});
	});

	// Loan-to-loan URL Router
	router.use('/l/:id(\\d{0,})/url/:offset(\\d{0,})', async (req, res) => {
		await trace('live-loan.loan.redirectToUrl', { resource: req.path }, async () => {
			await redirectToUrl('loan', cache, req, res);
		});
	});

	// Loan-to-loan IMG Router (Legacy)
	router.use('/l/:id(\\d{0,})/img/:offset(\\d{0,})', async (req, res) => {
		await trace('live-loan.loan.serveImg', { resource: req.path }, async () => {
			await serveImg('loan', 'legacy', cache, req, res);
		});
	});

	// Loan-to-loan IMG Router (Kiva Classic)
	router.use('/l/:id(\\d{0,})/img2/:offset(\\d{0,})', async (req, res) => {
		await trace('live-loan.loan.serveImg', { resource: req.path }, async () => {
			await serveImg('loan', 'classic', cache, req, res);
		});
	});

	// Filter URL Router
	router.use('/f/:id([a-zA-Z0-9.%,_-]{0,})/url/:offset(\\d{0,})', async (req, res) => {
		await trace('live-loan.filter.redirectToUrl', { resource: req.path }, async () => {
			await redirectToUrl('filter', cache, req, res);
		});
	});

	// Filter URL Router (refugees/displaced)
	router.use('/f/theme_refugees/displaced/url/:offset(\\d{0,})', async (req, res) => {
		// patch in hard-coded id
		req.params.id = 'theme_refugees/displaced';
		await trace('live-loan.filter.redirectToUrl', { resource: req.path }, async () => {
			await redirectToUrl('filter', cache, req, res);
		});
	});

	// Filter IMG Router (Legacy)
	router.use('/f/:id([a-zA-Z0-9.%,_-]{0,})/img/:offset(\\d{0,})', async (req, res) => {
		await trace('live-loan.filter.serveImg', { resource: req.path }, async () => {
			await serveImg('filter', 'legacy', cache, req, res);
		});
	});

	// Filter IMG Router (Kiva Classic)
	router.use('/f/:id([a-zA-Z0-9.%,_-]{0,})/img2/:offset(\\d{0,})', async (req, res) => {
		await trace('live-loan.filter.serveImg', { resource: req.path }, async () => {
			await serveImg('filter', 'classic', cache, req, res);
		});
	});

	// Loan Id URL Router
	router.use('/lid/:id([0-9]{0,})/url', async (req, res) => {
		await trace('live-loan.loanid.redirectToUrl', { resource: req.path }, async () => {
			await redirectToUrl('loanid', cache, req, res);
		});
	});

	// Loan Id IMG Router (Legacy)
	router.use('/lid/:id([0-9]{0,})/img', async (req, res) => {
		await trace('live-loan.loanid.serveImg', { resource: req.path }, async () => {
			await serveImg('loanid', 'legacy', cache, req, res);
		});
	});

	// Loan Id IMG Router (Kiva Classic)
	router.use('/lid/:id([0-9]{0,})/img2', async (req, res) => {
		await trace('live-loan.loanid.serveImg', { resource: req.path }, async () => {
			await serveImg('loanid', 'classic', cache, req, res);
		});
	});

	// 404 any /live-loan/* routes that don't match above
	router.use((req, res) => {
		res.sendStatus(404);
	});

	return router;
}
