import { getFullUrl } from '@/util/urlUtils';
import clipboardCopy from 'clipboard-copy';

/* This mixin depends on the component using it having the
* following data or computed variables available:
* this.shareMessage and this.shareLink
* this.copyStatus is optional
*/

export default {
	methods: {
		handleFacebookResponse(trackingCategory) {
			// Check for the route hash that facebook adds to the request
			if (this.$route.hash === '#_=_') {
				// Check for an error
				const { error_code: code, error_message: message } = this.$route.query;
				if (code) {
					// The 4201 error code means the user pressed 'Cancel', so can be ignored
					if (code !== '4201') {
						this.$showTipMsg(`There was a problem sharing to Facebook: ${message}`, 'warning');
					}
					this.$kvTrackEvent(trackingCategory, 'fail', 'share-facebook');
				} else {
					this.$showTipMsg('Thanks for sharing to Facebook!');
				}
			}
		},
		/** displays the share pop up window for whatever service we are sharing on.  */
		showSharePopUp(destinationUrl, thanksText) {
			// This code taken from the twitter example in the docs
			const width = 600;
			const height = 420;
			const winHeight = window.innerHeight;
			const winWidth = window.innerWidth;
			const left = Math.round((winWidth / 2) - (width / 2));
			let top = 0;

			if (winHeight > height) {
				top = Math.round((winHeight / 2) - (height / 2));
			}
			window.open(
				destinationUrl,
				'intent',
				// eslint-disable-next-line max-len
				`scrollbars=yes,resizable=yes,toolbar=no,location=yes,width=${width},height=${height},left=${left},top=${top}`
			);
			this.$showTipMsg(thanksText);
		},
		twitterShareUrl({ utmCampaign, utmContent }) {
			if (this.shareLink && this.shareMessage) {
				const twitterShareUrlWithUtms = getFullUrl(this.shareLink, {
					utm_source: 't.co',
					utm_medium: 'social',
					utm_campaign: utmCampaign,
					utm_content: utmContent,
				});
				return getFullUrl('https://twitter.com/intent/tweet', {
					text: this.shareMessage,
					url: twitterShareUrlWithUtms,
					hashtags: 'microloan,kivalove',
					via: 'Kiva',
				});
			}
			return '';
		},
		facebookShareUrl({ utmCampaign, utmContent }) {
			if (this.shareLink && this.shareMessage) {
				const facebookShareUrlWithUtms = getFullUrl(this.shareLink, {
					utm_source: 'facebook.com',
					utm_medium: 'social',
					utm_campaign: utmCampaign,
					utm_content: utmContent,
				});
				const pageUrl = `https://${this.$appConfig.host}${this.$route.path}`;
				return getFullUrl('https://www.facebook.com/dialog/share', {
					app_id: this.$appConfig.fbApplicationId,
					display: 'page',
					href: facebookShareUrlWithUtms,
					redirect_uri: pageUrl,
					quote: this.shareMessage,
				});
			}
			return '';
		},
		linkedInShareUrl({ utmCampaign, utmContent }) {
			if (this.shareLink && this.shareMessage) {
				const linkedInShareUrlWithUtms = getFullUrl(this.shareLink, {
					utm_source: 'linkedin.com',
					utm_medium: 'social',
					utm_campaign: utmCampaign,
					utm_content: utmContent,
				});
				return getFullUrl('https://www.linkedin.com/sharing/share-offsite/', {
					url: linkedInShareUrlWithUtms
				});
			}
			return '';
		},
		async copyLink({ utmCampaign, utmContent }, text) {
			const url = getFullUrl(this.shareLink, {
				utm_source: 'social_share_link',
				utm_medium: 'referral',
				utm_campaign: utmCampaign,
				utm_content: utmContent,
			});
			try {
				await clipboardCopy(`${this.shareMessage} ${url}`);
				if (this.copyStatus) {
					this.copyStatus = {
						class: 'social__btn--success',
						disabled: true,
						text: 'Copied!'
					};
				}
			} catch (err) {
				if (this.copyStatus) {
					this.copyStatus = {
						class: 'social__btn--error',
						disabled: true,
						text: 'Error'
					};
				}
			} finally {
				setTimeout(() => {
					if (this.copyStatus) {
						this.copyStatus = {
							class: '',
							disabled: false,
							text
						};
					}
				}, 500);
			}
		}
	},
};
