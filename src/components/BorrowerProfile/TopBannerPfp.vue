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
								This loan is in the private funding stage.
							</h3>
						</div>
					</div>
					<div class="tw-flex-auto">
						<!-- eslint-disable-next-line max-len -->
						{{ borrowerName }} has {{ daysLeftLanguage }} to earn the support of {{ lendersNeeded }} lenders through their network. If successful, we'll share this loan with everyone on Kiva.
					</div>
				</section>
			</div>
		</kv-grid>
	</kv-page-container>
</template>

<script>
import { mdiInformationOutline } from '@mdi/js';
import KvMaterialIcon from '~/@kiva/kv-components/vue/KvMaterialIcon';
import KvGrid from '~/@kiva/kv-components/vue/KvGrid';
import KvPageContainer from '~/@kiva/kv-components/vue/KvPageContainer';

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
