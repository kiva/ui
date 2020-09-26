<template>
	<a class="header__card-link" :href="href">
		<div class="row align-middle">
			<div class="small-3 header__card-img">
				<img :src="imgSrc" />
			</div>
			<div class="column small-offset-1 header__card-text">
				<h4>{{ title }}</h4>
				<p>{{ subtitle }}</p>
			</div>
		</div>
	</a>
</template>

<script>
export default {
	props: {
		title: String,
		subtitle: String,
		href: String,
		imgSrc: String,
	},
};
</script>

<style lang="scss" scoped>
@import "settings";
@import "components/15-years/15-years";

.header {
	&__card-link {
		@include link();
	}

	&__card-img {
		width: 100px;
		display: block;
		margin-left: auto;
		margin-right: auto;

		// Phones
		@include breakpoint(small) {
			display: none;
		}

		// Desktop
		@include breakpoint(xga) {
			display: block;
		}
	}
}
</style>
