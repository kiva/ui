<template>
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
				'click-new-filter-saved-search',
				'Add to saved searches'
			);
		}
	}
};
</script>
