import ChallengeCallout from '@/components/Lend/LoanSearch/ChallengeCallout';
import apolloStoryMixin from "../mixins/apollo-story-mixin";

export default {
	title: 'Components/ChallengeCallout',
	component: ChallengeCallout,
};

const story = (args = {}) => {
	const template = (_args, { argTypes }) => ({
		props: Object.keys(argTypes),
		components: { ChallengeCallout },
		mixins: [apolloStoryMixin()],
		setup() { return { args }; },
		template: `
			<challenge-callout v-bind="args" />
		`,
	});
	template.args = args;
	return template;
};

const publicLendProfile = {
	id: 2383848,
	name: 'Mary',
	image: {
		url: 'https://www-0.development.kiva.org/img/s100/4da4a17c4b35913d22114bf29bb1911b.jpg',
		width: 3264,
		height: 2448,
	},
	publicId: 'mary19806605',
};


export const Default = story({ teamName: 'A+' });
export const Lender = story({ shareLender: publicLendProfile, teamName: 'A+' });
export const AddToCard = story({
	currentLender: { lender: publicLendProfile },
	teamName: 'A+',
	showAddedToCartMessage: true,
	borrowerName: 'Borrower',
});
