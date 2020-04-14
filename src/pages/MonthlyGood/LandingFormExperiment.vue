<template>
	<form @submit.prevent.stop="submit" novalidate>
		<div class="row">
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
			<span class="large-4 medium-4 small-12 columns select-category-label">
				Loan monthly to
			</span>
			<span class="large-7 medium-7 small-12 columns select-category">
				<select
						class="loan-price medium-text-font-size"
						@change="updateSelected"
				>
					<option
							v-for="(option, index) in lendingCategories"
							:value="option.value"
							:key="index"
					>
						{{ option.label }}
					</option>
				</select>
			</span>
		</div>

		<kv-button class="smaller" type="submit" :disabled="$v.$invalid">
			{{ buttonText }}
		</kv-button>
	</form>
</template>


<script>
	import { validationMixin } from 'vuelidate';
	import { required, minValue, maxValue } from 'vuelidate/lib/validators';

	import KvDropdownRounded from '@/components/Kv/KvDropdownRounded';
	import KvCurrencyInput from '@/components/Kv/KvCurrencyInput';
	import KvButton from '@/components/Kv/KvButton';
	import loanGroupCategoriesMixin from '@/plugins/loan-group-categories';
	import { number } from '@storybook/addon-knobs';
	import MultiAmountSelector from '@/components/Forms/MultiAmountSelector';

	export default {
		mixins: [
			validationMixin,
			loanGroupCategoriesMixin
		],
		components: {
			KvButton,
			KvCurrencyInput,
			KvDropdownRounded,
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
				default: number('minCustomAmount', 5)
			},
			maxCustomAmount: {
				default: number('maxCustomAmount', 10000)
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
	@import 'settings';

	// styles to match KvDropDownRounded
	input[type="text"] {
		border-radius: $button-radius;
		color: $charcoal;
		font-size: $medium-text-font-size;
		font-weight: $global-weight-highlight;
		margin: 0;
	}

	// When label is error, validation styles overwrite this
	label:not(.error) + input {
		border: 1px solid $charcoal;
	}

	::v-deep .dropdown-wrapper select.dropdown {
		width: 100%;
	}

	.input-wrapper {
		padding-bottom: 1rem;
	}

	.validation-errors {
		padding: 0.15rem 0 0 0;
		margin-bottom: 0;

		li {
			line-height: 1.15rem;
		}
	}
	.kv-pill-toggle{
		margin-bottom: 1rem;
	}
	.select-category{
		padding-left: 0;
	}
	.select-category-label{
		padding-right: 0;
		padding-top: .5rem;
	}
</style>
