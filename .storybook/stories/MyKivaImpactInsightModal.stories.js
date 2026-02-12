import MyKivaImpactInsightModal from '#src/components/MyKiva/ImpactInsight/MyKivaImpactInsightModal.vue';

export default {
    title: 'MyKiva/ImpactInsight/ImpactInsightModal',
	component: MyKivaImpactInsightModal,
};

const story = (args) => {
	const template = (_args, { argTypes }) => ({
		props: Object.keys(argTypes),
		components: { MyKivaImpactInsightModal },
		setup() { return { args }; },
		template: `
			<div>
				<MyKivaImpactInsightModal
					v-bind="args"
				/>
			</div>
		`,
	});
	template.args = args;
	return template;
};

export const Default = story({
	visible: true,
	latestLoan: {
		id: 1975833,
		name: 'Mayram',
		image: {
			hash: '9673d0722a7675b9b8d11f90849d9b44',
		},
		geocode: {
			country: {
				geocode:{
					latitude: -16,
					longitude: 167
				},
				id: 231,
				isoCode: 'VU',
				name: 'Vanuatu',
				ppp: '$89,599'
			}
		},
		amount: 100,
		whySpecial: 'She is a community leader.',
		gender: 'female',
		otherLoans: [],
		amount: '-75.00',
		partner: {
			id: 123,
			loansPosted: 4567,
			__typename: 'LoanPartner',
		},
    },
});

export const NonPartner = story({
	visible: true,
	latestLoan: {
		id: 1975833,
		name: 'Mayram',
		image: {
			hash: '9673d0722a7675b9b8d11f90849d9b44',
		},
		geocode: {
			country: {
				geocode:{
					latitude: -16,
					longitude: 167
				},
				id: 231,
				isoCode: 'VU',
				name: 'Vanuatu',
				ppp: '$89,599'
			}
		},
		amount: 100,
		whySpecial: 'She is a community leader.',
		gender: 'female',
		otherLoans: [],
		amount: '-75.00',
		partner: null,
    },
});
