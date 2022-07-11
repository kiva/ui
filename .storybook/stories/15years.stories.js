import Vue from 'vue';

// import plugins
import kivaPlugins from '@/plugins';
Vue.use(kivaPlugins);

import AppealBanner15 from '@/components/WwwFrame/PromotionalBanner/Banners/AppealBanner/AppealBanner15';
import FifteenYears from '@/pages/15Years/15Years';
import FifteenYearsHeader from '@/components/15Years/15YearsHeader';
import FifteenYearsHowKivaWorks from '@/components/15Years/15YearsHowKivaWorks';
import FifteenYearsIndividuals from '@/components/15Years/15YearsIndividuals';
import FifteenYearsPartners from '@/components/15Years/15YearsPartners';
import FifteenYearsStyles from '@/components/15Years/15YearsStyles';
import FifteenYearsTimeline from '@/components/15Years/15YearsTimeline';

import apolloStoryMixin from '../mixins/apollo-story-mixin';
import kvAuth0StoryMixin from '../mixins/kv-auth0-story-mixin';
import {appealBanner} from '../mock-data/contentful-data-mock';
import countryFacetsDataMock from '../mock-data/country-facets-data-mock';
import cookieStoreStoryMixin from '../mixins/cookie-store-story-mixin';

// This decorator applies the 15 year styles to the individual components in storybook
// so they can be viewed in the same way they're applied in the 15Year page.
const FifteenYearsDecorator = () => ({
	components: {
		FifteenYearsStyles,
	},
	template: `
		<div>
			<svg xmlns="http://www.w3.org/2000/svg" style="display:none;" xmlns:xlink="http://www.w3.org/1999/xlink"><symbol viewBox="0 0 20.1 10.3" id="icon-fat-chevron"><![CDATA[
				]]><path d="M10.05 10.3l-10-8L2.4 0l7.65 6.14L17.72 0l2.38 2.28z"></path><![CDATA[
			]]></symbol><symbol viewBox="0 0 67 29" id="icon-large-chevron-mobile"><![CDATA[
				]]><path d="M33.5 27.6L.7 1.4l.6-.8 32.2 25.8L65.7.6l.6.8z"></path><![CDATA[
			]]></symbol><symbol viewBox="0 0 102 43" id="icon-large-chevron"><![CDATA[
				]]><path d="M51 41.6l-.3-.2-50-40 .6-.7L51 40.4 100.7.6l.6.8z"></path><![CDATA[
			]]></symbol><symbol viewBox="0 0 22 22" id="icon-magnify-glass"><![CDATA[
				]]><path d="M8 16.31a8.853 8.853 0 004.953 1.5c2.382 0 4.62-.928 6.305-2.612a8.858 8.858 0 002.61-6.305c0-2.381-.927-4.62-2.61-6.304a8.858 8.858 0 00-6.305-2.611c-2.381 0-4.62.927-6.304 2.611a8.857 8.857 0 00-2.612 6.305c0 1.81.537 3.537 1.533 5L.18 19.288c-.253.253-.198.719.123 1.04l1.26 1.26c.321.321.787.376 1.04.123L8 16.311zM6.454 8.893c0-3.584 2.916-6.5 6.5-6.5s6.5 2.916 6.5 6.5c0 3.585-2.916 6.5-6.5 6.5a6.508 6.508 0 01-6.5-6.5z"></path><![CDATA[
			]]></symbol><symbol viewBox="0 0 52 23" id="icon-medium-chevron"><![CDATA[
				]]><path d="M26 21.6L.7 1.4l.6-.8L26 20.4 50.7.6l.6.8z"></path><![CDATA[
			]]></symbol><symbol viewBox="0 0 50 22" id="icon-small-chevron-mobile"><![CDATA[
				]]><path d="M25 21.6L-.3 1.4.3.6 25 20.4 49.7.6l.6.8z"></path><![CDATA[
			]]></symbol><symbol viewBox="0 0 32 15" id="icon-small-chevron"><![CDATA[
				]]><path d="M16 13.6L.7 1.4l.6-.8L16 12.4 30.7.6l.6.8z"></path><![CDATA[
			]]></symbol><symbol viewBox="0 0 29 29" id="icon-small-x"><![CDATA[
				]]><path d="M23 20.168l-8.185-8.187L23 3.807 20.168 1l-8.182 8.179L3.81 1 1 3.81l8.186 8.196L1 20.19 3.81 23l8.203-8.192L20.193 23z"></path><![CDATA[
			]]></symbol><symbol viewBox="0 0 24 24" id="icon-star"><![CDATA[
				]]><path d="M0 0h24v24H0z"></path><![CDATA[
				]]><path fill="currentColor" d="M12 0l2.832 9.168H24l-7.416 5.665L19.416 24 12 18.335 4.583 24l2.833-9.167L0 9.168h9.167L12 0z"></path><![CDATA[
			]]></symbol><symbol viewBox="0 0 12 7" id="icon-triangle"><![CDATA[
				]]><path d="M6 0l6 6.857H0z" fill-rule="evenodd"></path><![CDATA[
			]]></symbol><symbol viewBox="0 0 29 29" id="icon-x"><![CDATA[
				]]><path d="M27.3 28.8L14.5 16 1.7 28.8.3 27.3l12.8-12.8L.3 1.7 1.7.3l12.8 12.8L27.3.3l1.4 1.5-12.8 12.8 12.8 12.8z"></path><![CDATA[
			]]></symbol>
			</svg>
			<fifteen-years-styles>
				<div style="margin: -1rem;">
					<story/>
				</div>
			</fifteen-years-styles>
		</div>`,
});

