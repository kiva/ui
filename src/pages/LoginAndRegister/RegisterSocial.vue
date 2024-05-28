<template>
	<system-page>
		<div class="page-content" style="max-width: 20rem;">
			<div v-if="passwordless">
				<div class="tw-flex tw-justify-center tw-items-center tw-relative tw-mb-2">
					<div
						v-if="fetchedLogoUrl"
						class="tw-w-14 tw-h-14 tw-flex tw-justify-center
							tw-items-center tw-rounded-full tw-z-1 tw-bg-white tw--mr-2 tw-border
							tw-border-white tw-border-4 logo"
					>
						<img
							:src="fetchedLogoUrl"
							:alt="fetchedLogoAltText"
							class="tw-w-full tw-h-full tw-object-contain"
						>
					</div>
					<div
						class="tw-w-14 tw-h-14 tw-rounded-full tw-border tw-border-white
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
				{{ !passwordless? 'One last thing!' : 'Almost there!' }}
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
				<kv-base-input
					name="firstName"
					class="data-hj-suppress tw-w-full tw-mb-4"
					type="text"
					v-show="needsNames"
					v-model.trim="firstName"
					:validation="$v.firstName"
				>
					First name
					<template #required>
						Enter first name.
					</template>
				</kv-base-input>
				<kv-base-input
					name="lastName"
					class="data-hj-suppress tw-w-full tw-mb-4"
					type="text"
					v-show="needsNames"
					v-model.trim="lastName"
					:validation="$v.lastName"
				>
					Last name
					<template #required>
						Enter last name.
					</template>
				</kv-base-input>
				<kv-base-input
					name="newAcctTerms"
					class="data-hj-suppress tw-w-full tw-mb-4"
					type="checkbox"
					v-show="needsTerms"
					v-model="newAcctTerms"
					:validation="$v.newAcctTerms"
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
					@update:modelValue="$kvTrackEvent(
						'Login',
						'click-marketing-updates',
						emailUpdatesCopy,
						$event ? 1 : 0
					)"
				>
					{{ emailUpdatesCopy }}
				</kv-base-input>
				<div class="tw-mb-4">
					<re-captcha-enterprise
						:required="needsCaptcha"
						@update="captcha = $event"
					/>
					<p
						class="tw-text-center tw-text-danger tw-text-small tw-font-medium tw-mt-1"
						v-if="needsCaptcha && $v.captcha.$error"
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
import { validationMixin } from 'vuelidate';
import { required } from 'vuelidate/lib/validators';
import logReadQueryError from '@/util/logReadQueryError';
import KvBaseInput from '@/components/Kv/KvBaseInput';
import ReCaptchaEnterprise from '@/components/Forms/ReCaptchaEnterprise';
import SystemPage from '@/components/SystemFrame/SystemPage';
import strategicPartnerLoginInfoByPageIdQuery from '@/graphql/query/strategicPartnerLoginInfoByPageId.graphql';
import experimentVersionFragment from '@/graphql/fragments/experimentVersion.graphql';
import { trackExperimentVersion } from '@/util/experiment/experimentUtils';
import KvButton from '~/@kiva/kv-components/vue/KvButton';

const COMMS_OPT_IN_EXP_KEY = 'opt_in_comms';

export default {
	name: 'RegisterSocial',
	metaInfo() {
		return {
			title: 'Complete registration'
		};
	},
	components: {
		KvBaseInput,
		KvButton,
		ReCaptchaEnterprise,
		SystemPage,
	},
	mixins: [
		validationMixin,
	],
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
		};
	},
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
				return 'Send me updates about my borrower(s), my impact, and other ways I can help.';
			}

			return !this.passwordless
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

		if (!this.passwordless) {
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
		}
	},
	apollo: {
		preFetch(config, client, { route }) {
			const pageId = route?.query?.partnerContentId;
			if (!pageId) {
				return Promise.resolve();
			}
			return client.query({
				query: strategicPartnerLoginInfoByPageIdQuery,
				variables: { pageId: route.query.partnerContentId ?? '' }
			});
		}
	},
	methods: {
		postRegisterSocialForm(event) {
			this.$kvTrackEvent('Register', 'click-register-social-cta', 'Complete registration');
			this.$v.$touch();

			if (!this.$v.$invalid) {
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

<style scoped>
.logo {
	box-shadow: 0 0 18px rgba(0, 0, 0, 0.2);
}
</style>
