
import StoryRouter from 'storybook-vue-router';
import {
	contentfulMediaImg,
	contentfulGenericContentBlock,
	contentfulBackground,
	contentfulMediaVideo,
	contentfulResponsiveImageSet
} from '../mock-data/contentful-data-mock';
import DynamicHero from '@/components/Contentful/DynamicHero.vue';

const heroContentGroup = {
	"key": "homepage-hero-eddie-test",
	"name": "Eddie test homepage hero",
	"type": "dynamicHero",
	"contents": [
		{...contentfulGenericContentBlock('hero-text')},
	],
}

export default {
	title: 'ContentfulPage/DynamicHero',
	component: DynamicHero,
	decorators: [StoryRouter()],
	args: {
		content: heroContentGroup,
	},
	argTypes: {},
	layout: 'fullscreen',
};

export const Default = (args, { argTypes }) => ({
	props: Object.keys(argTypes),
	components: {
		DynamicHero,
	},
	template: `
		<dynamic-hero :content="content"/>
	`,
});
Default.args = {
	content: {
		...heroContentGroup,
		"media": [
			{...contentfulMediaImg()}		]
	}
};

export const ResponsiveImage = (args, { argTypes }) => ({
	props: Object.keys(argTypes),
	components: {
		DynamicHero,
	},
	provide: {
		apollo: {
			readQuery() {
				return {}
			},
			query(params) {
				return Promise.resolve({});
			},
		},
	},
	template: `
		<dynamic-hero :content="content"/>
	`,
});

ResponsiveImage.args = {
	content: {
		...heroContentGroup,
		contents: [
			{...contentfulGenericContentBlock('hero-text')},
			{...contentfulBackground('color')},
			{...contentfulResponsiveImageSet}
		],
		media: null
	}
};

export const MultipleImages = (args, { argTypes }) => ({
	props: Object.keys(argTypes),
	components: {
		DynamicHero,
	},
	provide: {
		apollo: {
			readQuery() {
				return {}
			},
			query(params) {
				return Promise.resolve({});
			},
		},
	},
	template: `
		<dynamic-hero :content="content"/>
	`,
});

MultipleImages.args = {
	content: {
		...heroContentGroup,
		"media": [
			{...contentfulMediaImg()},
			{...contentfulMediaImg()},
			{...contentfulMediaImg()}
		]
	}
};

export const Video = (args, { argTypes }) => ({
	props: Object.keys(argTypes),
	components: {
		DynamicHero,
	},
	template: `
		<dynamic-hero :content="content"/>
	`,
});

Video.args = {
	content: {
		...heroContentGroup,
		"media": [
			{...contentfulMediaVideo},
		]
	}
};

export const BackgroundVideo = (args, { argTypes }) => ({
	props: Object.keys(argTypes),
	components: {
		DynamicHero,
	},
	template: `
		<dynamic-hero :content="content"/>
	`,
});

BackgroundVideo.args = {
	content: {
		...heroContentGroup,
		contents: [
			{...contentfulGenericContentBlock('hero-text')},
			{...contentfulBackground('video')}
		],
		"media": [
			{...contentfulMediaImg()}
		]
	}
};

export const BackgroundImage = (args, { argTypes }) => ({
	props: Object.keys(argTypes),
	components: {
		DynamicHero,
	},
	template: `
		<dynamic-hero :content="content"/>
	`,
});

BackgroundImage.args = {
	content: {
		...heroContentGroup,
		contents: [
			{...contentfulGenericContentBlock('hero-text')},
			{...contentfulBackground('image')}
		],
		"media": [
			{...contentfulMediaImg()}
		]
	}
};

export const BackgroundColor = (args, { argTypes }) => ({
	props: Object.keys(argTypes),
	components: {
		DynamicHero,
	},
	template: `
		<dynamic-hero :content="content"/>
	`,
});

BackgroundColor.args = {
	content: {
		...heroContentGroup,
		contents: [
			{...contentfulGenericContentBlock('hero-text')},
			{...contentfulBackground('color')}
		],
		"media": [
			{...contentfulMediaImg()}
		]
	}
};
