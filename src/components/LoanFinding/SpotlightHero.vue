<template>
	<div class="tw-w-full tw-mb-2">
		<div class="tw-flex tw-items-center tw-gap-1 tw-px-1 lg:tw-px-2">
			<!-- eslint-disable max-len -->
			<img :src="images('megaphone.svg')" alt="mfi_recommendations">
			<h3 class="tw-text-h4 tw-text-primary tw-whitespace-nowrap">
				{{ sectionTitle }}
			</h3>
		</div>
		<div class="tw-mt-2 lg:tw-mt-4 tw-px-2">
			<h2 v-html="headline" class="tw-text-h2 tw-text-primary"></h2>
			<h6 class="tw-text-small tw-text-primary tw-mt-1">
				{{ subheadline }}
			</h6>
		</div>
		<div class="tw-flex tw-flex-col md:tw-flex-row tw-my-3 tw-items-center">
			<div class="md:tw-w-2/3 tw-px-2">
				<div class="tw-relative">
					<!-- eslint-disable max-len -->
					<div class="tw-rounded tw-p-2 tw-bg-white tw-border" style="border-color: #C4C4C4;">
						<img class="tw-rounded tw-w-full" :src="images(partnerImage)" alt="Spotlight Recommendation">

						<div class="tw-flex tw-items-center tw-mt-3 tw-mb-1 tw-gap-2">
							<img :src="images('leaf.svg')" alt="MFI Recommendations">
							<p class="tw-text-small">
								{{ partnerImageFooter }}
							</p>
						</div>
					</div>
				</div>
			</div>
			<div class="lg:tw-w-1/3 md:tw-pl-2 tw-pt-2 md:tw-pt-0">
				<p class="tw-px-2 md:tw-px-0">
					{{ subheadsTitle }}
				</p>

				<ul class="tw-mt-3 tw-px-2">
					<li v-if="getSubhead(0)" class="tw-flex tw-items-center tw-gap-1">
						<!-- eslint-disable max-len -->
						<img class="tw-w-4" :src="images('heart.svg')" alt="Anti-poverty focus">
						<h4 class="tw-uppercase tw-text-h4">
							{{ getSubhead(0) }}
						</h4>
					</li>
					<li v-if="getSubhead(1)" class="tw-flex tw-items-center tw-gap-1 tw-mt-2">
						<!-- eslint-disable max-len -->
						<img class="tw-w-4" :src="images('savings.svg')" alt="Facilitation of savings">
						<h4 class="tw-uppercase tw-text-h4">
							{{ getSubhead(1) }}
						</h4>
					</li>
					<li v-if="getSubhead(2)" class="tw-flex tw-items-center tw-gap-1 tw-mt-2">
						<!-- eslint-disable max-len -->
						<img class="tw-w-4" :src="images('empowerment.svg')" alt="Family & Community Empowerment">
						<h4 class="tw-uppercase tw-text-h4">
							{{ getSubhead(2) }}
						</h4>
					</li>
				</ul>
			</div>
		</div>
		<div>
			<p class="tw-text-primary tw-text-subhead tw-py-0 lg:tw-pt-2 tw-px-2">
				{{ partnerText }}
			</p>
		</div>
	</div>
</template>

<script>
import { mdiMapMarker } from '@mdi/js';
import { metaGlobReader } from '#src/util/importHelpers';

const imageRequire = import.meta.glob('/src/assets/images/mfi_recommendations/*.*', { eager: true, query: '?url' });
const images = metaGlobReader(imageRequire, '/src/assets/images/mfi_recommendations/');

export default {
	name: 'SpotlightHero',
	props: {
		sectionTitle: {
			type: String,
			default: ''
		},
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
		},
	},
	data() {
		return {
			images,
			mdiMapMarker,
		};
	},
	methods: {
		getSubhead(index) {
			return this.subheads[index] ? this.subheads[index] : '';
		}
	}
};
</script>
