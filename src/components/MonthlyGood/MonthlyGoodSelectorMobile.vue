<template>
	<div class="monthly-selector-mobile">
		<div class="row align-center">
			<div class="small-12 columns">
				<kv-button
					class="monthly-selector-mobile__button tw-mx-auto tw-w-full"
					@click.native="showLightbox"
					v-kv-track-event="[
						'homepage',
						'click-mgpromo-cta',
						'Lets get started'
					]"
				>
					Get started
				</kv-button>
			</div>
		</div>
		<kv-lightbox
			:visible="lightboxVisible"
			:title="lightboxTitle"
			@lightbox-closed="hideLightbox"
		>
			<div class="monthly-selector-mobile__causes" v-if="lightboxStep == 'cause'">
				<button
					v-for="(option, index) in sortedLendingCategories"
					:key="index"
					v-kv-track-event="[
						'homepage',
						'click-mgpromo-cause',
						option.marketingName
					]"
					@click="selectCause(option)"
				>
					<img
						class="monthly-selector-mobile__causes-icon"
						:src="getImage(`./mg-${option.value}.svg`)"
					>
					{{ option.marketingName }}
				</button>
			</div>
			<div class="monthly-selector-mobile__amounts" v-if="lightboxStep == 'amount'">
				<button
					v-for="(option, index) in mgAmountOptions"
					:key="index"
					v-kv-track-event="[
						'homepage',
						'click-mgpromo-amount',
						option.value
					]"
					@click="selectAmount(option.value)"
				>
					{{ option.label }}
				</button>
			</div>
			<div class="monthly-selector-mobile__your-cause" v-if="selectedGroup">
				<strong>Your cause</strong>
				<div class="monthly-selector-mobile__causes monthly-selector-mobile__causes--selected">
					<button
						class="selected"
						@click="goBackToCauses"
					>
						<img
							class="monthly-selector-mobile__causes-icon"
							:src="getImage(`./mg-${selectedGroup.value}.svg`)"
						>
						{{ selectedGroup.marketingName }}
					</button>
				</div>
			</div>
		</kv-lightbox>
	</div>
</template>

<script>
import numeral from 'numeral';
import { validationMixin } from 'vuelidate';
import { required, minValue, maxValue } from 'vuelidate/lib/validators';

import KvIcon from '@/components/Kv/KvIcon';
import KvLightbox from '@/components/Kv/KvLightbox';

import loanGroupCategoriesMixin from '@/plugins/loan-group-categories';

import KvButton from '~/@kiva/kv-components/vue/KvButton';

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
	},
	components: {
		KvButton,
		KvIcon,
		KvLightbox,
	},
	mixins: [
		loanGroupCategoriesMixin,
		validationMixin,
	],
	validations: {
		mgAmount: {
			required,
			minValue: minValue(5),
			maxValue: maxValue(100),
		},
		groupValue: {
			required
		}
	},
	data() {
		return {
			selectedGroup: this.preSelectedCategory,
			mgAmount: null,
			mgAmountOptions: [
				{
					value: 5,
					label: `${numeral(5).format('$0,0')} /mo`,
				},
				{
					value: 25,
					label: `${numeral(25).format('$0,0')} /mo`,
				},
				{
					value: 50,
					label: `${numeral(50).format('$0,0')} /mo`,
				},
				{
					value: 75,
					label: `${numeral(75).format('$0,0')} /mo`,
				},
				{
					value: 100,
					label: `${numeral(100).format('$0,0')} /mo`,
				},
				{
					value: 'other',
					label: 'Other',
				},
			],

			lightboxVisible: false,
			lightboxStep: 'cause',
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
			document.getElementsByClassName('monthly-selector-mobile__button')[0].focus();
			this.showLightbox();
		},
		selectCause(option) {
			this.lightboxStep = 'amount';
			this.selectedGroup = option;
		},
		selectAmount(amount) {
			this.mgAmount = amount;
			this.navigateToMG();
		},
	},
	computed: {
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
		lightboxTitle() {
			return this.lightboxStep === 'cause'
				? 'What cause would you like to support?' : 'How much would you like to lend?';
		}
	}
};

</script>

<style lang="scss" scoped>
@import 'settings';

$offwhite: #F8F8F8;

.monthly-selector-mobile {
	position: relative;

	.right-arrow-icon {
		width: rem-calc(21);
		height: rem-calc(23);
		transform: rotate(270deg);
		fill: $white;
		margin: 0 20px;
		position: absolute;
	}

	&__your-cause {
		margin-top: 1rem;
	}

	&__amounts {
		flex-flow: column;
		align-items: center;

		button {
			width: auto;
			margin-bottom: 1rem;
		}
	}

	&__causes {
		flex-flow: wrap;

		button {
			width: 100%;
		}
	}

	&__causes,
	&__amounts {
		display: flex;
		padding: 0.75rem 1.5rem;

		button {
			text-align: left;
			font-size: 1.5rem;
			display: flex;
			align-items: center;
			padding: 0.5rem;
			border-radius: rem-calc(8);

			&:hover,
			&.selected {
				background-color: $offwhite;
			}
		}
	}

	&__causes--selected {
		padding-left: 0;
	}

	&__causes-icon {
		height: rem-calc(48);
		width: rem-calc(48);
		border-radius: rem-calc(8);
		overflow: hidden;
		margin-right: 1rem;
	}
}
</style>
