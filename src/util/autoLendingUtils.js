import logReadQueryError from '#src/util/logReadQueryError';
import partnerListQuery from '#src/graphql/query/autolending/partnerList.graphql';
import _sortBy from 'lodash/sortBy';

/**
 * Queries the available partner IDs
 *
 * @param apollo The Apollo Client to use
 * @returns The IDs of the available partners
 */
export const queryAllPartners = async apollo => {
	let allPartners = [];

	const queryPartners = (offset = 0) => {
		return apollo.query({ query: partnerListQuery, variables: { offset } });
	};

	const addFilteredPartners = partners => {
		// Filter out the "N/A direct to ..." non-partners
		const nonDirectPartners = partners.filter(p => p?.name?.toLowerCase()?.indexOf('direct to') === -1);
		allPartners.push(...nonDirectPartners);
	};

	try {
		let offset = 0;
		// Monolith globally limited to returning 100 items
		const step = 100;

		const initialData = await queryPartners();
		const totalCount = initialData?.data?.general?.partners?.totalCount ?? [];
		addFilteredPartners(initialData?.data?.general?.partners?.values ?? []);

		offset += step;

		if (totalCount > offset) {
			const remainingData = await Promise.all(
				[...Array(Math.ceil(totalCount / step) - 1)].map(() => {
					const dataPromise = queryPartners(offset);
					offset += 100;
					return dataPromise;
				})
			);

			remainingData.forEach(d => addFilteredPartners(d?.data?.general?.partners?.values ?? []));
		}

		allPartners = _sortBy(allPartners, 'name');
	} catch (e) {
		logReadQueryError(e, 'queryAllPartners partnerListQuery');
	}

	return allPartners;
};
