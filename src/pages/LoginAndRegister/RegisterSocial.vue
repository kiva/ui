<template>
	<system-page>
		<div class="page-content" style="max-width: 20rem;">
			<div v-if="partnerContentId">
				<div class="tw-flex tw-justify-center tw-items-center tw-relative tw-mb-2">
					<div
						v-if="fetchedLogoUrl"
						class="tw-w-14 tw-h-14 tw-flex tw-justify-center
							tw-items-center tw-rounded-full tw-z-1 tw-bg-white tw--mr-2
							tw-border-white tw-border-4 logo"
					>
						<img
							:src="fetchedLogoUrl"
							:alt="fetchedLogoAltText"
							class="tw-w-full tw-h-full tw-object-contain"
						>
					</div>
					<div
						class="tw-w-14 tw-h-14 tw-rounded-full tw-border-white
							tw-border-4 tw-overflow-hidden logo"
					>
						<img
							src="../../assets/images/kiva_k_cutout_new.jpg"
							alt="Kiva Logo" class="tw-w-full tw-h-full tw-object-cover"
						>
					</div>
				</div>
			</div>
			<h1 class="tw-text-h2 tw-mb-2">
				{{ !partnerContentId ? 'One last thing!' : 'Almost there!' }}
			</h1>
			<p class="tw-mb-4">
				{{ registrationMessage }}
			</p>
			<form
				id="registerSocialTermsForm"
				class="promptForm tw-text-left"
				method="post"
				:action="`https://${$appConfig.auth0.domain}/continue?state=${$route.query.state}`"
				@submit="postRegisterSocialForm"
			>
				<div class="data-hj-suppress tw-w-full tw-mb-4">
					<kv-base-input
						name="firstName"
						type="text"
						v-show="needsNames"
						v-model.trim="firstName"
						:validation="v$.firstName"
					>
						First name
						<template #required>
							Enter first name.
						</template>
					</kv-base-input>
				</div>
				<div class="data-hj-suppress tw-w-full tw-mb-4">
					<kv-base-input
						name="lastName"
						type="text"
						v-show="needsNames"
						v-model.trim="lastName"
						:validation="v$.lastName"
					>
						Last name
						<template #required>
							Enter last name.
						</template>
					</kv-base-input>
				</div>
				<user-updates-preference
					v-if="enableRadioBtnExperiment"
					tracking-category="authentication"
					@update:model-value="selectedComms = $event"
				/>
				<input
					v-if="enableRadioBtnExperiment"
					type="hidden"
					name="newAcctTerms"
					value="on"
				>
				<template v-else>
					<kv-base-input
						name="newAcctTerms"
						class="data-hj-suppress tw-w-full tw-mb-4"
						type="checkbox"
						v-show="needsTerms"
						v-model="newAcctTerms"
						:validation="v$.newAcctTerms"
						@update:model-value="$kvTrackEvent(
							'authentication',
							'click',
							'terms-of-use',
							'I have read and agree to the Terms of Use and Privacy Policy',
							$event ? 1 : 0
						)"
					>
						I have read and agree to the Kiva
						<a href="/legal/terms" target="_blank">Terms of Use</a>
						and
						<a href="/legal/privacy" target="_blank">
							Privacy {{ enableCommsExperiment ? 'Notice' : 'Policy' }}
						</a> (required)
						<template #checked>
							You must agree to the Kiva Terms of Use and Privacy
							{{ enableCommsExperiment ? 'Notice' : 'Policy' }}.
						</template>
					</kv-base-input>
					<kv-base-input
						name="newsConsent"
						class="data-hj-suppress tw-w-full tw-mb-4"
						type="checkbox"
						v-show="needsNews"
						v-model="newsConsent"
						@update:model-value="$kvTrackEvent(
							'authentication',
							'click',
							'marketing-updates',
							emailUpdatesCopy,
							$event ? 1 : 0
						)"
					>
						{{ emailUpdatesCopy }}
					</kv-base-input>
				</template>
				<div class="tw-mb-4">
					<re-captcha-enterprise
						:required="needsCaptcha"
						@update="captcha = $event"
					/>
					<p
						class="tw-text-center tw-text-danger tw-text-small tw-font-medium tw-mt-1"
						v-if="needsCaptcha && v$.captcha?.$invalid"
					>
						Please complete the captcha.
					</p>
				</div>
				<p v-if="showSsoTerms" class="tw-text-tertiary tw-text-small tw-mb-4">
					Kiva will share your name and email address with the organization you are
					registering with to let them know you've redeemed your credits.
				</p>
				<kv-button
					class="register-button tw-w-full tw-mb-2"
					type="submit"
				>
					Complete registration
				</kv-button>
			</form>
			<div class="small-12">
				<a
					:href="`https://${$appConfig.auth0.domain}/v2/logout`"
					v-kv-track-event="['Register', 'click-register-social-cancel-cta', 'Cancel registration']"
				>
					Cancel registration
				</a>
			</div>
		</div>
	</system-page>
