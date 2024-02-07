import ThanksPage from '@/pages/Thanks/ThanksPage';
import apolloStoryMixin from '../mixins/apollo-story-mixin';
import cookieStoreStoryMixin from '../mixins/cookie-store-story-mixin';
import kvAuth0StoryMixin from '../mixins/kv-auth0-story-mixin';
import {
	maleLoanData,
	femaleLoanData,
	femaleLoanDataWithInviter,
	iwdExperiment,
} from '../mock-data/thanks-page-data-mock';
import VueRouter from 'vue-router';

const routes = new VueRouter();

export default {
	title: 'Page/ThanksPage',
	component: ThanksPage,
	decorators: [
		(story, { args }) => {
			// Ensure story iframe loads with expected query string
			routes.replace(`/?${args.queryString}`).catch(() => { });
			return story();
		}
	]
};

const story = (queryResult = {}, fragmentResult = {}, queryString = '') => {
	const template = () => ({
		components: { ThanksPage },
		mixins: [cookieStoreStoryMixin(), kvAuth0StoryMixin],
		// Using provide ensures that apollo is not shared between stories
		provide: apolloStoryMixin({ queryResult, fragmentResult }).provide,
		routes,
		template: '<thanks-page />',
	});
	template.args = { queryString };
	return template;
};

export const Default = story(maleLoanData);

export const IWDNoFemaleLoan = story(maleLoanData, iwdExperiment);

export const IWDNoInviter = story(femaleLoanData, iwdExperiment);

export const IWDInviterKiva = story(femaleLoanData, iwdExperiment, 'valet_inviter=kiva');

export const IWDInviterLender = story(femaleLoanDataWithInviter, iwdExperiment, 'valet_inviter=mary19806605');

