<template>
	<div class="tw-flex tw-flex-col md:tw-flex-row md:tw-items-center">
		<router-link
			class="tw-contents tw-no-underline"
			:to="`${displayType === 'lenders' ? '/lender/' + this.publicId : '/team/' + this.publicId}`"
			:v-kv-track-event="configureTracking"
		>
			<!-- eslint-disable-next-line max-len -->
			<div class="tw-block md:tw-inline-block md:tw-flex-none md:tw-mr-2 tw-w-[135px] md:tw-w-[150px] lg:tw-w-[84px] xl:tw-w-[96px]">
				<borrower-image
					v-if="!this.anonymousSupporterCard"
					class="tw-w-full tw-rounded"
					:class="`${this.anonymousSupporterCard ? 'tw-bg-brand' : 'tw-bg-black' }`"
					:alt="name"
					:aspect-ratio="borrowerImageAspect"
					:default-image="{ width: isMobile ? 160 : 96 }"
					:hash="hash"
					:images="[
						// small & medium
						{ width: 180, viewSize: 414 },
						// large
						{ width: 84, viewSize: 734 },
						// xlarge
						{ width: 96, viewSize: 1024 }
					]"
				/>
				<div
					v-else
					class="
						tw-w-full
						tw-rounded
						tw-bg-brand
						tw-flex
						tw-items-center
						tw-justify-center
						tw-mb-1
						tw-h-[101px] md:tw-h-[150px] lg:tw-h-[84px] xl:tw-h-[96px]"
				>
					<!-- Kiva K logo -->
					<!-- eslint-disable max-len -->
					<svg class="" width="25" height="37" viewBox="0 0 25 37" fill="none" xmlns="http://www.w3.org/2000/svg">
						<path d="M8.22861 0.875H0.857178V36.3125H8.22861V0.875Z" fill="white" />
						<path d="M10.1143 23.2751C21.9428 23.2751 24.6857 13.2126 24.6857 11.4626H23.6571C11.8286 11.4626 9.08569 21.5251 9.08569 23.2751H10.1143Z" fill="white" />
						<path d="M9.08569 24.2376C9.08569 26.0751 11.1428 36.3126 23.8285 36.3126H24.8571C24.8571 34.4751 22.8 24.2376 10.1143 24.2376H9.08569Z" fill="white" />
					</svg>
					<!-- eslint-enable max-len -->
				</div>
			</div>
			<div class="tw-inline-block">
				<span
					v-if="name"
					class="tw-no-underline"
					:class="`${ displayType === 'teams' ? 'tw-text-h4' : ''}`"
				>
					{{ name }}
				</span><br>
				<span
					v-if="whereabouts"
					class="tw-text-h4 tw-no-underline"
				>
					{{ whereabouts }}
				</span>
			</div>
		</router-link>
	</div>
</template>

<script>
import _throttle from 'lodash/throttle';
import BorrowerImage from './BorrowerImage';

export default {
	components: {
		BorrowerImage,
	},
	props: {
		name: {
			type: String,
			default: ''
		},
		hash: {
			type: String,
			default: ''
		},
		publicId: {
			type: String,
			default: '',
		},
		whereabouts: {
			type: String,
			default: ''
		},
		displayType: {
			type: String,
			default: ''
		},
		hasAnonymousSupporters: {
			type: Boolean,
			default: false,
		}
	},
	data() {
		return {
			isMobile: false,
			anonymousSupporterCard: false,
		};
	},
	computed: {
		borrowerImageAspect() {
			if (!this.isMobile) {
				return 1;
			}
			return 3 / 4;
		},
		configureTracking() {
			if (this.displayType === 'lenders') {
				return ['Borrower profile', 'click-lender-image', this.name];
			}
			return ['Borrower profile', 'click-team-image', this.name];
		}
	},
	methods: {
		determineIfMobile() {
			this.isMobile = document.documentElement.clientWidth < 735;
		},
	},
	beforeDestroy() {
		window.removeEventListener('resize', _throttle(() => {
			this.determineIfMobile();
		}, 200));
	},
	mounted() {
		window.addEventListener('resize', _throttle(() => {
			this.determineIfMobile();
		}, 200));

		if (this.hasAnonymousSupporters) {
			this.anonymousSupporterCard = true;
		}
		this.determineIfMobile();
	},
};
</script>
