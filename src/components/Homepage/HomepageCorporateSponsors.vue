<template>
	<section class="section sponsors bold text-center large-text">
		<img
			:src="sponsorsSectionImg.file.url"
			class="sponsors__section-img"
		>
		<p
			v-html="sponsorsHeadline"
			class="sponsors__headline"
		>
		</p>
		<ul class="sponsors__list row">
			<li
				v-for="image in sponsorImages"
				:key="image.title"
				class="sponsors__li small-6 large-4 columns"
			>
				<img
					:src="image.url"
					:alt="image.description"
					class="sponsors__li--logo"
					loading="lazy"
				>
			</li>
		</ul>
	</section>
</template>

<script>

export default {
	props: {
		content: {
			type: Object,
			default: () => {},
		},
	},
	computed: {
		sponsorsSectionImg() {
			const images = this.content?.media ?? [];
			const sectionImage = images?.find(({ title }) => title.indexOf('corporate-sponsor-section-img') > -1);
			return sectionImage;
		},
		sponsorsHeadline() {
			// eslint-disable-next-line max-len
			const sectionText = this.content?.contents?.filter(({ key }) => key.indexOf('corporate-sponsor-section-text') > -1);
			return sectionText[0]?.headline;
		},
		sponsorImages() {
			const images = this.content?.media ?? [];
			const sponsorImages = images?.filter(({ title }) => title.indexOf('sponsor-image') > -1);
			return sponsorImages.map(image => ({
				description: image?.description ?? '',
				title: image?.title ?? '',
				url: image?.file?.url ?? ''
			}));
		}
	}

};
</script>

<style lang="scss" scoped>
@import 'settings';

.sponsors {
	&__section-img {
		max-width: rem-calc(400);
	}

	&__headline {

	}

	&__li {
		margin: 0 auto;

		&--logo {
			width: 100px;
		}
	}
}

</style>
