<template>
	<div class="reservation-info small-text">
		<span v-if="isExpiringSoon"
			class="loan-message">{{ reservedMessage }}</span>
			<!-- Reserved for {{ props.expiryTime }} ## {{ props.isEndingSoon }}more minutes -->
	</div>
</template>

<script>
import {
	differenceInMinutes,
	differenceInHours
} from 'date-fns';

export default {
	props: {
		plannedExpirationDate: {
			type: String,
			default: ''
		},
		isExpiringSoon: {
			type: Boolean,
			default: false
		},
		isFunded: {
			type: Boolean,
			default: false
		},
	},
	computed: {
		reservedMessage() {
			console.log('reserved message function entered');
			if (!this.isExpiringSoon) {
				return '';
			}
			const hours = differenceInHours(this.plannedExpirationDate, Date.now());
			if (hours >= 6) {
				return 'Loan not reserved. Why?';
			}
			const mins = differenceInMinutes(this.plannedExpirationDate, Date.now());
			if (mins >= 45) {
				return `NORMAL Reserved for ${mins} more minutes `;
			}
			if (mins >= 6) {
				return `RED Reserved for ${mins} more minutes `;
			}
			return 'Reserved text fallthrough';
		}
	}
};

</script>

<style lang="scss" scoped>
@import 'settings';

.reservation-info {
	color: $kiva-text-light;
}
</style>
