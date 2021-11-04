<template>
	<system-page>
		<div class="page-content">
			<h1 class="featured-text">
				One last thing!
			</h1>
			<p>
				{{ registrationMessage }}
			</p>
			<form
				id="registerSocialTermsForm"
				class="promptForm"
				action="."
				@submit.prevent.stop="postRegisterSocialForm"
			>
				<kv-base-input name="firstName"
					class="fs-exclude"
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
				<kv-base-input name="lastName"
					class="fs-exclude"
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
				<kv-base-input name="newAcctTerms"
					type="checkbox"
					v-show="needsTerms"
					v-model="newAcctTerms"
					:validation="$v.newAcctTerms"
				>
					<template #after>
						I have read and agree to the Kiva
						<a href="/legal/terms" target="_blank">Terms of Use</a>
						and
						<a href="/legal/privacy" target="_blank">Privacy Policy</a>
					</template>
					<template #checked>
						You must agree to the Kiva Terms of Use and Privacy Policy.
					</template>
				</kv-base-input>
				<kv-button
					class="register-button smaller"
					type="submit"
				>
					Complete registration
				</kv-button>
			</form>
			<div class="small-12">
				<a :href="`https://${$appConfig.auth0.domain}/v2/logout`">Cancel registration</a>
			</div>
		</div>
	</system-page>
</template>

<script>
import { validationMixin } from 'vuelidate';
import { required } from 'vuelidate/lib/validators';
import KvBaseInput from '@/components/Kv/KvBaseInput';
import KvButton from '@/components/Kv/KvButton';
import SystemPage from '@/components/SystemFrame/SystemPage';

export default {
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
			newAcctTerms: false,
			showNewAcctTermsError: false,
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
			return `To finish creating your account, please ${parts.join(' and ')}.`;
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
	beforeRouteEnter(to, from, next) {
		// Redirect to error page if query parameters are missing
		const { state, terms, names } = to.query ?? {};
		if (!state || !(terms || names)) {
			next('/error');
		} else {
			next();
		}
	},
	created() {
		if (this.$route.query.terms) {
			this.needsTerms = true;
		}
		if (this.$route.query.names) {
			this.needsNames = true;
		}
	},
	mounted() {
		// TODO: tracking events
	},
	methods: {
		postRegisterSocialForm() {
			this.$v.$touch();

			if (!this.$v.$invalid) {
				window.location = `https://${this.$appConfig.auth0.domain}/continue`
				+ '?agree=yes'
				+ `&firstName=${this.firstName}`
				+ `&lastName=${this.lastName}`
				+ `&state=${this.$route.query.state}`;
			}
		},
	}

};
</script>
