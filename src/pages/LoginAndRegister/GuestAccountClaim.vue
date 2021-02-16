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
					   @valid="firstName = $event"
				>
				<label class="input-label"
					   for='lastName'>
					Last name
				</label>
				<input id="lastName"
					   type="text"
					   required
					   @valid="lastName = $event"
				>
				<KvButton class="claim-button"
						  type="submit"
				>
					Done
				</KvButton>
			</form>
			<kv-loading-overlay v-if="loading" id="updating-overlay" />
		</div>
	</system-page>
</template>

<script>
	import SystemPage from '@/components/SystemFrame/SystemPage';
	import KvButton from '@/components/Kv/KvButton';
	import KvLoadingOverlay from '@/components/Kv/KvLoadingOverlay';
	import completeGuestAccountClaim from '@/graphql/mutation/completeGuestAccountClaim.graphql';
	export default {
		components: {
			SystemPage,
			KvButton,
			KvLoadingOverlay,
		},
		inject: ['apollo'],
		data() {
			return {
				firstName: '',
				lastName: '',
				loading: false,
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
				this.apollo.mutate({
					mutation: completeGuestAccountClaim,
					variables: {
						firstName: this.firstName,
						lastName: this.lastName,
					},
				}).then(({ error }) => {
					if (error) {
						this.$showTipMsg(error.message, 'error');
					} else {
						window.location = `https://${this.$appConfig.auth0.domain}`
								+ `/continue?${this.formData}&state=${this.$route.query.state}`;
					}
				}).catch(error => {
					this.$showTipMsg('Please try again.', 'error');
				}).finally(() => this.stopLoading());
			},
			submit() {
				if (this.formValid) {
					this.claimGuestAccount();
				} else {
					this.$showTipMsg('Please complete all the fields.', 'error');
				}
			},
			startLoading() {
				this.loading = true;
			},
			stopLoading() {
				this.loading = false;
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
