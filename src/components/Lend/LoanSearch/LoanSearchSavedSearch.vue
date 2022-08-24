<template>
	<!-- eslint-disable-next-line max-len -->
	<div class="savedSearchContainer tw-bg-brand-100 tw-border tw-border-action tw-rounded tw-p-2 tw-flex tw-gap-1 tw-mb-2">
		<div class="tw-grow">
			<div class="tw-flex">
				<icon-add class="tw-mr-1" />
				<h4 class="tw-text-h4 tw-mb-1 tw-font-medium tw-text-action">
					Save This Search
				</h4>
			</div>
			<!-- eslint-disable-next-line max-len -->
			Found the perfect filter settings? Add them to your 'Saved Searches' to easily return to the list of borrowers that meet your lending criteria.
		</div>
		<div style="min-width: 250px;" class="savedSearchButtonContainer tw-self-center">
			<kv-button
				variant="secondary"
				class="savedSearchButton"
				@click="openModal"
			>
				Add to Saved Searches
			</kv-button>
		</div>
	</div>
</template>

<script>
import IconAdd from '@/assets/icons/inline/add.svg';
import KvButton from '~/@kiva/kv-components/vue/KvButton';

export default {
	name: 'LoanSearchSavedSearch',
	components: {
		KvButton,
		IconAdd
	},
	mounted() {
		this.$kvTrackEvent(
			'Lending',
			'view-new-filter-saved-search',
			''
		);
	},
	methods: {
		openModal() {
			this.$kvTrackEvent(
				'Lending',
				'click-new-filter-saved-search',
				'Add to saved searches'
			);
		}
	}
};
</script>

<style lang="scss" scoped>
@import "settings";

@media screen and (max-width: 733px) {
	.savedSearchContainer {
		flex-direction: column;
	}

	.savedSearchButton {
		&Container {
			width: 100%;
		}

		width: 100%;
	}
}
</style>
