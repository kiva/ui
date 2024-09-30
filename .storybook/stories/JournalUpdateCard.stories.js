import JournalUpdateCard from '#src/components/MyKiva/JournalUpdateCard.vue';
import { mockLoansArray } from '../utils';

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

const story = (args = {}) => {
	const template = (_args, { argTypes }) => ({
		props: Object.keys(argTypes),
		components: { JournalUpdateCard },
		setup() { return { args }; },
		provide: {
			$kvTrackEvent: () => Promise.resolve({
				fn: () => ({}),
			}),
		},
		template: `
			<div class="tw-bg-eco-green-1 tw-p-0.5">
				<journal-update-card v-bind="args" />
			</div>
		`,
	});
	template.args = args;
	return template;
};

export const Default = story({ loan: mockLoans[0], update });
export const Repaying = story({ loan: { ...mockLoans[0], status: 'payingBack' }, update });
