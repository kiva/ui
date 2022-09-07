<template>
	<div>
		<!-- eslint-disable-next-line max-len -->
		<div class="tw-bg-brand-100 tw-border tw-border-action tw-rounded tw-p-2 tw-flex tw-flex-col lg:tw-flex-row tw-gap-1 tw-mb-2">
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
			<div style="min-width: 250px;" class="tw-self-center tw-w-full">
				<kv-button
					variant="secondary"
					class="tw-w-full"
					@click="openModal"
				>
					Add to Saved Searches
				</kv-button>
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
	</div>
</template>

<script>
import IconAdd from '@/assets/icons/inline/add.svg';
import { createSavedSearch } from '@/util/loanSearch/searchStateUtils';
import logFormatter from '@/util/logFormatter';
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
			type: Array,
			default: () => {}
		},
		showSuccessMessage: {
			type: Function,
			default: () => {}
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
			this.$kvTrackEvent(
				'Lending',
				'click-new-saved-search-modal-dismiss',
				''
			);
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
			// const queryString = window.location.search.replace(/(&|\?)utm_[a-zA-Z0-9]*=[a-zA-Z0-9]*/, '');
			createSavedSearch(
				this.apollo, this.reformattedSearchState, '', this.savedSearchName
			// eslint-disable-next-line no-unused-vars
			).then(({ data }) => {
				this.showSuccessMessage(this.savedSearchName);
			}).catch(errorResponse => {
				logFormatter(errorResponse, 'error');
				// eslint-disable-next-line max-len
				this.$showTipMsg('There was an error creating your Saved Search, these set of filters may already exist in your Saved Searches. Please try again.', 'error');
			});
		}
	}
};
</script>
