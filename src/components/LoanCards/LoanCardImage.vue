<template>
	<div class="borrower-image-wrapper" :class="{'offset-borrower-image': useDefaultStyles}">
		<router-link
			:to="`/lend/${loanId}`"
			v-kv-track-event="['Lending', 'click-Read more', 'Photo', loanId, 'true']"
			class="borrower-image-link"
			:target="linkTarget"
		>
			<img class="borrower-image"
				:srcset="formattedImageRetinaUrl + ' 2x'"
				:src="formattedImageStandardUrl"
				:alt="'photo of ' + name"

				@click="handleImageClick"
			>

			<favorite-star class="favorite-star"
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
	components: {
		FavoriteStar,
	},
	props: {
		loanId: {
			type: Number,
			default: null
		},
		retinaImageUrl: {
			type: String,
			default: ''
		},
		standardImageUrl: {
			type: String,
			default: ''
		},
		name: {
			type: String,
			default: ''
		},
		isVisitor: {
			type: Boolean,
			default: false
		},
		isFavorite: {
			type: Boolean,
			default: false
		},
		openInNewTab: {
			type: Boolean,
			default: false
		},
		imageEnhancementExperimentVersion: {
			type: String,
			default: ''
		},
		loanImageHash: {
			type: String,
			default: ''
		},
		useDefaultStyles: {
			type: Boolean,
			default: true
		},
		disableLink: {
			type: Boolean,
			default: false,
		},
	},

	computed: {
		formattedImageRetinaUrl() {
			return this.formatImageUrl(this.retinaImageUrl, 'w_960,h_720,c_fill,g_faces');
		},

		formattedImageStandardUrl() {
			return this.formatImageUrl(this.standardImageUrl, 'w_480,h_360,c_fill,g_faces');
		},

		linkTarget() {
			return this.openInNewTab ? '_blank' : '_self';
		},
	},

	methods: {
		formatImageUrl(imageUrl, transformations) {
			return (this.imageEnhancementExperimentVersion === 'variant-b' ? this.formatCloudinaryUrl(transformations) : imageUrl);  // eslint-disable-line
		},
		formatCloudinaryUrl(transformations) {
			return `https://res.cloudinary.com/kiva/${transformations}/e_viesus_correct/e_sharpen:150/a_ignore,fl_progressive,q_auto:best/remote/${this.loanImageHash}.jpg`; // eslint-disable-line
		},
		handleImageClick(event) {
			if (this.disableLink) {
				event.preventDefault();
				event.stopPropagation();
				return;
			}
			this.$emit('track-loan-card-interaction', {
				interactionType: 'viewBorrowerPage',
				interactionElement: 'photo'
			});
		},
	},
};
</script>

<style lang="scss" scoped>
	@import 'settings';

	.offset-borrower-image {
		height: 0;
		overflow: hidden;
		padding-top: 75%;
		background: $kiva-stroke-gray;
		position: relative;

		.borrower-image {
			position: absolute;
			top: 0;
			left: 0;
			width: 100%;
			height: 100%;
		}

		.favorite-star {
			position: absolute;
			bottom: 0;
			right: 0;
		}
	}
</style>
