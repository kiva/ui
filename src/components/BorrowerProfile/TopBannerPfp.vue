<template>
	<kv-page-container class="tw-px-0">
		<kv-grid class="tw-grid-cols-12">
			<div class="tw-col-span-12">
				<section
					class="
					tw-bg-brand-200
					md:tw-bg-primary
					tw-p-2.5 md:tw-p-3 lg:tw-p-4
					tw-rounded-b"
				>
					<div class="tw-flex tw-items-center">
						<div
							class="tw-flex-none tw-mr-1.5 tw-h-2.5"
						>
							<kv-material-icon
								class="tw-text-secondary tw-h-2.5 tw-w-2.5 tw-shrink-0"
								:icon="mdiInformationOutline"
							/>
						</div>
						<div>
							<h3>
								This loan is in the private fundraising stage.
							</h3>
						</div>
					</div>
					<div class="tw-flex-auto">
						<!-- eslint-disable-next-line max-len -->
						<p>{{ borrowerName }} has {{ daysLeftLanguage }} to earn the support of {{ lendersNeeded }} lenders through their network. Once they reach this goal, we'll share their loan with Kiva's global lending community.</p>
						<p class="tw-mt-2">
							<!-- eslint-disable-next-line max-len -->
							The <strong>Private Fundraising Period</strong> is a core part of Kiva's social underwriting model, which relies on community trust rather than credit scores or collateral. Your contribution is a signal that says: <em>“I know this person. I trust their character. I believe they will use this loan responsibly and repay it.”</em>
						</p>
						<p class="tw-mt-2">
							<strong>Your loan is not a donation</strong>
							—you'll be repaid as the borrower makes scheduled loan payments.
						</p>
					</div>
				</section>
			</div>
		</kv-grid>
	</kv-page-container>
</template>

<script>
import { mdiInformationOutline } from '@mdi/js';
import { KvMaterialIcon, KvGrid, KvPageContainer } from '@kiva/kv-components';

export default {
	name: 'TopBannerPfp',
	components: {
		KvMaterialIcon,
		KvGrid,
		KvPageContainer,
	},
	props: {
		lendersNeeded: {
			type: Number,
			default: 0,
		},
		daysLeft: {
			type: Number,
			default: 0,
		},
		borrowerName: {
			type: String,
			default: 'This borrower',
		},
	},
	data() {
		return {
			mdiInformationOutline,
		};
	},
	computed: {
		daysLeftLanguage() {
			switch (this.daysLeft) {
				case this.daysLeft < 1:
					return 'less than 1 day';
				case this.daysLeft === 1:
					return `${this.daysLeft} day`;
				default:
					return `${this.daysLeft} days`;
			}
		}
	}
};
</script>
