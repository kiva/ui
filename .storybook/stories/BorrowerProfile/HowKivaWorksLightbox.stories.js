import HowKivaWorksLightbox from '#src/components/BorrowerProfile/HowKivaWorksLightbox';

export default {
	title: 'Components/BorrowerProfile/HowKivaWorksLightbox',
	component: HowKivaWorksLightbox,
};

export const Default = () => ({
	components: { HowKivaWorksLightbox },
	data() {
		return { visible: true };
	},
	template: `
		<div>
			<button class="tw-text-link" @click="visible = true">How it works</button>
			<how-kiva-works-lightbox
				:visible="visible"
				@lightbox-closed="visible = false"
			/>
		</div>
	`,
});