const minFundedLoans = 0;
const maxFundedLoans = 15000
const recentFundedLoans = {
	data: {
		general: {
			kivaStats: {
				numRecentFundedLoans: Math.floor(Math.random() * (maxFundedLoans - minFundedLoans + 1) + minFundedLoans),
			}
		}
	}
};

export default {
	title: 'Page/15Years',
	component: FifteenYears,
	args: {
		appealBannerContent: appealBanner,
	},
	layout: 'fullscreen',
};

export const Combined = (args, { argTypes }) => ({
	props: Object.keys(argTypes),
	components: {
		FifteenYears,
	},
	layout: 'fullscreen',
	mixins: [apolloStoryMixin({ queryResult: countryFacetsDataMock}),  cookieStoreStoryMixin(), kvAuth0StoryMixin],
	template: `
		<div style="margin: -1rem;"><fifteen-years /></div>
	`,
});

export const AppealBanner = (args, { argTypes }) => ({
	components: {
		AppealBanner15,
	},
	props: Object.keys(argTypes),
	decorators: [FifteenYearsDecorator],
	mixins: [apolloStoryMixin({ queryResult: recentFundedLoans}), cookieStoreStoryMixin(), kvAuth0StoryMixin],
	template: `
		<appeal-banner-15 :appeal-banner-content="appealBannerContent"  />
	`,
});

export const Header = (args, { argTypes }) => ({
	components: {
		FifteenYearsHeader,
	},
	props: Object.keys(argTypes),
	decorators: [FifteenYearsDecorator],
	mixins: [apolloStoryMixin({ queryResult: countryFacetsDataMock}), cookieStoreStoryMixin(), kvAuth0StoryMixin],
	template: `
		<fifteen-years-header />
	`,
});

export const Timeline = (args, { argTypes }) => ({
	components: {
		FifteenYearsTimeline,
	},
	props: Object.keys(argTypes),
	decorators: [FifteenYearsDecorator],
	mixins: [apolloStoryMixin(), kvAuth0StoryMixin],
	template: `
		<fifteen-years-timeline />
	`,
});

export const Individuals = (args, { argTypes }) => ({
	components: {
		FifteenYearsIndividuals,
	},
	props: Object.keys(argTypes),
	mixins: [apolloStoryMixin(), kvAuth0StoryMixin],
	decorators: [FifteenYearsDecorator],
	template: `
		<fifteen-years-individuals />
	`,
});

export const Partners = (args, { argTypes }) => ({
	components: {
		FifteenYearsPartners,
	},
	props: Object.keys(argTypes),
	mixins: [apolloStoryMixin(), kvAuth0StoryMixin],
	decorators: [FifteenYearsDecorator],
	template: `
		<fifteen-years-partners />
	`,
});

export const HowKivaWorks = (args, { argTypes }) => ({
	components: {
		FifteenYearsHowKivaWorks,
	},
	props: Object.keys(argTypes),
	mixins: [apolloStoryMixin(), kvAuth0StoryMixin],
	decorators: [FifteenYearsDecorator],
	template: `
		<fifteen-years-how-kiva-works />
	`,
});
