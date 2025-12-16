<template>
	<async-lender-section @visible="() => isLoading = false">
		<section v-if="countriesData.length > 0">
			<div v-if="isLoading">
				<kv-loading-placeholder
					class="tw-mb-2"
					style="height: 30px; width: 250px;"
				/>
				<kv-loading-placeholder
					class="tw-w-full tw-aspect-video"
				/>
			</div>
			<div v-else>
				<h2 class="data-hj-suppress tw-mb-2">
					{{ lenderMapTitle }}
				</h2>
				<kv-map
					class="
						tw-rounded
						tw-overflow-hidden
						tw-mb-3
					"
					:auto-zoom-delay="500"
					:aspect-ratio="1.8"
					:lat="30"
					:long="1"
					:zoom-level="1"
					:use-leaflet="true"
					:show-zoom-control="true"
					:allow-dragging="true"
					:show-labels="false"
					:countries-data="countriesData"
					:show-fundraising-loans="showFundraisingLoans"
					@country-lend-filter="countryFilterClicked"
				/>
				<div>
					<p class="tw-mb-1 tw-font-medium">
						Legend:
					</p>
					<div class="tw-grid tw-grid-cols-2 md:tw-grid-cols-3 tw-gap-2">
						<div
							v-for="legend in legendData"
							:key="legend.color"
							class="tw-flex tw-items-start tw-gap-1"
						>
							<span
								:class="[
									'tw-w-4',
									'tw-h-2',
									'tw-border',
									legend.color,
								]"
							></span>
							<p class="tw-text-small tw-font-medium">
								{{ legend.label }}
							</p>
						</div>
					</div>
					<div class="tw-flex tw-items-center tw-gap-1 tw-mt-2">
						<span
							class="tw-w-1 tw-h-1 tw-border tw-rounded-full tw-bg-brand-900"
						></span>
						<p class="tw-text-small tw-font-medium">
							Fundraising loans
						</p>
					</div>
				</div>
				<div class="tw-mt-3">
					<p class="tw-mb-1 tw-font-medium">
						Options:
					</p>
					<kv-checkbox
						class="tw-text-small tw-font-medium custom-checkbox"
						v-model="showFundraisingLoans"
						@click="showFundraisingLoansEvent"
					>
						Show fundraising loans
					</kv-checkbox>
				</div>
			</div>
		</section>
	</async-lender-section>
</template>

<script>
import numeral from 'numeral';
import {
	KvCheckbox, KvMap, getLoansIntervals, KvLoadingPlaceholder
} from '@kiva/kv-components';
import { formatPossessiveName } from '#src/util/stringParserUtils';
import AsyncLenderSection from './AsyncLenderSection';

const mapColors = [
	100,
	300,
	500,
	650,
	800,
	1000,
];

export default {
	name: 'LenderMap',
	components: {
		KvMap,
		KvCheckbox,
		KvLoadingPlaceholder,
		AsyncLenderSection,
	},
	props: {
		lenderInfo: {
			type: Object,
			required: true,
		},
		lenderStats: {
			type: Object,
			required: true,
		},
	},
	data() {
		return {
			showFundraisingLoans: true,
			isLoading: true,
		};
	},
	computed: {
		lenderMapTitle() {
			return this.lenderInfo?.name
				? `${formatPossessiveName(this.lenderInfo.name)} Lending Activity by Country`
				: 'Lending Activity by Country';
		},
		countriesData() {
			return (this.lenderStats?.statsPerCountry?.values ?? []).map(stat => ({
				label: stat.country?.name ?? '',
				value: stat.loanCount ?? '',
				lat: stat.country?.geocode?.latitude ?? 0,
				long: stat.country?.geocode?.longitude ?? 0,
				isoCode: stat.country?.isoCode ?? '',
				numLoansFundraising: stat.country?.numLoansFundraising ?? 0,
			}));
		},
		legendData() {
			const legendLabels = [];
			const loanCountsArray = [];
			this.countriesData.forEach(country => {
				loanCountsArray.push(country.value);
			});

			const maxNumLoansToOneCountry = Math.max(...loanCountsArray);
			const intervals = getLoansIntervals(1, maxNumLoansToOneCountry, 6);

			if (intervals.length === 1) {
				const [inf, sup] = intervals[0]; // eslint-disable-line no-unused-vars

				for (let i = 0; i < sup; i += 1) {
					const loansNumber = i + 1;
					const label = `${loansNumber} loan${loansNumber > 1 ? 's' : ''} made`;

					legendLabels.push({
						color: `tw-bg-brand-${mapColors[i]}`,
						label,
					});
				}
			} else {
				intervals.forEach((interval, index) => {
					const [inf, sup] = interval;
					const formattedInf = numeral(inf).format('0,0');
					const formattedSup = numeral(sup).format('0,0');

					let label = `${formattedInf} - ${formattedSup} loans made`;
					if (inf === sup) {
						label = `${formattedInf} loans made`;
					}

					legendLabels.push({
						color: `tw-bg-brand-${mapColors[index]}`,
						label,
					});
				});
			}

			return legendLabels;
		},

	},
	methods: {
		countryFilterClicked(countryIso) {
			this.$kvTrackEvent('lender-profile', 'click', 'lender-loans-map-country-fundraising-loans', countryIso);
			this.$router.push({
				path: '/lend/filter',
				query: {
					country: countryIso,
				},
			});
		},
		showFundraisingLoansEvent() {
			this.$kvTrackEvent(
				'lender-profile',
				'toggle',
				'lender-loans-map-show-fundraising-loans',
				null,
				this.showFundraisingLoans ? 0 : 1
			);
		},
	},
};
</script>

<style lang="postcss" scoped>
.custom-checkbox:deep(label > div:first-of-type) {
	@apply tw-w-2 tw-h-2;
}
</style>
