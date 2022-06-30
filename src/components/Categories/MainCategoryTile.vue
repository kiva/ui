<template>
	<div v-if="tileSize === 'large' || tileSize === 'medium'" class="tw-mb-6">
		<router-link
			class="tw-no-underline
			active:tw-no-underline visited:tw-no-underline
			hover:tw-no-underline focus:tw-no-underline
			tw-text-black
			active:tw-text-black visited:tw-text-black
			hover:tw-text-black focus:tw-text-black"
			:to="`/lend-by-category/${cleanURL}`"
			v-kv-track-event="['Lending', 'click-Category', categoryName]"
		>
			<kv-responsive-image class="category-image"
				:images="chooseImage(tileSize)"
				loading="lazy"
				:alt="altText"
			/>
			<div>
				<div class="tw-text-center tw-flex tw-justify-between">
					<h3 class="tw-mt-2 tw-mb-2">
						Lend to {{ categoryName }}
					</h3>
					<h4
						class="tw-mt-2 tw-mb-2"
						:class="tileSize === 'medium' ? 'md:tw-hidden' : ''"
					>
						{{ numberLoans }} loans
					</h4>
				</div>
				<div>
					<p class="tw-line-clamp-3">
						{{ categoryDescription }}
					</p>
				</div>
			</div>
			<h4 v-if="tileSize === 'medium'"
				class="tw-mt-1 tw-mb-2 tw-hidden md:tw-block"
			>
				{{ numberLoans }} loans
			</h4>
		</router-link>
	</div>
	<div v-else-if="tileSize === 'small'" class=" tw-mb-6">
		<router-link
			class="tw-no-underline
			active:tw-no-underline visited:tw-no-underline
			hover:tw-no-underline focus:tw-no-underline
			tw-text-black
			active:tw-text-black visited:tw-text-black
			hover:tw-text-black focus:tw-text-black"
			:to="`/lend-by-category/${cleanURL}`"
			v-kv-track-event="['Lending', 'click-Category', categoryName]"
		>
			<div class="tw-flex">
				<div class="tw-mr-2 tw-flex-none">
					<kv-responsive-image class="category-image-small"
						:images="chooseImage(tileSize)"
						loading="lazy"
						:alt="altText"
					/>
				</div>
				<div class="tw-grow">
					<h3 class=" tw-mb-2">
						Lend to {{ categoryName }}
					</h3>
					<div>
						<span class="tw-line-clamp-2">
							{{ categoryDescription }}
						</span>
					</div>
					<h4 class="tw-mt-1 tw-mb-1 ">
						{{ numberLoans }} loans
					</h4>
				</div>
			</div>
		</router-link>
	</div>
</template>

<script>

import KvResponsiveImage from '@/components/Kv/KvResponsiveImage';

export default {
	name: 'MainCategoryTile',
	props: {
		tileSize: {
			type: String,
			default: 'small'
		},
		categoryName: {
			type: String,
			default: ''
		},
		categoryDescription: {
			type: String,
			default: ''
		},
		numberLoans: {
			type: Number,
			default: 0
		},
		image: {
			type: String,
			default: ''
		},
		retinaImage: {
			type: String,
			default: ''
		},
		categoryUrl: {
			type: String,
			default: ''
		}
	},
	components: {
		KvResponsiveImage
	},
	data() {
		return {
		};
	},
	computed: {
		retinaImageExists() {
			if (this.retinaImage === '') {
				return false;
			}
			return true;
		},
		altText() {
			return `Kiva loans to ${this.categoryName}`;
		},
		cleanURL() {
			return this.categoryUrl.substring(this.categoryUrl.lastIndexOf('/') + 1);
		}
	},
	methods: {
		chooseImage(tileSize) {
			if (tileSize === 'large') {
				return this.retinaImageExists
					? [['small', this.retinaImage], ['small retina', this.retinaImage]]
					: [['small', this.image]];
			}
			if (tileSize === 'medium') {
				return this.retinaImageExists
					? [['small', this.retinaImage], ['small retina', this.retinaImage],
						['large', this.image], ['large retina', this.retinaImage]]
					: [['small', this.image]];
			}
			// Default case or tileSize === 'small'
			return this.retinaImageExists
				? [['small', this.image], ['small retina', this.retinaImage]]
				: [['small', this.image]];
		},
	},
};
</script>

<style lang="postcss" scoped>

.category-image >>> img {
	@apply tw-rounded;
}

.category-image-small >>> img {
	@apply tw-rounded;
	@apply tw-object-cover;
	@apply tw-w-[152px];
	@apply tw-h-[152px];
}

</style>
