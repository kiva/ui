<template>
	<div class="donate-repayments-toggle">
		<label v-if="!myDonateRepayments" class="donate-repayments-label">
			<input class="donate-repayments-checkbox" type="checkbox" v-model="donateRepayments">
			<span class="donate-repayments-icon">
				<kv-icon v-if="!donateRepayments" name="checkbox-rounded-unchecked" />
				<kv-icon v-else name="checkbox-rounded-checked" />
			</span>
			<span id="donate-repayments-tooltip">Donate loan repayments instead?</span>
		</label>
		<kv-tooltip controller="donate-repayments-tooltip">
			<template slot="title">Thanks for your support!</template>
			When you check this box, repayments go back to Kiva in the form of donations,
			helping us cover operating costs and reach even more borrowers worldwide.
			<br>
			Repayments from selected loans will not be added back to your account as Kiva credit.
		</kv-tooltip>
	</div>
</template>

<script>
import KvIcon from '@/components/Kv/KvIcon';
import KvTooltip from '@/components/Kv/KvTooltip';
// import numeral from 'numeral';

/*
Data needs
- high level loan data: ids, price, donateRepayment setting, count
- my donateRepyaments status
- currentDonation Total
*/

export default {
	components: {
		KvIcon,
		KvTooltip
	},
	inject: ['apollo'],
	props: {
		donation: {
			type: Object,
			default: () => {}
		},
		myDonateRepayments: {
			type: Boolean,
			default: false
		},
		loanCount: {
			type: Number,
			default: 0
		}
	},
	data() {
		return {
			donateRepayments: false
		};
	}
};
</script>

<style lang="scss" scoped>
@import 'settings';

.donate-repayments-toggle {
	.donate-repayments-label {
		display: block;
		position: relative;
	}

	.donate-repayments-checkbox {
		position: relative;
		left: -1000rem;
	}

	.donate-repayments-icon {
		position: absolute;
		top: 0.5rem;
		right: 0;

		svg {
			height: 1.2rem;
			width: 1.2rem;
		}
	}

	#donate-repayments-tooltip {
		text-align: right;
		display: inherit;
		position: absolute;
		top: 0.5rem;
		right: 2rem;
		font-weight: $global-weight-highlight;
		color: $kiva-accent-blue;
	}
}
</style>
