<template>
	<div class="tw-text-primary tw-text-center">
		<hr class="tw-hidden md:tw-block tw-border-tertiary">
		<a
			class="tw-hidden md:tw-inline tw-text-primary tw-pr-1 tw-font-medium tw-cursor-pointer"
			data-testid="bp-jump-link-borrower-story"
			v-kv-track-event="['Borrower profile', 'click-jump-link', 'Borrower story']"
			@click="scrollToSection('#loanStory')"
		>
			<kv-material-icon
				class="tw-w-3 tw-h-3 tw-my-3 tw-align-middle tw-mr-0.5"
				:icon="mdiAccount"
			/>
			Borrower story
		</a>
		<a
			class="tw-text-primary tw-pl-1 tw-pr-1 tw-font-medium tw-cursor-pointer tw-whitespace-nowrap"
			data-testid="bp-jump-link-loan-details"
			v-kv-track-event="['Borrower profile', 'click-jump-link', 'Loan details']"
			@click="scrollToSection('#loanDetails')"
		>
			<kv-material-icon
				class="tw-w-3 tw-h-3 tw-my-3 tw-align-middle tw-mr-0.5"
				:icon="mdiFormatListBulleted"
			/>
			Loan details
		</a>
	</div>
</template>

<script>
import { mdiAccount, mdiFormatListBulleted } from '@mdi/js';
import smoothScrollMixin from '@/plugins/smooth-scroll-mixin';
import KvMaterialIcon from '~/@kiva/kv-components/vue/KvMaterialIcon';

export default {
	name: 'JumpLinks',
	components: {
		KvMaterialIcon,
	},
	mixins: [smoothScrollMixin],
	data() {
		return {
			mdiAccount,
			mdiFormatListBulleted,
		};
	},
	methods: {
		scrollToSection(sectionId) {
			const elementToScrollTo = document.querySelector(sectionId);
			const topOfSectionToScrollTo = elementToScrollTo?.offsetTop ?? 0;
			this.smoothScrollTo({ yPosition: topOfSectionToScrollTo, millisecondsToAnimate: 750 });
		}
	}
};
</script>
