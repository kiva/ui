<template>
	<div class="reservation-info tw-w-full">
		<div
			class="tw-text-small tw-text-secondary"
			v-if="expiryTime"
		>
			<!-- The loan-message class is on all possible loan-message return types for use in automated tests
			that QA/David configured -->

			<!-- Loading state -->
			<p class="loan-message tw-my-1" v-if="calculatingMessage">
				<em>Calculating loan reservation...</em>
			</p>
			<!-- Not Reserved -->
			<p class="loan-message tw-my-1" v-if="loanReservationMsg1">
				Loan not reserved. <button
					class="tw-text-link tw-font-medium" @click="triggerDefaultLightbox"
					data-testid="basket-loan-reservation-why"
				>
					Why?
				</button>
			</p>
			<!-- Time Based Messages -->
			<p
				v-if="loanReservationMsg2 || loanReservationMsg3 || loanReservationMsg4"
				class="loan-message tw-my-1"
				:class="{'tw-font-medium tw-text-danger': loanReservationMsg3 || loanReservationMsg4}"
			>
				{{ differenceInWords }}
			</p>
		</div>
		<!-- TODO: Replace this lightbox with a Popper tip message. -->
		<kv-lightbox
			class="loanNotReservedLightbox"
			data-testid="basket-loan-why-lightbox"
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
</template>

<script>
import { differenceInMinutes, differenceInSeconds } from 'date-fns';
import KvLightbox from '~/@kiva/kv-components/vue/KvLightbox';

export default {
	name: 'LoanReservation',
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
			calculatingMessage: true,
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
		reservationMessage() {
			if (this.expiryTime !== null) {
				const mins = differenceInMinutes(this.reservedDate.getTime(), Date.now());
				const seconds = differenceInSeconds(this.reservedDate.getTime(), Date.now()) % 60;

				const warningMessageUpperBoundMinutes = 9;
				const differenceInWords = `Reservation expires in ${mins}m ${seconds}s`;

				if ((this.reservedDate.getTime() - Date.now()) <= 0 || this.isExpiringSoon) {
					clearInterval(this.reservationMessageId);
					this.loanReservationMsg1 = true;
					this.loanReservationMsg2 = false;
					this.loanReservationMsg3 = false;
					this.loanReservationMsg4 = false;
				} else if (mins > warningMessageUpperBoundMinutes) {
					this.differenceInWords = differenceInWords;
					this.loanReservationMsg1 = false;
					this.loanReservationMsg2 = true;
				} else if (mins > 1 && mins <= warningMessageUpperBoundMinutes) {
					this.differenceInWords = differenceInWords;
					this.loanReservationMsg2 = false;
					this.loanReservationMsg3 = true;
				} else if (mins <= 1) {
					this.differenceInWords = `Reservation expires in ${seconds}s`;
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
	created() {
		this.reservationMessage();
	},
	mounted() {
		this.activateReservationTimer();
	},
	beforeDestroy() {
		if (this.reservationMessageId) {
			clearInterval(this.reservationMessageId);
		}
	},
};
</script>
