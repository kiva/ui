<template>
	<div v-if="tileSize === 'large'" class="tw-mb-6">
		<kv-responsive-image class="category-image"
			:images="retinaImageExists ?
				[['small', image],
					['small retina', retinaImage]]
				:
				[['small', image]]"
			loading="lazy"
			:alt="imageAlt"
		/>
		<large-tile-info
			:category-name="categoryName"
			:category-description="categoryDescription"
			:number-loans="numberLoans"
		/>
	</div>
	<div v-else-if="tileSize === 'medium'" class="tw-mb-6">
		<kv-responsive-image class="category-image"
			:images="retinaImageExists ?
				[['small', image],
					['small retina', retinaImage]]
				:
				[['small', image]]"
			loading="lazy"
			:alt="imageAlt"
		/>
		<div class="tw-hidden md:tw-block">
			<h3 class="tw-mt-2 tw-mb-2">
				Lend to {{ categoryName }}
			</h3>
			<div>
				<span class="tw-line-clamp-3">
					{{ categoryDescription }}
				</span>
			</div>
			<h4 class="tw-mt-1 tw-mb-2 ">
				{{ numberLoans }} loans
			</h4>
		</div>
		<div class="md:tw-hidden">
			<large-tile-info
				:category-name="categoryName"
				:category-description="categoryDescription"
				:number-loans="numberLoans"
			/>
		</div>
	</div>
	<div v-else-if="tileSize === 'small'" class=" tw-mb-6">
		<div class="tw-flex">
			<div class="tw-mr-2 tw-flex-none">
				<kv-responsive-image class="category-image-small"
					:images="retinaImageExists ?
						[['small', image],
							['small retina', retinaImage]]
						:
						[['small', image]]"
					loading="lazy"
					:alt="imageAlt"
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
	</div>
</template>

<script>

import KvResponsiveImage from '@/components/Kv/KvResponsiveImage';
import LargeTileInfo from '@/components/Categories/LargeTileInfo';

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
		imageAlt: {
			type: String,
			default: ''
		}
	},
	components: {
		KvResponsiveImage,
		LargeTileInfo
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
	}
};
</script>

<style lang="scss" scoped>

.category-image {
	::v-deep {
		img {
			border-radius: 15px;
		}
	}
}

.category-image-small {
	::v-deep {
		img {
			border-radius: 15px;
			width: 152px;
			height: 152px;
			object-fit: cover;
		}
	}
}

</style>
