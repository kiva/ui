<template>
	<www-page
		class="data-settings-page"
		:gray-background="true"
	>
		<template #secondary>
			<the-my-kiva-secondary-menu />
		</template>

		<kv-default-wrapper>
			<h1 class="tw-mb-2">
				Data Settings
			</h1>
			<p class="tw-mb-4">
				Manage your data settings on Kiva or close your account
			</p>

			<kv-loading-paragraph
				v-if="loading"
				:num-lines="6"
				class="tw-mb-4"
			/>

			<template v-if="!loading">
				<kv-settings-card
					class="tw-mb-4"
					title="Cookie preferences"
				>
					<template #content>
						<div class="tw-mb-2">
							<kv-checkbox
								:key="'cookie-' + dataLoaded"
								id="cookie-opt-out"
								v-model="form.cookieOptOut"
								:disabled="isSaving"
							>
								Opt out of non-essential analytics and marketing cookies.<br>
								<span class="tw-text-small tw-text-secondary">
									This setting will be applied automatically whenever you sign into your
									account and will override any session-based cookie settings.
								</span><br>
								<a
									:href="urls.legalCookie"
									target="_blank"
									rel="noopener noreferrer"
									class="tw-text-link"
									@click="trackSettingsClick('data-settings-link-cookie-policy')"
								>
									Learn more about our Cookie Policy and manage session-based cookies here.
								</a>
							</kv-checkbox>
						</div>
					</template>
				</kv-settings-card>

				<kv-settings-card
					class="tw-mb-4"
					title="Advertising data sharing preferences"
				>
					<template #content>
						<div class="tw-mb-2">
							<kv-checkbox
								:key="'pii-' + dataLoaded"
								id="pii-sharing-opt-out"
								v-model="form.piiSharingOptOut"
								:disabled="isSaving"
							>
								Opt out of sharing your data with third parties for advertising purposes.<br>
								<a
									:href="urls.legalPrivacy"
									target="_blank"
									rel="noopener noreferrer"
									class="tw-text-link"
									@click="trackSettingsClick('data-settings-link-privacy')"
								>
									Learn more in the "How Kiva Uses Your Personal Information" section of
									Kiva's privacy policy
								</a>
							</kv-checkbox>
						</div>
					</template>
				</kv-settings-card>

				<div class="tw-mb-4">
					<kv-button
						:disabled="!isChanged || isSaving"
						@click="onSaveClick"
					>
						{{ isSaving ? 'Saving...' : 'Save data settings' }}
					</kv-button>
				</div>

				<kv-settings-card
					title="Account termination"
				>
					<template #content>
						<p class="tw-mb-4">
							Permanently delete your Kiva account and all personally identifying information
							associated with your account. When you delete your account, you'll authorize any
							current balance and future repayments on your outstanding loans to be donated to
							Kiva. If you'd like your current balance returned to you, please
							<a
								:href="urls.withdrawFunds"
								target="_blank"
								rel="noopener noreferrer"
								class="tw-text-link"
								@click="trackSettingsClick('data-settings-link-withdraw-funds')"
							>
								withdraw funds prior to deleting your account
							</a>.
							After deleting your account you'll be unable to access your past lending activity.
						</p>
						<kv-button
							variant="secondary"
							@click="onCloseAccountClick"
						>
							Close account
						</kv-button>
					</template>
				</kv-settings-card>
			</template>
		</kv-default-wrapper>

		<kv-lightbox
			:visible="showCloseAccountLightbox"
			title="Are you sure?"
			@lightbox-closed="hideCloseAccountLightbox"
		>
			<p>
				By clicking "Yes, close my account", you agree that your current account balance and future
				loan repayments (if any) will be automatically donated to Kiva's operating expenses.
				After your account is closed you'll be unable to access your past lending activity and
				you'll be removed from Kiva's email lists. This action cannot be undone.
			</p>
			<template #controls>
				<kv-button
					variant="secondary"
					class="tw-mr-2"
					@click="onCloseAccountCancelClick"
				>
					No, go back
				</kv-button>
				<kv-button
					variant="danger"
					:disabled="isClosingAccount"
					@click="onCloseAccountConfirmClick"
				>
					{{ isClosingAccount ? 'Closing...' : 'Yes, close my account' }}
				</kv-button>
			</template>
		</kv-lightbox>
	</www-page>
