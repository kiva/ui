const get = require('lodash/get');
const express = require('express');
const argv = require('./util/argv');
const config = require('../config/selectConfig')(argv.config);
const fetch = require('./util/fetch');

const drawLoanCard = require('./util/live-loan/live-loan-draw');

function getLoansFromCache(loginId, cache) {
	return new Promise(resolve => {
		cache.get(`recommendations-by-login-id-${loginId}`, (error, data) => {
			let parsedData = [];
			if (error) {
				console.error(JSON.stringify({
					meta: {},
					level: 'error',
					message: `MemJS Error Getting recommendations-by-login-id-${loginId}, Error: ${error}`
				}));
			}
			if (data) {
				parsedData = JSON.parse(data);
			}
			resolve(parsedData);
		});
	});
}

function setLoansToCache(loginId, loans, cache) {
	return new Promise((resolve, reject) => {
		const expires = 10 * 60; // 10 minutes
		cache.set(`recommendations-by-login-id-${loginId}`, JSON.stringify(loans), { expires }, (error, success) => {
			if (error) {
				console.error(JSON.stringify({
					meta: {},
					level: 'error',
					message: `MemJS Error Setting Cache for recommendations-by-login-id-${loginId}, Error: ${error}`
				}));
				reject();
			}
			if (success) {
				console.info(JSON.stringify({
					meta: {},
					level: 'info',
					message: `MemJS Success Setting Cache for recommendations-by-login-id-${loginId}, Success: ${success}`
				}));
				resolve();
			}
		});
	});
}

function fetchRecommendedLoans(loginId, cache) {
	return new Promise((resolve, reject) => {
		getLoansFromCache(loginId, cache).then(data => {
			if (data.length) {
				resolve(data);
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
						setLoansToCache(loginId, loanData, cache).then(() => {
							resolve(loanData);
						});
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
		try {
			const loanData = await fetchRecommendedLoans(userId, cache);
			const offsetLoanId = loanData[offset - 1].id;
			res.redirect(302, `/lend/${offsetLoanId}`);
		} catch (err) {
			console.error(err);
			res.redirect(302, '/lend-by-category/');
		}
	});

	// IMG Router
	router.use('/u/:userId/img/:offset', async (req, res) => {
		const { userId, offset } = req.params;
		try {
			const loanData = await fetchRecommendedLoans(userId, cache);
			const loanCardImgBuffer = await drawLoanCard(loanData[offset - 1]);
			res.contentType('image/jpeg');
			res.send(loanCardImgBuffer);
		} catch (err) {
			console.error(err);
			res.sendStatus(500);
		}
	});

	// 404 any /live-loan/* routes that don't match above
	router.use((req, res) => {
		res.sendStatus(404);
	});

	return router;
};
