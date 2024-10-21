import { defaultBadges } from '#src/util/achievementUtils';
import { gql } from 'graphql-tag';
import logReadQueryError from '#src/util/logReadQueryError';

export const badgeQuery = gql`query contentfulBadgeImage ($badgeKey: String!) {
	contentful {
		entries(contentKey: $badgeKey, contentType: "challenge")
	}
}`;

export default function useBadgeContentfulData(client, route) {
	const utmCampaign = route?.query?.utm_campaign ?? '';
	const isUtmValid = utmCampaign.includes('badge_') && utmCampaign.includes('social_share');
	const badgeKey = utmCampaign.split('badge_')[1];

	const loadBadgeInfo = async () => {
		let badgeImage = null;
		let badgeCategory = '';

		try {
			const data = client.readQuery({
				query: badgeQuery,
				variables: { badgeKey }
			});

			const contentfulData = data?.contentful?.entries?.items ?? null;
			if (contentfulData) {
				badgeImage = contentfulData?.[0]?.fields?.badgeImage?.fields?.file?.url ?? null;
				badgeCategory = contentfulData?.[0]?.fields?.challengeName ?? '';
			}
		} catch (e) {
			logReadQueryError(e, 'useBadgeContentfulData');
		}

		return {
			badgeImage,
			badgeCategory
		};
	};

	return {
		badgeQuery,
		badgeKey,
		isBadgeKeyValid: isUtmValid && defaultBadges.includes(badgeKey),
		loadBadgeInfo,
	};
}
