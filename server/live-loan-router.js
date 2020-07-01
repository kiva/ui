const get = require('lodash/get');
const express = require('express');
const argv = require('./util/argv');
const config = require('../config/selectConfig')(argv.config);
const fetch = require('./util/fetch');

const drawLoanCard = require('./util/live-loan/live-loan-draw');

function getRecommendedLoans(type, loginId, offset = 0, limit = 1) {
	return new Promise((resolve, reject) => {
		const endpoint = config.app.graphqlUri;
		let query;
		if (type === 'url') {
			query = `{
				ml {
					recommendationsByLoginId(
						segment: all
						  loginId: ${loginId}
						  offset: ${offset}
						  limit: ${limit}
					) {
						values {
							id,
						}
					}
				}
			}`;
		} else if (type === 'img') {
			query = `{
				ml {
					recommendationsByLoginId(
						segment: all
						  loginId: ${loginId}
						  offset: ${offset}
						  limit: ${limit}
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
		}

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
				resolve(loanData);
			}).catch(err => {
				console.error(err);
				reject(err);
			});
	});
}

module.exports = function liveLoanRouter() {
	const router = express.Router();
	const userRouter = express.Router({ mergeParams: true });
	const urlRouter = express.Router({ mergeParams: true });
	const imgRouter = express.Router({ mergeParams: true });

	router.get('/', (req, res) => { res.sendStatus(500); });

	router.use('/u', userRouter);
	userRouter.get('/', (req, res) => { res.sendStatus(500); });
	userRouter.get('/:userId', (req, res) => { res.sendStatus(500); });
	userRouter.use('/:userId/url', urlRouter);
	userRouter.use('/:userId/img', imgRouter);

	// URL Router
	urlRouter.get('/', (req, res) => { res.sendStatus(500); });
	urlRouter.get('/:offset', async (req, res) => {
		const { userId, offset } = req.params;
		try {
			const loanData = await getRecommendedLoans('url', userId/* , offset */);
			const offsetLoanId = loanData[0].id;
			res.redirect(302, `/lend/${offsetLoanId}`);
		} catch (err) {
			console.error(err);
			res.redirect(302, '/lend-by-category/');
			// res.sendStatus(500); // TODO, do we want 500 error here instead?
		}
	});

	// IMG Router
	imgRouter.get('/', (req, res) => { res.sendStatus(500); });
	imgRouter.get('/:offset', async (req, res) => {
		const { userId, offset } = req.params;
		try {
			const loanData = await getRecommendedLoans('img', userId/* , offset */);
			const loanCardImgBuffer = await drawLoanCard(loanData[0]); // TODO: offset?
			// TODO: Add loanCard img to memcache?
			res.contentType('image/jpeg');
			res.send(loanCardImgBuffer);
		} catch (err) {
			console.error(err);
			res.sendStatus(500);
		}
	});

	return router;
};
