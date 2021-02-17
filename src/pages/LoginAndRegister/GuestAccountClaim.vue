<template>
	<system-page>
		<div class="page-content">
			<h1 class="featured-text">
				One last thing!
			</h1>
			<p>
				To finish creating your account, please enter your first and last name below.
			</p>
			<form id="guestAccountClaimForm" action="." @submit.prevent.stop="submitForm">
				<label class="input-label" for="firstName">
					First name
				</label>
				<input id="firstName" v-model="firstName" type="text" required @valid="firstName = $event">
				<label class="input-label" for="lastName">
					Last name
				</label>
				<input id="lastName" v-model="lastName" type="text" required @valid="lastName = $event">
				<KvButton class="claim-button" type="submit">
					Done
				</KvButton>
			</form>
		</div>
	</system-page>
</template>

<script>
import _get from 'lodash/get';
import SystemPage from '@/components/SystemFrame/SystemPage';
import KvButton from '@/components/Kv/KvButton';
import completeGuestAccountClaim from '@/graphql/mutation/completeGuestAccountClaim.graphql';

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
			error: ''
		};
	},
	computed: {
		formData() {
			return [
				`firstName=${encodeURIComponent(this.firstName)}`,
				`lastName=${encodeURIComponent(this.lastName)}`,
			].join('&');
		},
		formValid() {
			return this.firstName && this.lastName;
		},
	},
	methods: {
		claimGuestAccount() {
			this.apollo.mutate({
				mutation: completeGuestAccountClaim,
				variables: {
					firstName: this.firstName,
					lastName: this.lastName,
				},
			}).then(data => {
				const response = _get(data, 'data.my.completeGuestAccountClaim');
				if (response.success) {
					window.location = `https://${this.$appConfig.auth0.domain}`
							+ `/continue?${this.formData}&state=${this.$route.query.state}`;
				} else {
					this.$showTipMsg(response.error, 'error');
				}
			});
		},
		submitForm() {
			if (this.formValid) {
				this.claimGuestAccount();
			} else {
				this.$showTipMsg('Please complete all the fields.', 'error');
			}
		}
	},

};
</script>

<style lang="scss" scoped>
@import 'settings';

.page-content {
	max-width: 20rem;

	#submit-button {
		width: 100%;
	}

	.input-label {
		text-align: left;
	}

	.claim-button {
		width: 100%;
	}
}
</style>
