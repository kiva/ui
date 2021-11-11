<template>
	<div class="tw-text-primary tw-text-center">
		<hr class="tw-border-tertiary">
		<a
			class="tw-text-primary tw-mr-2.5"
			v-kv-track-event="['Borrower profile', 'click-jump-link', 'Borrower story']"
			@click="scrollToSection('#loanStory')"
		>
			<kv-material-icon
				class="tw-my-3 tw-align-middle"
				:icon="mdiAccount"
			/>
			Borrower story
		</a>
		<a
			class="tw-text-primary tw-mr-2.5"
			v-kv-track-event="['Borrower profile', 'click-jump-link', 'Loan details']"
			@click="scrollToSection('#loanDetails')"
		>
			<kv-material-icon
				class="tw-my-3 tw-align-middle"
				:icon="mdiFormatListBulleted"
			/>
			Loan details
		</a>
	</div>
</template>

<script>
import { mdiAccount, mdiFormatListBulleted } from '@mdi/js';
import KvMaterialIcon from '~/@kiva/kv-components/vue/KvMaterialIcon';

export default {
	components: {
		KvMaterialIcon,
	},
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
			window.scrollTo({
				// 50 (to compensate for the height of the top nav) + top of the section to be scrolled to
				// leaves the user on the correct section of the page when a jump link is clicked
				top: 50 + topOfSectionToScrollTo,
				behavior: 'smooth'
			});
		}
	}
};
</script>
