<template>
	<div class="borrower-image-wrapper">
		<router-link
			:to="`/lend/${loanId}`"
			v-kv-track-event="['Lending', 'click-Read more', 'Photo', loanId, 'true']"
		>

			<img class="borrower-image"
				:srcset = "retinaImageUrl + ' 2x'"
				:src = "standardImageUrl"
				:alt = "'photo of ' + name"

				@click="$emit('track-loan-card-interaction', {
					interactionType: 'viewBorrowerPage',
					interactionElement: 'photo'
				})"
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
		}
	}
};
</script>

<style lang="scss" scoped>
	@import 'settings';

	.borrower-image-wrapper {
		height: 0;
		overflow: hidden;
		padding-top: 75%;
		background: $kiva-stroke-gray;
		position: relative;
	}

	.borrower-image {
		position: absolute;
		top: 0;
		left: 0;
		width: 100%;
		height: auto;
		object-fit: cover;
	}

	.favorite-star {
		position: absolute;
		bottom: 0;
		right: 0;
	}
</style>
