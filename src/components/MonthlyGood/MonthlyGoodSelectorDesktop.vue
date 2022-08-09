<template>
	<div class="monthly-selector" v-click-outside="closeAll">
		<div class="row align-spaced collapse">
			<div class="column">
				<button
					class="monthly-selector__button"
					:class="causeClass"
					v-kv-track-event="[
						'homepage',
						'click-mgpromo-cause-cta',
						'Choose a cause'
					]"
					@click="toggleCauses"
				>
					<template v-if="!selectedGroup">
						<strong class="tw-action">Choose a cause</strong><br>
						What matters to you?
					</template>
					<template v-if="selectedGroup">
						<strong class="tw-action">{{ selectedGroup.marketingName }}</strong><br>
						Your cause
					</template>
				</button>
				<transition name="kvfade">
					<div class="monthly-selector__causes" v-if="isCauseOpen">
						<button
							v-for="(option, index) in sortedLendingCategories"
							:key="index"
							v-kv-track-event="[
								'homepage',
								'click-mgpromo-cause',
								option.marketingName
							]"
							@click.stop="selectCause(option)"
						>
							<img
								class="monthly-selector__causes-icon"
								:src="getImage(`./mg-${option.value}.svg`)"
							>
							{{ option.marketingName }}
						</button>
					</div>
				</transition>
			</div>
			<div class="column">
				<button
					class="monthly-selector__button"
					:class="amountClass"
					v-kv-track-event="[
						'homepage',
						'click-mgpromo-amount-cta',
						'Choose an amount'
					]"
					@click="toggleAmounts"
				>
					<template v-if="!mgAmount">
						<strong>Choose an amount</strong><br>
						As little as $5
					</template>
					<template v-if="mgAmount">
						<strong>{{ formattedAmount }}</strong><br>
						Your amount
					</template>
				</button>
				<transition name="kvfade">
					<div class="monthly-selector__amounts" v-if="isAmountOpen">
						<button
							v-for="(option, index) in mgAmountOptions"
							:key="index"
							v-kv-track-event="[
								'homepage',
								'click-mgpromo-amount',
								option.value
							]"
							@click.stop="selectAmount(option.value)"
						>
							{{ option.label }}
						</button>
					</div>
				</transition>
			</div>
			<div class="shrink column monthly-selector__take-action-wrapper">
				<!--  classic hollow -->
				<kv-button
					@click.native="navigateToMG"
					class="monthly-selector__take-action"
					v-kv-track-event="[
						'homepage',
						'click-mgpromo-cta',
						'Take action'
					]"
					:state="($v.mgAmount.$invalid || $v.groupValue.$invalid) ? 'disabled' : ''"
					:disabled="$v.mgAmount.$invalid || $v.groupValue.$invalid"
				>
					Subscribe
				</kv-button>
			</div>
		</div>
	</div>
</template>

<script>
import numeral from 'numeral';
import { validationMixin } from 'vuelidate';
import { required, minValue, maxValue } from 'vuelidate/lib/validators';

import loanGroupCategoriesMixin from '@/plugins/loan-group-categories';
import clickOutside from '@/plugins/click-outside';

import KvButton from '~/@kiva/kv-components/vue/KvButton';

const mgSelectorImgRequire = require.context('@/assets/images/mg-selector-icons/', true);

