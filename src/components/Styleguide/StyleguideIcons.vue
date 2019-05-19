<template>
	<!-- TODO: Next steps:
	- Figure out why the linkedIn icon doesn't display
	- Add label to each icon that displays the name
	- Sort the uncatgorized icons further
	- Bonus: set up click interaction that copies entire <kv-icon class="icon" name="NAME" /> to clipboard -->
	<section id="section-icons">
		<h1>Icons</h1>
		<div class="social-icons">
			<h3>Social</h3>
			<kv-icon class="icon" name="youtube" />
			<kv-icon class="icon" name="facebook" />
			<kv-icon class="icon" name="facebook-box-logo" />
			<kv-icon class="icon" name="twitter" />
			<kv-icon class="icon" name="yelp" />
			<kv-icon class="icon" name="instagram" />
			<kv-icon class="icon" name="linkedIn" />
			<kv-icon class="icon" name="pinterest" />
		</div>
		<div class="sector-icons">
			<h3>Sectors</h3>
			<kv-icon class="icon" name="sector-arts" />
			<kv-icon class="icon" name="sector-clothing" />
			<kv-icon class="icon" name="sector-construction" />
			<kv-icon class="icon" name="sector-education" />
			<kv-icon class="icon" name="sector-entertainment" />
			<kv-icon class="icon" name="sector-food" />
			<kv-icon class="icon" name="sector-health" />
			<kv-icon class="icon" name="sector-housing" />
			<kv-icon class="icon" name="sector-manufacturing" />
			<kv-icon class="icon" name="sector-personal-use" />
			<kv-icon class="icon" name="sector-retail" />
			<kv-icon class="icon" name="sector-services" />
			<kv-icon class="icon" name="sector-transportation" />
			<kv-icon class="icon" name="sector-wholesale" />
		</div>
		<div class="credit-card-icons">
			<h3>Credit cards</h3>
			<kv-icon class="icon" name="amex" />
			<kv-icon class="icon" name="visa" />
			<kv-icon class="icon" name="mastercard" />
			<kv-icon class="icon" name="unknown_card" />
		</div>
		<div class="credit-card-icons">
			<h3>Chevrons</h3>
			<kv-icon class="icon" name="small-chevron-mobile" />
			<kv-icon class="icon" name="small-chevron" />
			<kv-icon class="icon" name="medium-chevron" />
			<kv-icon class="icon" name="large-chevron-mobile" />
			<kv-icon class="icon" name="large-chevron" />
		</div>
		<div class="checkbox-icons">
			<h3>Checkbox</h3>
			<kv-icon class="icon" name="check-in-circle" />
			<kv-icon class="icon" name="checkbox-bad" />
			<kv-icon class="icon" name="checkbox-checked" />
			<kv-icon class="icon" name="checkbox-good" />
			<kv-icon class="icon" name="checkbox-rounded-checked" />
			<kv-icon class="icon" name="checkbox-rounded-unchecked" />
			<kv-icon class="icon" name="checkbox-unchecked" />
		</div>
		<div class="grey-border-icons">
			<h3>Grey border</h3>
			<kv-icon class="icon" name="auto-deposit" />
			<kv-icon class="icon" name="boundaries" />
			<kv-icon class="icon" name="goals" />
			<kv-icon class="icon" name="hand-up" />
			<kv-icon class="icon" name="high-five" />
			<kv-icon class="icon" name="impact" />
			<kv-icon class="icon" name="lifting" />
			<kv-icon class="icon" name="megaphone" />
			<kv-icon class="icon" name="money-muscle" />
			<kv-icon class="icon" name="recycle" />
			<kv-icon class="icon" name="updates" />
		</div>
		<div class="green-circle-icons">
			<h3>Green circle</h3>
			<kv-icon class="icon" name="apply-circle" />
			<kv-icon class="icon" name="choose" />
			<kv-icon class="icon" name="fundraise" />
			<kv-icon class="icon" name="invite" />
			<kv-icon class="icon" name="lend" />
			<kv-icon class="icon" name="repaid" />
			<kv-icon class="icon" name="repeat" />
		</div>
		<div class="black-circle-icons">
			<h3>Black circle</h3>
			<kv-icon class="icon" name="apply" />
			<kv-icon class="icon" name="interview" />
			<kv-icon class="icon" name="matchmaking" />
			<kv-icon class="icon" name="offer" />
			<kv-icon class="icon" name="screen" />
		</div>
		<div class="grey-circle-icons">
			<h3>Grey circle</h3>
			<kv-icon class="icon" name="confirmation" />
			<kv-icon class="icon" name="error" />
			<!-- Info and warning are the same icon -->
			<kv-icon class="icon" name="info" />
			<kv-icon class="icon" name="question" />
			<kv-icon class="icon" name="warning" />
		</div>
		<div class="uncategorized-icons">
			<h3>Uncategorized</h3>
			<kv-icon class="icon" name="browse-toggle" />
			<kv-icon class="icon" name="corporate-engagement" />
			<kv-icon class="icon" name="curved-arrow" />
			<kv-icon class="icon" name="dedicate-heart" />
			<kv-icon class="icon" name="distribution" />
			<kv-icon class="icon" name="edit" />
			<kv-icon class="icon" name="email" />
			<kv-icon class="icon" name="filter" />
			<kv-icon class="icon" name="filters-toggle" />
			<kv-icon class="icon" name="filters" />
			<kv-icon class="icon" name="globe" />
			<kv-icon class="icon" name="grants" />
			<kv-icon class="icon" name="grid" />
			<kv-icon class="icon" name="half-star" />
			<kv-icon class="icon" name="handshake" />
			<kv-icon class="icon" name="iwd-flower" />
			<kv-icon class="icon" name="kiva-card" />
			<kv-icon class="icon" name="kiva-promise" />
			<kv-icon class="icon" name="leaf" />
			<kv-icon class="icon" name="leaves" />
			<kv-icon class="icon" name="line-graph" />
			<kv-icon class="icon" name="list" />
			<kv-icon class="icon" name="lock" />
			<kv-icon class="icon" name="magnify-glass" />
			<kv-icon class="icon" name="map" />
			<kv-icon class="icon" name="match" />
			<kv-icon class="icon" name="nearme" />
			<kv-icon class="icon" name="new-kiva-logo" />
			<kv-icon class="icon" name="paypal" />
			<kv-icon class="icon" name="pdf" />
			<kv-icon class="icon" name="pencil" />
			<kv-icon class="icon" name="present" />
			<kv-icon class="icon" name="refresh" />
			<kv-icon class="icon" name="secure-lock" />
			<kv-icon class="icon" name="slideshow-dot" />
			<kv-icon class="icon" name="small-x" />
			<kv-icon class="icon" name="sort" />
			<kv-icon class="icon" name="star" />
			<kv-icon class="icon" name="tags-checkmark" />
			<kv-icon class="icon" name="triangle" />
			<kv-icon class="icon" name="woman" />
			<kv-icon class="icon" name="x" />
		</div>
	</section>
</template>

<script>
import KvIcon from '@/components/Kv/KvIcon';

export default {
	components: {
		KvIcon
	},
};
</script>

<style lang="scss" scoped>
@import 'settings';

.icon {
	height: 5rem;
	width: 5rem;
}
</style>
