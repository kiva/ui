import ThanksPage from '@/pages/Thanks/ThanksPage';
import apolloStoryMixin from '../mixins/apollo-story-mixin';
import cookieStoreStoryMixin from '../mixins/cookie-store-story-mixin';
import kvAuth0StoryMixin from '../mixins/kv-auth0-story-mixin';
import { maleLoanData, femaleLoanData, iwdExperiment } from '../mock-data/thanks-page-data-mock';

export default {
	title: 'Page/ThanksPage',
	component: ThanksPage,
};

const story = (queryResult = {}, fragmentResult = {}) => {
	const template = () => ({
		components: { ThanksPage },
		mixins: [cookieStoreStoryMixin(), kvAuth0StoryMixin],
		// Using provide ensures that apollo is not shared between stories
		provide: apolloStoryMixin({ queryResult, fragmentResult }).provide,
		template: '<thanks-page />',
	})
	return template;
};

export const Default = story(maleLoanData);

export const IWD = story(femaleLoanData, iwdExperiment);

export const IWDNoFemaleLoan = story(maleLoanData, iwdExperiment);
