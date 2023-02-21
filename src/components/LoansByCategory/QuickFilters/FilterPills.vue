<template>
	<div class="tw-flex tw-flex-nowrap tw-gap-1 tw-overflow-scroll">
		<div
			class="tw-shrink-0 pill-container"
			:class="{'first' : selectedOptions.includes(option.key) }"
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
				class="tw-bg-primary filter-pill"
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
	border-radius: 16px;
	padding: 10px 20px;
	font-weight: bold;
	box-shadow: 0px 4px 15px 0px #0000000D;
	transition: all .2s ease-in;
}

.filter-pill:hover {
	cursor: pointer;
	background-color: #000;
	color: #FFF;
}

.filter-pill.selected {
	color: #FFF;
	background-color: #000;
}

.pill-container.first {
	order: -1;
}
</style>
