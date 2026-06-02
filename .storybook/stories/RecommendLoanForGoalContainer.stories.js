import RecommendLoanForGoalContainer from '#src/components/LoanCards/RecommendLoanForGoal/RecommendLoanForGoalContainer';
import loanDataMock from '../mock-data/loan-data-mock';

const PHOTO_PATH = 'https://www.kiva.org/img/';
const baseLoan = loanDataMock[2];

const headerDetails = ['12 loan goal', 'U.S. Entrepreneurs', '2 loans completed'];

const baseContentCardProps = {
	loan: baseLoan,
	loanId: baseLoan.id,
	photoPath: PHOTO_PATH,
	showTags: true,
	externalLinks: true,
	customLoanDetails: true,
	showViewLoan: false,
	isVisitor: true,
	showLightView: true,
	basketItems: [],
	route: {},
};

export default {
	title: 'Loan Cards/Recommend Loan For Goal Container',
	component: RecommendLoanForGoalContainer,
	argTypes: {
		headerTitle: { control: 'text' },
		headerDetails: { control: 'object' },
		contentHeading: { control: 'text' },
		expressCheckoutEnabled: { control: 'boolean' },
		isAdding: { control: 'boolean' },
		isInBasket: { control: 'boolean' },
		isRedirecting: { control: 'boolean' },
		loadedSetData: { control: 'boolean' },
		footerProps: { control: 'object' },
	},
};

const story = (overrides = {}) => {
	const args = {
		headerTitle: 'Goal set!',
		headerDetails,
		contentHeading: 'Start your goal with this recommended loan',
		expressCheckoutEnabled: false,
		isAdding: false,
		isInBasket: false,
		isRedirecting: false,
		loadedSetData: true,
		footerProps: {},
		...overrides,
	};
	const template = (_args, { argTypes }) => ({
		props: Object.keys(argTypes),
		components: { RecommendLoanForGoalContainer },
		setup() {
			const kvTrackFunction = () => {};
			const contentCardProps = {
				...baseContentCardProps,
				kvTrackFunction,
			};
			return { args, contentCardProps };
		},
		template: `
			<div class="tw-w-full tw-bg-white" style="max-width: 700px">
				<recommend-loan-for-goal-container
					v-bind="args"
					:content-card-props="contentCardProps"
				/>
			</div>
		`,
	});
	template.args = args;
	return template;
};

export const Default = story();

export const ExpressCheckout = story({
	expressCheckoutEnabled: true,
});

export const AddingToBasket = story({
	isAdding: true,
});

export const CheckoutReady = story({
	isInBasket: true,
});

export const Redirecting = story({
	expressCheckoutEnabled: true,
	isInBasket: true,
	isRedirecting: true,
});

export const Loading = story({
	loadedSetData: false,
});
