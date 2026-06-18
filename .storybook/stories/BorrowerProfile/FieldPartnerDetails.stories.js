import FieldPartnerDetails from '#src/components/BorrowerProfile/FieldPartnerDetails';

export default {
	title: 'Components/BorrowerProfile/FieldPartnerDetails',
	component: FieldPartnerDetails,
};

// Only props the component actually renders. (It does not accept startDate,
// loansPosted, totalAmountRaised or avgLoanSizePercentPerCapitaIncome.)
const basePartner = {
	partnerId: 100,
	partnerName: 'Bai Tushum Bank',
	avgBorrowerCost: 35,
	avgBorrowerCostType: 'interest',
	avgProfitability: 2.5,
	arrearsRate: 0.02,
	loansAtRiskRate: 3,
	defaultRate: 1.25,
	riskRating: 3.5,
	currencyExchangeLossRate: 0.05,
};

export const AllMetrics = () => ({
	components: { FieldPartnerDetails },
	data: () => ({ ...basePartner }),
	template: '<field-partner-details v-bind="$data" />',
});

// avgBorrowerCost of 0 makes the "Average cost to borrower" metric render as "N/A".
export const NoAverageCost = () => ({
	components: { FieldPartnerDetails },
	data: () => ({ ...basePartner, avgBorrowerCost: 0 }),
	template: '<field-partner-details v-bind="$data" />',
});

// riskRating drives the star rating display (5 full stars vs the default 3.5).
export const HighRiskRating = () => ({
	components: { FieldPartnerDetails },
	data: () => ({ ...basePartner, riskRating: 5 }),
	template: '<field-partner-details v-bind="$data" />',
});
