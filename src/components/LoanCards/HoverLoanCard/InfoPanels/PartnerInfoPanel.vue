<template>
	<info-panel :id="elementId" :expandable="expandable">
		<template #title>
			Field Partner info
		</template>
		<!-- v-if="!loanLength" -->
		<!-- <div id="loading-overlay">
			<div class="spinner-wrapper">
				<kv-loading-spinner />
			</div>
		</div> -->
		<!-- v-else -->
		<div>
			<ul>
				<li>
					<label>Time on Kiva:</label>
					<span class="data">
						{{}} months
					</span>
				</li>
				<li>
					<label>Kiva borrowers:</label>
					<span class="data">
						{{}}
					</span>
				</li>
				<li>
					<label>Total loans:</label>
					<p class="data">
						{{}}
					</p>
				</li>
				<li>
					<label>Average cost to borrower:</label>
					<p class="data">
						{{}}
					</p>
				</li>
				<li>
					<label>Profitabilty (return on assets):</label>
					<p class="data">
						{{}}
					</p>
				</li>
				<li>
					<label>Average loan size (% per capita income):</label>
					<p class="data">
						{{}}
					</p>
				</li>
				<li>
					<label>Deliquency rate:</label>
					<p class="data">
						{{}}
					</p>
				</li>
				<li>
					<label>Loans at risk rate:</label>
					<p class="data">
						{{}}
					</p>
				</li>
				<li>
					<label>Default rate:</label>
					<p class="data">
						{{}}
					</p>
				</li>
				<li>
					<label>Currency exchange loss rate:</label>
					<p class="data">
						{{}}
					</p>
				</li>
			</ul>
			<div>
				<h3>Why Kiva works with this partner:</h3>
				<p class="data">{{}}</p>
			</div>
		</div>
	</info-panel>
</template>

<script>
import InfoPanel from './InfoPanel';
// import KvLoadingSpinner from '@/components/Kv/KvLoadingSpinner';

export default {
	components: {
		InfoPanel,
		// KvLoadingSpinner
	},
	inject: ['apollo'],
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
			return `${this.loanId}-partner-info-panel-ex-${this.expandable ? '1' : '0'}`;
		}
	},
};
</script>
