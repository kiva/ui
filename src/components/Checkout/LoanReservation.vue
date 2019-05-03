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
				v-if="loanReservationMsg2">{{ differenceInWords }}
			</div>

			<div
				v-if="loanReservationMsg3 || loanReservationMsg4"
				class="loan-message red">{{ differenceInWords }}
			</div>
		</span>
	</div>
</template>

<script>
import { differenceInMinutes, differenceInSeconds } from 'date-fns';
import KvLightbox from '@/components/Kv/KvLightbox';

export default {
	components: {
		KvLightbox
	},
	data() {
		return {
			defaultLbVisible: false,
			differenceInWords: '',
			reservationMessageId: null,
			loanReservationMsg1: false,
			loanReservationMsg2: false,
			loanReservationMsg3: false,
			loanReservationMsg4: false,
		};
	},
	props: {
		activateTimer: {
			type: Boolean,
			default: false
		},
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
		setDifferenceInWords(value) {
			this.differenceInWords = value;
		},
		reservationMessage() {
			if (this.expiryTime !== null) {
				const reservedDate = new Date(this.expiryTime);
				const mins = differenceInMinutes(reservedDate.getTime(), Date.now());
				const seconds = differenceInSeconds(reservedDate.getTime(), Date.now()) % 60;

				let warningMessageUpperBoundMinutes = 6;
				let differenceInWords = `Reserved for ${mins} more minutes`;

				if (this.activateTimer === true) {
					warningMessageUpperBoundMinutes = 10;
					differenceInWords = `Reservation expires in ${mins} minutes and ${seconds} seconds`;
				}

				if ((reservedDate.getTime() - Date.now()) <= 0 || this.isExpiringSoon) {
					clearInterval(this.reservationMessageId);
					this.loanReservationMsg1 = true;
					this.loanReservationMsg2 = false;
					this.loanReservationMsg3 = false;
					this.loanReservationMsg4 = false;
				} else if (mins > warningMessageUpperBoundMinutes) {
					this.setDifferenceInWords(differenceInWords);
					this.loanReservationMsg2 = true;
				} else if (mins > 1 && mins <= warningMessageUpperBoundMinutes) {
					this.setDifferenceInWords(differenceInWords);
					this.loanReservationMsg3 = true;
				} else if (mins <= 1) {
					differenceInWords = this.activateTimer === true ?
						`Reservation expires in ${seconds} seconds` :
						'Reserved for 1 more minute';

					this.setDifferenceInWords(differenceInWords);
					this.loanReservationMsg4 = true;
				}
			}
		}
	},
	created() {
		this.reservationMessage();
	},
	mounted() {
		if (this.activateTimer === true) {
			this.reservationMessageId = setInterval(() => {
				this.reservationMessage();
			}, 1000);
		}
	},
	destroyed() {
		if (this.activateTimer === true) {
			clearInterval(this.reservationMessageId);
		}
	}
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

	.loan-message.red {
		color: $kiva-accent-red;
		font-weight: $global-weight-highlight;
	}
}
</style>
