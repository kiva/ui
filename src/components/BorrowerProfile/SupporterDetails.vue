<template>
	<div>
		<!-- eslint-disable-next-line max-len -->
		<div class="tw-block md:tw-inline-block md:tw-flex-none md:tw-mr-2 tw-w-[135px] md:tw-w-[150px] lg:tw-w-[84px] xl:tw-w-[96px]">
			<borrower-image
				class="
					tw-w-full
					tw-bg-black
					tw-rounded
				"
				:alt="name"
				:aspect-ratio="borrowerImageAspect"
				:default-image="{ width: isMobile ? 160 : 96 }"
				:hash="hash"
				:images="[
					// small
					{ width: 180, viewSize: 414 },
					// large
					{ width: 84, viewSize: 734 },
					// xlarge
					{ width: 96, viewSize: 1024 }
				]"
			/>
		</div>
		<div class="tw-inline-block">
			<span
				v-if="name"
				:class="`${ displayType === 'teams' ? 'tw-text-h4' : ''}`"
			>
				{{ name }}
			</span><br>
			<span
				v-if="lenderPage && whereabouts"
				class="tw-text-h4"
			>
				{{ whereabouts }}
			</span>
		</div>
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
		lenderPage: {
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
		}
	},
	data() {
		return {
			isMobile: false,
		};
	},
	computed: {
		borrowerImageAspect() {
			if (!this.isMobile) {
				return 1;
			}
			return 3 / 4;
		},
	},
	methods: {
		determineIfMobile() {
			this.isMobile = document.documentElement.clientWidth < 735;
		}
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

		this.determineIfMobile();
	},
};
</script>
