import { defaultBadges } from '#src/util/achievementUtils';
import { gql } from 'graphql-tag';
import logReadQueryError from '#src/util/logReadQueryError';

export const badgeQuery = gql`query contentfulBadgeImage ($badgeKey: String!) {
	contentful {
		entries(contentKey: $badgeKey, contentType: "challenge")
	}
}`;

// Targets defined for each level
const levelsTarget = {
	level1: 2,
	level2: 3,
	level3: 5,
	level4: 10,
	level5: 20,
	level6: 50,
	level7: 100,
};

export default function useBadgeContentfulData(client, route) {
	const utmCampaign = route?.query?.utm_campaign ?? '';
	const isUtmValid = utmCampaign.includes('badge_') && utmCampaign.includes('social_share');
	const badgeKey = utmCampaign.split('badge_')[1];

	const loadBadgeInfo = async () => {
		let badgeImage = null;
		let badgeCategory = '';
		let badgeTarget = 0;

		try {
			const data = client.readQuery({
				query: badgeQuery,
				variables: { badgeKey }
			});

			const contentfulData = data?.contentful?.entries?.items ?? null;
			if (contentfulData) {
				badgeImage = contentfulData?.[0]?.fields?.badgeImage?.fields?.file?.url ?? null;
				badgeCategory = contentfulData?.[0]?.fields?.challengeName ?? '';
				badgeTarget = levelsTarget?.[`level${contentfulData?.[0]?.fields?.level}`] ?? 0;
			}
		} catch (e) {
			logReadQueryError(e, 'useBadgeContentfulData');
		}

		return {
			badgeImage,
			badgeCategory,
			badgeTarget,
		};
	};

	return {
		badgeQuery,
		badgeKey,
		isBadgeKeyValid: isUtmValid && defaultBadges.some(badgeName => badgeKey.includes(badgeName)),
		loadBadgeInfo,
	};
}
