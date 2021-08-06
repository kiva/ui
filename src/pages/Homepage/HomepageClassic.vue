<template>
	<www-page id="homepage"
		:header-theme="headerTheme"
	>
		<!-- Headline CTA -->

		<!-- Category loan card carousell -->

		<!-- How it works (4 step) -->

		<!-- Loan not donation -->

		<!-- Kiva community stats -->

		<!-- Community testimonial cards -->

		<!-- Bottom CTA -->
	</www-page>
</template>

<script>
import { lightHeader } from '@/util/siteThemes';
import WwwPage from '@/components/WwwFrame/WwwPage';

export default {
	components: {
		WwwPage,
	},
	data() {
		return {
			headerTheme: lightHeader,
		};
	},
	created() {
		// Apollo contentful query here
	},
	mounted() {
		// Fire page level tracking data here
	}
};
</script>
