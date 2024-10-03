import JournalUpdateCard from '#src/components/MyKiva/JournalUpdateCard.vue';
import { mockLoansArray } from '../utils';
import apolloStoryMixin from '../mixins/apollo-story-mixin';
import cookieStoreStoryMixin from "../mixins/cookie-store-story-mixin";

export default {
	title: 'MyKiva/JournalUpdateCard',
	component: JournalUpdateCard,
};

const mockLoans = mockLoansArray(1);

const update = {
	"id": 1365244,
	"body": "I’m thrilled to update you on our progress! Thanks to your support, we’ve entered the next phase of our journey—choosing the perfect fabric for our new bust-friendly styles. The swatches are on their way, and we’re evaluating two amazing options:<br />\r\n<br />\r\nCotton Spandex Jersey<br />\r\nBamboo Viscose Spandex<br />\r\n<br />\r\nBoth fabrics are not only comfortable and functional, but they are also natural and better for the environment. Choosing natural fabrics like cotton and bamboo is important to us because they are biodegradable, unlike synthetic materials that contribute to long-term pollution. Additionally, natural fabrics require fewer chemicals in their production, and bamboo in particular grows rapidly without the need for pesticides, making it a more sustainable option.<br />\r\n<br />\r\nWe prioritize breathability and comfort, but also want to do our part in reducing the fashion industry’s environmental footprint. By choosing natural fabrics, we’re working toward creating sustainable, eco-friendly clothing that looks good, feels good, and is better for the planet.<br />\r\n<br />\r\nThank you once again for your belief in our mission and for your support in helping us bring these new styles to life. I’ll keep you updated on our final choice, and as always, we are grateful for your continued support!<br />\r\n<br />\r\nWarm regards,<br />\r\nKristen Allen<br />\r\nFounder, Exclusively Kristen",
	"subject": "Exciting Update: Fabric Swatches Are on the Way!",
	"date": "2024-09-21T11:37:31Z",
	"image": null
};

const lender = {
	id: 1017469,
	public: true,
    inviterName: 'Test User',
};

const story = (args = {}) => {
	const template = (_args, { argTypes }) => ({
		props: Object.keys(argTypes),
		components: { JournalUpdateCard },
		mixins: [apolloStoryMixin(), cookieStoreStoryMixin()],
		setup() { return { args }; },
		provide: {
			$kvTrackEvent: () => Promise.resolve({
				fn: () => ({}),
			}),
		},
		template: `
			<div class="tw-bg-eco-green-1 tw-p-1" style="max-width: 450px;">
				<journal-update-card
					v-bind="args"
					@read-more-clicked="onReadMoreClicked"
					@share-loan-clicked="onShareLoanClicked"
				/>
			</div>
		`,
		methods: {
			onReadMoreClicked(updateId) {
				console.log(updateId);
			},
			onShareLoanClicked() {
				console.log('share loan clicked');
			},
		},
	});
	template.args = args;
	return template;
};

export const Default = story({ loan: mockLoans[0], update, lender });
export const Repaying = story({ loan: { ...mockLoans[0], status: 'payingBack' }, update, lender });
export const UpdateNumber = story({ loan: mockLoans[0], update, updateNumber: '2', lender });
export const NotTruncatedBody = story({ loan: { ...mockLoans[0], status: 'payingBack' }, update: { ...update, body: 'Testing not truncated body feature.' }, lender});
