<template>
	<div class="reservation-info small-text">
		<span v-if="expiryTime"
			class="loan-message">
			<div
				v-if="loanReservationMsg1"
				class="red">Loan not reserved. <a @click.prevent="triggerDefaultLightbox">Why?</a>
			</div>
			<!-- This lightbox will be replaced with a Popper tip message. -->
			<kv-lightbox
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
				v-if="loanReservationMsg2"
				minutes>Reserved for { minutes } more minutes
			</div>

			<div
				v-if="loanReservationMsg3"
				minutes
				class="red">Reserved for ${ minutes } more minutes
			</div>

			<div
				v-if="loanReservationMsg4"
				class="red">Reserved for 1 more minute
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
			minutes: this.mins
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
	},
	computed: {
		loanReservationMsg1() {
			const reservedDate = new Date(this.expiryTime);
			const timeLeft = reservedDate.getTime() - Date.now();

			if (timeLeft <= 0 || this.isExpiringSoon) {
				return true;
			}
			return false;
		},
		loanReservationMsg2() {
			const reservedDate = new Date(this.expiryTime);
			const mins = differenceInMinutes(reservedDate.getTime(), Date.now());

			if (mins > 6) {
				const minutes = this.mins;
				console.log(minutes);
				console.log(mins);
				return true;
			}
			return false;
		},
		loanReservationMsg3() {
			const reservedDate = new Date(this.expiryTime);
			const mins = differenceInMinutes(reservedDate.getTime(), Date.now());

			if (mins <= 6) {
				const minutes = this.mins;
				console.log(minutes);
				return true;
			}
			return false;
		},
		loanReservationMsg4() {
			const reservedDate = new Date(this.expiryTime);
			const mins = differenceInMinutes(reservedDate.getTime(), Date.now());

			if (mins <= 1) {
				return true;
			}
			return false;
		},

	},
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
