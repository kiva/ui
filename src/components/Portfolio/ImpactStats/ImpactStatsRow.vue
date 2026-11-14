<template>
	<section
		aria-label="Impact stats"
		data-testid="impact-stats"
		class="tw-grid tw-grid-cols-2 tw-gap-1
			md:tw-grid-cols-[minmax(max-content,1fr)_minmax(0,1fr)_minmax(max-content,1fr)_minmax(0,1fr)]
			md:tw-gap-x-3 md:tw-gap-y-0 md:tw-px-2.5 md:tw-py-2 md:tw-bg-white md:tw-rounded md:tw-shadow-lg"
	>
		<ImpactStat
			:class="[cellClass, 'tw-col-span-2 md:tw-col-span-1']"
			label="Lives touched"
			tooltip="The number of borrowers you've lent to."
			value-test-id="impact-lives-touched"
			:value="livesTouched"
			:loading="loading"
			footer-beside
		>
			<ul
				class="tw-flex tw-flex-col tw-items-end tw-gap-1 tw-text-right tw-text-balance
					md:tw-items-start md:tw-gap-0.5 md:tw-text-left"
			>
				<li>
					<KvTextLink
						:class="linkClass"
						to="/portfolio/loans"
						:icon="mdiArrowRight"
						v-kv-track-event="['portfolio', 'click', 'view-my-loans']"
					>
						View my loans
					</KvTextLink>
				</li>
				<li>
					<KvTextLink
						:class="linkClass"
						to="/portfolio/borrower-messages"
						:icon="mdiArrowRight"
						v-kv-track-event="['portfolio', 'click', 'see-borrower-updates']"
					>
						See borrower updates
					</KvTextLink>
				</li>
			</ul>
		</ImpactStat>
		<ImpactStat
			:class="cellClass"
			label="Countries"
			tooltip="Countries you've lent to, out of the countries where Kiva lends today."
			value-test-id="impact-countries"
			:value="countriesLentTo"
			:loading="loading"
		>
			<p
				v-if="countriesAvailable !== null"
				class="tw-text-caption tw-text-tertiary"
				data-testid="impact-countries-total"
			>
				of {{ $filters.numeral(countriesAvailable, '0,0') }} countries
			</p>
		</ImpactStat>
		<ImpactStat
			:class="cellClass"
			label="Donations"
			tooltip="Your total donations to Kiva."
			value-test-id="impact-donations"
			:value="donations"
			format="$0,0[.]00"
			:loading="loading"
		>
			<p class="tw-text-balance">
				<KvTextLink
					:class="linkClass"
					to="/portfolio/donations"
					:icon="mdiArrowRight"
					v-kv-track-event="['portfolio', 'click', 'view-tax-receipts']"
				>
					View tax receipts
				</KvTextLink>
			</p>
		</ImpactStat>
		<ImpactStat
			:class="[cellClass, 'tw-col-span-2 md:tw-col-span-1']"
			label="Total impact"
			tooltip="The total you've lent from your account, including repayments you've lent again."
			value-test-id="impact-total-impact"
			:value="totalImpact"
			format="$0,0[.]00"
			:loading="loading"
		>
			<p class="tw-text-caption tw-text-tertiary">
				from your account
			</p>
		</ImpactStat>
	</section>
</template>

<script setup>
import { mdiArrowRight } from '@mdi/js';
import { KvTextLink } from '@kiva/kv-components';
import ImpactStat from '#src/components/Portfolio/ImpactStats/ImpactStat';
import useImpactStats from '#src/composables/useImpactStats';

defineOptions({ name: 'ImpactStatsRow' });

const {
	livesTouched,
	countriesLentTo,
	countriesAvailable,
	donations,
	totalImpact,
	loading,
} = useImpactStats();

// KvTextLink is inline-flex, which pushes its arrow to the far edge when the text wraps
const linkClass = '!tw-inline [&>span]:tw-align-middle md:tw-whitespace-nowrap';

const cellClass = `tw-bg-white tw-rounded tw-shadow-lg tw-p-2
	md:tw-bg-transparent md:tw-rounded-none md:tw-shadow-[0_0_#0000] md:tw-p-0`;
</script>
