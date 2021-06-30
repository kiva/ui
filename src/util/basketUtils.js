import * as Sentry from '@sentry/browser';
import gql from 'graphql-tag';
import numeral from 'numeral';
import basketCountQuery from '@/graphql/query/basketCount.graphql';
import basketItemsQuery from '@/graphql/query/basketItems.graphql';

function logSetLendAmountError(loanId, err) {
	console.error(err);
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
			if (result.error) {
				logSetLendAmountError(loanId, result.error);
				reject(result.error);
			} else {
				resolve();
			}
		}).catch(error => {
			logSetLendAmountError(loanId, error);
			reject(error);
		});
	});
}

export function setDonationAmount() {
	// TODO
}
