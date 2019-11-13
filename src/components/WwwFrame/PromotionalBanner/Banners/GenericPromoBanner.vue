<template>
	<div class="row align-center">
		<router-link
			:to="promoBannerContent.link"
			class="banner-link"
			v-kv-track-event="promoBannerContent.kvTrackEvent"
		>
			<div class="content" v-html="richText">
			</div>
		</router-link>
	</div>
</template>

<script>
import { documentToHtmlString } from '~/@contentful/rich-text-html-renderer';

export default {
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
.row {
	margin: 0;
	max-width: 100%;
}

.banner-link {
	display: flex;
	align-items: center;
	color: #484848;

	&:hover {
		color: #63669D;
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
</style>
