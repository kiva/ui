<template>
	<www-page id="borrower-profile">
		<div class="container">
			<div class="grid grid-cols-12 gap-x-2">
				<div class="col-span-12 md:col-start-2 md:col-span-10 lg:col-span-7">
					Borrower details
				</div>
				<div class="col-span-12 md:col-start-6 md:col-span-6 lg:col-span-5">
					Powered by lenders info
				</div>
			</div>
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
