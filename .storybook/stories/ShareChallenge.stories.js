import ShareChallenge from '#src/components/Thanks/ShareChallenge';
import apolloStoryMixin from "../mixins/apollo-story-mixin";

export default {
	title: 'Components/ShareChallenge',
	component: ShareChallenge,
};

const socialSharingMixin = () => ({
	methods: {
		handleFacebookResponse: () => { },
		showSharePopUp: () => { },
		blueskyShareUrl: () => { },
		facebookShareUrl: () => { },
		linkedInShareUrl: () => { },
		copyLink: () => { }
	}
});

const story = (args = {}) => {
	const template = (_args, { argTypes }) => ({
		props: Object.keys(argTypes),
		components: { ShareChallenge },
		mixins: [apolloStoryMixin(), socialSharingMixin()],
		setup() { return args; },
		template:
			'<share-challenge :goal="goal" :loan="loan" :lender="lender" :team-public-id="teamPublicId" />',
	});
	return template;
};

const goal = {
	participation: {
		values: [
			{
				amountLent: 10
			}
		]
	},
	targets: {
		values: [
			{
				targetLendAmount: 20,
			}
		]
	}
}

const loan = {
	id: 1,
	name: 'Test Loan',
}

const lender = {
	inviterName: 'Test Lender',
	public: true,
	publicId: 'test-lender',
}

export const Default = story({ goal, loan });

export const Team = story({ goal, loan, teamPublicId: 'aplus' });

export const Lender = story({ goal, loan, lender, teamPublicId: 'aplus' });
