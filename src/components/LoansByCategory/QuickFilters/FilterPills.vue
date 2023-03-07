<template>
	<div class="tw-flex tw-gap-1" :class="{ 'tw-opacity-low': !filtersLoaded }">
		<div
			class="tw-shrink-0 pill-container tw-rounded"
			v-for="(option) in options"
			:key="option.key"
		>
			<input
				:id="option.key"
				type="checkbox"
				class="tw-hidden"
				:checked="selectedOptions.includes(option.key)"
				:disabled="option.key === 'all' && selectedOptions.includes('all')"
				@change="updateSelected($event, option.key)"
			>
			<label
				:for="option.key"
				class="tw-bg-primary tw-rounded tw-transition tw-font-medium filter-pill"
				:class="{ 'selected': selectedOptions.includes(option.key) }"
			>{{ option.title }}
			</label>
		</div>
	</div>
</template>

<script>
export default {
	name: 'FilterPills',
	props: {
		options: {
			type: Array,
			required: true,
		},
		selectedValues: {
			type: Array,
			default: () => ['all']
		},
		filtersLoaded: {
			type: Boolean,
			default: false
		},
	},
	data() {
		return {
			selectedOptions: this.selectedValues,
		};
	},
	methods: {
		updateSelected(event, option) {
			const selected = event.target.checked;

			if (option === 'all') {
				this.selectedOptions = ['all'];
			} else if (selected) { // Add option
				if (!this.selectedOptions.includes(option)) {
					this.selectedOptions = this.selectedOptions.filter(val => val !== 'all');
					this.selectedOptions.push(option);
				}
			} else { // Remove option
				const optionCount = this.selectedOptions.length;
				if (optionCount <= 1) {
					this.selectedOptions = ['all'];
				} else {
					this.selectedOptions = this.selectedOptions.filter(val => val !== option);
				}
			}
			this.$emit('update-values', { values: [...this.selectedOptions], selected, option });
		}
	}
};
</script>

<style lang="postcss" scoped>
.filter-pill {
	display: inherit;
	padding: 10px 20px;
	box-shadow: 0 calc(4px) calc(15px) 0 rgba(0, 0, 0, 0.05);
}

.filter-pill:hover {
	@apply tw-bg-black tw-text-white tw-cursor-pointer;
}

.filter-pill.selected {
	@apply tw-bg-black tw-text-white;
}
</style>
