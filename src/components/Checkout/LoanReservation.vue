<template>
	<div class="reservation-info small-text">
		<span v-if="expiryTime"
			class="loan-message"
			v-html="reservedMessage"></span>
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
		}
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
		reservedMessage() {
			const reservedDate = new Date(this.expiryTime);
			const mins = differenceInMinutes(reservedDate.getTime(), Date.now());

			if (this.expiryTime !== null) {
				const timeLeft = reservedDate.getTime() - Date.now();

				// TODO: update text of Loan not reserved message. Needs to read "Loan not reserved. Why?"
				if (timeLeft <= 0 || this.isExpiringSoon) {
					// eslint-disable-next-line max-len
					return '<div class="red">Loan not reserved. <a @click.prevent="triggerDefaultLightbox">Why?</a></div>';
				} else if (mins > 6) {
					return `<div>Reserved for ${mins} more minutes</div>`;
				} else if (mins <= 6) {
					return `<div class="red">Reserved for ${mins} more minutes</div>`;
				} else if (mins <= 1) {
					return `<div class="red">Reserved for ${mins} more minute</div>`;
				}
			}
		}
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
