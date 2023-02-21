<template>
	<div class="tw-flex tw-flex-nowrap tw-gap-1 tw-overflow-scroll">
		<div
			class="tw-shrink-0 pill-container tw-my-2"
			:class="{'first' : selectedOptions.includes(option.key) }"
			v-for="(option) in options"
			:key="option.key"
		>
			<input
				:id="option.key"
				type="checkbox"
				class="tw-hidden"
				:disabled="(option.key === '' && selectedOptions.includes(option.key))
					? true : disabled"
				:checked="selectedOptions.includes(option.key)"
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
			default: () => []
		},
		disabled: {
			type: Boolean,
			default: false,
		}
	},
	data() {
		return {
			selectedOptions: this.selectedValues,
		};
	},
	methods: {
		updateSelected(event, option) {
			const selected = event.target.checked;
			if (option !== '') {
				if (selected) { // Add gender
					if (!this.selectedOptions.includes(option)) {
						this.selectedOptions = this.selectedOptions.filter(val => val !== '');
						this.selectedOptions.push(option);
					}
				} else { // Remove gender
					const optionCount = this.selectedOptions.length;
					if (optionCount <= 1) {
						this.selectedOptions = [''];
					} else {
						this.selectedOptions = this.selectedOptions.filter(val => val !== option);
					}
				}
			} else if (selected) {
				this.selectedOptions = [''];
			}
			this.$emit('update-values', { values: [...this.selectedOptions], selected, option });
		}
	}
};
</script>

<style lang="postcss" scoped>
.filter-pill {
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

.pill-container {
	transition: order 3s ease-in;
}

.pill-container.first {
	order: -1;
}
</style>
