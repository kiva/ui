<template>
	<div class="basket-item-wrapper">
		<checkout-item-img
			:loan-id="loan.id"
			:name="loan.loan.name"
			:image-url="loan.loan.image.url"
		/>

		<span class="small-10 loan-info">
			<div class="borrower-info featured-text">
				{{ loan.loan.name }} in {{ loan.loan.geocode.country.name }}
				<div class="matching-info small-text">Matched by MATCHERSNAME</div>
			</div>
			<span class="">
				<!-- Make this a component -->
				<div class="reservation-info small-text">Reserved for ## more minutes</div>
				<!-- Make this a component -->
				<input class="loan-price" type="select">{{ loan.price }}
			</span>
		</span>
	</div>
</template>

<script>
import CheckoutItemImg from '@/components/Checkout/CheckoutItemImg';

export default {
	components: {
		CheckoutItemImg
	}
};

</script>