</template>

<script>
import {
	KvButton,
	KvCheckbox,
	KvLightbox,
} from '@kiva/kv-components';
import KvDefaultWrapper from '#src/components/Kv/KvDefaultWrapper';
import KvLoadingParagraph from '#src/components/Kv/KvLoadingParagraph';
import KvSettingsCard from '#src/components/Kv/KvSettingsCard';
import TheMyKivaSecondaryMenu from '#src/components/WwwFrame/Menus/TheMyKivaSecondaryMenu';
import WwwPage from '#src/components/WwwFrame/WwwPage';
import { addDays } from 'date-fns';
import { parseQueryStringCookie, buildQueryStringCookie } from '#src/util/queryStringCookie';
import dataSettingsQuery from '#src/graphql/query/dataSettings/dataSettingsQuery.graphql';
import updateDataSettingsMutation from '#src/graphql/mutation/dataSettings/updateDataSettings.graphql';
import closeAccountMutation from '#src/graphql/mutation/dataSettings/closeAccount.graphql';

const LEGAL_COOKIE_URL = '/legal/cookies';
const LEGAL_PRIVACY_URL = '/legal/privacy';
const WITHDRAW_FUNDS_URL = '/withdraw';
const KVGDPR_COOKIE_NAME = 'kvgdpr';
const KVGDPR_EXPIRES_DAYS = 365;

/** this.form key -> kvgdpr cookie key */
const FORM_TO_KVGDPR_KEYS = {
	cookieOptOut: 'opted_out',
	piiSharingOptOut: 'pii_opted_out',
};

