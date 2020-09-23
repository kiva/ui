import gql from 'graphql-tag';

function addCreditByType(type, code, apollo) {
	const addCreditMutation = gql`mutation addCreditMutation(
		$basketId: String!,
		$creditType: CreditTypeEnum!,
		$redemptionCode: String!
	) {
		shop(basketId: $basketId) {
			addCreditByType(creditType: $creditType, redemptionCode: $redemptionCode)
		}
	}`;
	return new Promise(() => {
		return apollo.mutate({
			mutation: addCreditMutation,
			variables: {
				creditType: type,
				redemptionCode: code,
			}
		});
	});
}

export function applyLendingReward(promoFundId, apollo) {
	const applyLendingRewardMutation = gql`mutation applyLendingRewardMutation(
		$basketId: String!,
		$promoFundId: String!
	) {
		shop(basketId: $basketId) {
			applyLendingReward(promoFundId: $promoFundId)
		}
	}`;
	return new Promise(() => {
		return apollo.mutate({
			mutation: applyLendingRewardMutation,
			variables: {
				promoFundId
			}
		});
	});
}

export function applyUpcCode(upcCode, apollo) {
	return addCreditByType('universal_code', upcCode, apollo);
}

export function applyRedemptionCode(redemptionCode, apollo) {
	return addCreditByType('redemption_code', redemptionCode, apollo);
}
