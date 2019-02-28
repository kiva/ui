<template>
	<div class="refinement-list">
		<div>
			<div>{{ 5 }} Filters Applied</div>
			<div v-if="isCollapsible">
				<div v-if="isCollapsed">Show More</div>
				<div v-else>Show Fewer</div>
			</div>
		</div>
		<ais-current-refinements>
			<ul slot-scope="{ items, createURL }">
				<li v-for="item in items" :key="item.attribute">
					{{ item.label }}:
					<ul>
						<li
							v-for="refinement in item.refinements"
							:key="[
								refinement.attribute,
								refinement.type,
								refinement.value,
								refinement.operator
							].join(':')"
						>
							<a
								:href="createURL(refinement)"
								@click.prevent="item.refine(refinement)"
							>
								{{ item.label }} {{ refinement.value }} X
							</a>
						</li>
					</ul>
				</li>
			</ul>
		</ais-current-refinements>

	</div>
</template>

<script>
import { AisCurrentRefinements } from 'vue-instantsearch';
import FilterChip from '@/pages/Lend/Filter/FilterChip';

export default {
	components: {
		AisCurrentRefinements,
		FilterChip,
	},
	data() {
		return {
			collapsibleState: null,
			CollapsibleStates: Object.freeze({
				NotCollapsible: Symbol('NotCollapsible'),
				Open: Symbol('Open'),
				Closed: Symbol('Closed'),
			}),
		};
	},
	computed: {
		isCollapsible() {
			return this.collapsibleState !== this.CollapsibleStates.NotCollapsible;
		},
		isCollapsed() {
			return this.collapsibleState === this.CollapsibleStates.Closed;
		}
	},
	methods: {
		setCollapsibleState() {
			this.collapsibleState = this.CollapsibleStates.NotCollapsible;
		},
		transformRefinementList(items) {
			return items.reverse();
		},
	},
	created() {
		this.setCollapsibleState();
	},
};
</script>

<style lang="scss">
.refinement-list {}
</style>
