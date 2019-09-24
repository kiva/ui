<template>
	<div class="pill-toggle">
		<ais-numeric-menu
			attribute="borrowerCount"
			:items="aisMenuConfig"
		>
			<!-- <div slot-scope="{ items, refine }">
				<group-toggle-wrapper
					:refine="refine"
					:items="items"
				/>
			</div> -->
			<ul slot-scope="{ items, refine, createURL }">
				<li :v-for="item in items">
					<a :href="createURL(item.value)"
						:key="item.value"
						@click.prevent="refine(item.value)"
					>
						{{ item.label }}
					</a>
				</li>
			</ul>
		</ais-numeric-menu>
	</div>
</template>

<script>
import { AisNumericMenu } from 'vue-instantsearch';
// import GroupToggleWrapper from '@/pages/Lend/Filter/FilterSections/GroupIndividual/GroupToggleWrapper';

export default {
	components: {
		AisNumericMenu,
		// GroupToggleWrapper,
	},
	data() {
		return {
			aisMenuConfig: [
				{ label: 'All' },
				{ label: 'Individual', end: 1 },
				{ label: 'Group', start: 2, end: 50 }
			]
		};
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
	},
};
</script>
