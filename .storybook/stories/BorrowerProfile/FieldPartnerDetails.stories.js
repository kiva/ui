import FieldPartnerDetails from '#src/components/BorrowerProfile/FieldPartnerDetails';

export default {
	title: 'Components/BorrowerProfile/FieldPartnerDetails',
	component: FieldPartnerDetails,
};

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
	startDate: '2018-06-01',
	loansPosted: 12450,
	totalAmountRaised: 18500000,
	avgLoanSizePercentPerCapitaIncome: 42.5,
};

function monthsAgoIso(months) {
	const d = new Date();
	d.setMonth(d.getMonth() - months);
	return d.toISOString().slice(0, 10);
}

export const AllMetrics = () => ({
	components: { FieldPartnerDetails },
	data: () => ({ ...basePartner }),
	template: '<field-partner-details v-bind="$data" />',
});

export const LessThanOneYear = () => ({
	components: { FieldPartnerDetails },
	data: () => ({
		...basePartner,
		startDate: monthsAgoIso(3),
	}),
	template: '<field-partner-details v-bind="$data" />',
});

export const MissingOptionalFields = () => ({
	components: { FieldPartnerDetails },
	data: () => ({
		...basePartner,
		startDate: '',
		loansPosted: 0,
		totalAmountRaised: 0,
		avgLoanSizePercentPerCapitaIncome: 0,
	}),
	template: '<field-partner-details v-bind="$data" />',
});
