import DonationNudgeLightbox from '#src/components/Checkout/DonationNudge/DonationNudgeLightbox.vue';
import cookieStoreStoryMixin from '../mixins/cookie-store-story-mixin';
import apolloStoryMixin from '../mixins/apollo-story-mixin';

const args = {
	visible: true
};

export default {
	title: 'Components/Donation Nudge Lightbox',
	component: DonationNudgeLightbox,
	args,
};

export const Default = (args, { argTypes }) => ({
	props: Object.keys(argTypes),
	components: { DonationNudgeLightbox },
	mixins: [cookieStoreStoryMixin(), apolloStoryMixin()],
	setup() { return args; },
	template: `
		<donation-nudge-lightbox
			:loan-count="1"
			:loan-reservation-total="25"
			:visible="visible"
			:close-nudge-lightbox="() => {}"
			:update-donation-to="() => {}"
			:has-custom-donation="false"
			description="Lorem Ipsum"
			:current-donation-amount="'3.75'"
		 />
		`,
});
