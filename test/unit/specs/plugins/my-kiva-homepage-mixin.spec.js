import { getIsMyKivaEnabled } from '#src/util/myKivaUtils';
import { readBoolSetting } from '#src/util/settingsUtils';
import myKivaHomepageMixin from '#src/plugins/my-kiva-homepage-mixin';

vi.mock('#src/util/myKivaUtils', () => ({
	getIsMyKivaEnabled: vi.fn(),
	MY_KIVA_FOR_ALL_USERS_KEY: 'my_kiva_for_all_users'
}));

vi.mock('#src/util/settingsUtils', () => ({
	readBoolSetting: vi.fn()
}));

vi.mock('#src/graphql/query/shared/myKivaForAllUsers.graphql', () => ({
	default: 'myKivaForAllUsersQuery'
}));

describe('my-kiva-homepage-mixin.js', () => {
	let context;

	beforeEach(() => {
		context = {
			apollo: {
				query: vi.fn()
			},
			cookieStore: {},
			$kvTrackEvent: vi.fn(),
			redirectToMyKivaHomepage: false
		};

		vi.clearAllMocks();
	});

	describe('data', () => {
		it('should initialize redirectToMyKivaHomepage to false', () => {
			const data = myKivaHomepageMixin.data();
			expect(data.redirectToMyKivaHomepage).toBe(false);
		});
	});

	describe('computed properties', () => {
		it('homePagePath should return "/" when not redirecting', () => {
			context.redirectToMyKivaHomepage = false;
			const result = myKivaHomepageMixin.computed.homePagePath.call(context);
			expect(result).toBe('/');
		});

		it('homePagePath should return "/mykiva" when redirecting', () => {
			context.redirectToMyKivaHomepage = true;
			const result = myKivaHomepageMixin.computed.homePagePath.call(context);
			expect(result).toBe('/mykiva');
		});

		it('portfolioPath should return "/portfolio" when not redirecting', () => {
			context.redirectToMyKivaHomepage = false;
			const result = myKivaHomepageMixin.computed.portfolioPath.call(context);
			expect(result).toBe('/portfolio');
		});

		it('portfolioPath should return "/mykiva" when redirecting', () => {
			context.redirectToMyKivaHomepage = true;
			const result = myKivaHomepageMixin.computed.portfolioPath.call(context);
			expect(result).toBe('/mykiva');
		});
	});

	describe('mounted', () => {
		it('should set redirectToMyKivaHomepage to user id when conditions are met', async () => {
			context.apollo.query.mockResolvedValue({
				data: {
					my: { id: 123 }
				}
			});
			readBoolSetting.mockReturnValue(true);
			getIsMyKivaEnabled.mockReturnValue(true);

			await myKivaHomepageMixin.mounted.call(context);

			expect(context.redirectToMyKivaHomepage).toBe(123);
			expect(getIsMyKivaEnabled).toHaveBeenCalledWith(
				context.apollo,
				context.$kvTrackEvent,
				true,
				context.cookieStore
			);
		});

		it('should not set redirectToMyKivaHomepage when flag is disabled', async () => {
			context.apollo.query.mockResolvedValue({
				data: {
					my: { id: 123 }
				}
			});
			readBoolSetting.mockReturnValue(false);

			await myKivaHomepageMixin.mounted.call(context);

			expect(context.redirectToMyKivaHomepage).toBe(false);
			expect(getIsMyKivaEnabled).not.toHaveBeenCalled();
		});

		it('should not set redirectToMyKivaHomepage when userData is null', async () => {
			context.apollo.query.mockResolvedValue({
				data: {
					my: null
				}
			});
			readBoolSetting.mockReturnValue(true);
			getIsMyKivaEnabled.mockReturnValue(true);

			await myKivaHomepageMixin.mounted.call(context);

			expect(context.redirectToMyKivaHomepage).toBeUndefined();
		});

		it('should not set redirectToMyKivaHomepage when getIsMyKivaEnabled returns false', async () => {
			context.apollo.query.mockResolvedValue({
				data: {
					my: { id: 123 }
				}
			});
			readBoolSetting.mockReturnValue(true);
			getIsMyKivaEnabled.mockReturnValue(false);

			await myKivaHomepageMixin.mounted.call(context);

			expect(context.redirectToMyKivaHomepage).toBe(false);
		});

		it('should handle missing user id', async () => {
			context.apollo.query.mockResolvedValue({
				data: {
					my: {}
				}
			});
			readBoolSetting.mockReturnValue(true);
			getIsMyKivaEnabled.mockReturnValue(true);

			await myKivaHomepageMixin.mounted.call(context);

			expect(context.redirectToMyKivaHomepage).toBeUndefined();
		});
	});
});
