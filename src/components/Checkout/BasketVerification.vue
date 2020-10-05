<template>
	<!-- NB: Reusing .order-totals .forced-width styling. -->
	<div class="basket-verification order-totals">
		<div
			v-if="verificationState === 'verified'"
			class="verification-verified forced-width"
		>
			<div class="forced-width">
				Basket Verified!
			</div>
		</div>

		<kv-lightbox
			:visible="verificationState === 'required'"
			class="verification-required"
			title="Verify your email"
		>
			<p>To ensure your safety, we added an extra layer of security.</p>
			<p>Once we verify your account, you can continue checking out!</p>
			<kv-button @click.native="send">
				Send verification link
			</kv-button>
		</kv-lightbox>

		<kv-lightbox
			:visible="verificationState === 'pending'"
			class="verification-pending"
			title="Verification link sent"
		>
			<p>We sent a validation link <span v-if="email" class="email">to {{ email }}</span>.</p>
			<p>After receiving the email, follow the link provided to continue checking out with your Kiva Credit.</p>
			<kv-button @click.native="send">
				Resend email
			</kv-button>
			<p>
				<router-link to="/help/contact-us">
					Need help? Contact us
				</router-link>
			</p>
		</kv-lightbox>
	</div>
</template>

<script>
import KvButton from '@/components/Kv/KvButton';
import KvLightbox from '@/components/Kv/KvLightbox';
import getVerificationState from '@/graphql/query/checkout/basketVerificationState.graphql';
import startBasketVerificationMutation from '@/graphql/mutation/checkout/startBasketVerification.graphql';

export default {
	components: {
		KvButton,
		KvLightbox,
	},
	inject: ['apollo'],
	data() {
		return {
			email: '',
			verificationState: '',
		};
	},
	apollo: {
		preFetch: true,
		query: getVerificationState,
		result({ data }) {
			this.setState(data?.shop?.basketVerificationState || this.verificationState);
			this.email = data?.my?.userAccount?.email || this.email || '';
		},
	},
	computed: {
		verificationRequired() {
			return this.verificationState === 'required' || this.verificationState === 'pending';
		},
	},
	methods: {
		setState(state) {
			this.verificationState = state;
			this.$emit('verification-state', this.verificationState);
			this.$emit('verification-required', this.verificationRequired);
		},
		send() {
			this.setState('pending');
			this.apollo.mutate({ mutation: startBasketVerificationMutation });
		},
	},
};
</script>

<style lang="scss" scoped>
.verification-verified {
	text-align: right;
}

.verification-pending,
.verification-required {
	text-align: center;
}
</style>
