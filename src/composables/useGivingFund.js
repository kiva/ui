// import {
// 	ref,
// 	computed,
// 	onMounted,
// } from 'vue';
import logFormatter from '#src/util/logFormatter';
// eslint-disable-next-line max-len
import myGivingFundParticipationDonations from '#src/graphql/query/portfolio/myGivingFundParticipationDonations.graphql';

export default function useGivingFund(apollo) {
	/**
	 * Generic Fetch method for Donation Particpation
	 * Note: the myGivingFundParticipationDonations is abbreviated to focus on amount donated and the fund id
	 */
	const fetchGivingFundDonationData = async (fundIds = [], limit = 20, offset = 0) => {
		const variables = {
			// default is 10, increasing to 20 to reduce need to fetch more
			limit,
			offset,
		};
		// if we have fundIds, add to variables
		if (fundIds.length) {
			variables.filter = {
				fundIds,
			};
		}

		try {
			const response = await apollo.query({
				query: myGivingFundParticipationDonations,
				fetchPolicy: 'network-only',
				variables,
			});

			// return query result
			return response?.data?.my ?? {};
		} catch (error) {
			logFormatter(`Error fetching giving fund donation data: ${error}`, 'error');
		}
	};

	const getDonationTotalsForFund = async fundId => {
		let totalDonated = 0;
		if (!fundId) {
			return totalDonated;
		}
		// fetch donation data for fundId
		await fetchGivingFundDonationData([fundId]).then(data => {
			// return total donated amount
			totalDonated = data?.givingFundParticipation?.totalCount
				? data.givingFundParticipation.values
					.reduce((sum, donation) => sum + donation.amountDonated, 0)
				: 0;
		});

		return totalDonated;
	};

	return {
		fetchGivingFundDonationData,
		getDonationTotalsForFund,
	};
}
