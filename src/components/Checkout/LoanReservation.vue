<template>
	<div class="reservation-info small-text">
		<span v-if="expiryTime"
			class="loan-message"
			v-html="reservedMessage"></span>
	</div>
</template>

<script>
import { differenceInMinutes } from 'date-fns';

export default {
	props: {
		expiryTime: {
			type: String,
			default: ''
		},
		isExpiringSoon: {
			type: Boolean,
			default: false
		}
	},
	computed: {
		reservedMessage() {
			const reservedDate = new Date(this.expiryTime);
			const mins = differenceInMinutes(reservedDate.getTime(), Date.now());

			if (this.expiryTime !== null) {
				const timeLeft = reservedDate.getTime() - Date.now();

				// TODO: update text of Loan not reserved message. Needs to read "Loan not reserved. Why?"
				// Why? needs to be a link to helptext handled using popper's lightbox or helptext
				if (timeLeft <= 0 || this.isExpiringSoon) {
					return '<div class="red">Loan not reserved</div>';
				} else if (mins > 6) {
					return `<div>Reserved for ${mins} more minutes</div>`;
				} else if (mins <= 6) {
					return `<div class="red">Reserved for ${mins} more minutes</div>`;
				} else if (mins <= 1) {
					return `<div class="red">Reserved for ${mins} more minute</div>`;
				}
			}
		}
	}
};

</script>

<style lang="scss" scoped>
@import 'settings';

.reservation-info {
	color: $kiva-text-light;
	line-height: 2rem;
	float: right;

	.loan-message /deep/ .red {
		color: $kiva-accent-red;
		font-weight: 400;
	}
}
</style>
