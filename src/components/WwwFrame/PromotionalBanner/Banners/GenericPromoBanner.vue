<template>
	<div class="row align-center gift-banner">
		<router-link
			:to="promoBannerContent.link"
			class="banner-link"
			v-kv-track-event="promoBannerContent.kvTrackEvent"
		>
			<kv-icon name="present" class="present-icon" />
			<div class="content" v-html="richText">
			</div>
		</router-link>
	</div>
</template>

<script>
import KvIcon from '@/components/Kv/KvIcon';
import { documentToHtmlString } from '~/@contentful/rich-text-html-renderer';

export default {
	components: {
		KvIcon
	},
	props: {
		promoBannerContent: {
			type: Object,
			default() {
				return {
					bannerName: '',
					kvTrackEvent: [],
					link: '',
					richText: {},
				};
			}
		},
	},
	computed: {
		richText() {
			return documentToHtmlString(this.promoBannerContent.richText);
		}
	},
	data() {
		return {
		};
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
	padding: 0.625rem;
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

.gift-banner {
	background-image: url('~@/assets/images/backgrounds/tipbar-bg-small.jpg');
	background-position: bottom;

	.banner-link {
		display: flex;
		align-items: center;
	}
}

.gift-banner .present-icon {
	display: block;
	height: rem-calc(22);
	width: rem-calc(22);
	margin-right: rem-calc(10);
	margin-top: -0.2rem;
}

.gift-banner .banner-link:hover {
	.present-icon {
		stroke: $kiva-darkgreen;
	}
}

</style>
