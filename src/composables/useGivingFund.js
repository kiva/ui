import logFormatter from '#src/util/logFormatter';
// eslint-disable-next-line max-len
import myGivingFundParticipationDonations from '#src/graphql/query/portfolio/myGivingFundParticipationDonations.graphql';

export default function useGivingFund(apollo) {
	const DEFAULT_LIMIT = 20;

	/**
	 * Util method to generate offsets for paginated fetching
	 */
	const generateOffsets = (totalDonationEntryCount, limit) => {
		// return empty array if total count is less than or equal to limit
		if (totalDonationEntryCount <= limit) {
			return [];
		}
		// figure out how many more donations to fetch
		const totalToFetch = totalDonationEntryCount - limit;
		// calculate how many more fetches we need to do
		const fetchesNeeded = Math.ceil(totalToFetch / limit);
		// create an array of offsets to fetch
		const offsets = Array.from({ length: fetchesNeeded }, (_, i) => (i + 1) * limit);
		return offsets;
	};

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
		const data = await fetchGivingFundDonationData();
		const totalDonationEntryCount = data?.givingFundParticipation?.totalCount || 0;
		const firstPage = data?.givingFundParticipation?.values ?? [];

		if (!totalDonationEntryCount || !firstPage.length) {
			return fundIds;
		}

		const donationEntries = [...firstPage];

		// if our totalCount is greater than our default limit, fetch the rest
		if (totalDonationEntryCount > DEFAULT_LIMIT) {
			const offsets = generateOffsets(totalDonationEntryCount, DEFAULT_LIMIT);
			// fetch all offsets in parallel
			const results = await Promise.all(
				offsets.map(offset => fetchGivingFundDonationData([], DEFAULT_LIMIT, offset))
			);
			results.forEach(result => {
				donationEntries.push(...(result?.givingFundParticipation?.values ?? []));
			});
		}

		// filter out funds without owner or owned by current user
		const filteredDonations = donationEntries.filter(donation => {
			return donation?.givingFund?.owner?.id && donation?.givingFund?.owner?.id !== parseInt(ownerId, 10);
		});
		// extract unique fund ids
		filteredDonations.forEach(donation => {
			if (!fundIds.includes(donation.givingFund?.id)) {
				fundIds.push(donation.givingFund?.id);
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

	return {
		fetchGivingFundDonationData,
		getDonationTotalsForFund,
		getFundsContributedToIds,
	};
}
