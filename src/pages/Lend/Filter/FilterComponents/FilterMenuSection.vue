<template>
	<div class="filter-menu-section" :class="{open}" @click="toggleMenu">
		<div class="filter-summary">
			<div class="filter-summary-title-row">
				<div class="filter-summary-title">
					{{ title }}
				</div>
				<kv-icon class="filter-summary-title-chevron" name="small-chevron-mobile" />
			</div>
			<div class="filter-summary-applied-filters">
				{{ appliedFilters }}
			</div>
		</div>
		<div class="filter-items-container" @click.stop>
			<slot></slot>
		</div>
	</div>
</template>

<script>
import KvIcon from '@/components/Kv/KvIcon';

export default {
	components: { KvIcon },
	props: {
		title: {
			type: String,
			required: true,
		},
		appliedFilters: {
			type: String,
			default: 'All',
		},
		initialAccordianStateOpen: {
			type: Boolean,
			default: false
		}
	},
	data() {
		return {
			open: this.initialAccordianStateOpen,
		};
	},
	methods: {
		toggleMenu() {
			this.open = !this.open;

			const eventAction = `${this.open ? 'open' : 'close'}-filter-section`;
			this.$kvTrackEvent(
				'Lending',
				eventAction,
				this.title.toLowerCase().replace(/ /g, '-')
			);
		},
	},
};
</script>

<style lang="scss">
@import 'settings';

.filter-menu-section {
	$filter-transition-timing: 0.15s ease-in;

	font-size: 0.875rem;
	font-weight: 300;
	cursor: pointer;

	.filter-summary {
		.filter-summary-title-row {
			display: flex;
			justify-content: space-between;
			align-items: center;
			stroke-width: rem-calc(2);
			transition: margin $filter-transition-timing;

			.filter-summary-title {
				font-size: 1rem;
				font-weight: 500;
				margin: 0;
			}

			.filter-summary-title-chevron {
				height: rem-calc(6);
				width: rem-calc(10);
				transition: transform $filter-transition-timing;
			}
		}

		.filter-summary-applied-filters {
			/* Hide this altogether until implemented fully */
			display: none;
		}
	}

	.filter-items-container {
		display: none;

		ul {
			list-style-type: none;
			margin: 0;
		}
	}

	&.open {
		.filter-summary {
			.filter-summary-title-row {
				margin: 0.25rem 0 0.75rem 0;

				.filter-summary-title-chevron {
					transform: rotate(180deg);
				}
			}

			.filter-summary-applied-filters {
				/* Hide when menu is open as per design */
				display: none;
			}
		}

		.filter-items-container {
			display: block;
		}
	}
}
</style>
