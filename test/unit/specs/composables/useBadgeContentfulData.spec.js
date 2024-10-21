import logReadQueryError from '#src/util/logReadQueryError';
import useBadgeContentfulData from '#src/composables/useBadgeContentfulData';
import { defaultBadges } from '#src/util/achievementUtils';

jest.mock('#src/util/logReadQueryError');

describe('useBadgeContentfulData', () => {
	let apollo;
	let route;

	beforeEach(() => {
		route = {
			query: {
				utm_campaign: `social_share_badge_${defaultBadges[0]}`
			}
		};
	});

	test('loads badge info correctly', async () => {
		apollo = {
			readQuery: jest.fn().mockReturnValue({
				contentful: {
					entries: {
						items: [
							{
								fields: {
									badgeImage: {
										fields: {
											file: {
												url: 'http://example.com/badge.png'
											}
										}
									},
									challengeName: 'Test Challenge'
								}
							}
						]
					}
				}
			}),
		};

		const { loadBadgeInfo, isBadgeKeyValid } = useBadgeContentfulData(apollo, route);

		const result = await loadBadgeInfo();

		expect(result.badgeImage).toBe('http://example.com/badge.png');
		expect(result.badgeCategory).toBe('Test Challenge');
		expect(isBadgeKeyValid).toBe(true);
		expect(apollo.readQuery).toBeCalledTimes(1);
	});

	test('handles error in loading badge info', async () => {
		apollo = {
			readQuery: jest.fn().mockImplementation(() => {
				throw new Error('Query error');
			}),
		};

		const { loadBadgeInfo } = useBadgeContentfulData(apollo, route);

		const result = await loadBadgeInfo();

		expect(result.badgeImage).toBeNull();
		expect(result.badgeCategory).toBe('');
		expect(logReadQueryError).toHaveBeenCalled();
		expect(apollo.readQuery).toBeCalledTimes(1);
	});
});
