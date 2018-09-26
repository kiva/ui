<template>
	<div id="container">
		<div>
			<input
				id="donation-amount"
				v-model="donationAmount"
				@blur="validateInput"
			>
		</div>
		<div>
			<kv-button
				class="smaller"
				id="donation-button"
				@click.native.prevent.stop="updateDonation()"
			>
				Support Kiva
			</kv-button>
		</div>
	</div>
</template>

<script>
import KvButton from '@/components/Kv/KvButton';
import updateDonation from '@/graphql/mutation/updateDonation.graphql';
import numeral from 'numeral';

export default {
	components: {
		KvButton,
	},
	data() {
		return {
			donationAmount: numeral(this.defaultValue).format('$0,0.00'),
		};
	},
	inject: ['apollo'],
	methods: {
		updateDonation() {
			this.apollo.mutate({
				mutation: updateDonation,
				variables: {
					price: numeral(this.donationAmount).format('0,0.00'),
					isTip: false,
				}
			}).then(() => {
				window.location.href = '/basket';
			}).catch(error => {
				console.error(error);
			});
		},
		validateInput() {
			// format the value taken from the donation input
			this.donationAmount = numeral(this.donationAmount).format('$0,0.00');
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
		margin: 0 auto;
		display: flex;
		align-items: center;
		justify-content: space-around;

		@include breakpoint(large) {
			margin: 0;
			justify-content: flex-start;
		}
	}

	#donation-amount {
		margin-right: rem-calc(20);
		height: rem-calc(56);
		width: rem-calc(80);
		text-align: center;
	}

	#donation-button {
		margin-bottom: 0;
	}
</style>
