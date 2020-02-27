<template>
	<div class="kiva-as-expert-section-wrapper">
		<div class="row">
			<div class="small-12 columns">
				<h2 class="impact-text">
					{{ contentGroup.content.fields.headline }}
				</h2>
			</div>
			<div class="small-12 large-7 columns">
				<div v-html="bodyCopy">
				</div>
				<!--
				<p>
					With more than $1 billion in loans funded, Kiva is a leading global nonprofit creating opportunity
					for communities in need around the world. Your support will help us continue to push boundaries,
					from offering flexible loan terms that help farmers deal with unpredictable weather to providing
					capital to refugees in need of stability.
				</p>
				<kv-responsive-image
					:images="billionImpactImages"
					class="hide-for-large community-image"
					alt=""
				/>
				<p class="join-the-movement">
					Join the movement of over <strong>1.6 million lenders</strong> who’ve supported <strong>2.5 million
					borrowers</strong>.
				</p>
				-->
				<slot name="form"></slot>
			</div>

			<div class="large-5 columns">
				<!-- {{ contentGroup.media.fields.file.url }} -->
				<img v-for="(media, index) in contentGroup.media" :src="media.fields.file.url" :key="index">
				<!-- <kv-responsive-image
					:images="billionImpactImages"
					class="show-for-large community-image"
					alt="10 years and $1 billion in loans funded"
				/> -->
			</div>
		</div>
	</div>
</template>

<script>
// import KvResponsiveImage from '@/components/Kv/KvResponsiveImage';
import { documentToHtmlString } from '~/@contentful/rich-text-html-renderer';

const billionImpactImagesRequire = require.context('@/assets/images/10-years-billion-impact', true);

export default {
	props: {
		contentGroup: {
			type: Object,
			default() {
				return {};
			}
		},
	},
	data() {
		return {
			billionImpactImages: [
				['small', billionImpactImagesRequire('./10-years-billion-impact_ghost.jpg')],
				['small retina', billionImpactImagesRequire('./10-years-billion-impact_2x_ghost.jpg')],
			]
		};
	},
	components: {
		// KvResponsiveImage
	},
	computed: {
		bodyCopy() {
			return documentToHtmlString(this.contentGroup.content.fields.bodyCopy);
		}
	},
};

</script>

<style lang="scss" scoped>
@import 'settings';

.kiva-as-expert-section-wrapper {
	padding: 2rem 0 3rem;
	background-color: $ghost;

	h2 {
		color: $kiva-green;
		margin-bottom: 1.85rem;
	}

	.community-image {
		padding: 1.25rem;
		width: 100%;
	}

	.hide-for-large.community-image {
		max-width: 25rem;
		display: block;
		margin: 0 auto;
	}

	.join-the-movement {
		padding: 1.85rem 0;
	}
}
</style>
