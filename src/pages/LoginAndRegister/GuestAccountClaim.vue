<template>
	<system-page>
		<div class="page-content">
			<h1 class="featured-text">
				One last thing!
			</h1>
			<p>
				To finish creating your account, please enter your first and last name below.
			</p>
			<form id="guestAccountClaimForm"
				  action="."
				  @submit.prevent.stop="postGuestAccountClaimForm"
			>
				<label class="input-label"
					   for='firstName'>
					First name
				</label>
				<input id="firstName"
					   type="text"
					   required
				>
				<label class="input-label"
					   for='lastName'>
					Last name
				</label>
				<input id="lastName"
					   type="text"
					   required
				>
				<KvButton class="claim-button"
						  type="submit"
				>
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
		data() {
			return {
				firstName: '',
				lastName: '',
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
				this.startLoading();
				this.fetch(`https://${this.$appConfig.auth0.domain}/ajax/complete-account-claim`, {
					method: 'POST',
					headers: {
						'Content-Type': 'application/x-www-form-urlencoded',
					},
					body: this.formData,
				}).then((res) => {
					return res;
				});
			},
			submit() {
				if (this.formValid) {
					this.claimGuestAccount();
				}
			},
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
		.input-label{
			text-align: left;
		}
		.claim-button{
			width: 100%;
		}
	}
</style>
