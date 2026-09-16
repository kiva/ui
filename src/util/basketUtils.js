import * as Sentry from '@sentry/vue';
import numeral from 'numeral';
import logFormatter from '#src/util/logFormatter';
import basketCountQuery from '#src/graphql/query/basketCount.graphql';
import basketItemsQuery from '#src/graphql/query/basketItems.graphql';
import basketLoansInfoQuery from '#src/graphql/query/basketLoansInfo.graphql';
import createNewBasketMutation from '#src/graphql/mutation/shopCreateNewBsket.graphql';
import updateDonation from '#src/graphql/mutation/updateDonation.graphql';
import updateLoanReservation from '#src/graphql/mutation/updateLoanReservation.graphql';

export const INVALID_BASKET_ERROR = 'invalidBasket';

// Placeholder copy pending design/content review (CIT-5181). The lock self-heals after 300s,
// so this must not imply the basket is permanently stuck.
export const CHECKOUT_IN_PROGRESS_MESSAGE = 'Your checkout is being processed, so your basket '
	+ 'can\u2019t be changed right now. Please wait a moment and refresh the page.';

function logSetLendAmountError(loanId, err) {
	logFormatter(err, 'error');
	try {
		Sentry.withScope(scope => {
			scope.setTag('loan_id', loanId);
			scope.setTag('mutation', 'addToBasket');
			Sentry.captureException(err);
		});
	} catch (e) {
		// no-op
	}
}

export async function createNewBasket({ apollo, cookieStore }) {
	// Create a new basket
	const { data } = await apollo.mutate({ mutation: createNewBasketMutation });
	const newBasketId = data?.shop?.createBasket;

	// Set the new basket ID in the cookie
	if (newBasketId) {
		cookieStore.set('kvbskt', newBasketId, { path: '/', secure: true });
	}

	return newBasketId;
}

export function setLendAmount({ amount, apollo, loanId }) {
	return new Promise((resolve, reject) => {
		const price = numeral(amount).format('0.00');
		apollo.mutate({
			mutation: updateLoanReservation,
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
			(Array.isArray(errors) ? errors : [errors]).forEach(error => {
				logSetLendAmountError(loanId, error);
			});
			reject(errors);
		});
	});
}

export function setDonationAmount({ apollo, donationAmount }) {
	const formattedDonationAmount = numeral(donationAmount).format('0.00');
	return apollo.mutate({
		mutation: updateDonation,
		variables: {
			price: formattedDonationAmount,
			isTip: true
		}
	}).then(data => {
		if (data?.errors) {
			data?.errors.forEach(error => {
				logFormatter(error, 'error');
			});
		}
		return data;
	}).catch(error => {
		logFormatter(error, 'error');
	});
}

export function handleInvalidBasket({ loan, cookieStore }) {
	cookieStore.remove('kvbskt', { path: '/', secure: true });
	cookieStore.set('kvatbid', JSON.stringify(loan));
	window.location.reload();
}
export function handleInvalidBasketForDonation({ cookieStore, donationAmount, navigateToCheckout = false }) {
	cookieStore.remove('kvbskt', { path: '/', secure: true });
	cookieStore.set('kvatbamt', JSON.stringify({ donationAmount, navigateToCheckout }));
	window.location.reload();
}

export function hasBasketExpired(errorCode) {
	return ['shop.invalidBasketId', 'shop.basketRequired'].includes(errorCode);
}

// The backend refuses basket edits while the lender's own checkout is still running (CIT-4190).
// Two codes mean the same thing: the loan reservation path returns checkout_in_progress, the
// donation/Kiva Card/credit paths throw shop.checkoutInProgress.
export function isCheckoutInProgress(errorCode) {
	return ['checkout_in_progress', 'shop.checkoutInProgress'].includes(errorCode);
}

// Basket errors arrive with the code nested under extensions or, from some mutations, at the top level.
export function getBasketErrorCode(error) {
	return error?.extensions?.code ?? error?.code;
}

// Lender-facing copy for a basket error, overriding the backend message where ours is better.
export function getBasketErrorMessage(error) {
	return isCheckoutInProgress(getBasketErrorCode(error)) ? CHECKOUT_IN_PROGRESS_MESSAGE : error?.message;
}
