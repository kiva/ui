import socialSharingMixin from '#src/plugins/social-sharing-mixin';

vi.mock('#src/util/urlUtils', () => ({
	getFullUrl: vi.fn()
}));

vi.mock('clipboard-copy', () => ({
	default: vi.fn()
}));

describe('social-sharing-mixin.js', () => {
	let context;
	let mockGetFullUrl;
	let mockClipboardCopy;

	beforeEach(async () => {
		const urlUtils = await import('#src/util/urlUtils');
		mockGetFullUrl = urlUtils.getFullUrl;
		const clipboardCopy = await import('clipboard-copy');
		mockClipboardCopy = clipboardCopy.default;

		context = {
			$route: {
				hash: '',
				query: {},
				path: '/lend/1234'
			},
			$showTipMsg: vi.fn(),
			$kvTrackEvent: vi.fn(),
			$appConfig: {
				host: 'www.kiva.org',
				fbApplicationId: '123456789'
			},
			shareMessage: 'Check out this loan!',
			shareLink: 'https://www.kiva.org/lend/1234',
			copyStatus: null
		};
	});

	afterEach(() => {
		vi.clearAllMocks();
	});

	describe('handleFacebookResponse', () => {
		it('should handle successful facebook share', () => {
			context.$route.hash = '#_=_';
			context.$route.query = {};

			socialSharingMixin.methods.handleFacebookResponse.call(context, 'test-category');

			expect(context.$showTipMsg).toHaveBeenCalledWith('Thanks for sharing to Facebook!');
		});

		it('should handle facebook error with code and message', () => {
			context.$route.hash = '#_=_';
			context.$route.query = {
				error_code: '500',
				error_message: 'Server error'
			};

			socialSharingMixin.methods.handleFacebookResponse.call(context, 'test-category');

			expect(context.$showTipMsg).toHaveBeenCalledWith(
				'There was a problem sharing to Facebook: Server error',
				'warning'
			);
			expect(context.$kvTrackEvent).toHaveBeenCalledWith('test-category', 'fail', 'share-facebook');
		});

		it('should ignore facebook cancel error (4201)', () => {
			context.$route.hash = '#_=_';
			context.$route.query = {
				error_code: '4201',
				error_message: 'User cancelled'
			};

			socialSharingMixin.methods.handleFacebookResponse.call(context, 'test-category');

			expect(context.$showTipMsg).not.toHaveBeenCalled();
		});

		it('should do nothing when hash is not facebook redirect', () => {
			context.$route.hash = '';

			socialSharingMixin.methods.handleFacebookResponse.call(context, 'test-category');

			expect(context.$showTipMsg).not.toHaveBeenCalled();
			expect(context.$kvTrackEvent).not.toHaveBeenCalled();
		});
	});

	describe('showSharePopUp', () => {
		beforeEach(() => {
			global.window = {
				innerHeight: 800,
				innerWidth: 1200,
				open: vi.fn()
			};
		});

		it('should open popup with correct dimensions and position', () => {
			const destinationUrl = 'https://twitter.com/intent/tweet';
			const thanksText = 'Thanks for sharing!';

			socialSharingMixin.methods.showSharePopUp.call(context, destinationUrl, thanksText);

			expect(window.open).toHaveBeenCalledWith(
				destinationUrl,
				'intent',
				'scrollbars=yes,resizable=yes,toolbar=no,location=yes,width=600,height=420,left=300,top=190'
			);
			expect(context.$showTipMsg).toHaveBeenCalledWith(thanksText);
		});

		it('should position popup at top when window height is less than popup height', () => {
			window.innerHeight = 300;
			const destinationUrl = 'https://twitter.com/intent/tweet';
			const thanksText = 'Thanks for sharing!';

			socialSharingMixin.methods.showSharePopUp.call(context, destinationUrl, thanksText);

			expect(window.open).toHaveBeenCalledWith(
				destinationUrl,
				'intent',
				'scrollbars=yes,resizable=yes,toolbar=no,location=yes,width=600,height=420,left=300,top=0'
			);
		});
	});

	describe('blueskyShareUrl', () => {
		it('should generate bluesky share url with utm parameters', () => {
			const blueskyUrl = 'https://www.kiva.org/lend/1234?utm_source=bsky.app'
				+ '&utm_medium=social&utm_campaign=test&utm_content=loan';
			const composeUrl = 'https://bsky.app/intent/compose?text=Check+out+this+loan!+'
				+ 'https://www.kiva.org/lend/1234?utm_source=bsky.app&utm_medium=social'
				+ '&utm_campaign=test&utm_content=loan';
			mockGetFullUrl
				.mockReturnValueOnce(blueskyUrl)
				.mockReturnValueOnce(composeUrl);

			const result = socialSharingMixin.methods.blueskyShareUrl.call(context, {
				utmCampaign: 'test',
				utmContent: 'loan'
			});

			expect(mockGetFullUrl).toHaveBeenCalledWith('https://www.kiva.org/lend/1234', {
				utm_source: 'bsky.app',
				utm_medium: 'social',
				utm_campaign: 'test',
				utm_content: 'loan'
			});
			expect(result).toBe(composeUrl);
		});

		it('should return empty string when shareLink is not set', () => {
			context.shareLink = null;

			const result = socialSharingMixin.methods.blueskyShareUrl.call(context, {
				utmCampaign: 'test',
				utmContent: 'loan'
			});

			expect(result).toBe('');
		});

		it('should return empty string when shareMessage is not set', () => {
			context.shareMessage = null;

			const result = socialSharingMixin.methods.blueskyShareUrl.call(context, {
				utmCampaign: 'test',
				utmContent: 'loan'
			});

			expect(result).toBe('');
		});
	});

	describe('facebookShareUrl', () => {
		it('should generate facebook share url with utm parameters', () => {
			const fbLoanUrl = 'https://www.kiva.org/lend/1234?utm_source=facebook.com'
				+ '&utm_medium=social&utm_campaign=test&utm_content=loan';
			const fbShareUrl = 'https://www.facebook.com/dialog/share?app_id=123456789&display=page'
				+ '&href=https://www.kiva.org/lend/1234?utm_source=facebook.com&utm_medium=social'
				+ '&utm_campaign=test&utm_content=loan&redirect_uri=https://www.kiva.org/lend/1234'
				+ '&quote=Check+out+this+loan!';
			mockGetFullUrl
				.mockReturnValueOnce(fbLoanUrl)
				.mockReturnValueOnce(fbShareUrl);

			const result = socialSharingMixin.methods.facebookShareUrl.call(context, {
				utmCampaign: 'test',
				utmContent: 'loan'
			});

			expect(mockGetFullUrl).toHaveBeenNthCalledWith(1, 'https://www.kiva.org/lend/1234', {
				utm_source: 'facebook.com',
				utm_medium: 'social',
				utm_campaign: 'test',
				utm_content: 'loan'
			});
			expect(mockGetFullUrl).toHaveBeenNthCalledWith(2, 'https://www.facebook.com/dialog/share', {
				app_id: '123456789',
				display: 'page',
				href: fbLoanUrl,
				redirect_uri: 'https://www.kiva.org/lend/1234',
				quote: 'Check out this loan!'
			});
			expect(result).toBe(fbShareUrl);
		});

		it('should return empty string when shareLink is not set', () => {
			context.shareLink = null;

			const result = socialSharingMixin.methods.facebookShareUrl.call(context, {
				utmCampaign: 'test',
				utmContent: 'loan'
			});

			expect(result).toBe('');
		});

		it('should return empty string when shareMessage is not set', () => {
			context.shareMessage = null;

			const result = socialSharingMixin.methods.facebookShareUrl.call(context, {
				utmCampaign: 'test',
				utmContent: 'loan'
			});

			expect(result).toBe('');
		});
	});

	describe('linkedInShareUrl', () => {
		it('should generate linkedin share url with utm parameters', () => {
			const linkedInLoanUrl = 'https://www.kiva.org/lend/1234?utm_source=linkedin.com'
				+ '&utm_medium=social&utm_campaign=test&utm_content=loan';
			const linkedInShareUrl = 'https://www.linkedin.com/sharing/share-offsite/?url='
				+ 'https://www.kiva.org/lend/1234?utm_source=linkedin.com&utm_medium=social'
				+ '&utm_campaign=test&utm_content=loan';
			mockGetFullUrl
				.mockReturnValueOnce(linkedInLoanUrl)
				.mockReturnValueOnce(linkedInShareUrl);

			const result = socialSharingMixin.methods.linkedInShareUrl.call(context, {
				utmCampaign: 'test',
				utmContent: 'loan'
			});

			expect(mockGetFullUrl).toHaveBeenCalledWith('https://www.kiva.org/lend/1234', {
				utm_source: 'linkedin.com',
				utm_medium: 'social',
				utm_campaign: 'test',
				utm_content: 'loan'
			});
			expect(result).toBe(linkedInShareUrl);
		});

		it('should return empty string when shareLink is not set', () => {
			context.shareLink = null;

			const result = socialSharingMixin.methods.linkedInShareUrl.call(context, {
				utmCampaign: 'test',
				utmContent: 'loan'
			});

			expect(result).toBe('');
		});

		it('should return empty string when shareMessage is not set', () => {
			context.shareMessage = null;

			const result = socialSharingMixin.methods.linkedInShareUrl.call(context, {
				utmCampaign: 'test',
				utmContent: 'loan'
			});

			expect(result).toBe('');
		});
	});

	describe('copyLink', () => {
		beforeEach(() => {
			vi.useFakeTimers();
		});

		afterEach(() => {
			vi.useRealTimers();
		});

		it('should copy link to clipboard with utm parameters', async () => {
			const shareUrl = 'https://www.kiva.org/lend/1234?utm_source=social_share_link'
				+ '&utm_medium=referral&utm_campaign=test&utm_content=loan';
			mockGetFullUrl.mockReturnValue(shareUrl);
			mockClipboardCopy.mockResolvedValue();

			await socialSharingMixin.methods.copyLink.call(context, {
				utmCampaign: 'test',
				utmContent: 'loan'
			}, 'Copy');

			expect(mockGetFullUrl).toHaveBeenCalledWith('https://www.kiva.org/lend/1234', {
				utm_source: 'social_share_link',
				utm_medium: 'referral',
				utm_campaign: 'test',
				utm_content: 'loan'
			});
			expect(mockClipboardCopy).toHaveBeenCalledWith(`Check out this loan! ${shareUrl}`);
		});

		it('should update copyStatus to Copied on success', async () => {
			context.copyStatus = {
				class: '',
				disabled: false,
				text: 'Copy'
			};
			mockGetFullUrl.mockReturnValue('https://www.kiva.org/lend/1234?utm=params');
			mockClipboardCopy.mockResolvedValue();

			await socialSharingMixin.methods.copyLink.call(context, {
				utmCampaign: 'test',
				utmContent: 'loan'
			}, 'Copy');

			expect(context.copyStatus).toEqual({
				class: 'tw-transition-colors tw-border-action-highlight tw-text-action-highlight',
				disabled: true,
				text: 'Copied!'
			});

			vi.runAllTimers();

			expect(context.copyStatus).toEqual({
				class: '',
				disabled: false,
				text: 'Copy'
			});
		});

		it('should not update copyStatus when copyStatus is not set', async () => {
			context.copyStatus = null;
			mockGetFullUrl.mockReturnValue('https://www.kiva.org/lend/1234?utm=params');
			mockClipboardCopy.mockResolvedValue();

			await socialSharingMixin.methods.copyLink.call(context, {
				utmCampaign: 'test',
				utmContent: 'loan'
			}, 'Copy');

			expect(context.copyStatus).toBeNull();
		});

		it('should update copyStatus to Error on clipboard failure', async () => {
			context.copyStatus = {
				class: '',
				disabled: false,
				text: 'Copy'
			};
			mockGetFullUrl.mockReturnValue('https://www.kiva.org/lend/1234?utm=params');
			mockClipboardCopy.mockRejectedValue(new Error('Clipboard failed'));

			await socialSharingMixin.methods.copyLink.call(context, {
				utmCampaign: 'test',
				utmContent: 'loan'
			}, 'Copy');

			expect(context.copyStatus).toEqual({
				class: 'tw-transition-colors tw-border-danger-highlight tw-text-danger-highlight',
				disabled: true,
				text: 'Error'
			});

			vi.runAllTimers();

			expect(context.copyStatus).toEqual({
				class: '',
				disabled: false,
				text: 'Copy'
			});
		});

		it('should handle clipboard failure without copyStatus', async () => {
			context.copyStatus = null;
			mockGetFullUrl.mockReturnValue('https://www.kiva.org/lend/1234?utm=params');
			mockClipboardCopy.mockRejectedValue(new Error('Clipboard failed'));

			await socialSharingMixin.methods.copyLink.call(context, {
				utmCampaign: 'test',
				utmContent: 'loan'
			}, 'Copy');

			expect(context.copyStatus).toBeNull();
		});
	});
});