</template>

<script>
import { computed } from 'vue';
import { useVuelidate } from '@vuelidate/core';
import { required, requiredIf } from '@vuelidate/validators';
import logReadQueryError from '#src/util/logReadQueryError';
import KvBaseInput from '#src/components/Kv/KvBaseInput';
import ReCaptchaEnterprise from '#src/components/Forms/ReCaptchaEnterprise';
import SystemPage from '#src/components/SystemFrame/SystemPage';
import KvButton from '@kiva/kv-components/vue/KvButton';
import strategicPartnerLoginInfoByPageIdQuery from '#src/graphql/query/strategicPartnerLoginInfoByPageId.graphql';
import experimentVersionFragment from '#src/graphql/fragments/experimentVersion.graphql';
import { trackExperimentVersion } from '#src/util/experiment/experimentUtils';
import UserUpdatesPreference from '#src/components/Checkout/UserUpdatesPreference';
import experimentQuery from '#src/graphql/query/experimentAssignment.graphql';

const COMMS_OPT_IN_EXP_KEY = 'opt_in_comms';

export default {
	name: 'RegisterSocial',
	head() {
		return {
			title: 'Complete registration'
		};
	},
	components: {
		KvBaseInput,
		KvButton,
		ReCaptchaEnterprise,
		SystemPage,
		UserUpdatesPreference,
	},
	provide() {
		return {
			v$: computed(() => this.v$),
		};
	},
	inject: ['apollo', 'cookieStore'],
	props: {
		partnerContentId: {
			type: String,
			default: null,
		},
	},
	data() {
		return {
			captcha: '',
			firstName: '',
			lastName: '',
			needsCaptcha: false,
			needsTerms: false,
			needsNames: false,
			needsNews: false,
			newAcctTerms: false,
			newsConsent: false,
			showSsoTerms: false,
			passwordless: false,
			fetchedLogoAltText: null,
			fetchedLogoUrl: null,
			enableCommsExperiment: false,
			needsComms: false,
			selectedComms: '',
			enableRadioBtnExperiment: false,
		};
	},
	setup() { return { v$: useVuelidate() }; },
	computed: {
		registrationMessage() {
			const parts = [];
			if (this.needsNames) {
				parts.push('enter your first and last name');
			}
			if (this.needsTerms) {
				if (this.enableCommsExperiment) {
					parts.push('agree to the Terms of Use and Privacy Notice');
				} else {
					parts.push('agree to the Terms of Use and Privacy Policy');
				}
			}
			if (this.needsCaptcha) {
				parts.push('complete the captcha');
			}
			if (parts.length === 0) {
				return '';
			}
			const last = parts.pop();
			const inner = parts.length ? `${parts.join(', ')} and ${last}` : last;
			return `To finish creating your account, please ${inner} below.`;
		},
		emailUpdatesCopy() {
			if (this.enableCommsExperiment) {
				return 'Send me updates from people I\'ve funded, my impact, and other ways I can help.';
			}

			return !this.partnerContentId
				? 'I want to receive updates about my loans, Kiva news, and promotions in my inbox'
				: `Receive email updates from Kiva (including borrower updates and promos).
								You can unsubscribe anytime. (optional)`;
		}
	},
	validations() {
		const validations = {};
		if (this.needsCaptcha) {
			validations.captcha = { required };
		}
		if (this.needsNames) {
			validations.firstName = { required };
			validations.lastName = { required };
		}
		if (this.needsTerms) {
			validations.newAcctTerms = {
				checked: val => val,
			};
		}
		validations.selectedComms = {
			required: requiredIf(() => this.needsComms),
		};

		return validations;
	},
	created() {
		if (this.partnerContentId) {
			try {
				const partnerContentData = this.apollo.readQuery({
					query: strategicPartnerLoginInfoByPageIdQuery,
					variables: { pageId: this.$route.query.partnerContentId ?? '' }
				});
				const spLoginInfo = partnerContentData?.strategicPartnerLoginInfoByPageId;
				const logo = spLoginInfo?.contentful?.entry?.fields?.primaryLogo;
				this.fetchedLogoUrl = logo?.fields?.file?.url || '';
				this.fetchedLogoAltText = logo?.fields?.title || '';
			} catch (e) {
				logReadQueryError(e, 'RegisterSocial strategicPartnerLoginInfoByPageIdQuery');
			}
		}

		if (this.$route.query.captcha) {
			this.needsCaptcha = true;
		}
		if (this.$route.query.terms) {
			this.needsTerms = true;
		}
		if (this.$route.query.names) {
			this.needsNames = true;
		}
		if (this.$route.query.news) {
			this.needsNews = true;
		}
		if (this.$route.query.sso) {
			this.showSsoTerms = true;
		}
		if (this.$route.query.passwordless) {
			this.passwordless = true;
		}
		// Support legacy behavior of this page, which was to show the terms checkbox only
		if (!this.$route.query.terms
			&& !this.$route.query.names
			&& !this.$route.query.news
			&& !this.$route.query.captcha
		) {
			this.needsTerms = true;
			this.needsNews = true;
		}

		if (!this.partnerContentId && this.needsNews) {
			const { version } = this.apollo.readFragment({
				id: `Experiment:${COMMS_OPT_IN_EXP_KEY}`,
				fragment: experimentVersionFragment,
			}) ?? {};

			trackExperimentVersion(
				this.apollo,
				this.$kvTrackEvent,
				'basket',
				COMMS_OPT_IN_EXP_KEY,
				'EXP-MP-271-May2024'
			);
			if (version === 'b') {
				this.enableCommsExperiment = true;
			}
			if (version === 'c') {
				this.enableRadioBtnExperiment = true;
				this.newAcctTerms = true;
				this.needsComms = true;
			}
		}
	},
	apollo: {
		preFetch(config, client, { route }) {
			const currentRoute = route.value ?? route ?? {};
			const pageId = currentRoute.query?.partnerContentId;
			if (!pageId) {
				return client.query({ query: experimentQuery, variables: { id: COMMS_OPT_IN_EXP_KEY } });
			}
			return client.query({
				query: strategicPartnerLoginInfoByPageIdQuery,
				variables: { pageId: currentRoute.query.partnerContentId ?? '' }
			});
		}
	},
	methods: {
		postRegisterSocialForm(event) {
			this.$kvTrackEvent('Register', 'click-register-social-cta', 'Complete registration');

			this.v$.$touch();

			if (!this.v$.$invalid) {
				// Set news consent based on comms preference MP-271
				if (this.enableRadioBtnExperiment) {
					this.newsConsent = this.selectedComms === '1';
				}

				this.$kvTrackEvent('Register', 'register-social-success');
			} else {
				event.preventDefault();
				event.stopPropagation();
				this.$kvTrackEvent('Register', 'error-register-social-form-invalid-input');
			}
		}
	}

};
</script>

<style lang="postcss" scoped>
.logo {
	box-shadow: 0 0 18px rgba(0 0 0 / 20%);
}

.radio-error :deep(label > div) {
	@apply tw-border-danger-highlight;
}
</style>
