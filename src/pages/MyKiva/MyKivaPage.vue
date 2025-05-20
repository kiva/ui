<template>
	<www-page main-class="tw-bg-secondary tw-overflow-hidden tw-relative" class="tw-relative">
		<my-kiva-page-content />
	</www-page>
</template>

<script>
import { readBoolSetting } from '#src/util/settingsUtils';
import logReadQueryError from '#src/util/logReadQueryError';
import { CONTENTFUL_CAROUSEL_KEY, MY_KIVA_HERO_ENABLE_KEY } from '#src/util/myKivaUtils';
import myKivaQuery from '#src/graphql/query/myKiva.graphql';
import lendingStatsQuery from '#src/graphql/query/myLendingStats.graphql';
import contentfulEntriesQuery from '#src/graphql/query/contentfulEntries.graphql';
import uiConfigSettingQuery from '#src/graphql/query/uiConfigSetting.graphql';
import userAchievementProgressQuery from '#src/graphql/query/userAchievementProgress.graphql';
import WwwPage from '#src/components/WwwFrame/WwwPage';
import MyKivaPageContent from '#src/pages/MyKiva/MyKivaPageContent';

/**
 * Options API parent needed to ensure WWwPage children options API preFetch works,
 * specifically for header component data preFetch
 */
export default {
	name: 'MyKivaPage',
	inject: ['apollo', 'cookieStore'],
	components: {
		WwwPage,
		MyKivaPageContent,
	},
	apollo: {
		preFetch(config, client) {
			return Promise.all([
				client.query({ query: myKivaQuery }),
				client.query({ query: lendingStatsQuery }),
				client.query({ query: uiConfigSettingQuery, variables: { key: MY_KIVA_HERO_ENABLE_KEY } }),
			]).then(result => {
				const heroCarouselUiSetting = result[2];
				const isHeroEnabled = readBoolSetting(heroCarouselUiSetting, 'data.general.uiConfigSetting.value');

				if (isHeroEnabled) {
					return Promise.all([
						client.query({
							query: contentfulEntriesQuery,
							variables: { contentType: 'carousel', contentKey: CONTENTFUL_CAROUSEL_KEY },
						}),
						client.query({
							query: contentfulEntriesQuery,
							variables: { contentType: 'challenge', limit: 200 }
						}),
						client.query({ query: userAchievementProgressQuery })
					]).catch(error => {
						logReadQueryError(error, 'myKivaPage Hero Data Prefetch');
					});
				}
			}).catch(error => {
				logReadQueryError(error, 'myKivaPage Prefetch');
			});
		},
	},
};
</script>
