<template>
	<div class="basket-donation-item row">
		<span class="donation-icon">
		</span>
		<span class="small-10 medium-6">
			<div class="donation-info featured-text">
				Donation to Kiva
			</div>
			<div class="small-text">
				Help Kiva reach more borrowers around the world
			</div>
		</span>
		<span class="small-12 medium-4">
			<input type="input" name="donation" id="donation" value="">{{ donation.price }}
			<input class="settings" type="button" value="Update">
		</span>
	</div>
</template>

<script>
export default {
	props: {
		donation: {
			type: Object,
			default: () => {}
		}
	}
};
</script>

<style lang="scss">
@import 'settings';

</style>
