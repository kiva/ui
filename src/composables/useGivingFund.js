import logFormatter from '#src/util/logFormatter';
// eslint-disable-next-line max-len
import myGivingFundParticipationDonations from '#src/graphql/query/portfolio/myGivingFundParticipationDonations.graphql';
import myGivingFundParticipationFull from '#src/graphql/query/portfolio/myGivingFundParticipationFull.graphql';

export default function useGivingFund(apollo) {
	const DEFAULT_LIMIT = 20;
	/**
	 * Generic Fetch method for Donation Participation
	 * Note: the myGivingFundParticipationDonations is abbreviated to focus on amount donated and the fund id
	 */
	const fetchGivingFundDonationData = async (fundIds = [], limit = DEFAULT_LIMIT, offset = 0) => {
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

	const getFundsContributedToIds = async (ownerId = null) => {
		const fundIds = [];
		await fetchGivingFundDonationData({}, 40).then(data => {
			// extract unique fund ids from donation data
			if (data?.givingFundParticipation?.totalCount) {
				// filter out funds without owner or owned by current user
				const fitleredDonations = data.givingFundParticipation?.values?.filter(donation => {
					return donation?.givingFund?.owner?.id && donation?.givingFund?.owner?.id !== parseInt(ownerId, 10);
				});
				// extract unique fund ids
				fitleredDonations.forEach(donation => {
					if (!fundIds.includes(donation.givingFund?.id)) {
						fundIds.push(donation.givingFund?.id);
					}
				});
			}
		});
		return fundIds;
	};

	const getTotalDonatedForSingleOffset = async (fundId, offset) => {
		let totalDonated = 0;
		await fetchGivingFundDonationData([fundId], DEFAULT_LIMIT, offset).then(data => {
			// return total donated amount
			totalDonated = data?.givingFundParticipation?.totalCount
				? data.givingFundParticipation.values
					.reduce((sum, donation) => sum + donation.amountDonated, 0)
				: 0;
		});
		return totalDonated;
	};

	const getDonationTotalsForFund = async fundId => {
		let totalDonated = 0;
		if (!fundId) {
			return totalDonated;
		}

		// fetch donation data for fundId
		await fetchGivingFundDonationData([fundId]).then(data => {
			// if totalCount is greater than default limit
			// fetch with a series of offsets to get all donation data
			// then sum all donation amounts
			// else return single fetch total amount
			// if no donations, return 0
			if (data?.givingFundParticipation?.totalCount > DEFAULT_LIMIT) {
				// fetch the rest of the donation data
				// figure out how many more donations to fetch
				const totalToFetch = data.givingFundParticipation.totalCount - 1;
				// calculate how many more fetches we need to do
				const fetchesNeeded = Math.ceil(totalToFetch / DEFAULT_LIMIT);
				// create an array of offsets to fetch
				const offsets = Array.from({ length: fetchesNeeded }, (_, i) => (i + 1) * DEFAULT_LIMIT);
				// fetch all offsets in parallel
				const fetchPromises = offsets.map(offset => getTotalDonatedForSingleOffset(fundId, offset));
				// wait for all fetches to complete
				return Promise.all(fetchPromises).then(results => {
					// sum all results
					totalDonated = results.reduce((sum, amount) => sum + amount, 0);
					// add the initial donation amount
					totalDonated += data.givingFundParticipation.values
						.reduce((sum, donation) => sum + donation.amountDonated, 0);
				});
			}
			// return single total donated amount
			totalDonated = data?.givingFundParticipation?.totalCount
				? data.givingFundParticipation.values
					.reduce((sum, donation) => sum + donation.amountDonated, 0)
				: 0;
		});

		return totalDonated;
	};

	/**
	 * Generic Fetch method for Full Donation Participation Data
	 */
	const fetchFullGivingFundDonationData = async (fundIds = [], limit = DEFAULT_LIMIT, offset = 0) => {
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
				query: myGivingFundParticipationFull,
				fetchPolicy: 'network-only',
				variables,
			});

			// return query result
			return response?.data?.my ?? {};
		} catch (error) {
			logFormatter(`Error fetching giving fund donation data: ${error}`, 'error');
		}
	};

	const getDedupedFundsContributedToEntries = async (fundIds = []) => {
		const retrievedFundIds = [];
		const dedupedFunds = [];
		await fetchFullGivingFundDonationData(fundIds, 40).then(data => {
			if (data?.givingFundParticipation?.totalCount) {
				// map donation entry to fund entries
				const contributedFunds = data?.givingFundParticipation?.values?.map(entry => {
					return entry?.givingFund;
				}) ?? [];
				// extract unique funds
				contributedFunds.forEach(givingFund => {
					if (!retrievedFundIds.includes(givingFund?.id)) {
						retrievedFundIds.push(givingFund?.id);
						dedupedFunds.push(givingFund);
					}
				});
			}
		});
		return dedupedFunds;
	};

	const getFundTargetDisplayNounFromName = categoryName => {
		if (!categoryName) return null;
		switch (categoryName) {
			case 'climate-threatened people':
				return 'climate action';
			case 'U.S. entrepreneurs':
				return 'U.S. small businesses';
			default:
				return categoryName;
		}
	};

	const getFundTargetSupportedPeoplePhraseFromName = categoryName => {
		if (!categoryName) return null;
		switch (categoryName) {
			case 'women':
			case 'refugees':
			case 'U.S. entrepreneurs':
				return categoryName;
			default:
				return 'people';
		}
	};

	return {
		fetchFullGivingFundDonationData,
		fetchGivingFundDonationData,
		getDedupedFundsContributedToEntries,
		getDonationTotalsForFund,
		getFundsContributedToIds,
		getFundTargetDisplayNounFromName,
		getFundTargetSupportedPeoplePhraseFromName,
	};
}
