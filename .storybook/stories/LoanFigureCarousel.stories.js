import LoanFigureCarousel from '#src/components/BorrowerProfile/LoanFigureCarousel';

export default {
	title: 'BorrowerProfile/LoanFigureCarousel',
	component: LoanFigureCarousel,
};

const IMAGE_A = {
	__typename: 'Image',
	id: 1,
	hash: '4d844ac2c0b77a8a522741b908ea5c32',
};
const IMAGE_B = {
	__typename: 'Image',
	id: 2,
	hash: '7a39b55d6c72e12c0a06a1d9e5f9b0d1',
};
const IMAGE_C = {
	__typename: 'Image',
	id: 3,
	hash: 'c44a3d1fa7a3e8e8f3b2a9c0d5e6f7a8',
};
const VIDEO = {
	__typename: 'Video',
	youtubeId: 'dQw4w9WgXcQ',
};

const story = (args) => {
	const template = () => ({
		components: { LoanFigureCarousel },
		setup() { return { args }; },
		template: `
			<div style="max-width: 420px;">
				<loan-figure-carousel v-bind="args" />
			</div>
		`,
	});
	template.args = args;
	return template;
};

export const SingleImage = story({
	name: 'Maria',
	figures: [IMAGE_A],
});

export const SingleVideo = story({
	name: 'Maria',
	figures: [VIDEO],
});

export const MultipleImages = story({
	name: 'Maria',
	figures: [IMAGE_A, IMAGE_B, IMAGE_C],
});

export const MixedImagesAndVideo = story({
	name: 'Maria',
	figures: [IMAGE_A, VIDEO, IMAGE_B],
});
