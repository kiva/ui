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

async function getLoanImg(loan, cache) {
	let loanImg;
	const cachedLoanImg = await memJsUtils.getFromCache(`loan-card-img-${loan.id}`, cache);
	if (cachedLoanImg) {
		loanImg = cachedLoanImg;
	} else {
		loanImg = await drawLoanCard(loan);
		const expires = 10 * 60; // 10 minutes
		await memJsUtils.setToCache(`loan-card-img-${loan.id}`, loanImg, expires, cache);
	}
	return loanImg;
}

function fetchRecommendationsByLoginId(loginId, cache) {
	return new Promise((resolve, reject) => {
		memJsUtils.getFromCache(`recommendations-by-login-id-${loginId}`, cache).then(data => {
			if (data) {
				const jsonData = JSON.parse(data);
				resolve(jsonData);
			} else {
				const endpoint = config.app.graphqlUri;
				const query = `{
					ml {
						recommendationsByLoginId(
							segment: all
								loginId: ${loginId}
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

				fetch(endpoint, {
					method: 'POST',
					headers: { 'Content-Type': 'application/json' },
					body: JSON.stringify({
						query
					}),
				})
					.then(result => result.json())
					.then(result => {
						const loanData = get(result, 'data.ml.recommendationsByLoginId.values');
						if (loanData) {
							const expires = 10 * 60; // 10 minutes
							memJsUtils.setToCache(
								`recommendations-by-login-id-${loginId}`,
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

function fetchRecommendationsByLoanId(loanId, cache) {
	return new Promise((resolve, reject) => {
		memJsUtils.getFromCache(`recommendations-by-loan-id-${loanId}`, cache).then(data => {
			if (data) {
				const jsonData = JSON.parse(data);
				resolve(jsonData);
			} else {
				const endpoint = config.app.graphqlUri;
				const query = `{
					ml {
						relatedLoansByTopics(
							loanId: ${loanId},
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

				fetch(endpoint, {
					method: 'POST',
					headers: { 'Content-Type': 'application/json' },
					body: JSON.stringify({
						query
					}),
				})
					.then(result => result.json())
					.then(result => {
						const loanData = get(result, 'data.ml.relatedLoansByTopics[0].values');
						console.log('hiii');
						console.log(get(result, 'data.ml.relatedLoansByTopics[0].values'));
						if (loanData) {
							const expires = 10 * 60; // 10 minutes
							memJsUtils.setToCache(
								`recommendations-by-loan-id-${loanId}`,
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

module.exports = function liveLoanRouter(cache) {
	const router = express.Router();

	// User URL Router
	router.use('/u/:userId/url/:offset', async (req, res) => {
		const { userId, offset } = req.params;
		if (isNumeric(userId) && isNumeric(offset)) {
			try {
				const loanData = await fetchRecommendationsByLoginId(userId, cache);
				const offsetLoanId = loanData[offset - 1].id;
				res.redirect(302, `/lend/${offsetLoanId}`);
			} catch (err) {
				console.error(err);
				res.redirect(302, '/lend-by-category/');
			}
		} else {
			res.status(400).send('Invalid Parameters');
		}
	});

	// User IMG Router
	router.use('/u/:userId/img/:offset', async (req, res) => {
		const { userId, offset } = req.params;
		if (isNumeric(userId) && isNumeric(offset)) {
			try {
				const loanData = await fetchRecommendationsByLoginId(userId, cache);
				const loan = loanData[offset - 1];
				const loanImg = await getLoanImg(loan, cache);
				res.contentType('image/jpeg');
				res.send(loanImg);
			} catch (err) {
				console.error(err);
				res.sendStatus(500);
			}
		} else {
			res.status(400).send('Invalid Parameters');
		}
	});

	// Loan-to-loan URL Router
	router.use('/l/:loanId/url/:offset', async (req, res) => {
		const { loanId, offset } = req.params;
		if (isNumeric(loanId) && isNumeric(offset)) {
			try {
				const loanData = await fetchRecommendationsByLoanId(loanId, cache);
				const offsetLoanId = loanData[offset - 1].id;
				res.redirect(302, `/lend/${offsetLoanId}`);
			} catch (err) {
				console.error(err);
				res.redirect(302, '/lend-by-category/');
			}
		} else {
			res.status(400).send('Invalid Parameters');
		}
	});

	// Loan-to-loan IMG Router
	router.use('/l/:loanId/img/:offset', async (req, res) => {
		const { loanId, offset } = req.params;
		if (isNumeric(loanId) && isNumeric(offset)) {
			try {
				const loanData = await fetchRecommendationsByLoanId(loanId, cache);
				const loan = loanData[offset - 1];
				const loanImg = await getLoanImg(loan, cache);
				res.contentType('image/jpeg');
				res.send(loanImg);
			} catch (err) {
				console.error(err);
				res.sendStatus(500);
			}
		} else {
			res.status(400).send('Invalid Parameters');
		}
	});

	// 404 any /live-loan/* routes that don't match above
	router.use((req, res) => {
		res.sendStatus(404);
	});

	return router;
};
