<template>
	<section
		class="tw-bg-secondary md:tw-bg-secondary"
		style="margin: -16px"
	>
		<div class="tw-flex tw-px-4 tw-py-2">
			<div class="tw-flex-auto">
				<BorrowerName
					data-testid="bp-summary-borrower-name"
					class="tw-mb-0.5"
					:name="name"
				/>
				<template v-if="isLoading">
					<div class="tw-flex tw-flex-wrap tw-mb-3">
						<KvLoadingPlaceholder class="tw-mb-1" style="height: 0.5rem;" />
						<KvLoadingPlaceholder style="height: 2.8rem; width: 30%;" />
						<KvLoadingPlaceholder style="height: 2.8rem; width: 30%; margin-left: auto;" />
					</div>
				</template>
				<template v-else>
					<div class="tw-space-y-4">
						<div class="tw-space-y-2">
							<BorrowerImage
								data-testid="bp-summary-image"
								class="tw-w-full tw-rounded tw-bg-black"
								:alt="name"
								:aspect-ratio="16 / 25"
								:default-image="{ width: 612 }"
								:hash="loan.image.hash"
							/>
							<div class="tw-text-center">
								<h3 class="tw-text-h2">
									{{ loan?.name }}
								</h3>
								<div class="tw-font-medium tw-text-action">
									{{ loan?.sector?.name }}
								</div>
							</div>
							<LoanProgress
								data-testid="bp-summary-progress"
								class="tw-mb-2 tw-mt-1.5"
								:money-left="unreservedAmount"
								:progress-percent="fundraisingPercent"
								:time-left="timeLeft"
								:loan-status="inPfp ? 'pfp' : 'fundraising'"
								:number-of-lenders="numLenders"
								:pfp-min-lenders="pfpMinLenders"
							/>
						</div>
						<div class="tw-border-l-4 tw-border-action tw-text-primary tw-pl-4 tw-space-y-2">
							<div class="tw-text-h4">
								How this money helps
							</div>
							<div class="tw-text-secondary">
								Helps {{ loan.use }}
							</div>
						</div>
						<div class="tw-bg-white tw-px-3 tw-py-4" style="margin-left: -30px; margin-right: -30px;">
							<WhySpecial
								data-testid="bp-why-special"
								:loan-id="loan.id"
							/>
						</div>
						<MoreAboutLoan :loan-id="loan.id" />
					</div>
				</template>
			</div>
		</div>
	</section>
</template>

<script>
import { KvLoadingPlaceholder } from '@kiva/kv-components';

import { mdiMapMarker } from '@mdi/js';

import BorrowerImage from './BorrowerImage';
import BorrowerName from './BorrowerName';
import LoanProgress from './LoanProgress';
import MoreAboutLoan from './MoreAboutLoan';
import WhySpecial from './WhySpecial';

export default {
	name: 'BorrowerSideSheetContent',
	inject: ['apollo', 'cookieStore'],
	components: {
		BorrowerImage,
		BorrowerName,
		KvLoadingPlaceholder,
		LoanProgress,
		WhySpecial,
		MoreAboutLoan,
	},
	props: {
		loan: {
			type: Object,
			default: () => {},
		},
	},
	data() {
		return {
			activityName: '',
			city: '',
			countryName: '',
			distributionModel: '',
			fundraisingPercent: 0,
			hash: '',
			inPfp: false,
			isLoading: true,
			isLoggedIn: false,
			mdiMapMarker,
			name: '',
			numLenders: 0,
			pfpMinLenders: 0,
			state: '',
			status: '',
			timeLeft: '',
			totalComments: 0,
			unreservedAmount: '0',
			use: '',
		};
	},
	computed: {
		formattedLocation() {
			if (this.distributionModel === 'direct') {
				const formattedString = `${this.city}, ${this.state}, ${this.countryName}`;
				return formattedString;
			}
			if (this.countryName === 'Puerto Rico') {
				const formattedString = `${this.city}, PR`;
				return formattedString;
			}
			return this.countryName;
		},
	},
	async mounted() {
		console.log('this.loan', this.loan);
		this.inPfp = this.loan?.inPfp ?? false;
		this.pfpMinLenders = this.loan?.pfpMinLenders ?? 0;
		this.numLenders = this.loan?.lenders?.totalCount ?? 0;
		this.activityName = this.loan?.activity?.name ?? '';
		this.countryName = this.loan?.geocode?.country?.name ?? '';
		this.fundraisingPercent = this.loan?.fundraisingPercent ?? 0;
		this.timeLeft = this.loan?.fundraisingTimeLeft ?? '';
		this.unreservedAmount = this.loan?.unreservedAmount ?? '0';
		this.distributionModel = this.loan?.distributionModel ?? '';
		this.city = this.loan?.geocode?.city ?? '';
		this.state = this.loan?.geocode?.state ?? '';
		// If all shares are reserved in baskets, set the fundraising meter to 100%
		if (this.unreservedAmount === '0') this.fundraisingPercent = 1;
		this.totalComments = this.loan?.comments?.totalCount ?? 0;
		this.isLoading = false;
	},
};
</script>
