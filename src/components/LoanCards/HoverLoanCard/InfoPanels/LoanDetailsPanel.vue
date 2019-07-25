<template>
	<info-panel :id="elementId" :expandable="expandable">
		<template #title>
			Loan Details
		</template>
		<ul>
			<li>
				<label>Loan length:</label>
				<p class="data">{{  }}</p>
			</li>
			<li>
				<label>Repayment schedule:</label>
				<p class="data">{{  }}</p>
			</li>
			<li>
				<label>Disbursal date:</label>
				<p class="data">{{  }}</p>
			</li>
			<li>
				<label>Currency exchange loss:</label>
				<p class="data">{{  }}</p>
			</li>
			<li>
				<label>Facilitated by Field Partner:</label>
				<p class="data">{{  }}</p>
			</li>
			<li>
				<label>Is borrower paying interest? </label>
				<p class="data">{{  }}</p>
			</li>
			<li>
				<label>Field Partner risk rating:</label>
				<p class="data">{{  }}</p>
			</li>
		</ul>
		<ul>
			<!-- The size of the following tag will need to be adjusted -->
			<h3>{{ COUNTRY }} country facts</h3>
			<li>
				<label>Average annual income (USD):</label>
				<p class="data">{{  }}</p>
			</li>
			<li>
				<label>Funds lent in {{ COUNTRY }}:</label>
				<p class="data">{{  }}</p>
			</li>
			<li>
				<label>Loans currently fundraising:</label>
				<p class="data">{{  }}</p>
			</li>
			<li>
				<label>Loans transacted in:</label>
				<p class="data">{{  }}</p>
			</li>
		</ul>
	</info-panel>
</template>

<script>
import InfoPanel from './InfoPanel';
import KvLoadingSpinner from '@/components/Kv/KvLoadingSpinner';

export default {
	components: {
		InfoPanel,
		KvLoadingSpinner,
	},
	props: {
		expandable: {
			type: Boolean,
			default: true,
		},
		loanId: {
			type: Number,
			default: 0,
		},
	},
	computed: {
		elementId() {
			return `${this.loanId}-loan-details-panel-ex-${this.expandable ? '1' : '0'}`;
		}
	},
};
</script>

<style lang="scss">
@import 'settings';

#loading-overlay {
	position: absolute;
	width: auto;
	height: auto;
	left: 1rem;
	right: 1rem;
	bottom: 0;
	top: 0;
	background-color: rgba($platinum, 0.7);

	.spinner-wrapper {
		display: flex;
		align-items: center;
		justify-content: center;
		position: relative;
		height: 100%;
		top: auto;
		left: auto;
		transform: none;
		transition: top 100ms linear;
	}
}

</style>
