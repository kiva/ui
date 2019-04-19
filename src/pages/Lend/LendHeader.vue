<template>
	<div
		class="row lend-header-row"
		:class="{
			'extended-side-padding': extendedSidePadding,
			'hard-left-align': hardLeftAlign,
		}"
	>
		<div class="heading-region column small-12">
			<view-toggle :browse-url="browseUrl" :filter-url="filterUrl" />

			<h1>Make a loan, <br class="hide-for-medium">change a life</h1>
			<p class="page-subhead show-for-large">
				Each Kiva loan helps people build a better future for themselves and their families.
			</p>
		</div>
	</div>
</template>

<script>
import ViewToggle from '@/components/LoansByCategory/ViewToggle';

export default {
	components: {
		ViewToggle,
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
		extendedSidePadding: {
			type: Boolean,
			default: false,
		},
		hardLeftAlign: {
			type: Boolean,
			default: false,
		},
	},
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

		h1 {
			margin: 0;
		}

		p {
			margin-top: 0.75rem;
		}

		@media (hover: none) {
			margin: 1rem 0;
			padding: 0 1rem;
		}
	}

	&.extended-side-padding {
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
}
</style>
