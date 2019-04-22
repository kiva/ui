<template>
	<div class="pill-toggle">
		<ais-refinement-list :attribute="'gender'">
			<div slot-scope="{ items, refine }">
				<pill-toggle-wrapper
					:refine="refine"
					:items="items"
					:filter-menu-open="filterMenuOpen"
				/>
			</div>
		</ais-refinement-list>
	</div>
</template>

<script>
import { AisRefinementList } from 'vue-instantsearch';
import PillToggleWrapper from '@/pages/Lend/Filter/FilterSections/Gender/PillToggleWrapper';

export default {
	components: {
		AisRefinementList,
		PillToggleWrapper,
	},
	props: {
		title: {
			type: String,
			default: 'Gender',
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
};
</script>
