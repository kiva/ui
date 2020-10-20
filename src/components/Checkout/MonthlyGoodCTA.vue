<template>
	<div class="monthly-good-cta">
		<div class="row columns text-center">
			<h2 class="monthly-good-cta__headline">
				<kv-icon
					class="monthly-good-icon"
					title="Monthly Good"
					name="subscriptions-monthly-good"
				/>Grow your lending with Monthly Good!
			</h2>
			<p class="monthly-good-cta__subhead">
				<!-- eslint-disable-next-line max-len -->
				Want to change lives all year long? Sign up for Monthly Good and for as little as $5 a month, you can make a lasting impact on hundreds of borrowers.
			</p>
			<form class="monthly-good-cta__form" @submit.prevent="null">
				<div class="row">
					<div class="small-12 large-4 column">
						<kv-dropdown-rounded v-model="mgAmount" class="monthly-good-cta__dropdown">
							<option
								v-for="(option, index) in mgAmountOptions"
								:value="option.value"
								:key="index"
							>
								{{ option.label }}
							</option>
						</kv-dropdown-rounded>
					</div>
					<div class="column">
						<kv-dropdown-rounded v-model="selectedGroup" class="monthly-good-cta__dropdown">
							<option
								v-for="(option, index) in lendingCategories"
								:value="option.value"
								:key="index"
							>
								{{ option.label }}
							</option>
						</kv-dropdown-rounded>
					</div>
				</div>
				<div class="row">
					<div class="column">
						<kv-button :to="{
								path: '/monthlygood/setup',
								query: {
									amount: this.mgAmount,
									category: this.selectedGroup,
									nextmonth: true
								}
							}"
							v-kv-track-event="['Thanks', 'EXP-SUBS-526-Oct2020', 'click-monthly-good-signup']"
							class="monthly-good-cta__button smaller"
						>
							Sign me up
						</kv-button>
					</div>
				</div>
			</form>
		</div>
	</div>
</template>

<script>
import numeral from 'numeral';

import KvButton from '@/components/Kv/KvButton';
import KvIcon from '@/components/Kv/KvIcon';
import KvDropdownRounded from '@/components/Kv/KvDropdownRounded';

import loanGroupCategoriesMixin from '@/plugins/loan-group-categories';

export default {
	components: {
		KvButton,
		KvIcon,
		KvDropdownRounded,
	},
	mixins: [
		loanGroupCategoriesMixin
	],
	data() {
		return {
			selectedGroup: 'default',
			mgAmount: 10,
			mgAmountOptions: [
				{
					value: 35,
					label: `${numeral(35).format('$0,0.00')}`,
				},
				{
					value: 30,
					label: `${numeral(30).format('$0,0.00')}`,
				},
				{
					value: 25,
					label: `${numeral(25).format('$0,0.00')}`,
				},
				{
					value: 20,
					label: `${numeral(20).format('$0,0.00')}`,
				},
				{
					value: 15,
					label: `${numeral(15).format('$0,0.00')}`,
				},
				{
					value: 10,
					label: `${numeral(10).format('$0,0.00')}`,
				},
				{
					value: 5,
					label: `${numeral(5).format('$0,0.00')}`,
				},
			]
		};
	},
};
</script>

<style lang="scss" scoped>
@import 'settings';

.monthly-good-cta {
	padding: 2.25rem 0 1.5rem 0;
	background: $white;

	&__dropdown {
		width: 100%;
	}

	&__headline {
		@include big-text();

		text-align: center;
		margin-bottom: 1.5rem;
	}

	&__subhead {
		@include featured-text();

		margin-bottom: 2rem;
	}

	&__form {
		max-width: rem-calc(509);
		margin: 0 auto;
		text-align: center;
	}

	&__button {
		width: 100%;
	}
}

.monthly-good-icon {
	height: 1.65rem;
	width: 1.65rem;
	margin-right: 1rem;
}
</style>