export default {
	name: 'MonthlyGoodSelectorDesktop',
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
	},
	mixins: [
		loanGroupCategoriesMixin,
		validationMixin,
		clickOutside,
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
			isCauseOpen: false,
			isAmountOpen: false,
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
		};
	},
	mounted() {
		document.addEventListener('keyup', this.onKeyUp);
		this.$root.$on('openMonthlyGoodSelector', this.onCtaClick);
	},
	beforeDestroy() {
		document.removeEventListener('keyup', this.onKeyUp);
		this.$root.$off('openMonthlyGoodSelector', this.onCtaClick);
	},
	methods: {
		onKeyUp(e) {
			if (e.key === 'Escape') {
				this.closeAll();
			}
		},
		getImage(image) {
			return mgSelectorImgRequire(image);
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
			document.getElementsByClassName('monthly-selector__button')[0].focus();

			// if preSelectedCategory is present, open amounts.
			if (this.preSelectedCategory) {
				this.isCauseOpen = false;
				this.isAmountOpen = true;
			} else {
				// if no preSelectedCategory is present, open causes.
				this.isCauseOpen = true;
				this.isAmountOpen = false;
			}
		},
		toggleCauses() {
			this.isCauseOpen = !this.isCauseOpen;
			this.isAmountOpen = false;
		},
		toggleAmounts() {
			// only open if group selected
			if (this.selectedGroup) {
				this.isAmountOpen = !this.isAmountOpen;
				this.isCauseOpen = false;
			}
		},
		selectCause(option) {
			this.selectedGroup = option;
			this.isCauseOpen = false;
			this.isAmountOpen = true;
		},
		selectAmount(amount) {
			this.mgAmount = amount;
			this.isAmountOpen = false;
			this.navigateToMG();
		},
		closeAll() {
			this.isCauseOpen = false;
			this.isAmountOpen = false;
		}
	},
	computed: {
		sortedLendingCategories() {
			// return this.lendingCategories sorted by marketingOrder property
			return [...this.lendingCategories].sort((a, b) => a.marketingOrder - b.marketingOrder);
		},
		groupValue() {
			return this.selectedGroup?.value;
		},
		causeClass() {
			return {
				highlight: !this.isCauseOpen && !this.selectedGroup && !this.isAmountOpen,
				active: this.isCauseOpen,
				completed: !this.isCauseOpen && this.selectedGroup
			};
		},
		amountClass() {
			return {
				highlight: this.selectedGroup && !this.isAmountOpen && !this.mgAmount && !this.isCauseOpen,
				inactive: !this.selectedGroup && !this.isAmountOpen,
				active: this.isAmountOpen,
				completed: this.mgAmount
			};
		},
		formattedAmount() {
			if (this.mgAmount === 'other') {
				return 'Other';
			}
			return numeral(this.mgAmount).format('$0,0.00');
		},
	},

};

</script>

<style lang="scss" scoped>
@import 'settings';

$offwhite: #F8F8F8;
$kivaaction: #2B7C5F;

.monthly-selector {
	position: relative;

	&__button {
		padding: 0.75rem 1.25rem;
		border-radius: rem-calc(20px);
		border: 2px solid transparent;
		text-align: left;
		width: 100%;
		color: $magnemite;

		@include medium-text();

		@include breakpoint(xxlarge) {
			padding: 1.25rem 2.5rem;
			@include featured-text();
		}

		strong {
			color: $charcoal;
		}

		&.highlight {
			background-color: $white;
		}

		&:hover {
			background-color: $white;
		}

		&.active {
			border: 2px solid $kivaaction;
			background-color: $white;
		}

		&.completed {
			strong {
				color: $kivaaction;
			}
		}

		&.inactive {
			color: $gray;

			strong {
				color: $magnemite;
			}
		}
	}

	&__causes {
		top: -318px;
		height: rem-calc(312);
		max-width: rem-calc(568);
	}

	&__amounts {
		top: -247px;
		height: rem-calc(240);
		width: rem-calc(330);

		button {
			padding-left: 2rem;
		}
	}

	&__causes,
	&__amounts {
		background-color: $white;
		position: absolute;
		box-shadow: 0 -5px 80px rgba(0, 0, 0, 0.1);
		border-radius: rem-calc(20);
		display: flex;
		flex-flow: wrap;
		padding: 0.75rem 1.5rem;

		button {
			text-align: left;
			font-size: 1.5rem;
			width: 50%;
			flex: 0 0 50%;
			display: flex;
			align-items: center;
			padding: 0.5rem;
			border-radius: rem-calc(8);

			&:hover {
				background-color: $offwhite;
			}
		}
	}

	&__causes-icon {
		height: rem-calc(48);
		width: rem-calc(48);
		border-radius: rem-calc(8);
		overflow: hidden;
		margin-right: 1rem;
	}

	&__take-action-wrapper {
		display: flex;
		align-items: center;
		justify-content: center;
	}

	&__take-action {
		margin: 0 0.25rem;
		@include breakpoint(xlarge) {
			margin: 0 1.5rem;
		}
	}
}
</style>
