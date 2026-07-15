import ContentContainer from '#src/components/BorrowerProfile/ContentContainer';
import LoanFigureCarousel from '#src/components/BorrowerProfile/LoanFigureCarousel';

export default {
	title: 'Components/BorrowerProfile/LoanFigureCarousel',
	component: LoanFigureCarousel,
};

const IMAGE_A = {
	__typename: 'Image',
	id: 1,
	hash: '9673d0722a7675b9b8d11f90849d9b44',
};
const IMAGE_B = {
	__typename: 'Image',
	id: 2,
	hash: '6638894152e5ea6f0e65423b7b6cd9bb',
};
const IMAGE_C = {
	__typename: 'Image',
	id: 3,
	hash: '131e7cc9d0de32daad20d90b3a39c8a8',
};
const VIDEO = {
	__typename: 'Video',
	youtubeId: '_vikEQ3pWqo',
};

const story = (args) => {
	const template = () => ({
		components: { ContentContainer, LoanFigureCarousel },
		setup() { return { args }; },
		template: `
			<content-container>
				<loan-figure-carousel v-bind="args" />
			</content-container>
		`,
	});
	template.args = args;
	return template;
};

export const Loading = story({});

export const SingleImage = story({
	name: 'Maria',
	figures: [IMAGE_A],
});

export const MultipleImages = story({
	name: 'Maria',
	figures: [IMAGE_A, IMAGE_B, IMAGE_C],
});

export const MixedImagesAndVideo = story({
	name: 'Maria',
	figures: [VIDEO, IMAGE_A],
});
