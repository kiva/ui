<template>
	<system-page>
		<div class="page-content">
			<h1 class="featured-text">
				Almost done...
			</h1>
			<p>
				To complete your registration, please agree to the Terms of Use and Privacy Policy
			</p>
			<form
				id="registerSocialTermsForm"
				class="promptForm"
				action="."
				@submit.prevent.stop="postRegisterSocialForm"
			>
				<p class="terms">
					<label>
						<input
							type="checkbox"
							id="terms_agreement_popup"
							name="terms_agreement_popup"
							v-model="newAcctTerms"
							@click="showNewAcctTermsError = validateTerms()"
						>
						I have read and agree to the Kiva
						<a href="/legal/terms" target="_blank">Terms of Use</a>
						and
						<a href="/legal/privacy" target="_blank">Privacy Policy</a>
					</label>
					<ul v-show="showNewAcctTermsError" class="validation-errors">
						<li>
							You must agree to the Kiva Terms of Use and Privacy Policy
						</li>
					</ul>
				</p>
				<kv-button
					class="register-button smaller"
					type="submit"
					name="regForm_submit"
					id="regForm_submit"
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
import SystemPage from '@/components/SystemFrame/SystemPage';
import KvButton from '@/components/Kv/KvButton';

export default {
	metaInfo() {
		return {
			title: 'Accept terms'
		};
	},
	components: {
		SystemPage,
		KvButton,
	},
	data() {
		return {
			newAcctTerms: false,
			showNewAcctTermsError: false,
		};
	},
	mounted() {
		if (!this.$route.query.state) {
			this.$router.push('/error');
		}
	},
	methods: {
		validateTerms() {
			return this.newAcctTerms;
		},

		postRegisterSocialForm() {
			// Validate the termsAgreementPopup is checked
			if (!this.validateTerms()) {
				// show error here
				this.showNewAcctTermsError = true;
			} else {
				window.location = `https://${this.$appConfig.auth0.domain}`
				+ `/continue?agree=yes&state=${this.$route.query.state}`;
			}
		},
	}

};
</script>

<style lang="scss" scoped>
@import 'settings';

.terms #terms_agreement_popup {
	margin: 0 0.5rem 0 0;
}

</style>
