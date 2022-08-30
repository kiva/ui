<template>
	<div>
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
		<kv-lightbox
			title="Save this search"
			:visible="isLightboxVisible"
			@lightbox-closed="closeModal"
		>
			<template #header>
				<icon-add />
				<h2 class="tw-text-h2">
					Save this search
				</h2>
				<h3 class="tw-text-base">
					You can find all your saved searches under Lend in the top menu bar.
				</h3>
			</template>
			<div>
				<label
					for="savedSearchName"
					class="tw-text-h4 tw-block tw-pb-1 tw-text-secondary"
				>
					Saved Search Name
				</label>
				<kv-text-input
					class="tw-w-full tw-mb-2"
					id="savedSearchName"
					placeholder="i.e. Women Owned Business"
					v-model="savedSearchName"
				/>
				<kv-button
					@click.native="saveSavedSearch"
				>
					Create Saved Search
				</kv-button>
			</div>
		</kv-lightbox>
	</div>
</template>

<script>
import IconAdd from '@/assets/icons/inline/add.svg';
import { createSavedSearch } from '@/util/loanSearch/searchStateUtils';
import KvButton from '~/@kiva/kv-components/vue/KvButton';
import KvLightbox from '~/@kiva/kv-components/vue/KvLightbox';
import KvTextInput from '~/@kiva/kv-components/vue/KvTextInput';

export default {
	name: 'LoanSearchSavedSearch',
	components: {
		KvButton,
		KvLightbox,
		KvTextInput,
		IconAdd
	},
	inject: ['apollo'],
	props: {
		loanSearchState: {
			type: Object,
			default: () => {}
		},
		themeNames: {
			type: Object,
			default: () => {}
		}
	},
	mounted() {
		this.$kvTrackEvent(
			'Lending',
			'view-new-filter-saved-search',
			''
		);
	},
	data() {
		return {
			isLightboxVisible: false,
			savedSearchName: '',
		};
	},
	computed: {
		reformattedSearchState() {
			return {
				country: this.loanSearchState?.countryIsoCode,
				gender: this.loanSearchState?.gender,
				sector: this.loanSearchState?.sectorId,
				theme: this.loanSearchState?.themeId.map(themeId => this.themeNames[themeId])
			};
		}
	},
	methods: {
		openModal() {
			this.isLightboxVisible = true;
			this.$kvTrackEvent(
				'Lending',
				'click-new-filter-saved-search',
				'Add to saved searches'
			);
		},
		closeModal() {
			this.isLightboxVisible = false;
		},
		saveSavedSearch() {
			this.isLightboxVisible = false;
			createSavedSearch(this.apollo, this.reformattedSearchState, this.savedSearchName);
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
