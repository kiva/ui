<template>
	<section class="guest-account-upsell hide-for-print tw-p-3">
		<h2 class="guest-account-upsell__headline">
			Before you go!
		</h2>
		<p class="guest-account-upsell__subhead tw-mb-4">
			{{ borrowerUpdateText }}
		</p>
		<guest-account-creation />
	</section>
</template>

<script>
import GuestAccountCreation from '@/components/Forms/GuestAccountCreation';

export default {
	name: 'GuestUpsell',
	props: {
		loans: {
			type: Array,
			default: () => [],
		},
	},
	components: {
		GuestAccountCreation,
	},
	computed: {
		borrowerName() {
			return this.loans.length === 1 ? this.loans[0].name : 'the borrowers you support';
		},
		borrowerUpdateText() {
			return `Finish setting up your account to get updates from ${this.borrowerName}
				and choose how to re-lend your money when they pay you back.`;
		}
	},
	mounted() {
		this.$kvTrackEvent('post-checkout', 'show', 'register-upsell', this.borrowerUpdateText);
	}
};
</script>
