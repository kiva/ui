<template>
	<div class="reservation-info small-text">
		<span v-if="expiryTime">
			<!-- The loan-message class is on all possible loan-message return types for use in automated tests
			that QA/David configured -->
			<div
				class="loan-message"
				v-if="loanReservationMsg1">
				Loan not reserved. <a @click.prevent="triggerDefaultLightbox">Why?</a>
			</div>
			<!-- TODO: Replace this lightbox with a Popper tip message. -->
			<kv-lightbox
				class="loanNotReservedLightbox"
				:visible="defaultLbVisible"
				@lightbox-closed="lightboxClosed">
				<h2 slot="title">What does it mean that my loan is not reserved?</h2>
				<div>
					Loans will not be reserved if they've been in your basket for more than 45 minutes or have less
					than 6 hours left to fundraise. This means there's a chance this loan may be funded by other lenders
					even though it's in your basket. To make this loan, please proceed through the checkout process.
				</div>
			</kv-lightbox>

			<div
				class="loan-message"
				v-if="loanReservationMsg2" >Reserved for {{ mins }} more minutes
			</div>

			<div
				v-if="loanReservationMsg3"
				class="red loan-message">Reserved for {{ mins }} more minutes
			</div>

			<div
				v-if="loanReservationMsg4"
				class="red loan-message">Reserved for 1 more minute
			</div>
		</span>
	</div>
</template>

<script>
import { differenceInMinutes } from 'date-fns';
import KvLightbox from '@/components/Kv/KvLightbox';

export default {
	components: {
		KvLightbox
	},
	data() {
		return {
			defaultLbVisible: false,
			mins: '',
			loanReservationMsg1: false,
			loanReservationMsg2: false,
			loanReservationMsg3: false,
			loanReservationMsg4: false,
		};
	},
	props: {
		expiryTime: {
			type: String,
			default: ''
		},
		isExpiringSoon: {
			type: Boolean,
			default: false
		},
	},
	methods: {
		triggerDefaultLightbox() {
			this.defaultLbVisible = !this.defaultLbVisible;
		},
		lightboxClosed() {
			this.defaultLbVisible = false;
		},
		setMins(mins) {
			this.mins = mins;
		},
		reservationMessage() {
			const reservedDate = new Date(this.expiryTime);
			const mins = differenceInMinutes(reservedDate.getTime(), Date.now());

			if (this.expiryTime !== null) {
				const timeLeft = reservedDate.getTime() - Date.now();
				if (timeLeft <= 0 || this.isExpiringSoon) {
					this.loanReservationMsg1 = true;
				} else if (mins > 6) {
					this.setMins(mins);
					this.loanReservationMsg2 = true;
				} else if (mins <= 6) {
					this.setMins(mins);
					this.loanReservationMsg3 = true;
				} else if (mins <= 1) {
					this.loanReservationMsg4 = true;
				}
			}
		}
	},
	created() {
		this.reservationMessage();
	},
};

</script>

<style lang="scss" scoped>
@import 'settings';

.reservation-info {
	color: $kiva-text-light;
	width: 100%;
	text-align: left;

	.loanNotReservedLightbox {
		color: $charcoal;
	}

	.loan-message {
		margin-bottom: rem-calc(5);
		font-weight: $global-weight-normal;
	}

	.loan-message >>> .red {
		color: $kiva-accent-red;
		font-weight: $global-weight-highlight;
	}
}
</style>
