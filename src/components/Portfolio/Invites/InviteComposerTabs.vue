<template>
	<div data-testid="invite-composer-tabs">
		<KvTabs @tab-changed="onTabChanged">
			<template #tabNav>
				<KvTab
					for-panel="invite-tab-email"
					:selected="selectedTab === 'email'"
					data-testid="invite-tab-email"
				>
					Email
				</KvTab>
				<KvTab
					for-panel="invite-tab-facebook"
					:selected="selectedTab === 'facebook'"
					data-testid="invite-tab-facebook"
				>
					Facebook Post
				</KvTab>
				<KvTab
					for-panel="invite-tab-twitter"
					:selected="selectedTab === 'twitter'"
					data-testid="invite-tab-twitter"
				>
					Tweet
				</KvTab>
				<KvTab
					for-panel="invite-tab-url"
					:selected="selectedTab === 'url'"
					data-testid="invite-tab-url"
				>
					Personal URL
				</KvTab>
			</template>
			<template #tabPanels>
				<KvTabPanel id="invite-tab-email">
					<div>
						<slot name="email"></slot>
					</div>
				</KvTabPanel>
				<KvTabPanel id="invite-tab-facebook">
					<div class="tw-pt-1 tw-flex tw-flex-col tw-gap-2">
						<div>
							<KvButton
								:state="sharing.FACEBOOK ? 'loading' : ''"
								data-testid="invite-share-facebook"
								@click="share(shareSource.FACEBOOK)"
							>
								Post to Facebook Wall
							</KvButton>
						</div>
						<p v-if="shareError.FACEBOOK" role="alert" data-testid="invite-share-facebook-error">
							{{ shareError.FACEBOOK }}
						</p>
					</div>
				</KvTabPanel>
				<KvTabPanel id="invite-tab-twitter">
					<div class="tw-flex tw-flex-col tw-gap-2">
						<h3 class="tw-text-h4">
							Tweet an invitation
						</h3>
						<p>
							Please sign into Twitter (if needed) in the Twitter pop-up window, then enter your tweet in
							the window.
						</p>
						<div>
							<KvButton
								:state="sharing.TWITTER ? 'loading' : ''"
								data-testid="invite-share-twitter"
								@click="share(shareSource.TWITTER)"
							>
								Show Twitter window
							</KvButton>
						</div>
						<p v-if="shareError.TWITTER" role="alert" data-testid="invite-share-twitter-error">
							{{ shareError.TWITTER }}
						</p>
					</div>
				</KvTabPanel>
				<KvTabPanel id="invite-tab-url">
					<div class="tw-flex tw-flex-col tw-gap-2">
						<h3 class="tw-text-h4">
							Share link to invite friends
						</h3>
						<div v-if="loading" data-testid="invite-url-loading">
							<KvLoadingText />
						</div>
						<p v-else-if="loadError" role="alert" data-testid="invite-url-error">
							{{ errorMessage }}
						</p>
						<input
							v-else
							class="tw-w-full tw-rounded tw-border tw-border-tertiary tw-p-1"
							type="text"
							readonly
							aria-label="Your personal invite URL"
							:value="personalUrl"
							data-testid="invite-url-input"
							@click="$event.target.select()"
							@copy="$kvTrackEvent('portfolio', 'share', 'url')"
						>
						<p>
							Your personal invite URL can be copied and pasted, then emailed, Facebooked, tweeted &ndash;
							or even skywritten! When your friends visit your page and join Kiva, we’ll let you know so
							you can track your impact.
							<a
								v-if="personalUrl"
								:href="personalUrl"
								target="_blank"
								rel="noopener"
								data-testid="invite-url-view"
								v-kv-track-event="['portfolio', 'click', 'Invites view personal page']"
							>View your page &gt;</a>
						</p>
					</div>
				</KvTabPanel>
			</template>
		</KvTabs>
	</div>
</template>

<script>
import {
	KvButton, KvLoadingText, KvTab, KvTabPanel, KvTabs,
} from '@kiva/kv-components';
import logFormatter from '#src/util/logFormatter';
import {
	INVITE_COMPOSER_TABS, INVITE_ERROR_MESSAGE, INVITE_SHARE_SOURCE,
} from '#src/util/invites/invitesConstants';
import createInviteShareUrlMutation from '#src/graphql/mutation/invites/createInviteShareUrl.graphql';

const POPUP_BLOCKED_MESSAGE = 'Your browser blocked the share window. Allow pop-ups for Kiva and try again.';

const TWEET_TEXT = 'Join @Kiva and help change the world with just $25!';

