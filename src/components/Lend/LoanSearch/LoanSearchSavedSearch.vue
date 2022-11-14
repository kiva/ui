<template>
	<div>
		<div
			class="tw-flex tw-cursor-pointer tw-align-center"
			@click="openModal"
		>
			<icon-add class="tw-mr-1 tw-inline-block tw-align-baseline" />
			<h4 class="tw-text-h4 tw-mb-1 tw-font-medium tw-text-action tw-align-baseline">
				Save This Search
			</h4>
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
					:state="savedSearchName.length === 0 ? 'disabled' : null"
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
import logFormatter from '@/util/logFormatter';
import filterConfig from '@/util/loanSearch/filterConfig';
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
			default: () => ({})
		},
		allFacets: {
			type: Object,
			default: () => ({})
		},
		userId: {
			type: Number,
			default: null
		}
	},
	mounted() {
		this.$kvTrackEvent(
			'Lending',
			'view-new-filter-saved-search',
			''
		);

		if (this.$route?.query?.saved_search ?? false) {
			this.openModal();
		}
	},
	data() {
		return {
			isLightboxVisible: false,
			savedSearchName: '',
			closedModal: false
		};
	},
	computed: {
		reformattedSearchState() {
			return filterConfig.keys.reduce((prev, key) => {
				return { ...prev, ...filterConfig.config[key].getSavedSearch(this.loanSearchState, this.allFacets) };
			}, {});
		},
		loginUrl() {
			const fullPath = encodeURIComponent(`${this.$route.fullPath}&saved_search=true`);
			return `/ui-login?doneUrl=${fullPath}`;
		},
	},
	methods: {
		openModal() {
			if (this.userId) {
				this.isLightboxVisible = true;
				this.closedModal = false;
				this.$kvTrackEvent(
					'Lending',
					'click-new-filter-saved-search',
					'Add to saved searches'
				);
			} else {
				window.location.href = this.loginUrl;
			}
		},
		closeModal() {
			this.isLightboxVisible = false;
			if (!this.closedModal) {
				this.$kvTrackEvent(
					'Lending',
					'click-new-saved-search-modal-dismiss',
					''
				);
				this.closedModal = true;
			}
		},
		saveSavedSearch() {
			this.isLightboxVisible = false;
			this.$kvTrackEvent(
				'Lending',
				'click-create-saved-search-new-modal',
				'Create saved search',
				this.reformattedSearchState
			);
			// We want to exclude sending any utm params
			// New lend/filter page doesn't allow for custom keywords ATM - revisit this after exp phase
			createSavedSearch(
				this.apollo,
				this.reformattedSearchState,
				this.loanSearchState?.keywordSearch ?? '',
				this.savedSearchName
			).then(() => {
				this.$showTipMsg(`Success! You've added ${this.savedSearchName} to your saved searches.`);
			}).catch(errorResponse => {
				logFormatter(errorResponse, 'error');
				// eslint-disable-next-line max-len
				this.$showTipMsg('There was an error creating your Saved Search, these set of filters may already exist in your Saved Searches. Please try again.', 'error');
			});
		}
	}
};
</script>
