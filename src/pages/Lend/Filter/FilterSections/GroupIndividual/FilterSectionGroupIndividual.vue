<template>
	<div class="pill-toggle">
		<ais-menu :attribute="'borrowerCount'">
			<div slot-scope="{ items, refine }">
				<group-toggle-wrapper
					:transform-items="determineIfGroup"
					:refine="refine"
					:items="items"
					:filter-menu-open="filterMenuOpen"
				/>
			</div>
		</ais-menu>
	</div>
</template>

<script>
import { AisMenu } from 'vue-instantsearch';
import GroupToggleWrapper from '@/pages/Lend/Filter/FilterSections/GroupIndividual/GroupToggleWrapper';

export default {
	components: {
		AisMenu,
		GroupToggleWrapper,
	},
	props: {
		title: {
			type: String,
			default: 'group',
		},
		open: {
			type: Boolean,
			default: true,
		},
		filterMenuOpen: {
			type: Boolean,
			default: true,
		},
	},
	methods: {
		determineIfGroup(borrowerCount) {
			if (borrowerCount > 1) {
				return 'Group';
			}
			return 'Individual';
		}
	}
};
</script>
