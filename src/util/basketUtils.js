import * as Sentry from '@sentry/vue';
import { gql } from '@apollo/client';
import numeral from 'numeral';
import logFormatter from '@/util/logFormatter';
import basketCountQuery from '@/graphql/query/basketCount.graphql';
import basketItemsQuery from '@/graphql/query/basketItems.graphql';
import basketLoansInfoQuery from '@/graphql/query/basketLoansInfo.graphql';

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
					id: '0',
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
				{ query: basketLoansInfoQuery, variables: { id: loanId } }
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

export function handleInvalidBasket({ loan, cookieStore }) {
	cookieStore.remove('kvbskt', { path: '/', secure: true });
	cookieStore.set('kvatbid', JSON.stringify(loan));
	window.location.reload();
}
