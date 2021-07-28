import * as Sentry from '@sentry/browser';
import gql from 'graphql-tag';
import numeral from 'numeral';
import logFormatter from '@/util/logFormatter';
import basketCountQuery from '@/graphql/query/basketCount.graphql';
import basketItemsQuery from '@/graphql/query/basketItems.graphql';

function logSetLendAmountError(loanId, err) {
	logFormatter(err, 'error');
	try {
		Sentry.withScope(scope => {
			scope.setTag('loan_id', this.loanId);
			scope.setTag('mutation', 'addToBasket');
			Sentry.captureException(err);
		});
	} catch (e) {
		// no-op
	}
}

export function setLendAmount({ amount, apollo, loanId }) {
	return new Promise((resolve, reject) => {
		const price = numeral(amount).format('0.00');
		apollo.mutate({
			mutation: gql`mutation addToBasket($loanId: Int!, $price: Money!, $basketId: String) {
				shop (basketId: $basketId) {
					id
					updateLoanReservation (loanReservation: {
						id: $loanId
						price: $price
					}) {
						id
						price
					}
				}
			}`,
			variables: {
				loanId,
				price,
			},
			optimisticResponse: {
				__typename: 'Mutation',
				shop: {
					__typename: 'ShopMutation',
					updateLoanReservation: {
						__typename: 'LoanReservation',
						id: loanId,
						price,
					},
				},
			},
			awaitRefetchQueries: true,
			refetchQueries: [
				{ query: basketCountQuery },
				{ query: basketItemsQuery },
			]
		}).then(result => {
			if (result.errors) {
				result.errors.forEach(error => {
					logSetLendAmountError(loanId, error);
				});
				reject(result.errors);
			} else {
				resolve();
			}
		}).catch(errors => {
			errors.forEach(error => {
				logSetLendAmountError(loanId, error);
			});
			reject(errors);
		});
	});
}

export function setDonationAmount() {
	// TODO
}
