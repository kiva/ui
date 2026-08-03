// Sample countries for GoalInReviewSlide3 (Global reach). Includes the isoCode +
// geocode lat/long that KvMap needs to place/highlight each country, plus
// fundsLentInCountry which drives the map shade. 24 entries so the "Other (n)"
// overflow pill (shown after the first 14) is exercised.
const sampleGoalCountries = [
	{ id: '1', name: 'Burkina Faso', isoCode: 'BF', region: 'Africa', geocode: { city: 'Ouagadougou', latitude: 12.2, longitude: -1.6 }, fundsLentInCountry: 125, ppp: 2.15, numLoansFundraising: 4 },
	{ id: '2', name: 'Guatemala', isoCode: 'GT', region: 'Central America', geocode: { city: 'Guatemala City', latitude: 15.7, longitude: -90.2 }, fundsLentInCountry: 100, ppp: 5.5, numLoansFundraising: 2 },
	{ id: '3', name: "Cote D'Ivoire", isoCode: 'CI', region: 'Africa', geocode: { city: 'Abidjan', latitude: 7.5, longitude: -5.5 }, fundsLentInCountry: 75, ppp: 2.3, numLoansFundraising: 1 },
	{ id: '4', name: 'Sierra Leone', isoCode: 'SL', region: 'Africa', geocode: { city: 'Freetown', latitude: 8.5, longitude: -11.8 }, fundsLentInCountry: 200, ppp: 1.9, numLoansFundraising: 3 },
	{ id: '5', name: 'Liberia', isoCode: 'LR', region: 'Africa', geocode: { city: 'Monrovia', latitude: 6.4, longitude: -9.4 }, fundsLentInCountry: 50, ppp: 1.7, numLoansFundraising: 0 },
	{ id: '6', name: 'Egypt', isoCode: 'EG', region: 'Middle East', geocode: { city: 'Cairo', latitude: 27, longitude: 30 }, fundsLentInCountry: 300, ppp: 4.2, numLoansFundraising: 5 },
	{ id: '7', name: 'Madagascar', isoCode: 'MG', region: 'Africa', geocode: { city: 'Antananarivo', latitude: -18.8, longitude: 47 }, fundsLentInCountry: 150, ppp: 1.5, numLoansFundraising: 2 },
	{ id: '8', name: 'Kazakhstan', isoCode: 'KZ', region: 'Central Asia', geocode: { city: 'Almaty', latitude: 48, longitude: 68 }, fundsLentInCountry: 90, ppp: 3.1, numLoansFundraising: 1 },
	{ id: '9', name: 'Philippines', isoCode: 'PH', region: 'Southeast Asia', geocode: { city: 'Manila', latitude: 13, longitude: 122 }, fundsLentInCountry: 275, ppp: 3.6, numLoansFundraising: 6 },
	{ id: '10', name: 'Dominican Republic', isoCode: 'DO', region: 'Caribbean', geocode: { city: 'Santo Domingo', latitude: 19, longitude: -70.7 }, fundsLentInCountry: 60, ppp: 4.8, numLoansFundraising: 0 },
	{ id: '11', name: 'United States', isoCode: 'US', region: 'North America', geocode: { city: 'Washington', latitude: 39.8, longitude: -98.6 }, fundsLentInCountry: 400, ppp: 18, numLoansFundraising: 8 },
	{ id: '12', name: 'Mexico', isoCode: 'MX', region: 'North America', geocode: { city: 'Mexico City', latitude: 23.6, longitude: -102.5 }, fundsLentInCountry: 175, ppp: 7.2, numLoansFundraising: 3 },
	{ id: '13', name: 'Solomon Islands', isoCode: 'SB', region: 'Oceania', geocode: { city: 'Honiara', latitude: -9.6, longitude: 160.2 }, fundsLentInCountry: 40, ppp: 2, numLoansFundraising: 0 },
	{ id: '14', name: 'Tonga', isoCode: 'TO', region: 'Oceania', geocode: { city: "Nuku'alofa", latitude: -21.2, longitude: -175.2 }, fundsLentInCountry: 25, ppp: 3.9, numLoansFundraising: 0 },
	{ id: '15', name: 'Kenya', isoCode: 'KE', region: 'Africa', geocode: { city: 'Nairobi', latitude: 0.02, longitude: 37.9 }, fundsLentInCountry: 225, ppp: 2.7, numLoansFundraising: 4 },
	{ id: '16', name: 'Peru', isoCode: 'PE', region: 'South America', geocode: { city: 'Lima', latitude: -9.2, longitude: -75 }, fundsLentInCountry: 110, ppp: 5.1, numLoansFundraising: 2 },
	{ id: '17', name: 'Cambodia', isoCode: 'KH', region: 'Southeast Asia', geocode: { city: 'Phnom Penh', latitude: 12.6, longitude: 104.9 }, fundsLentInCountry: 130, ppp: 2.4, numLoansFundraising: 3 },
	{ id: '18', name: 'Uganda', isoCode: 'UG', region: 'Africa', geocode: { city: 'Kampala', latitude: 1.4, longitude: 32.3 }, fundsLentInCountry: 85, ppp: 1.8, numLoansFundraising: 1 },
	{ id: '19', name: 'Nicaragua', isoCode: 'NI', region: 'Central America', geocode: { city: 'Managua', latitude: 12.9, longitude: -85.2 }, fundsLentInCountry: 70, ppp: 3.3, numLoansFundraising: 0 },
	{ id: '20', name: 'Colombia', isoCode: 'CO', region: 'South America', geocode: { city: 'Bogota', latitude: 4.6, longitude: -74.3 }, fundsLentInCountry: 160, ppp: 5.8, numLoansFundraising: 2 },
	{ id: '21', name: 'Vietnam', isoCode: 'VN', region: 'Southeast Asia', geocode: { city: 'Hanoi', latitude: 14.1, longitude: 108.3 }, fundsLentInCountry: 190, ppp: 3.4, numLoansFundraising: 4 },
	{ id: '22', name: 'India', isoCode: 'IN', region: 'South Asia', geocode: { city: 'New Delhi', latitude: 22, longitude: 79 }, fundsLentInCountry: 350, ppp: 3.9, numLoansFundraising: 7 },
	{ id: '23', name: 'Rwanda', isoCode: 'RW', region: 'Africa', geocode: { city: 'Kigali', latitude: -1.9, longitude: 30.1 }, fundsLentInCountry: 95, ppp: 1.6, numLoansFundraising: 1 },
	{ id: '24', name: 'Ecuador', isoCode: 'EC', region: 'South America', geocode: { city: 'Quito', latitude: -1.8, longitude: -78.2 }, fundsLentInCountry: 65, ppp: 4.6, numLoansFundraising: 0 },
];

