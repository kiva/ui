<template>
	<www-page id="borrower-profile">
		<!--There was a slight difference between the max-width defintions in the figma file
		and what we have available from tailwinds.

		Mock defintion:
		Medium screen:
		max-width: 919px -> 57.44rem

		Large screen:
		max-width: 1200px -> 75rem

		I used the closest tailwinds classes to these max-width definitions

		Tailwinds classes used:
		Medium screen:
		max-w-4xl = max-width: 56rem;

		Large screen:
		max-w-6xl = max-width: 72rem;

		-->
		<div class="grid-cols-12 mx-5 md:mx-8 lg:mx-16 md:max-w-4xl lg:max-w-6xl flex-auto">
			Borrower profile frame
		</div>
	</www-page>
</template>

<script>
import WwwPage from '@/components/WwwFrame/WwwPage';

export default {
	components: {
		WwwPage,
	},
	data() {
		return {

		};
	}
};
</script>
