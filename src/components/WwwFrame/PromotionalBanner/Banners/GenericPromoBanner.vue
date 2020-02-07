<template>
	<div class="row align-center generic-banner">
		<router-link
			:to="promoBannerContent.link"
			class="banner-link"
			v-kv-track-event="promoBannerContent.kvTrackEvent"
		>
			<kv-icon :name="iconKey" :class="`${iconKey}-icon`" />
			<div class="content" v-html="promoBannerContent.richText">
			</div>
		</router-link>
	</div>
</template>

<script>
import KvIcon from '@/components/Kv/KvIcon';

export default {
	components: {
		KvIcon
	},
	props: {
		iconKey: {
			type: String,
			default: ''
		},
		promoBannerContent: {
			type: Object,
			default() {
				return {
					kvTrackEvent: [],
					link: '',
					richText: '',
				};
			}
		},
	},
};
</script>

<style  lang="scss" scoped>
@import 'settings';

.row {
	margin: 0;
	max-width: 100%;
}

.banner-link {
	color: $kiva-icon-green;
	text-decoration: none;
	text-align: center;
	padding: 0.365rem;
	line-height: 1.25;

	&:hover,
	&:active {
		color: $kiva-darkgreen;
	}
}

.content {
	text-align: center;
	display: block;
	// contentful rich text content is wrapped in a p tag, this removes all styles from it
	::v-deep p {
		display: inline;
		margin: 0;
		padding: 0;
	}
}

.generic-banner {
	background-image: url('~@/assets/images/backgrounds/tipbar-bg-small.jpg');
	background-position: bottom;

	.banner-link {
		display: flex;
		align-items: center;
	}

	.icon-info,
	.icon-kiva-card,
	.icon-monthly-good,
	.icon-confirmation,
	.icon-question {
		fill: $kiva-icon-green;
	}
}

.generic-banner [class*="-icon"] {
	display: block;
	height: rem-calc(22);
	width: rem-calc(22);
	margin-right: rem-calc(10);
	margin-top: -0.2rem;
}

.generic-banner .banner-link:hover {
	[class*="-icon"] {
		stroke: $kiva-darkgreen;
	}

	.icon-info,
	.icon-kiva-card,
	.icon-monthly-good,
	.icon-confirmation,
	.icon-question {
		fill: $kiva-darkgreen;
		stroke: none;
	}

	.icon-iwd-flower {
		stroke: none;
	}
}

</style>
