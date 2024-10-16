import NewHomePageLoanCard from '#src/components/LoanCards/NewHomePageLoanCard';
import apolloStoryMixin from '../mixins/apollo-story-mixin';
import cookieStoreStoryMixin from '../mixins/cookie-store-story-mixin';

const queryResult = {
	data: {
		lend: {
			loan: {
				id: 2440030,
				distributionModel: 'fieldPartner',
				geocode: {
					country: { name: 'Peru' },
				},
				image: {
					id: 4916565,
					hash: '8e195b0d98bde6a1a1861b11ceb61188',
				},
				name: 'Lolimar',
				use: 'to buy a mixer and supplies to continue making her pastries.',
				loanAmount: '525.00',
				loanFundraisingInfo: {
					fundedAmount: '275.00',
					reservedAmount: '0.00',
				},
				fundraisingPercent: Math.floor(0.5238095238095238 * 100),
			}
		}
	}
};

export default {
	title: 'Loan Cards/New Home Page Loan Card',
	component: NewHomePageLoanCard,
};

export const Default = () => ({
	mixins: [apolloStoryMixin({ queryResult }), cookieStoreStoryMixin()],
	components: { NewHomePageLoanCard },
	template: `
		<div class="kv-tailwind">
			<new-home-page-loan-card :loan-id="1998250" />
		</div>
	`,
});

export const Loading = () => ({
	mixins: [apolloStoryMixin({ loading: true }), cookieStoreStoryMixin()],
	components: { NewHomePageLoanCard },
	template: `
		<div class="kv-tailwind">
			<new-home-page-loan-card :loan-id="1998250" />
		</div>
	`,
});

const kivaDedicationQueryResult = JSON.parse(JSON.stringify(queryResult));
kivaDedicationQueryResult.data.lend.loan.dedicationToKiva = true;

export const KivaDedication = () => ({
	mixins: [apolloStoryMixin({ queryResult: kivaDedicationQueryResult }), cookieStoreStoryMixin()],
	components: { NewHomePageLoanCard },
	template: `
		<div class="kv-tailwind">
			<new-home-page-loan-card :loan-id="1998250" />
		</div>
	`,
});

const oneReceiptDedicationQueryResult = JSON.parse(JSON.stringify(queryResult));
oneReceiptDedicationQueryResult.data.lend.loan.dedications = {
    values: [
        {
            id: "2",
            recipientName: "Mom"
        }
    ]
};

export const OneRecipientDedication = () => ({
	mixins: [apolloStoryMixin({ queryResult: oneReceiptDedicationQueryResult }), cookieStoreStoryMixin()],
	components: { NewHomePageLoanCard },
	template: `
		<div class="kv-tailwind">
			<new-home-page-loan-card :loan-id="1998250" />
		</div>
	`,
});

const multipleRecipientsDedicationQueryResult = JSON.parse(JSON.stringify(oneReceiptDedicationQueryResult));
multipleRecipientsDedicationQueryResult.data.lend.loan.dedicationToKiva = true;

export const MultipleRecipientsDedication = () => ({
	mixins: [apolloStoryMixin({ queryResult: multipleRecipientsDedicationQueryResult }), cookieStoreStoryMixin()],
	components: { NewHomePageLoanCard },
	template: `
		<div class="kv-tailwind">
			<new-home-page-loan-card :loan-id="1998250" />
		</div>
	`,
});
