<template>
	<div>
		<kv-button
			class="tw-mx-auto"
			@click="showLightbox"
			v-kv-track-event="[
				'homepage',
				'click-mgpromo-cta',
				'Lets get started'
			]"
			id="mobileMonthlyGoodSelectorButton"
		>
			<span class="tw-flex tw-items-center tw-text-h3">
				Get started
				<kv-material-icon class="tw-w-3.5 tw-h-3.5" :icon="mdiChevronRight" />
			</span>
		</kv-button>
		<kv-lightbox
			:visible="lightboxVisible"
			title="Monthly Subscription"
			@lightbox-closed="hideLightbox"
			class="tw-text-left"
		>
			<div class="tw-pb-3" v-html="monthlySubscriptionCopy"></div>
			<div v-if="selectedGroup">
				<h4 class="tw-py-1">
					Your cause
				</h4>
				<button
					@click="goBackToCauses"
					class="tw-w-full tw-flex tw-items-center tw-mb-1.5"
				>
					<img
						class="tw-h-5 tw-w-5 tw-rounded-sm tw-overflow-hidden tw-mr-1"
						:src="getImage(`./mg-${selectedGroup.value}.svg`)"
					>
					{{ selectedGroup.marketingName }}
				</button>
			</div>
			<div v-if="lightboxStep == 'cause'" class="tw-mb-4">
				<p class="tw-mb-2">
					What cause would you like to support?
				</p>

				<button
					v-for="(option, index) in sortedLendingCategories"
					:key="index"
					v-kv-track-event="[
						'homepage',
						'click-mgpromo-cause',
						option.marketingName
					]"
					class="tw-w-full tw-flex tw-items-center tw-mb-1.5"
					@click="selectCause(option)"
				>
					<img
						class="tw-h-5 tw-w-5 tw-rounded-sm tw-overflow-hidden tw-mr-1"
						:src="getImage(`./mg-${option.value}.svg`)"
					>
					{{ option.marketingName }}
				</button>
			</div>
			<div class="tw-mt-2 tw-mb-4" v-if="lightboxStep === 'amount'">
				<label class="tw-text-h4 tw-py-1" for="mgAmountDropdown">
					Choose your amount
				</label>
				<kv-ui-select
					id="mgAmountDropdown"
					class="tw-w-full"
					v-model.number="mgAmount"
					@update:modelValue="trackMgAmountSelection"
				>
					<option
						v-for="(option, index) in mgAmountOptions"
						:key="index"
						:value="option.value"
					>
						{{ option.label }}
					</option>
				</kv-ui-select>
			</div>

			<template #controls v-if="selectedGroup">
				<kv-button @click="navigateToMG">
					Next
				</kv-button>
			</template>
		</kv-lightbox>
	</div>
</template>

<script>
import numeral from 'numeral';
import { validationMixin } from 'vuelidate';
import { required } from 'vuelidate/lib/validators';
import { mdiChevronRight } from '@mdi/js';

import loanGroupCategoriesMixin from '@/plugins/loan-group-categories';
import { documentToHtmlString } from '~/@contentful/rich-text-html-renderer';

import KvMaterialIcon from '~/@kiva/kv-components/vue/KvMaterialIcon';
import KvLightbox from '~/@kiva/kv-components/vue/KvLightbox';
import KvButton from '~/@kiva/kv-components/vue/KvButton';
import KvUiSelect from '~/@kiva/kv-components/vue/KvSelect';

const mgSelectorImgRequire = require.context('@/assets/images/mg-selector-icons/', true);

export default {
	props: {
		/**
		 * The category value to preSelect. Or null for no selection
		* */
		preSelectedCategory: {
			type: Object,
			default: null,
		},
		/**
		 * Rich text object for copy for lightbox
		* */
		richTextContent: {
			type: Object,
			default: () => {},
		},
	},
	components: {
		KvButton,
		KvLightbox,
		KvMaterialIcon,
		KvUiSelect,
	},
	mixins: [
		loanGroupCategoriesMixin,
		validationMixin,
	],
	validations: {
		mgAmount: {
			required,
			valid(value) {
				const possibleValues = this.mgAmountOptions.map(option => option.value);
				return possibleValues.includes(value);
			}
		},
		groupValue: {
			required
		}
	},
	data() {
		return {
			selectedGroup: this.preSelectedCategory,
			mgAmount: 25,
			mgAmountOptions: [
				{
					value: 5,
					label: `${numeral(5).format('$0,0')}`,
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
				{
					value: 'other',
					label: 'Other',
				},
			],
			lightboxVisible: false,
			lightboxStep: 'amount',
			mdiChevronRight,
		};
	},
	mounted() {
		this.$root.$on('openMonthlyGoodSelector', this.onCtaClick);
	},
	beforeDestroy() {
		this.$root.$off('openMonthlyGoodSelector', this.onCtaClick);
	},
	methods: {
		showLightbox() {
			// if preSelectedCategory is present, open amounts.
			if (this.preSelectedCategory) {
				this.lightboxStep = 'amount';
			} else {
				// if no preSelectedCategory is present, open causes.
				this.lightboxStep = 'cause';
			}
			this.lightboxVisible = true;
		},
		hideLightbox() {
			this.$kvTrackEvent('MonthlyGood', 'click-close-monthly-good-selector-mobile', this.lightboxStep);
			this.lightboxVisible = false;
		},
		getImage(image) {
			return mgSelectorImgRequire(image);
		},
		goBackToCauses() {
			this.lightboxStep = 'cause';
			this.selectedGroup = null;
		},
		navigateToMG() {
			// If mgAmount is other, just default to 25 value
			this.$router.push({
				path: '/monthlygood/setup',
				query: {
					amount: this.mgAmount !== 'other' ? this.mgAmount : 25,
					category: this.groupValue
				}
			});
		},
		onCtaClick() {
			/**
			 * Move focus to button from whatever triggered this event
			 * And open causes.
			 */
			document.getElementById('mobileMonthlyGoodSelectorButton').focus();
			this.showLightbox();
		},
		selectCause(option) {
			this.lightboxStep = 'amount';
			this.selectedGroup = option;
		},
		trackMgAmountSelection(selectedDollarAmount) {
			this.$kvTrackEvent(
				'homepage',
				'click-mgpromo-amount',
				selectedDollarAmount
			);
		},
	},
	computed: {
		monthlySubscriptionCopy() {
			const text = this.richTextContent?.richText;
			return documentToHtmlString(text);
		},
		sortedLendingCategories() {
			// return this.lendingCategories sorted by marketingOrder property
			return [...this.lendingCategories].sort((a, b) => a.marketingOrder - b.marketingOrder);
		},
		groupValue() {
			return this.selectedGroup?.value;
		},
		formattedAmount() {
			if (this.mgAmount === 'other') {
				return 'Other';
			}
			return numeral(this.mgAmount).format('$0,0.00');
		},
	}
};

</script>

<style lang="scss" scoped>
</style>
