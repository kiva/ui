<template>
	<div>
		<div class="kv-tailwind">
			<section class="tw-relative">
				<kv-page-container class="tw-mt-4 md:tw-mt-6 lg:tw-mt-8">
					<kv-grid class="tw-grid-cols-12">
						<div :class="[
							'tw-px-1',
							'tw-mb-14',
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

								<p class="tw-mt-2 tw-text-base">
									<!-- eslint-disable-next-line max-len -->
									Your subscription will renew automatically every month on the 1st. You can cancel any time.
								</p>
							</form>
						</div>
					</kv-grid>
				</kv-page-container>
			</section>
		</div>

		<!-- TODO Insert payment-dropin-wrapper here, outside of kv-tailwind -->
	</div>
</template>

<script>

import { validationMixin } from 'vuelidate';
import numeral from 'numeral';
import { required } from 'vuelidate/lib/validators';

import KvGrid from '~/@kiva/kv-components/vue/KvGrid';
import KvPageContainer from '~/@kiva/kv-components/vue/KvPageContainer';
import KvSelect from '~/@kiva/kv-components/vue/KvSelect';

const causesIconImgRequire = require.context('@/assets/images/causes-icons/', true);

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
			amount: 5
		};
	},
	inject: ['apollo'],
	methods: {
	},
};
</script>

<style lang="scss">
</style>
