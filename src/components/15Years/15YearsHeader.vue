<template>
	<div class="header section">
		<div class="header__main-section">
			<div class="row align-middle">
				<div class="header__text small-12 large-4 columns">
					<h1 class="header__headline">
						<span class="header__headline-stroked no-wrap"
							>Power in</span
						>
						Numbers
					</h1>
					<p>
						{{ mainTextSubtitle }}
					</p>
					<fifteen-years-button to="/help/">
						{{ buttonCTAText }}
					</fifteen-years-button>
				</div>

				<div
					class="header__globe small-12 large-offset-2 large-6 columns"
				>
					<img
						class="header__globe-img"
						width="503"
						height="503"
						src="@/assets/images/15-years/temp/globe.png"
						alt=""
					/>
				</div>
			</div>
		</div>
		<div class="header__cards-section">
			<div class="row">
				<div
					class="small-12 large-4 column"
					v-for="item in cardData"
					v-bind:key="item.href"
				>
					<FifteenYearsHeaderCard
						:title="item.title"
						:subtitle="item.subtitle"
						:href="item.href"
						:imgSrc="item.imgSrc"
					/>
				</div>
			</div>
		</div>
	</div>
</template>

<script>
import FifteenYearsButton from "./15YearsButton";
import FifteenYearsHeaderCard from "./15YearsHeaderCard.vue";

export default {
	components: {
		FifteenYearsButton,
		FifteenYearsHeaderCard,
	},
	props: {
		mainTextSubtitle: String,
		buttonCTAText: String,
		cardData: Object,
	},
};
</script>

<style lang="scss" scoped>
@import "settings";
@import "components/15-years/15-years";

.header {
	background: $offwhite;
	position: relative;
	z-index: 1;

	&__headline {
		@include huge-headline();
	}

	&__globe-img {
		width: 100%;
		max-width: rem-calc(615);
		margin: 2rem auto 0;
	}

	&__headline-stroked {
		-webkit-text-stroke: 1px $body-font-color;
		-webkit-text-fill-color: $offwhite;
	}

	&__main-section {
		display: flex;
		flex: 1;
		flex-direction: row;
	}

	&__cards-section {
		display: flex;
		flex-direction: row;
		align-items: bottom;
		padding: rem-calc(16) 0;
		justify-content: space-between;
		background-color: rgba(255, 255, 255, 0.75);

		.row {
			max-width: 90%;
			width: 90%;
		}

		// TODO: Vertical line separator between info cards via pseudo-selector
		/* 
		.align-middle:after {
			content: "";
			border-left: solid 1px black;
			height: 75px;
			margin-top: auto;
			margin-bottom: auto;
		} */
	}
}
</style>
