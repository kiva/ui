<template>
	<system-page>
		<div class="page-content" style="max-width: 20rem;">
			<h1 class="tw-text-h2 tw-mb-2">
				One last thing!
			</h1>
			<p class="tw-mb-4">
				{{ registrationMessage }}
			</p>
			<form
				id="registerSocialTermsForm"
				class="promptForm tw-text-left"
				action="."
				@submit.prevent.stop="postRegisterSocialForm"
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
					<a href="/legal/privacy" target="_blank">Privacy Policy</a>
					<template #checked>
						You must agree to the Kiva Terms of Use and Privacy Policy.
					</template>
				</kv-base-input>
				<kv-base-input
					name="newsConsent"
					class="data-hj-suppress tw-w-full tw-mb-4"
					type="checkbox"
					v-show="needsNews"
					v-model="newsConsent"
				>
					I want to receive updates about my loans, Kiva news, and promotions in my inbox
				</kv-base-input>
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
import KvBaseInput from '@/components/Kv/KvBaseInput';
import SystemPage from '@/components/SystemFrame/SystemPage';
import KvButton from '~/@kiva/kv-components/vue/KvButton';

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
		SystemPage,
	},
	mixins: [
		validationMixin,
	],
	data() {
		return {
			firstName: '',
			lastName: '',
			needsTerms: false,
			needsNames: false,
			needsNews: false,
			newAcctTerms: false,
			newsConsent: false,
			showSsoTerms: false,
		};
	},
	computed: {
		registrationMessage() {
			const parts = [];
			if (this.needsNames) {
				parts.push('enter your first and last name below');
			}
			if (this.needsTerms) {
				parts.push('agree to the Terms of Use and Privacy Policy');
			}
			return parts.length ? `To finish creating your account, please ${parts.join(' and ')}.` : '';
		},
	},
	validations() {
		const validations = {};
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
		// Support legacy behavior of this page, which was to show the terms checkbox only
		if (!this.$route.query.terms && !this.$route.query.names && !this.$route.query.news) {
			this.needsTerms = true;
			this.needsNews = true;
		}
	},
	methods: {
		postRegisterSocialForm() {
			this.$kvTrackEvent('Register', 'click-register-social-cta', 'Complete registration');
			this.$v.$touch();

			if (!this.$v.$invalid) {
				this.$kvTrackEvent('Register', 'register-social-success', undefined, undefined, undefined, () => {
					window.location = `https://${this.$appConfig.auth0.domain}/continue`
					+ '?agree=yes'
					+ `&newsConsent=${this.newsConsent ? 'yes' : 'no'}`
					+ `&firstName=${this.firstName}`
					+ `&lastName=${this.lastName}`
					+ `&state=${this.$route.query.state}`;
				});
			} else {
				this.$kvTrackEvent('Register', 'error-register-social-form-invalid-input');
			}
		},
	}

};
</script>
