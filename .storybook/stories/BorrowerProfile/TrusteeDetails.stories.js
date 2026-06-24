import TrusteeDetails from '#src/components/BorrowerProfile/TrusteeDetails';

export default {
	title: 'Components/BorrowerProfile/TrusteeDetails',
	component: TrusteeDetails,
};

const baseTrustee = {
	borrowerName: 'Sample borrower',
	trusteeName: 'Willy Wonka',
	endorsement: 'This borrower has been endorsed by a local Kiva trustee.',
	numLoansEndorsedPublic: 342,
	totalLoansValue: '1875000.00',
	numDefaultedLoans: 7,
	repaymentRate: 98,
	trusteeId: 12345,
};

export const WithEndorsement = () => ({
	components: { TrusteeDetails },
	data: () => ({ ...baseTrustee }),
	template: '<trustee-details v-bind="$data" />',
});
WithEndorsement.storyName = 'Trustee (with endorsement)';

export const WithoutEndorsementText = () => ({
	components: { TrusteeDetails },
	data: () => ({ ...baseTrustee, endorsement: '' }),
	template: '<trustee-details v-bind="$data" />',
});

export const NoTrusteeEndorsement = () => ({
	components: { TrusteeDetails },
	data: () => ({
		...baseTrustee,
		trusteeName: 'No Trustee Endorsement',
		endorsement: '',
		numLoansEndorsedPublic: 0,
		totalLoansValue: '0.00',
		numDefaultedLoans: 0,
		repaymentRate: 0,
	}),
	template: '<trustee-details v-bind="$data" />',
});