// The window each share opens in, its size, and the channel its share is tracked as
const SHARE_WINDOWS = {
	[INVITE_SHARE_SOURCE.FACEBOOK]: {
		name: 'facebook', width: 626, height: 436, channel: 'facebook',
	},
	[INVITE_SHARE_SOURCE.TWITTER]: {
		name: 'tweet', width: 550, height: 370, channel: 'twitter',
	},
};

export default {
	name: 'InviteComposerTabs',
	components: {
		KvButton,
		KvLoadingText,
		KvTab,
		KvTabPanel,
		KvTabs,
	},
	inject: ['apollo'],
	props: {
		/** The viewer's permanent invite page URL */
		personalUrl: {
			type: String,
			default: '',
		},
		/** Whether the personal URL is still loading */
		loading: {
			type: Boolean,
			default: false,
		},
		/** Whether the personal URL failed to load */
		loadError: {
			type: Boolean,
			default: false,
		},
	},
	// shared: a share link was made, which adds a row to the activity list
	emits: ['shared'],
	data() {
		return {
			errorMessage: INVITE_ERROR_MESSAGE,
			shareSource: INVITE_SHARE_SOURCE,
			// The tabs show it once they mount. Until then, as on the server, no panel shows.
			selectedTab: INVITE_COMPOSER_TABS[0],
			sharing: { [INVITE_SHARE_SOURCE.FACEBOOK]: false, [INVITE_SHARE_SOURCE.TWITTER]: false },
			shareError: { [INVITE_SHARE_SOURCE.FACEBOOK]: '', [INVITE_SHARE_SOURCE.TWITTER]: '' },
			// The share link for each source, as a promise: one link per source while the page is open, since each
			// link is counted on its own activity row
			shareLinks: {},
		};
	},
	methods: {
		onTabChanged(index) {
			const tab = INVITE_COMPOSER_TABS[index];
			if (tab === this.selectedTab) {
				return;
			}
			this.selectedTab = tab;
		},
		// The window opens before the link is made, while the click still allows it to. It is centered over the
		// browser window, in screen coordinates.
		openShareWindow(source) {
			const { name, width, height } = SHARE_WINDOWS[source];
			const left = Math.round(window.screenX + ((window.outerWidth - width) / 2));
			const top = Math.round(window.screenY + ((window.outerHeight - height) / 2));
			const shareWindow = window.open('', name, `width=${width},height=${height},left=${left},top=${top}`);
			try {
				shareWindow.opener = null;
			} catch {
				// A window of this name already showing the share site can't be changed
			}
			return shareWindow;
		},
		shareTarget(source, url) {
			if (source === INVITE_SHARE_SOURCE.FACEBOOK) {
				const params = new URLSearchParams({
					app_id: this.$appConfig.fbApplicationId,
					display: 'popup',
					href: url,
				});
				return `https://www.facebook.com/dialog/share?${params}`;
			}
			const params = new URLSearchParams({ text: TWEET_TEXT, url, via: 'Kiva' });
			return `https://twitter.com/intent/tweet?${params}`;
		},
		async createShareUrl(source) {
			const { data, errors } = await this.apollo.mutate({
				mutation: createInviteShareUrlMutation,
				variables: { source },
			});
			const url = data?.my?.createInviteShareUrl?.url;
			if (errors?.length || !url) {
				throw new Error(JSON.stringify(errors ?? 'missing share link'));
			}
			return url;
		},
		// Each click opens its own window, so a click while the link is still being made isn't lost
		async share(source) {
			this.shareError[source] = '';
			const shareWindow = this.openShareWindow(source);
			if (!shareWindow) {
				this.shareError[source] = POPUP_BLOCKED_MESSAGE;
				return;
			}
			// Tracked once a window opened, so blocked clicks don't count as shares
			this.$kvTrackEvent('portfolio', 'share', SHARE_WINDOWS[source].channel);
			let link = this.shareLinks[source];
			const isNewLink = !link;
			if (isNewLink) {
				link = this.createShareUrl(source);
				this.shareLinks[source] = link;
			}
			this.sharing[source] = true;
			try {
				const url = await link;
				if (!shareWindow.closed) {
					shareWindow.location.href = this.shareTarget(source, url);
				}
				if (isNewLink) {
					this.$emit('shared');
				}
			} catch (error) {
				this.shareError[source] = INVITE_ERROR_MESSAGE;
				if (isNewLink) {
					// The next click makes a new link
					delete this.shareLinks[source];
					logFormatter(`Error creating invite share link: ${error}`, 'error');
				}
			} finally {
				this.sharing[source] = false;
			}
		},
	},
};
</script>
