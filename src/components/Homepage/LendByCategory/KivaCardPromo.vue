<template>
	<div class="row kiva-card-promo">
		<div class="small-12 xlarge-5 columns">
			<img
				class="kiva-card-promo__img"
				src="@/assets/images/holiday2020/kiva-card-promo.svg"
				loading="lazy"
				alt=""
				width="237"
				height="336"
			>
		</div>

		<div class="small-12 xlarge-7 columns">
			<h2 class="kiva-card-promo__header">
				{{ headline }}
			</h2>
			<div class="row">
				<div class="large-10 columns kiva-card-promo__body" v-html="bodyCopy"></div>
			</div>
			<kv-button
				class="rounded"
				:to="primaryCtaLink"
				v-kv-track-event="[
					'homepage',
					'click-kiva-card-promo',
					primaryCtaText
				]"
			>
				{{ primaryCtaText }}
			</kv-button>
		</div>
	</div>
</template>

<script>
import KvButton from '@/components/Kv/KvButton';
import { documentToHtmlString } from '~/@contentful/rich-text-html-renderer';

export default {
	name: 'KivaCardPromo',
	components: {
		KvButton,
	},
	props: {
		promoContent: {
			type: Object,
			default() { return {}; }
		}
	},
	computed: {
		bodyCopy() {
			return documentToHtmlString(this.promoContent.bodyCopy);
		},
		headline() {
			return this.promoContent.headline;
		},
		primaryCtaLink() {
			return this.promoContent.primaryCtaLink;
		},
		primaryCtaText() {
			return this.promoContent.primaryCtaText;
		},
	},
};
</script>

<style lang="scss" scoped>
@import "settings";

.kiva-card-promo {
	&__header {
		font-weight: bold;
		margin-top: rem-calc(20);

		@include breakpoint(large) {
			@include large-text();
		}
	}

	&__body {
		margin-bottom: 1rem;
	}

	&__img {
		display: block;
		width: rem-calc(236);
		margin: 0 auto;

		@include breakpoint(xlarge) {
			margin: 0 auto 0 0;
			width: rem-calc(333);
		}
	}
}
</style>
