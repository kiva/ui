const get = require('lodash/get');
const express = require('express');
const argv = require('./util/argv');
const config = require('../config/selectConfig')(argv.config);
const fetch = require('./util/fetch');

const drawLoanCard = require('./util/live-loan/live-loan-draw');

function isNumeric(value) {
	return /^\d+$/.test(value);
}

function getFromCache(key, cache) {
	return new Promise(resolve => {
		cache.get(key, (error, data) => {
			if (error) {
				console.error(JSON.stringify({
					meta: {},
					level: 'error',
					message: `MemJS Error Getting ${key}, Error: ${error}`
				}));
			}
			resolve(data);
		});
	});
}

function setToCache(key, value, expires, cache) {
	return new Promise((resolve, reject) => {
		cache.set(key, value, { expires }, (error, success) => {
			if (error) {
				console.error(JSON.stringify({
					meta: {},
					level: 'error',
					message: `MemJS Error Setting Cache for ${key}, Error: ${error}`
				}));
				reject();
			}
			if (success) {
				console.info(JSON.stringify({
					meta: {},
					level: 'info',
					message: `MemJS Success Setting Cache for ${key}, Success: ${success}`
				}));
				resolve();
			}
		});
	});
}

function fetchRecommendedLoans(loginId, cache) {
	return new Promise((resolve, reject) => {
		getFromCache(`recommendations-by-login-id-${loginId}`, cache).then(data => {
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
							setToCache(
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

module.exports = function liveLoanRouter(cache) {
	const router = express.Router();

	// URL Router
	router.use('/u/:userId/url/:offset', async (req, res) => {
		const { userId, offset } = req.params;
		if (isNumeric(userId) && isNumeric(offset)) {
			try {
				const loanData = await fetchRecommendedLoans(userId, cache);
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

	// IMG Router
	router.use('/u/:userId/img/:offset', async (req, res) => {
		const { userId, offset } = req.params;
		if (isNumeric(userId) && isNumeric(offset)) {
			try {
				const loanData = await fetchRecommendedLoans(userId, cache);
				const loan = loanData[offset - 1];
				let loanImg;
				const cachedLoanImg = await getFromCache(`loan-card-img-${loan.id}`, cache);
				if (cachedLoanImg) {
					loanImg = cachedLoanImg;
				} else {
					loanImg = await drawLoanCard(loan);
					const expires = 10 * 60; // 10 minutes
					await setToCache(`loan-card-img-${loan.id}`, loanImg, expires, cache);
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
	});

	// 404 any /live-loan/* routes that don't match above
	router.use((req, res) => {
		res.sendStatus(404);
	});

	return router;
};
