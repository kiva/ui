<template>
	<div id="container">
		<div>
			<input id="donation-amount" v-model="donationAmount" type="number">
		</div>
		<div>
			<kv-button class="smaller" @click.native.prevent.stop="updateDonation()">Support Kiva</kv-button>
		</div>
	</div>
</template>

<script>
import KvButton from '@/components/Kv/KvButton';
import updateDonation from '@/graphql/mutation/updateDonation.graphql';

export default {
	components: {
		KvButton,
	},
	data() {
		return {
			donationAmount: this.defaultValue,
		};
	},
	inject: ['apollo'],
	methods: {
		updateDonation() {
			this.apollo.mutate({
				mutation: updateDonation,
				variables: {
					price: this.donationAmount,
					isTip: false,
				}
			}).then(() => {
				window.location.href = '/basket';
			}).catch(error => {
				console.error(error);
			});
		}
	},
	props: {
		defaultValue: { type: Number, required: false, default: 0 }
	},
};
</script>


<style lang="scss" scoped>
	@import 'settings';

	#container {
		display: flex;
		align-items: center;
		justify-content: space-around;

		@include breakpoint(large) {
			justify-content: flex-start;
		}
	}

	#donation-amount {
		margin-right: rem-calc(20);
		height: rem-calc(56);
		width: rem-calc(80);
	}
</style>
