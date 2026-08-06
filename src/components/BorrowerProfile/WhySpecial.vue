<template>
	<article>
		<h2 class="tw-sr-only">
			Why this loan is special
		</h2>
		<p class="tw-text-headline tw-my-1">
			{{ fullWhySpecial }}
		</p>
	</article>
</template>

<script>
import { formatWhySpecial } from '#src/util/loanUtils';

export default {
	name: 'WhySpecial',
	props: {
		whySpecial: {
			type: String,
			default: '',
		},
	},
	computed: {
		fullWhySpecial() {
			return formatWhySpecial(this.whySpecial);
		}
	},
};
</script>
