<template>
	<div id="container"
		class="tw-flex tw-mx-auto md:tw-mx-0 tw-items-center tw-justify-around md:tw-justify-start"
	>
		<kv-text-input
			class="tw-w-13 tw-mr-2"
			id="donation-amount"
			v-model="donationAmount"
			@blur="validateInput"
		/>
		<kv-button
			id="donation-button"
			@click="updateDonation()"
		>
			Support Kiva
		</kv-button>
	</div>
</template>

<script>
import numeral from 'numeral';
import updateDonation from '@/graphql/mutation/updateDonation.graphql';
import KvTextInput from '~/@kiva/kv-components/vue/KvTextInput';
import KvButton from '~/@kiva/kv-components/vue/KvButton';

export default {
	components: {
		KvButton,
		KvTextInput,
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
