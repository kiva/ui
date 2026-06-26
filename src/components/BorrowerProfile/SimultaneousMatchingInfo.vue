<template>
	<div class="tw-hidden md:tw-flex md:tw-flex-row md:tw-items-center lg:tw-flex-col lg:tw-items-center tw-py-1.5">
		<div class="tw-flex tw-shrink-0 md:tw-mr-2 lg:tw-mr-0 lg:tw-mb-1.5">
			<kv-user-avatar
				v-for="(matcher, index) in simultaneousMatching"
				:key="matcher.managedAccountId"
				class="tw-w-5 tw-h-5 tw-rounded-full tw-shadow"
				is-small
				:class="{ '-tw-ml-2': index > 0 }"
				:lender-name="matcher.displayName || 'Anonymous'"
				:lender-image-url="matcher.logo && matcher.logo.url ? matcher.logo.url : ''"
			/>
		</div>
		<p class="md:tw-text-left lg:tw-text-center">
			${{ formattedLendAmount }} becomes ${{ formattedMatchedAmount }} with partner matching
			by {{ formattedNames }} while funds last.
		</p>
	</div>
</template>

<script>
import numeral from 'numeral';
import { KvUserAvatar } from '@kiva/kv-components';

export default {
	name: 'SimultaneousMatchingInfo',
	components: {
		KvUserAvatar,
	},
	props: {
		simultaneousMatching: {
			type: Array,
			default: () => [],
		},
		lendAmount: {
			type: Number,
			default: 25,
		},
	},
	computed: {
		matchedAmount() {
			const matcherTotal = this.simultaneousMatching.reduce(
				(sum, matcher) => sum + this.lendAmount * (matcher.ratio ?? 0),
				0,
			);
			return Math.round(this.lendAmount + matcherTotal);
		},
		formattedLendAmount() {
			return numeral(this.lendAmount).format('0,0');
		},
		formattedMatchedAmount() {
			return numeral(this.matchedAmount).format('0,0');
		},
		formattedNames() {
			const names = this.simultaneousMatching.map(m => m.displayName || 'a Kiva supporter');
			if (names.length === 0) return '';
			if (names.length === 1) return names[0];
			if (names.length === 2) return `${names[0]} and ${names[1]}`;
			const allButLast = names.slice(0, -1).join(', ');
			return `${allButLast}, and ${names[names.length - 1]}`;
		},
	},
};
</script>
