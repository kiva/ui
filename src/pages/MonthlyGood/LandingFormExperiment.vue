<template>
	<form @submit.prevent.stop="submit" novalidate>
		<multi-amount-selector
			id="amount-selector"
			:options="amountOptions"
			:selected="amountSelected"
			@pill-toggled="pillToggled"
			:min-custom-amount="minCustomAmount"
			:max-custom-amount="maxCustomAmount"
			@custom-amount-updated="customAmountUpdated"
			:split-pills="true"
		/>
		<div class="select-category-wrapper">
			<label
				class="select-category-label"
				for="select-category"
			>
				Loan monthly to
			</label>
			<kv-select
				class="select-category"
				id="select-category"
				:value="selectedGroup"
				@change="updateSelected"
			>
				<option
					v-for="(option, index) in lendingCategories"
					:value="option.value"
					:key="index"
				>
					{{ option.label }}
				</option>
			</kv-select>
		</div>

		<kv-button class="smaller" type="submit" :disabled="$v.$invalid" v-kv-track-event="[
			'MonthlyGood',
			`click-start-form-${componentKey}`,
			buttonText
		]"
		>
			{{ buttonText }}
		</kv-button>
	</form>
</template>

<script>
import { validationMixin } from 'vuelidate';
import { required, minValue, maxValue } from 'vuelidate/lib/validators';
import KvButton from '@/components/Kv/KvButton';
import KvSelect from '@/components/Kv/KvSelect';
import loanGroupCategoriesMixin from '@/plugins/loan-group-categories';
import MultiAmountSelector from '@/components/Forms/MultiAmountSelector';

export default {
	mixins: [
		validationMixin,
		loanGroupCategoriesMixin
	],
	components: {
		KvButton,
		KvSelect,
		MultiAmountSelector
	},
	validations: {
		amount: {
			required,
			minValue: minValue(5),
			maxValue: maxValue(10000)
		},
	},
	data() {
		return {
			amountOptions: [
				{
					title: '$5',
					key: '5',
				},
				{
					title: '$10',
					key: '10',
				},
				{
					title: '$25',
					key: '25',
				},
				{
					title: '$50',
					key: '50',
				},
				{
					title: 'Other',
					key: 'custom'
				}
			],
			amountSelected: '25',
			customAmount: 5,
		};
	},
	props: {
		amount: {
			type: Number,
			default: 25
		},
		selectedGroup: {
			type: String,
			default: 'default'
		},
		buttonText: {
			type: String,
			default: 'Contribute monthly'
		},
		minCustomAmount: {
			type: Number,
			default: 5
		},
		maxCustomAmount: {
			type: Number,
			default: 10000
		}
	},
	computed: {
		componentKey() {
			// This component can exist multiple times on the page or can be iterated over.
			// If it has a key attribute, then it will be used in the input id to avoid
			// duplicate inputs with the same id.
			return this.$vnode.key || '';
		}
	},
	methods: {
		// Emits values to parent component to allow the synchronization of 2 landing
		// forms on the same page
		updateSelected(event) {
			this.$emit('update:selectedGroup', event.target.value);
		},
		// Emits values to parent component to allow the synchronization of 2 landing
		// forms on the same page
		updateAmount(value) {
			this.$emit('update:amount', value);
		},
		submit() {
			this.$router.push({
				path: '/monthlygood/setup',
				query: {
					amount: this.amount,
					category: this.selectedGroup
				}
			});
		},
		pillToggled(value) {
			if (value === 'custom') {
				this.amountSelected = 'custom';
			} else {
				this.amountSelected = value;
				this.$emit('update:amount', parseFloat(value));
			}
		},
		// Implementation Required in Parent Component
		// Enables tracking of selected option/key associated value
		customAmountUpdated(value) {
			this.$emit('update:amount', parseFloat(value));
		}
	},
};
</script>
<style lang="scss" scoped>
	.kv-pill-toggle {
		margin-bottom: 1rem;
	}

	.select-category-wrapper {
		display: flex;
		align-items: baseline;
	}

	.select-category-label {
		flex-shrink: 0;
		margin-right: 0.5rem;
		font-size: 1rem;
	}

	.select-category {
		width: 100%;
	}
</style>
