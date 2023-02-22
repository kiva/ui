<template>
	<div class="tw-w-full tw-mb-2">
		<div class="tw-flex tw-items-center tw-gap-1 tw-px-1 lg:tw-px-2">
			<!-- eslint-disable max-len -->
			<img src="@/assets/images/mfi_recommendations/megaphone.svg" alt="mfi_recommendations">
			<h3 class="tw-text-h4 tw-text-primary tw-whitespace-nowrap">
				IMPACT AT KIVA
			</h3>
		</div>
		<div class="tw-mt-2 lg:tw-mt-4 tw-px-2">
			<h2 v-html="headline" class="tw-text-h2 tw-text-primary"></h2>
			<h6 class="tw-text-small tw-text-primary tw-mt-1">
				{{ subheadline }}
			</h6>
		</div>
		<div class="tw-flex tw-flex-col md:tw-flex-row tw-my-3 tw-items-center">
			<div class="md:tw-w-2/3 md:tw-px-2">
				<div class="tw-relative">
					<!-- eslint-disable max-len -->
					<div class="tw-rounded tw-p-2 tw-bg-white tw-border" style="border-color: #C4C4C4;">
						<img class="tw-rounded tw-w-full" :src="imageRequire(`./${partnerImage}`)">

						<div class="tw-flex tw-items-center tw-mt-3 tw-mb-2 tw-gap-2">
							<img src="@/assets/images/mfi_recommendations/leaf.svg" alt="mfi_recommendations">
							<p class="tw-text-small">
								{{ partnerImageFooter }}
							</p>
						</div>
					</div>
				</div>
			</div>
			<div class="lg:tw-w-1/3 lg:tw-pl-2 tw-pt-2 md:tw-pt-0">
				<p class="tw-px-3 lg:tw-px-0">
					{{ subheadsTitle }}
				</p>

				<ul class="tw-mt-3">
					<li class="tw-flex tw-items-center tw-gap-1">
						<!-- eslint-disable max-len -->
						<img class="tw-w-4" src="@/assets/images/mfi_recommendations/heart.svg" alt="Anti-poverty focus">
						<h4 class="tw-uppercase tw-text-h4">
							{{ getSubhead(0) }}
						</h4>
					</li>
					<li class="tw-flex tw-items-center tw-gap-1 tw-mt-2">
						<!-- eslint-disable max-len -->
						<img class="tw-w-4" src="@/assets/images/mfi_recommendations/savings.svg" alt="Facilitation of savings">
						<h4 class="tw-uppercase tw-text-h4">
							{{ getSubhead(1) }}
						</h4>
					</li>
					<li class="tw-flex tw-items-center tw-gap-1 tw-mt-2">
						<!-- eslint-disable max-len -->
						<img class="tw-w-4" src="@/assets/images/mfi_recommendations/empowerment.svg" alt="Family & Community Empowerment">
						<h4 class="tw-uppercase tw-text-h4">
							{{ getSubhead(2) }}
						</h4>
					</li>
				</ul>
			</div>
		</div>
		<div>
			<p class="tw-text-primary tw-text-subhead tw-py-0 lg:tw-pt-2 tw-px-2 lg:tw-px-0">
				{{ partnerText }}
			</p>
		</div>
	</div>
</template>

<script>
import { mdiMapMarker } from '@mdi/js';

const imageRequire = require.context('@/assets/images/mfi_recommendations/', true);

export default {
	name: 'MFIHero',
	props: {
		headline: {
			type: String,
			default: ''
		},
		subheadline: {
			type: String,
			default: ''
		},
		partnerImage: {
			type: String,
			default: ''
		},
		partnerImageFooter: {
			type: String,
			default: ''
		},
		partnerText: {
			type: String,
			default: ''
		},
		subheadsTitle: {
			type: String,
			default: ''
		},
		subheads: {
			type: Array,
			default: () => []
		}
	},
	data() {
		return {
			mdiMapMarker,
			imageRequire
		};
	},
	methods: {
		getSubhead(index) {
			return this.subheads[index] ? this.subheads[index] : '';
		}
	}
};
</script>
