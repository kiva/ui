const get = require('lodash/get');
const express = require('express');
const argv = require('./util/argv');
const config = require('../config/selectConfig')(argv.config);
const fetch = require('./util/fetch');
const memJsUtils = require('./util/memJsUtils');
const drawLoanCard = require('./util/live-loan/live-loan-draw');

function isNumeric(value) {
	return /^\d+$/.test(value);
}

const recommendationsByLoginIdQuery = id => `{
	ml {
		recommendationsByLoginId(
			segment: all
				loginId: ${id}
				offset: 0
				limit: 4
		) {
			values {
				name
				id
				borrowerCount
				geocode {
					country {
						name
					}
				}
				use
				loanAmount
				status
				loanFundraisingInfo {
					fundedAmount
				}
				image {
					retina: url(customSize: "w960h720")
				}
			}
		}
	}
}`;

const recommendationsByLoanIdQuery = id => `{
	ml {
		relatedLoansByTopics(
			loanId: ${id},
			offset: 0,
			topics: [story]
			limit: 4,
		) {
			values {
				name
				id
				borrowerCount
				geocode {
					country {
						name
					}
				}
				use
				loanAmount
				status
				loanFundraisingInfo {
					fundedAmount
				}
				image {
					retina: url(customSize: "w960h720")
				}
			}
		}
	}
}`;

function fetchRecommendedLoans(type, id, cache) {
	let query;
	let queryResultPath;
	if (type === 'user') {
		query = recommendationsByLoginIdQuery;
		queryResultPath = 'data.ml.recommendationsByLoginId.values';
	} else if (type === 'loan') {
		query = recommendationsByLoanIdQuery;
		queryResultPath = 'data.ml.relatedLoansByTopics[0].values';
	}
	return new Promise((resolve, reject) => {
		memJsUtils.getFromCache(`recommendations-by-${type}-id-${id}`, cache).then(data => {
			if (data) {
				const jsonData = JSON.parse(data);
				resolve(jsonData);
			} else {
				const endpoint = config.app.graphqlUri;
				fetch(endpoint, {
					method: 'POST',
					headers: { 'Content-Type': 'application/json' },
					body: JSON.stringify({
						query: query(id)
					}),
				})
					.then(result => result.json())
					.then(result => {
						const loanData = get(result, queryResultPath);
						if (loanData) {
							const expires = 10 * 60; // 10 minutes
							memJsUtils.setToCache(
								`recommendations-by-${type}-id-${id}`,
								JSON.stringify(loanData),
								expires,
								cache
							)
								.then(() => {
									resolve(loanData);
								});
						} else {
							throw new Error('No loans returned');
						}
					}).catch(err => {
						console.error(err);
						reject(err);
					});
			}
		}).catch(err => {
			console.error(err);
		});
	});
}

async function redirectToUrl(type, cache, req, res) {
	const { id, offset } = req.params;
	if (isNumeric(id) && isNumeric(offset)) {
		try {
			const loanData = await fetchRecommendedLoans(type, id, cache);
			const offsetLoanId = loanData[offset - 1].id;
			res.redirect(302, `/lend/${offsetLoanId}`);
		} catch (err) {
			console.error(err);
			res.redirect(302, '/lend-by-category/');
		}
	} else {
		res.status(400).send('Invalid Parameters');
	}
}

async function serveImg(type, cache, req, res) {
	const { id, offset } = req.params;
	if (isNumeric(id) && isNumeric(offset)) {
		try {
			const loanData = await fetchRecommendedLoans(type, id, cache);
			const loan = loanData[offset - 1];

			let loanImg;
			const cachedLoanImg = await memJsUtils.getFromCache(`loan-card-img-${loan.id}`, cache);
			if (cachedLoanImg) {
				loanImg = cachedLoanImg;
			} else {
				loanImg = await drawLoanCard(loan);
				const expires = 10 * 60; // 10 minutes
				await memJsUtils.setToCache(`loan-card-img-${loan.id}`, loanImg, expires, cache);
			}

			res.contentType('image/jpeg');
			res.send(loanImg);
		} catch (err) {
			console.error(err);
			res.sendStatus(500);
		}
	} else {
		res.status(400).send('Invalid Parameters');
	}
}

module.exports = function liveLoanRouter(cache) {
	const router = express.Router();

	// User URL Router
	router.use('/u/:id/url/:offset', async (req, res) => {
		await redirectToUrl('user', cache, req, res);
	});

	// User IMG Router
	router.use('/u/:id/img/:offset', async (req, res) => {
		await serveImg('user', cache, req, res);
	});

	// Loan-to-loan URL Router
	router.use('/l/:id/url/:offset', async (req, res) => {
		await redirectToUrl('loan', cache, req, res);
	});

	// Loan-to-loan IMG Router
	router.use('/l/:id/img/:offset', async (req, res) => {
		await serveImg('loan', cache, req, res);
	});

	// 404 any /live-loan/* routes that don't match above
	router.use((req, res) => {
		res.sendStatus(404);
	});

	return router;
};
