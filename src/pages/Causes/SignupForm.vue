<template>
	<section class="tw-relative">
		<kv-page-container class="tw-mt-4 md:tw-mt-6 lg:tw-mt-8">
			<kv-grid class="tw-grid-cols-12">
				<div :class="[
					'tw-px-1',
					'tw-mb-6',
					'tw-col-span-12',
					'md:tw-col-span-6',
					'md:tw-col-start-4'
				]"
				>
					<!-- Sign Up Form -->
					<img
						class="tw-h-16 tw-w-16 tw-mx-auto tw-mb-4"
						:src="causesIconImgRequire(`./lend-icon.svg`)"
					>

					<h3 v-if="cause === 'climate'">
						Are you ready to take action and fund climate loans each month?
					</h3>
					<h3 v-if="cause === 'education'">
						Are you ready to take action and fund education loans each month?
					</h3>
					<h3 v-if="cause === 'women'">
						Are you ready to take action and fund loans to women each month?
					</h3>

					<form
						class="tw-mt-2"
						@submit.prevent=""
						novalidate
					>
						<fieldset :disabled="success">
							<label
								class="tw-text-h4"
								for="amount"
							>
								Monthly Amount
							</label>
							<kv-select
								class="tw-w-full tw-mt-2"
								id="amount"
								v-model="amount"
							>
								<option
									v-for="(option, index) in mgAmountOptions"
									:value="option.value"
									:key="index"
								>
									{{ option.label }}
								</option>
							</kv-select>

							<p class="tw-mt-2 tw-text-base" v-if="dayOfMonth < 29">
								<!-- eslint-disable-next-line max-len -->
								Your subscription will renew automatically every month on the {{ dayOfMonth | numeral('Oo') }}. You can cancel any time.
							</p>
							<p class="tw-mt-2 tw-text-base" v-else>
								<!-- eslint-disable-next-line max-len -->
								Your subscription will renew automatically on the {{ dayOfMonth | numeral('Oo') }}, or the last day of the month. You can cancel any time.
							</p>
							<causes-drop-in-payment-wrapper
								class="tw-mt-4 tw-mx-auto"
								:amount="amount"
								:day-of-month="dayOfMonth"
								:cause-category-id="causeCategoryId"
								@complete-transaction="completeCausesBraintree"
							/>
						</fieldset>
					</form>
				</div>
			</kv-grid>
		</kv-page-container>
	</section>
</template>

<script>
import gql from 'graphql-tag';

import { validationMixin } from 'vuelidate';
import numeral from 'numeral';
import { required } from 'vuelidate/lib/validators';

import CausesDropInPaymentWrapper from '@/components/Causes/CausesDropInPaymentWrapper';
import KvGrid from '~/@kiva/kv-components/vue/KvGrid';
import KvPageContainer from '~/@kiva/kv-components/vue/KvPageContainer';
import KvSelect from '~/@kiva/kv-components/vue/KvSelect';

const causesIconImgRequire = require.context('@/assets/images/causes-icons/', true);

const pageQuery = gql`query causesCategoryIds {
  getCategories(subscriptionType: "CAUSES") {
    totalCount
    values {
      enabled
      id
      name
    }
  }
}`;

export default {
	props: {
		cause: {
			type: String,
			default: 'climate',
			validator: value => {
				return ['climate', 'education', 'women'].indexOf(value) !== -1;
			}
		},
	},
	components: {
		CausesDropInPaymentWrapper,
		KvGrid,
		KvPageContainer,
		KvSelect,
	},
	metaInfo: {
		title: 'Get Started',
	},
	mixins: [validationMixin],
	validations: {
		amount: {
			required,
		},
	},
	data() {
		return {
			dayOfMonth: new Date().getDate(),
			causesIconImgRequire,
			mgAmountOptions: [
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
			amount: 5,
			success: false,
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
	methods: {
		completeCausesBraintree() {
			// disable form inputs while routing to thanks
			this.success = true;
			this.$kvTrackEvent('Registration', 'successful-causes-reg', 'register-causes');
			this.$router.push({
				path: '/causes/thanks',
			});
		},
	},
	computed: {
		causeCategoryId() {
			switch (this.cause) {
				case 'climate':
					return this.causesCategories.find(category => category.name === 'Climate Change')?.id;
				case 'education':
					return this.causesCategories.find(category => category.name === 'Education')?.id;
				case 'women':
					return this.causesCategories.find(category => category.name === 'Support Women')?.id;
				default:
					console.log(`Did not find category id for this.cause: "${this.cause}"`, 'warning');
					return '';
			}
		}
	},
};
</script>

<style scoped lang="scss">
</style>
