<template>
	<form
		@submit.prevent
		novalidate
	>
		<fieldset :disabled="this.disabled">
			<div class="row column">
				<strong>Each month on the</strong>
				<label
					class="tw-sr-only"
					:class="{ 'error': $v.form.dayOfMonth.$invalid }" :for="form.dayOfMonth"
				>
					Day of the Month
				</label>
				<kv-text-input
					v-if="isDayInputShown"
					@blur="hideDayInput()"
					class="text-input__day"
					id="dayOfMonth"
					type="number"
					placeholder=""
					required
					min="1"
					max="31"
					v-model.number="form.dayOfMonth"
				/>
				<button
					class="tw-text-link tw-font-medium"
					@click="isDayInputShown = true"
					v-if="!isDayInputShown"
				>
					<strong>{{ form.dayOfMonth | numeral('Oo') }}</strong>
					<kv-icon class="icon-pencil" name="pencil" title="Edit" />
				</button>
				<strong>we'll process the following:</strong>
				<ul class="validation-errors" v-if="$v.form.dayOfMonth.$invalid">
					<li v-if="!$v.form.dayOfMonth.required">
						Field is required
					</li>
					<li v-if="!$v.form.dayOfMonth.minValue || !$v.form.dayOfMonth.maxValue">
						Enter day of month between 1 and 31
					</li>
				</ul>
				<div class="additional-day-info">
					<small v-if="form.dayOfMonth > 28">
						Your subscription will renew automatically on the 28th of the month.
					</small>
				</div>
			</div>
			<div class="middle-wrapper">
				<div class="row align-middle">
					<div class="columns">
						<span>
							Deposit for lending
						</span>
					</div>

					<div class="small-6 medium-4 columns">
						<label
							class="tw-sr-only"
							:class="{ 'error': $v.form.amount.$invalid }"
							for="amount"
						>
							Amount
						</label>
						<kv-select
							class="tw-w-full tw-mt-2"
							id="amount"
							v-model="form.amount"
						>
							<option
								v-for="(option, index) in causesAmountOptions"
								:value="option.value"
								:key="index"
							>
								{{ option.label }}
							</option>
						</kv-select>
					</div>
				</div>
				<div class="row columns align-middle">
					<ul class="tw-text-right validation-errors" v-if="$v.form.amount.$invalid">
						<li v-if="!$v.form.amount.required">
							Field is required
						</li>
						<li v-if="!$v.form.amount.minValue || !$v.form.amount.maxValue">
							Enter an amount of $5-$10,000
						</li>
					</ul>
				</div>
			</div>
			<div class="row align-middle">
				<div class="column">
					<label class="tw-font-medium" for="causes-category-select">Your contribution will:</label>
				</div>
				<div class="column">
					<kv-select v-model="form.categoryId" class="group-dropdown" id="causes-categories-select">
						<option
							v-for="(option, index) in causesList"
							:value="option.value"
							:key="index"
						>
							{{ option.label }}
						</option>
					</kv-select>
				</div>
			</div>
		</fieldset>
	</form>
</template>

<script>
import { validationMixin } from 'vuelidate';
import { required, minValue, maxValue } from 'vuelidate/lib/validators';
import gql from 'graphql-tag';
import numeral from 'numeral';

import KvIcon from '@/components/Kv/KvIcon';
import KvSelect from '~/@kiva/kv-components/vue/KvSelect';
import KvTextInput from '~/@kiva/kv-components/vue/KvTextInput';

const pageQuery = gql`
	query causesCategoryIds {
		getCategories(subscriptionType: "CAUSES") {
			totalCount
			values {
				enabled
				id
				name
				contentfulEntry {
					entry
				}
			}
		}
	}
`;
/**
 * This form contains all the fields and validation to modify a Causes Subscription
 * It accepts values as props and sets those to initial data values.
 * When values are changed it emits the validity state and the values
 * so a parent component can access them.
 */
