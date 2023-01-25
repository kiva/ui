import { gql } from '@apollo/client';
import promoCampaign from '@/graphql/query/promoCampaign.graphql';

/**
 * addCreditByType mutation
 * Applies a promotional code based on type and code to the current basket
 *
 * @param {String} type Promotion Type
 * @param {String} code Promotion Code
 * @param {Object} apollo Apollo Client instance
 * @returns {Promise}
 */
function addCreditByType(type, code, apollo) {
	const addCreditMutation = gql`mutation addCreditMutation(
		$basketId: String!,
		$creditType: CreditTypeEnum!,
		$redemptionCode: String!
	) {
		shop(basketId: $basketId) {
			id
			addCreditByType(creditType: $creditType, redemptionCode: $redemptionCode)
		}
	}`;

	return apollo.mutate({
		mutation: addCreditMutation,
		variables: {
			creditType: type,
			redemptionCode: code,
		}
	});
}

/**
 * applyLendingReward mutation
 * Applies a lending reward "session" by storing it in the CommonCache referencing the current basket
 *
 * @param {String} promoFundId PromoFund Id
 * @param {Object} apollo Apollo Client instance
 * @returns {Promise}
 */
export function applyLendingReward(promoFundId, apollo) {
	const applyLendingRewardMutation = gql`mutation applyLendingRewardMutation(
		$basketId: String!,
		$promoFundId: String!
	) {
		shop(basketId: $basketId) {
			id
			applyLendingReward(promoFundId: $promoFundId)
		}
	}`;

	return apollo.mutate({
		mutation: applyLendingRewardMutation,
		variables: {
			promoFundId
		}
	});
}

/**
 * applyUpcCode
 * Handle applying UPC type code
 *
 * @param {String} upcCode UPC code string
 * @param {Object} apollo Apollo Client instance
 * @returns {Promise}
 */
export function applyUpcCode(upcCode, apollo) {
	return addCreditByType('universal_code', upcCode, apollo);
}

/**
 * applyRedemptionCode
 * Handle applying Redemption type code
 *
 * @param {String} redemptionCode Redemption code string
 * @param {Object} apollo Apollo Client instance
 * @returns {Promise}
 */
export function applyRedemptionCode(redemptionCode, apollo) {
	return addCreditByType('redemption_code', redemptionCode, apollo);
}

/**
 * validateQueryParams
 * Inspect incoming query params for an applicable query key and value
 * Attempt to apply the code if matched by type
 *
 * @param {Object} query Query Object from Vue router
 * @param {Object} apollo Apollo Client instance
 * @returns {Promise}
 */
export function validateQueryParams(query, apollo) {
	const { upc, promoCode, lendingReward } = query;
	// console.log(upc, promoCode, lendingReward);
	if (upc) {
		return applyUpcCode(upc, apollo);
	}
	if (promoCode) {
		return applyRedemptionCode(promoCode, apollo);
	}
	if (lendingReward) {
		return applyLendingReward(lendingReward, apollo);
	}
	// No code passed, Reject with status
	return Promise.reject('No promotion found.');
}

/**
 * getPromoFromBasket
 * Get promo information based on basket state
 *
 * @param {Object} query Query Object from Vue router
 * @param {Object} apollo Apollo Client instance
 * @returns {Promise}
 */
export function getPromoFromBasket(promoFundId = null, apollo) {
	return apollo.query({
		query: promoCampaign,
		variables: {
			promoFundId: promoFundId !== null ? String(promoFundId) : promoFundId
		},
		fetchPolicy: 'network-only',
	});
}
