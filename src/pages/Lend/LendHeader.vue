<template>
	<div
		class="row lend-header-row"
		:class="{
			'side-arrows-padding': sideArrowsPadding,
			'hard-left-align': hardLeftAlign,
			'side-pinned-filter-padding': sidePinnedFilterPadding,
		}"
	>
		<div class="heading-region column small-12">
			<view-toggle :browse-url="browseUrl" :filter-url="filterUrl" />
			<h1 class="tw-mb-2">
				Make a loan, <br class="hide-for-medium">change a life
			</h1>

			<a @click="showPersonalizationWizard()" class="tw-cursor-pointer"> Help me choose </a>

			<kv-material-icon 
				:icon="mdiChevronRight" 
			/>

			<p class="page-subhead show-for-large tw-mb-4">
				Each Kiva loan helps people build a better future for themselves and their families.
			</p>
		</div>
	</div>
</template>

<script>
import ViewToggle from '@/components/LoansByCategory/ViewToggle';
import { mdiChevronRight } from '@mdi/js';
import KvMaterialIcon from '~/@kiva/kv-components/vue/KvMaterialIcon';

export default {
	components: {
		ViewToggle,
		KvMaterialIcon,
	},
	data() {
		return {
			showedWizard: false,
			mdiChevronRight
		};
	},
	props: {
		browseUrl: {
			type: String,
			default: '',
		},
		filterUrl: {
			type: String,
			default: '',
		},
		sideArrowsPadding: {
			type: Boolean,
			default: false,
		},
		sidePinnedFilterPadding: {
			type: Boolean,
			default: false,
		},
		hardLeftAlign: {
			type: Boolean,
			default: false,
		},
	},
	methods: {
		showPersonalizationWizard() {
			this.showedWizard = true;
		}
	}
};
</script>

<style lang="scss">
@import 'settings';

.lend-header-row {
	.heading-region {
		margin: 2rem 0;
		padding: 0 1rem;

		.view-toggle {
			margin: 0.125rem 0 0 0.375rem;
			float: right;
			display: flex;

			@include breakpoint(large) {
				margin: 0.375rem 0 0.375rem 0.375rem;
			}
		}

		@media (hover: none) {
			margin: 1rem 0;
			padding: 0 1rem;
		}
	}

	&.side-arrows-padding {
		max-width: 63.75rem;

		.heading-region {
			padding: 0 2.5rem;
		}
	}

	&.hard-left-align {
		.page-subhead {
			margin-left: rem-calc(-1);
		}

		h1 {
			margin-left: rem-calc(-2.5);
		}
	}

	&.side-pinned-filter-padding {
		@include breakpoint(1194px) {
			max-width: rem-calc(1174);
		}
	}
}
</style>