export default {
	name: 'CausesUpdateForm',
	components: {
		KvIcon,
		KvSelect,
		KvTextInput,
	},
	data() {
		return {
			causesAmountOptions: [
				{
					value: 5,
					label: `${numeral(5).format('$0,0')}`,
				},
				{
					value: 15,
					label: `${numeral(15).format('$0,0')}`,
				},
				{
					value: 25,
					label: `${numeral(25).format('$0,0')}`,
				},
				{
					value: 50,
					label: `${numeral(50).format('$0,0')}`,
				},
				{
					value: 75,
					label: `${numeral(75).format('$0,0')}`,
				},
				{
					value: 100,
					label: `${numeral(100).format('$0,0')}`,
				},
			],
			form: {
				categoryId: this.categoryId,
				dayOfMonth: this.dayOfMonth,
				amount: this.amount,
			},
			isDayInputShown: false,
			causesCategories: [],
		};
	},
	inject: ['apollo', 'cookieStore'],
	apollo: {
		query: pageQuery,
		preFetch: true,
		result(result) {
			this.causesCategories = result?.data?.getCategories?.values ?? [];
		},
	},
	props: {
		/**
		 * Should all inputs on the form be disabled
		 * */
		disabled: {
			type: Boolean,
			default: false,
		},
		/**
		 *  Causes Amount
		 * */
		amount: {
			type: Number,
			default: 0,
		},
		/**
		 * Day of month Monthly Good will take effect
		 * */
		dayOfMonth: {
			type: Number,
			default: new Date().getDate(),
		},
		/**
		 * Cause id to lend to.
		 * */
		categoryId: {
			type: String,
			default: '',
		},
	},
	mixins: [validationMixin],
	validations: {
		form: {
			amount: {
				required,
				minValue: minValue(5),
				maxValue: maxValue(10000),
			},
			dayOfMonth: {
				required,
				minValue: minValue(1),
				maxValue: maxValue(31),
			},
			categoryId: {
				required,
			},
		},
	},
	mounted() {
		/** After initial value is loaded, setup watch to make form dirty on value changes
		 * and emit values on value changes. Setting this in mounted prevents the form
		 * from being dirty on initial load
		 */
		this.$watch('form', () => {
			this.$v.$touch();
			/**
				 * Event emitted whenever a form value changes.
				 * @type {Event}
				 */
			this.$emit('form-update', {
				...this.form,
				categoryName: this.categoryName,
				isChanged: this.$v.$dirty,
				isFormValid: !this.$v.$invalid,
			});
		}, { deep: true });
	},
	methods: {
		hideDayInput() {
			if (!this.$v.form.dayOfMonth.$invalid) {
				this.isDayInputShown = false;
			}
		},
		convertCauseKeyToLabel(key) {
			switch (key) {
				case 'climateChange':
					return 'Support climate change loans';
				case 'education':
					return 'Support education';
				case 'genderEquality':
					return 'Support women';
				default:
					return '';
			}
		},
	},
	computed: {
		categoryName() {
			return this.causesCategories.find(category => category.id === this.form.categoryId)?.name;
		},
		causesList() {
			return this.causesCategories.map(category => {
				return {
					label: this.convertCauseKeyToLabel(
						category?.contentfulEntry?.entry?.fields?.dataObject?.causeKey
					),
					value: category.id,
					causeKey:
						category?.contentfulEntry?.entry?.fields?.dataObject?.causeKey,
				};
			});
		},
	},
};
</script>

<style lang="scss" scoped>
@import 'settings';

form {
	.row {
		margin-bottom: 0.25em;
	}

	.additional-left-pad-currency {
		padding-left: 0.65rem;
	}

	.icon-pencil {
		height: 1rem;
		width: 1rem;
	}

	.text-input__day {
		margin: 0 0 0 0.25rem;
	}

	.validation-errors {
		margin: 0;
	}

	.additional-day-info {
		margin-bottom: 1.25rem;

		small,
		strong {
			display: block;
		}
	}

	::v-deep .loading-spinner {
		vertical-align: middle;
		width: 1rem;
		height: 1rem;
	}

	::v-deep .loading-spinner .line {
		background-color: $white;
	}

	::v-deep .dropdown-wrapper.group-dropdown .dropdown {
		margin-top: 0.65rem;
		margin-bottom: 0;
	}

	.middle-wrapper {
		padding-left: 2rem;
		padding-right: 2rem;
	}

	.group-dropdown {
		margin-right: 2rem;
	}
}
</style>