export default {
	name: 'DataSettingsPage',
	components: {
		KvButton,
		KvCheckbox,
		KvDefaultWrapper,
		KvLightbox,
		KvLoadingParagraph,
		KvSettingsCard,
		TheMyKivaSecondaryMenu,
		WwwPage,
	},
	inject: ['apollo', 'cookieStore'],
	data() {
		return {
			loading: true,
			isSaving: false,
			isClosingAccount: false,
			showCloseAccountLightbox: false,
			form: {
				cookieOptOut: false,
				piiSharingOptOut: false,
			},
			initialValues: {
				cookieOptOut: false,
				piiSharingOptOut: false,
			},
			dataLoaded: false,
		};
	},
	computed: {
		isChanged() {
			return this.initialValues.cookieOptOut !== this.form.cookieOptOut
				|| this.initialValues.piiSharingOptOut !== this.form.piiSharingOptOut;
		},
		urls: () => ({
			legalCookie: LEGAL_COOKIE_URL,
			legalPrivacy: LEGAL_PRIVACY_URL,
			withdrawFunds: WITHDRAW_FUNDS_URL,
		}),
	},
	head: {
		title: 'Data settings',
	},
	apollo: {
		query: dataSettingsQuery,
		preFetch: true,
		result({ data }) {
			const ua = data?.my?.userAccount;
			if (ua) {
				this.form.cookieOptOut = ua.cookieOptOut === true;
				this.form.piiSharingOptOut = ua.piiSharingOptOut === true;
				this.initialValues = this.getFormSnapshot();
				this.syncKvgdprCookie();
			}
			this.dataLoaded = true;
			this.loading = false;
		},
	},
	methods: {
		trackSettingsClick(label) {
			this.$kvTrackEvent('user-settings', 'click', label);
		},
		onSaveClick() {
			this.trackSettingsClick('data-settings-save-settings');
			this.saveSettings();
		},
		onCloseAccountClick() {
			this.trackSettingsClick('data-settings-close-account-lightbox-opened');
			this.showCloseAccountLightbox = true;
		},
		hideCloseAccountLightbox() {
			this.showCloseAccountLightbox = false;
		},
		onCloseAccountCancelClick() {
			this.trackSettingsClick('data-settings-close-account-cancel');
			this.showCloseAccountLightbox = false;
		},
		onCloseAccountConfirmClick() {
			this.trackSettingsClick('data-settings-close-account-confirm');
			this.confirmCloseAccount();
		},
		getFormSnapshot() {
			return { ...this.form };
		},
		syncKvgdprCookie() {
			if (!this.cookieStore) return;
			const current = this.cookieStore.get(KVGDPR_COOKIE_NAME) || '';
			const kvgdpr = parseQueryStringCookie(current);
			Object.entries(FORM_TO_KVGDPR_KEYS).forEach(([formKey, cookieKey]) => {
				if (this.form[formKey]) {
					kvgdpr[cookieKey] = 'true';
				} else {
					delete kvgdpr[cookieKey];
				}
			});
			const isKivaOrg = typeof window !== 'undefined' && window.location?.hostname?.endsWith('.kiva.org');
			this.cookieStore.set(KVGDPR_COOKIE_NAME, buildQueryStringCookie(kvgdpr), {
				expires: addDays(new Date(), KVGDPR_EXPIRES_DAYS),
				path: '/',
				...(isKivaOrg && { domain: '.kiva.org' }),
			});
		},
		isUpdateDataSettingsSuccess(my) {
			return my?.updateCookieOptOut !== undefined && my?.updatePiiSharingOptOut !== undefined;
		},
		getUpdateDataSettingsMy(resOrError) {
			if (!resOrError) return null;
			if (resOrError?.data?.my) return resOrError.data.my;
			const result = resOrError?.result ?? resOrError?.data ?? resOrError?.graphQLErrors?.[0]?.result;
			return result?.data?.my ?? result?.my ?? null;
		},
		applySaveSuccess() {
			this.initialValues = this.getFormSnapshot();
			this.$showTipMsg('Your cookie preferences have been saved');
		},
		getGraphQLErrors(error) {
			const list = error?.graphQLErrors;
			if (!Array.isArray(list) || list.length === 0) return [];
			return list.map(gql => ({ code: gql.extensions?.code, message: gql.message }));
		},
		showSaveError(e) {
			const errors = this.getGraphQLErrors(e);
			const needsSignIn = errors.some(err => err?.code === 'api.authenticationRequired');
			const fallback = 'There was an error trying to save your data settings. Please try again later.';
			const msg = needsSignIn
				? 'Please sign in to save your data settings.'
				: (errors.map(err => err?.message).filter(Boolean).join(' ') || fallback);
			this.$showTipMsg(msg, 'error');
		},
		async saveSettings() {
			this.isSaving = true;
			let res;
			let caught;
			try {
				res = await this.apollo.mutate({
					mutation: updateDataSettingsMutation,
					variables: {
						cookieOptOut: this.form.cookieOptOut,
						piiSharingOptOut: this.form.piiSharingOptOut,
					},
					refetchQueries: [{ query: dataSettingsQuery }],
				});
			} catch (e) {
				caught = e;
			}
			const my = caught ? this.getUpdateDataSettingsMy(caught) : res?.data?.my;
			if (this.isUpdateDataSettingsSuccess(my)) {
				this.applySaveSuccess();
			} else {
				this.showSaveError(caught || {});
			}
			this.isSaving = false;
		},
		async confirmCloseAccount() {
			this.isClosingAccount = true;
			try {
				const res = await this.apollo.mutate({ mutation: closeAccountMutation });
				const success = res?.data?.my?.closeAccount === true;
				if (success) {
					this.showCloseAccountLightbox = false;
					window.location.href = '/closed';
					return;
				}
				this.$showTipMsg('There was an error trying to close your account. Please try again later.', 'error');
			} catch (e) {
				const errors = this.getGraphQLErrors(e);
				const needsSignIn = errors.some(err => err?.code === 'api.authenticationRequired');
				const needsVerification = errors.some(err => err?.code === 'org.kiva.EmailVerificationRequired');
				if (needsSignIn) {
					this.$showTipMsg('Please sign in recently to close your account.', 'error');
				} else if (needsVerification) {
					const doneUrl = encodeURIComponent(window.location?.href || '/settings/data');
					window.location.href = `/start-verification?doneUrl=${doneUrl}&process=closing%20your%20account`;
				} else {
					const msg = errors.map(err => err?.message).filter(Boolean).join(' ')
						|| 'There was an error trying to close your account. Please try again later.';
					this.$showTipMsg(msg, 'error');
				}
			} finally {
				this.isClosingAccount = false;
			}
		},
	},
};
</script>
