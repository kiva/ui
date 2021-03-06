<template>
	<div class="reservation-info">
		<div
			class="small-text"
			v-if="expiryTime"
		>
			<!-- The loan-message class is on all possible loan-message return types for use in automated tests
			that QA/David configured -->

			<!-- Loading state -->
			<div class="loan-message" v-if="calculatingMessage">
				<em>Calculating loan reservation...</em>
			</div>
			<!-- Not Reserved -->
			<div class="loan-message" v-if="loanReservationMsg1">
				Loan not reserved. <kv-button class="text-link" @click.native="triggerDefaultLightbox">
					Why?
				</kv-button>
			</div>
			<!-- Time Based Messages -->
			<div
				v-if="loanReservationMsg2 || loanReservationMsg3 || loanReservationMsg4"
				class="loan-message"
				:class="{red: loanReservationMsg3 || loanReservationMsg4}"
			>
				{{ differenceInWords }}
			</div>
			<!-- TODO: Replace this lightbox with a Popper tip message. -->
			<kv-lightbox
				class="loanNotReservedLightbox"
				:visible="defaultLbVisible"
				@lightbox-closed="lightboxClosed"
				title="What does it mean that my loan is not reserved?"
			>
				<p>
					Loans will not be reserved if they've been in your basket for more than 45
					minutes or have less than 6 hours left to fundraise. This means there's a chance this loan may be
					funded by other lenders even though it's in your basket. To make this loan, please proceed through
					the checkout process.
				</p>
			</kv-lightbox>
		</div>
	</div>
</template>

<script>
import { differenceInMinutes, differenceInSeconds } from 'date-fns';
import KvButton from '@/components/Kv/KvButton';
import KvLightbox from '@/components/Kv/KvLightbox';

export default {
	components: {
		KvButton,
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
			calculatingMessage: true,
		};
	},
	props: {
		activateTimer: {
			type: Boolean,
			default: true
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
	computed: {
		reservedDate() {
			return new Date(this.expiryTime);
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
				const mins = differenceInMinutes(this.reservedDate.getTime(), Date.now());
				const seconds = differenceInSeconds(this.reservedDate.getTime(), Date.now()) % 60;

				let warningMessageUpperBoundMinutes = 5;
				let differenceInWords = `Reserved for ${mins} more minutes`;

				if (this.activateTimer === true) {
					warningMessageUpperBoundMinutes = 9;
					differenceInWords = `Reservation expires in ${mins}m ${seconds}s`;
				}

				if ((this.reservedDate.getTime() - Date.now()) <= 0 || this.isExpiringSoon) {
					clearInterval(this.reservationMessageId);
					this.loanReservationMsg1 = true;
					this.loanReservationMsg2 = false;
					this.loanReservationMsg3 = false;
					this.loanReservationMsg4 = false;
				} else if (mins > warningMessageUpperBoundMinutes) {
					this.setDifferenceInWords(differenceInWords);
					this.loanReservationMsg1 = false;
					this.loanReservationMsg2 = true;
				} else if (mins > 1 && mins <= warningMessageUpperBoundMinutes) {
					this.setDifferenceInWords(differenceInWords);
					this.loanReservationMsg2 = false;
					this.loanReservationMsg3 = true;
				} else if (mins <= 1) {
					differenceInWords = this.activateTimer === true
						? `Reservation expires in ${seconds}s`
						: 'Reserved for 1 more minute';

					this.setDifferenceInWords(differenceInWords);
					this.loanReservationMsg3 = false;
					this.loanReservationMsg4 = true;
				}
				// clear calculating message
				this.calculatingMessage = false;
			}
		},
		activateReservationTimer() {
			clearInterval(this.reservationMessageId);

			this.reservationMessageId = setInterval(() => {
				this.reservationMessage();
			}, 1000);
		}
	},
	mounted() {
		if (this.activateTimer === true) {
			this.activateReservationTimer();
		}
	},
	destroyed() {
		if (this.activateTimer === true) {
			clearInterval(this.reservationMessageId);
		}
	},
	watch: {
		// This watch is only necessary due to a potentially changing experiment value
		// TODO: remove this watch + similify setTimeout activation once experiment is removed
		activateTimer(newValue) {
			this.$nextTick(() => {
				if (newValue) {
					this.activateReservationTimer();
				} else {
					clearInterval(this.reservationMessageId);
				}
			});
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
