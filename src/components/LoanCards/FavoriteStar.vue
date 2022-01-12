<template>
	<!--
	*
	*
	*
	*
	*
		This is a old file, we don't want to use moving forward
		if you're looking to implement loan bookmarking behavior
		please use:
			src/components/BorrowerProfile/LoanBookmark.vue
	*
	*
	*
	*
	*-->
	<span>
		<button
			class="tw-inline-flex tw-p-1 tw-cursor-pointer tw-bg-primary tw-rounded tw-m-0.5"
			@click.prevent.stop="toggleFavorite()"
			:v-kv-track-event="`[
				'Lending',
				'click-Favorite star',
				${isFavorite ? 'Favorite' : 'Remove favorite',
				loanId,
				loanId
			}]`"
		>
			<kv-material-icon
				class="tw-text-action tw-w-3"
				:icon="`${isFavorite ? mdiBookmark : mdiBookmarkOutline}`"
			/>
		</button>
	</span>
</template>

<script>
import { mdiBookmarkOutline, mdiBookmark } from '@mdi/js';
import KvMaterialIcon from '~/@kiva/kv-components/vue/KvMaterialIcon';

export default {
	components: {
		KvMaterialIcon,
	},
	props: {
		isFavorite: {
			type: Boolean,
			default: false
		},
		loanId: {
			type: Number,
			default: null
		},
	},
	data() {
		return {
			mdiBookmarkOutline,
			mdiBookmark,
		};
	},
	methods: {
		toggleFavorite() {
			this.$emit('favorite-toggled');
		}
	}
};
</script>
