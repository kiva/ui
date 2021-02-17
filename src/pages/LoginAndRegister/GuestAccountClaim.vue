<template>
	<system-page>
		<div class="page-content">
			<h1 class="featured-text">
				One last thing!
			</h1>
			<p>
				To finish creating your account, please enter your first and last name below.
			</p>
			<form id="guestAccountClaimForm" action="." @submit.prevent.stop="claimGuestAccount">
				<label class="input-label" for="firstName">
					First name
				</label>
				<input id="firstName" v-model="firstName" type="text" required>
				<label class="input-label" for="lastName">
					Last name
				</label>
				<input id="lastName" v-model="lastName" type="text" required>
				<ul v-show="showValidationError" class="validation-errors">
					<li>
						You must provide your first and last name
					</li>
				</ul>
				<KvButton class="claim-button" type="submit">
					Done
				</KvButton>
			</form>
		</div>
	</system-page>
</template>

<script>
import SystemPage from '@/components/SystemFrame/SystemPage';
import KvButton from '@/components/Kv/KvButton';

export default {
	components: {
		SystemPage,
		KvButton,
	},
	inject: ['apollo'],
	data() {
		return {
			firstName: '',
			lastName: '',
			showValidationError: false
		};
	},
	computed: {
		isValid() {
			return this.firstName.trim() && this.lastName.trim();
		},
		formData() {
			return [
				`firstName=${encodeURIComponent(this.firstName)}`,
				`lastName=${encodeURIComponent(this.lastName)}`,
			].join('&');
		}
	},
	methods: {
		claimGuestAccount() {
			if (!this.isValid) {
				this.showValidationError = true;
			} else {
				window.location = `https://${this.$appConfig.auth0.domain}`
						+ `/continue?${this.formData}&state=${this.$route.query.state}`;
			}
		}
	},

};
</script>

<style lang="scss" scoped>
@import 'settings';

.page-content {
	max-width: 20rem;

	.input-label {
		text-align: left;
	}

	.claim-button {
		width: 100%;
	}
}
</style>
