<template>
	<div class="row mg-area">
		<kv-settings-card class="column large-8" title="Monthly Good">
			<template v-slot:icon>
				<kv-icon
					class="icon"
					title="Monthly Good"
					name="subscriptions-monthly-good"
				/>
			</template>
			<template v-slot:content>
				<router-link v-if="!isMonthlyGoodSubscriber"
					to="/monthlygood"
				>
					Sign up for a Kiva Monthly Good subscription
				</router-link>
				<div v-if="isMonthlyGoodSubscriber">
					<p>
						On the <a
							role="button"
							@click.prevent="showLightbox = true;"
						>{{ dayOfMonth | numeral('Oo') }}</a> of each month <a
							role="button"
							@click.prevent="showLightbox = true;"
						>{{ totalCombinedDeposit | numeral('$0,0.00') }}</a> will be
						transferred<a
							role="button"
							@click.prevent="showLightbox = true;"
							v-if="selectedGroupDescriptor"
						> to support
							{{ selectedGroupDescriptor }}</a>.
					</p>
					<p>
						<a role="button" @click.prevent="$emit('cancel-subscription')">Cancel Monthly Good</a>
					</p>
					<kv-lightbox
						class="monthly-good-settings-lightbox"
						:visible="showLightbox"
						title="Change your monthly good"
						@lightbox-closed="closeLightbox"
					>
						<monthly-good-update-form
							:donation="donation"
							:day-of-month="dayOfMonth"
							:category="category"
							:mg-amount="mgAmount"
							:disabled="isSaving"
							@form-update="formUpdated"
						/>
						<template slot="controls">
							<kv-button
								data-test="monthly-good-save-button"
								class="smaller button"
								v-if="!isSaving"
								@click.native="saveMonthlyGood"
								:disabled="!isChanged || !isFormValid"
							>
								Save
							</kv-button>
							<kv-button data-test="monthly-good-save-button" class="smaller button" v-else>
								Saving <kv-loading-spinner />
							</kv-button>
						</template>
					</kv-lightbox>
				</div>
			</template>
		</kv-settings-card>
	</div>
</template>

<script>
import _get from 'lodash/get';
import gql from 'graphql-tag';

import loanGroupCategoriesMixin from '@/plugins/loan-group-categories';

import KvButton from '@/components/Kv/KvButton';
import KvIcon from '@/components/Kv/KvIcon';
import KvLightbox from '@/components/Kv/KvLightbox';
import KvLoadingSpinner from '@/components/Kv/KvLoadingSpinner';
import KvSettingsCard from '@/components/Kv/KvSettingsCard';
import MonthlyGoodUpdateForm from '@/components/Forms/MonthlyGoodUpdateForm';

const pageQuery = gql`query monthlyGoodSubscription {
	my {
		autoDeposit {
			amount
			donateAmount
			dayOfMonth
			isSubscriber
		}
		monthlyGoodCategory
	}
}`;

export default {
	inject: ['apollo'],
	components: {
		KvButton,
		KvIcon,
		KvLightbox,
		KvLoadingSpinner,
		KvSettingsCard,
		MonthlyGoodUpdateForm,
	},
	data() {
		return {
			isSaving: false,
			category: null,
			dayOfMonth: new Date().getDate(),
			donation: 0,
			mgAmount: 0,
			isMonthlyGoodSubscriber: false,
			showLightbox: false,
			isChanged: false,
			isFormValid: true,
		};
	},
	mixins: [
		loanGroupCategoriesMixin
	],
	apollo: {
		query: pageQuery,
		preFetch(config, client) {
			return client.query({
				query: pageQuery
			});
		},
		result({ data }) {
			this.isMonthlyGoodSubscriber = _get(data, 'my.autoDeposit.isSubscriber', false);
			if (this.isMonthlyGoodSubscriber) {
				const autoDepositAmount = parseFloat(_get(data, 'my.autoDeposit.amount', 0));
				this.donation = parseFloat(_get(data, 'my.autoDeposit.donateAmount', 0));
				this.dayOfMonth = _get(data, 'my.autoDeposit.dayOfMonth');
				this.category = _get(data, 'my.monthlyGoodCategory', '');
				this.mgAmount = autoDepositAmount - this.donation;
			}
		},
	},
	computed: {
		selectedGroupDescriptor() {
			const selectedCategory = this.lendingCategories.find(category => category.value === this.category);

			// Set group descriptor. There can be cases where this is undefined, and returns empty string.
			return selectedCategory ? selectedCategory.shortName : '';
		},
		totalCombinedDeposit() {
			return this.donation + this.mgAmount;
		},
	},
	methods: {
		/** This method is triggered when the form is updated.
		* Sets the values in this component to the form values
		* @param {Object} form - Update form values
		* @param {number} form.mgAmount - MG amount.
		* @param {number} form.donation - MG donation amount.
		* @param {number} form.dayOfMonth - MG day of month.
		* @param {number} form.category - MG category short name.
		* @param {boolean} form.isChanged - is the form dirty.
		* @param {boolean} form.isFormValid - is the form valid.
		*/
		formUpdated({
			mgAmount, donation, dayOfMonth, category, isChanged, isFormValid
		}) {
			this.mgAmount = mgAmount;
			this.donation = donation;
			this.dayOfMonth = dayOfMonth;
			this.category = category;
			this.isChanged = isChanged;
			this.isFormValid = isFormValid;
		},
		closeLightbox() {
			/** If form is changed, let parent component know so save button can be displayed
			 * This method will not be executed when lightbox closes after saving.
			*/
			if (this.isChanged) {
				this.$emit('unsaved-changes', true);
			}
			this.showLightbox = false;
		},
		saveMonthlyGood() {
			this.isSaving = true;
			const updateMGCategory = this.apollo.mutate({
				mutation: gql`mutation updateCategory($category: MonthlyGoodCategoryEnum!) {
					my {
						updateMonthlyGoodCategory(category: $category)
					}
				}`,
				variables: {
					category: this.category,
				}
			});
			const updateMGSettings = this.apollo.mutate({
				mutation: gql`mutation updateAutoDeposit($amount: Money, $donateAmount: Money, $dayOfMonth: Int) {
					my {
						updateAutoDeposit( autoDeposit: {
							amount: $amount, donateAmount: $donateAmount, dayOfMonth: $dayOfMonth
						}) {
							amount donateAmount dayOfMonth
						}
					}
				}`,
				variables: {
					amount: this.totalCombinedDeposit,
					donateAmount: this.donation,
					dayOfMonth: this.dayOfMonth,
				}
			});
			return Promise.all([updateMGCategory, updateMGSettings]).then(() => {
				this.$showTipMsg('Settings saved!');
			}).catch(e => {
				console.error(e);
				this.$showTipMsg('There was a problem saving your settings', 'error');
			}).finally(() => {
				this.isSaving = false;
				this.$emit('unsaved-changes', false);
				this.showLightbox = false;
			});
		},
	},
};
</script>

<style lang="scss" scoped>
@import 'settings';
</style>
