export const mockState = {
	gender: 'female',
	countryIsoCode: ['US'],
	sectorId: [1],
	sortBy: 'expiringSoon',
	themeId: [1],
	tagId: [1],
	pageOffset: 10,
	pageLimit: 5,
};

export const savedSearchParams = {
	name: 'test saved search',
	queryString: '{"gender":"female","country":"PH"}',
	filters: {
		gender: 'female',
		country: ['PH']
	}
};

export const mockAllFacets = {
	countryFacets: [
		{ country: { isoCode: 'US', name: 'United States', region: 'North America' } },
		{ country: { isoCode: 'CA', name: 'Canada', region: 'North America' } }
	],
	countryIsoCodes: ['US', 'CA'],
	countryNames: ['UNITED STATES', 'CANADA'],
	sectorFacets: [{ id: 1, name: 'Sector 1' }, { id: 2, name: 'Sector 2' }],
	sectorIds: [1],
	sectorNames: ['SECTOR 1', 'SECTOR 2'],
	themeFacets: [{ id: 1, name: 'Theme 1' }, { id: 2, name: 'Theme 2' }],
	themeIds: [1, 2],
	themeNames: ['THEME 1', 'THEME 2'],
	tagFacets: [{ id: 1, name: 'Tag 1' }, { id: 2, name: 'Tag 2' }],
	tagIds: [1, 2],
	tagNames: ['TAG 1', 'TAG 2'],
	genderFacets: [{ name: 'female' }, { name: 'male' }],
	genders: ['FEMALE', 'MALE'],
	flssSorts: [{ name: 'expiringSoon' }, { name: 'personalized' }, { name: 'popularityScore' }],
	standardSorts: [{ name: 'expiringSoon' }, { name: 'popularity' }],
};

export const mockTransformedMiddleEast = (numLoansFundraising = 44) => ({
	region: 'Middle East',
	numLoansFundraising,
	countries: [
		{
			name: 'Jordan',
			isoCode: 'JO',
			numLoansFundraising,
			region: 'Middle East',
		},
	]
});

export const mockTransformedChile = (numLoansFundraising = 20) => ({
	name: 'Chile',
	isoCode: 'CL',
	numLoansFundraising,
	region: 'South America',
});

export const mockTransformedColombia = (numLoansFundraising = 152) => ({
	name: 'Colombia',
	isoCode: 'CO',
	numLoansFundraising,
	region: 'South America',
});

export const mockTransformedSouthAmerica = (
	countries = [mockTransformedChile(), mockTransformedColombia()],
	numLoansFundraising = 172
) => ({
	region: 'South America',
	numLoansFundraising,
	countries,
});

export const mockTransformedRegions = [mockTransformedMiddleEast(), mockTransformedSouthAmerica()];
