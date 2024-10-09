import JournalUpdatesCarousel from '#src/components/MyKiva/JournalUpdatesCarousel.vue';
import { mockLoansArray } from '../utils';
import apolloStoryMixin from '../mixins/apollo-story-mixin';
import cookieStoreStoryMixin from "../mixins/cookie-store-story-mixin";

export default {
	title: 'MyKiva/JournalUpdatesCarousel',
	component: JournalUpdatesCarousel,
};

const mockLoans = mockLoansArray(1);

const updates = [
	{
	  "id": 1366971,
	  "body": "Dear Kiva lenders,<br />\r\n<br />\r\nWe’re thrilled to update you on our progress and express our gratitude for your continued support! Thanks to your generous contributions, the fabric samples for our new bust-friendly styles have just arrived, and we’re excited to begin the next phase of our journey.<br />\r\n<br />\r\nOur team is meticulously reviewing each fabric to ensure it meets our high standards for durability, breathability, and overall quality. While some of the fabrics are perfect, a few have turned out to be much too thin for our needs. We’re carefully evaluating every option to ensure that the final product will be both comfortable and long-lasting.<br />\r\n<br />\r\nThank you again for believing in our mission to bring more body-inclusive, eco-friendly fashion to the world. We couldn’t do this without you, and we’ll keep you updated on the next steps!<br />\r\n<br />\r\nWarm regards,<br />\r\nKristen",
	  "subject": "Thank You for Your Support: Fabric Has Arrived!",
	  "date": "2024-09-25T15:00:09Z",
	  "image": {
		"id": 5680766,
		"url": "https://www-0.development.kiva.org/img/w200h200/bd5e2740a161233c37d0781fea0c5653.jpg"
	  }
	},
	{
	  "id": 1365244,
	  "body": "I’m thrilled to update you on our progress! Thanks to your support, we’ve entered the next phase of our journey—choosing the perfect fabric for our new bust-friendly styles. The swatches are on their way, and we’re evaluating two amazing options:<br />\r\n<br />\r\nCotton Spandex Jersey<br />\r\nBamboo Viscose Spandex<br />\r\n<br />\r\nBoth fabrics are not only comfortable and functional, but they are also natural and better for the environment. Choosing natural fabrics like cotton and bamboo is important to us because they are biodegradable, unlike synthetic materials that contribute to long-term pollution. Additionally, natural fabrics require fewer chemicals in their production, and bamboo in particular grows rapidly without the need for pesticides, making it a more sustainable option.<br />\r\n<br />\r\nWe prioritize breathability and comfort, but also want to do our part in reducing the fashion industry’s environmental footprint. By choosing natural fabrics, we’re working toward creating sustainable, eco-friendly clothing that looks good, feels good, and is better for the planet.<br />\r\n<br />\r\nThank you once again for your belief in our mission and for your support in helping us bring these new styles to life. I’ll keep you updated on our final choice, and as always, we are grateful for your continued support!<br />\r\n<br />\r\nWarm regards,<br />\r\nKristen Allen<br />\r\nFounder, Exclusively Kristen",
	  "subject": "Exciting Update: Fabric Swatches Are on the Way!",
	  "date": "2024-09-21T11:37:31Z",
	  "image": null
	},
	{
	  "id": 1364885,
	  "body": "Thank you, I am feeling so appreciative! And thanks to all lenders who have contributed in the last couple days to get us over 22% - very exciting! I am so very grateful to this community of lenders. Thank you for helping make our dream come true. We are at the final stretch with just one day to go. Please share my loan with your network and remind them it's a loan, not a donation. I plan to pay all of you back!",
	  "subject": "Freeling Grateful!",
	  "date": "2024-09-17T16:15:28Z",
	  "image": null
	},
	{
	  "id": 1364834,
	  "body": "Thanks to your amazing support, we’ve officially entered the sampling phase for our new bust-friendly designs! We’re currently selecting fabrics and colors, and we’d love to get your input. <br />\r\n<br />\r\nWhat types of fabrics do you love? Are you into bold colors, soft pastels, or neutrals? Your feedback will help us create styles that truly resonate with our supporters.<br />\r\n<br />\r\nPlease share your thoughts in the comments below—your input means the world to us as we continue this journey together! <br />\r\n<br />\r\nThank you again for believing in Exclusively Kristen! ",
	  "subject": " We’re in the Sampling Phase! ",
	  "date": "2024-09-13T16:11:15Z",
	  "image": null
	}
];

const lender = {
	id: 1017469,
	public: true,
    inviterName: 'Test User',
};

const story = (args = {}) => {
	const template = (_args, { argTypes }) => ({
		props: Object.keys(argTypes),
		components: { JournalUpdatesCarousel },
		mixins: [apolloStoryMixin(), cookieStoreStoryMixin()],
		setup() { return { args }; },
		provide: {
			$kvTrackEvent: () => Promise.resolve({
				fn: () => ({}),
			}),
		},
		template: `
			<div class="tw-bg-eco-green-1 tw-p-1">
				<journal-updates-carousel v-bind="args" />
			</div>
		`,
	});
	template.args = args;
	return template;
};

export const Default = story({ loan: mockLoans[0], updates, lender, totalUpdates: 4 });
export const SingleUpdate = story({ loan: mockLoans[0], updates: [updates[0]], lender, totalUpdates: 1 });
