import GoalEntrypoint from '#src/components/Thanks/SingleVersion/GoalEntrypoint.vue';
import loanDataMock from '../mock-data/loan-data-mock';

const PHOTO_PATH = 'https://www.kiva.org/img/';
const baseLoan = loanDataMock[2];

// Card props the recommended-loan step forwards to KvCompactLoanCard.
const baseRecommendLoanCardProps = {
	loan: baseLoan,
	loanId: baseLoan.id,
	photoPath: PHOTO_PATH,
	showTags: true,
	externalLinks: true,
	customLoanDetails: true,
	showLightView: true,
	basketItems: [],
	route: {},
};

const recommendLoanHeaderDetails = ['12 loan goal', 'Women', '2 loans completed'];

export default {
	title: 'MyKiva/GoalEntrypoint',
	component: GoalEntrypoint,
};

const story = (args) => {
	const template = (_args, { argTypes }) => ({
		props: Object.keys(argTypes),
		components: { GoalEntrypoint },
		setup() {
			const kvTrackFunction = () => {};
			return {
				args,
				recommendLoanCardProps: { ...baseRecommendLoanCardProps, kvTrackFunction },
			};
		},
		template: `
			<div style="max-width: 620px;">
				<goal-entrypoint
					v-bind="args"
					:recommend-loan-card-props="recommendLoanCardProps"
				/>
			</div>
		`,
	});
	template.args = args;
	return template;
};

export const Loading = story({
	loading: true,
});

export const NoWomenLoansPastYear = story({
	loading: false,
	totalLoans: 0,
	tieredAchievements: [],
});

export const OneDigitLoans = story({
	loading: false,
	totalLoans: 2,
	categoriesLoanCount: {
		'womens-equality': 2,
	},
});

export const ThreeDigitsLoans = story({
	loading: false,
	totalLoans: 200,
	categoriesLoanCount: {
		'womens-equality': 200,
	},
});

// Recommended-loan step (ExpressCheckout) shown after the goal is set.
export const RecommendedLoanExpressCheckout = story({
	loading: false,
	showRecommendLoanAfterGoalView: true,
	loadedSetData: true,
	recommendLoanHeaderDetails,
});

// Recommended loan already in the basket — footer shows the checkout CTA.
export const RecommendedLoanInBasket = story({
	loading: false,
	showRecommendLoanAfterGoalView: true,
	loadedSetData: true,
	recommendLoanHeaderDetails,
	recommendLoanIsInBasket: true,
});
