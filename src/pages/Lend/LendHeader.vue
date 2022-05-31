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
			<p class="page-subhead show-for-large tw-mb-4">
				Each Kiva loan helps people build a better future for themselves and their families.
			</p>
		</div>
	</div>
</template>

<script>
import ViewToggle from '@/components/LoansByCategory/ViewToggle';
import getCacheKey from '@/util/getCacheKey';

export default {
	name: 'LendHeader',
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
	serverCacheKey: props => {
		const {
			browseUrl,
			filterUrl,
			sidePinnedFilterPadding,
			hardLeftAlign,
			sideArrowsPadding
		} = props;
		const getValue = value => {
			return value ? `-${value}` : '';
		};
		return getCacheKey(`${filterUrl}${getValue(browseUrl)}${getValue(sidePinnedFilterPadding)}${getValue(hardLeftAlign)}${getValue(sideArrowsPadding)}`); // eslint-disable-line max-len
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
