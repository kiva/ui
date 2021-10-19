/* eslint-disable import/prefer-default-export */
import gql from 'graphql-tag';
import flssLoanQuery from '@/graphql/query/flssLoansQuery.graphql';

export function fetchSectors(apollo) {
	const sectorQuery = gql`query sectors {lend { sector { id name } } }`;

	return apollo.query({
		query: sectorQuery,
	})
		.then(dataSector => {
			return dataSector.data.lend.sector.map(sectorInfo => {
				return {
					name: sectorInfo.name,
					id: sectorInfo.id
				};
			});
		})
		.catch(e => {
			console.log('Sector Data failed to fetch: ', e.message);
		});
}

export function fetchCountryFacets(apollo) {
	const countryQuery = gql`
query countryFacets {
	lend {
		countryFacets {
			country {
				name
				isoCode
				geocode {latitude longitude}
				numLoansFundraising
				region }
				count }
			}
	}`;

	return apollo.query({
		query: countryQuery,
	})
		.then(({ data }) => {
			return data.lend.countryFacets;
		})
		.catch(e => {
			console.log('CountryFacet Data failed to fetch: ', e.message);
		});
}

export function fetchData(loanQueryFilters, apollo) {
	return apollo.query({
		query: flssLoanQuery,
		variables: {
			filterObject: loanQueryFilters,
			limit: 20
		},
		fetchPolicy: 'network-only',
	})
		.then(({ data }) => {
			return data.fundraisingLoans;
		})
		.catch(e => {
			console.log('FundraisingLoans Data failed to fetch: ', e.message);
		});
}

export function filterGender(gender) {
	let genderFilter = {};
	if (!['both', 'male', 'female'].includes(gender)) {
		return genderFilter;
	}
	if (gender === 'both') {
		genderFilter = { any: ['female', 'male'] };
	} else {
		genderFilter = { any: [gender] };
	}

	console.log('from filterGender:', genderFilter);
	return genderFilter;
}

export function validateSectorInput(sectorListInput, sectorNames) {
	if (sectorListInput.length > 0) {
		const isValid = sectorListInput.every(sector => sectorNames.includes(sector));
		return isValid;
	}
	console.log('No sector filters were passed to the query.  \nPlease check the sector input:', sectorListInput);
	return false;
}

export function filterSector(sectorList, sectorNames) {
	// # TODO: collect sector from checkbox inputs
	// once they're fixed
	let sectorFilter = { none: [] };
	if (validateSectorInput(sectorList, sectorNames)) {
		sectorFilter = { any: sectorList };
		return sectorFilter;
	}
	console.log('from filterSector:', sectorFilter);
	return sectorFilter;
}

export function filterCountry(countryList, allCountries) {
	let countryFilter = { none: [] };
	if (countryList.length > 1 && countryList.every(country => allCountries.includes(country))) {
		countryFilter = { any: countryList };
		return countryFilter;
	}
	console.log('from filterCountry:', filterCountry);
	return countryFilter;
}