// Sample userAchievementProgress.tieredLendingAchievements for the Sectors Funded
// donut (Slide 3). A [sectorName | null, loanCount] seed expands into loanPurchases.
// One loan is re-listed in a second achievement to prove getSectorChartValues
// de-duplicates by loan id.
const sampleSectorSeed = [
	['Agriculture', 8],
	['Eco-friendly', 7],
	['Services', 5],
	['Water / Sanitation', 4],
	['Food', 3],
	['Education', 3],
	['Single Parents', 2],
	['Refugees', 2],
	['Manufacturing', 2],
];

// Expands a seed into achievement objects. A null sector name produces sector-less
// loans, which the component groups into the "Other" bucket.
function buildSectorAchievements(seed) {
	const loanPurchases = seed.flatMap(([name, count], sectorIndex) => (
		Array.from({ length: count }, (_unused, i) => ({
			purchaseTime: '2026-01-01T00:00:00Z',
			loan: {
				id: `loan-${sectorIndex}-${i}`,
				sector: name ? { id: `sector-${sectorIndex}`, name } : null,
			},
		}))
	));
	return [
		{ id: 'lending-achievement', progressForYear: loanPurchases.length, loanPurchases },
		{ id: 'womens-equality', progressForYear: 1, loanPurchases: [loanPurchases[0]] },
	];
}

// Default: every loan has a sector, so there is no "Other" bucket.
export const sampleSectorAchievements = buildSectorAchievements(sampleSectorSeed);

// "Other" case: some loans have a null sector, grouped into "Other (n)".
export const sampleSectorAchievementsWithOther = buildSectorAchievements([
	...sampleSectorSeed,
	[null, 3],
]);

export function buildSampleGoalInReviewData(year) {
	return {
		year,
		isEligible: true,
		firstName: 'Alexandra',
		goalSummary: {
			goalName: `${year} impact goal`,
			category: 'womens-equality',
			target: 14,
			status: 'completed',
			setMonth: 'January',
			dateStarted: `${year}-01-15`,
			transactionSessionCount: 6,
			countries: sampleGoalCountries,
		},
		sectorAchievements: sampleSectorAchievements,
		// TODO: supplied by the parent page from its own percentile query once
		// integrated (kept separate from goalSummary). A value >= 80 activates the
		// GoalInReviewSlide4 "Top X%" habit variant; otherwise it falls back to
		// session-based copy.
		lifetimePercentile: null,
		loanStats: {
			totalLent: 1025,
			borrowers: 14,
			percentComplete: 100,
		},
		borrowerList: [
			{
				name: 'Sample borrower',
				country: 'Sample country',
				sector: 'Sample sector',
			},
		],
		geography: {
			countries: ['Sample country'],
			bordersCrossed: 1,
		},
		sectors: [
			{
				name: 'Sample sector',
				percentage: 100,
			},
		],
		goalInsights: {
			setMonth: 'January',
			percentile: 95,
		},
		wrapUp: {
			headline: 'Your goal changed everything.',
			shareUrl: null,
		},
	};
}
