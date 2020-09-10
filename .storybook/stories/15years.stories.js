import Vue from 'vue'

// import plugins
import kivaPlugins from '@/plugins';
Vue.use(kivaPlugins)

import StoryRouter from 'storybook-vue-router';
import FifteenYearsLanding from '@/pages/15Years/15Years';
import FifteenYearsIndividuals from '@/components/15Years/15YearsIndividuals';
import FifteenYearsSponsors from '@/components/15Years/15YearsSponsors';
import FifteenYearsHowKivaWorks from '@/components/15Years/15YearsHowKivaWorks';
import FifteenYearsTimeline from '@/components/15Years/15YearsTimeline';
import apolloStoryMixin from '../mixins/apollo-story-mixin';
import kvAuth0StoryMixin from '../mixins/kv-auth0-story-mixin';

export default {
	title: 'Pages/15Years',
	component: FifteenYearsLanding,
	args: {},
	argTypes: {},
	layout: 'fullscreen',
	decorators: [StoryRouter()]
};

export const Default = (args, { argTypes }) => ({
	props: Object.keys(argTypes),
	components: {
		FifteenYearsLanding,
	},
	layout: 'fullscreen',
	mixins: [apolloStoryMixin, kvAuth0StoryMixin],
	template: `
		<fifteen-years-landing />
	`,
});

export const Timeline = (args, { argTypes }) => ({
	components: {
		FifteenYearsTimeline
	},
	props: Object.keys(argTypes),
	mixins: [apolloStoryMixin, kvAuth0StoryMixin],
	template: `
		<fifteen-years-timeline />
	`,
});

export const Individuals = (args, { argTypes }) => ({
	components: {
		FifteenYearsIndividuals
	},
	props: Object.keys(argTypes),
	mixins: [apolloStoryMixin, kvAuth0StoryMixin],
	template: `
		<fifteen-years-individuals />
	`,
});

export const Sponsors = (args, { argTypes }) => ({
	components: {
		FifteenYearsSponsors
	},
	props: Object.keys(argTypes),
	mixins: [apolloStoryMixin, kvAuth0StoryMixin],
	template: `
		<fifteen-years-sponsors />
	`,
});

export const HowKivaWorks = (args, { argTypes }) => ({
	components: {
		FifteenYearsHowKivaWorks
	},
	props: Object.keys(argTypes),
	mixins: [apolloStoryMixin, kvAuth0StoryMixin],
	template: `
		<fifteen-years-how-kiva-works />
	`,
});
