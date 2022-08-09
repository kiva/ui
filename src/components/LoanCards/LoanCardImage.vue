<template>
	<div
		class="borrower-image-wrapper"
		:class="{
			'offset-borrower-image': useDefaultStyles,
			'full-width-borrower-image': fullWidthImage,
		}"
	>
		<router-link
			:to="`/lend/${loanId}`"
			v-kv-track-event="['Lending', 'click-Read more', 'Photo', loanId, loanId]"
			class="borrower-image-link"
			:target="linkTarget"
		>
			<img
				class="borrower-image"
				:srcset="retinaImageUrl + ' 2x'"
				:src="standardImageUrl"
				:alt="'photo of ' + name"

				@click="handleImageClick"
				loading="lazy"
			>

			<favorite-star
				class="tw-absolute tw-bottom-0 tw-right-0"
				v-if="!isVisitor"
				:is-favorite="isFavorite"
				:loan-id="loanId"
				@favorite-toggled="$emit('favorite-toggled')"
			/>
		</router-link>
	</div>
</template>

<script>
import FavoriteStar from '@/components/LoanCards/FavoriteStar';

export default {
	name: 'LoanCardImage',
	components: {
		FavoriteStar,
	},
	props: {
		loanId: {
			type: Number,
			default: null,
		},
		retinaImageUrl: {
			type: String,
			default: '',
		},
		standardImageUrl: {
			type: String,
			default: '',
		},
		name: {
			type: String,
			default: '',
		},
		isVisitor: {
			type: Boolean,
			default: false,
		},
		isFavorite: {
			type: Boolean,
			default: false,
		},
		openInNewTab: {
			type: Boolean,
			default: false,
		},
		useDefaultStyles: {
			type: Boolean,
			default: true,
		},
		disableLink: {
			type: Boolean,
			default: false,
		},
		fullWidthImage: {
			type: Boolean,
			default: false,
		},
	},

	computed: {
		linkTarget() {
			return this.openInNewTab ? '_blank' : '_self';
		},
	},

	methods: {
		handleImageClick(event) {
			this.$emit('image-click');

			this.$emit('track-loan-card-interaction', {
				interactionType: 'viewBorrowerPage',
				interactionElement: 'photo'
			});

			if (this.disableLink) {
				event.preventDefault();
			}
		},
	},
};
</script>

<style lang="scss" scoped>
@import 'settings';

.borrower-image-wrapper {
	&.absolute-positioned {
		padding-top: 75%;
		position: relative;

		.borrower-image {
			position: absolute;
		}
	}

	&.offset-borrower-image {
		@extend .absolute-positioned;

		height: 0;
		overflow: hidden;
		background: $kiva-stroke-gray;

		.borrower-image {
			top: 0;
			left: 0;
			width: 100%;
			height: 100%;
		}
	}

	&.full-width-borrower-image {
		@extend .absolute-positioned;

		height: 100%;

		.borrower-image {
			top: 50%;
			transform: translateY(-50%);
			width: 100%;
			height: auto;
		}
	}
}
</style>
