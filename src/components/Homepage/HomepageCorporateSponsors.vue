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
					:class="'sponsors__li--' + image.description"
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
		width: 20rem;
		margin-bottom: 1.5rem;

		@include breakpoint(large) {
			width: 25rem;
		}
	}

	&__headline {
		padding: rem-calc(10);

		@include breakpoint(large) {
			margin-bottom: rem-calc(50);
		}
	}

	&__li {
		// Applies to all sponsor logos
		&--logo {
			margin: rem-calc(60) auto;
		}

		// styling individual sponsor logos
		&--boa-logo {
			width: rem-calc(306);
		}

		&--hitachi-logo {
			width: rem-calc(136);
		}

		&--visa-foundation-logo {
			width: rem-calc(92);
		}

		&--women-and-girls-empowerment-logo {
			width: rem-calc(100);
		}

		&--principal-foundation-logo {
			width: rem-calc(278);
		}

		&--pepsi-foundation-logo {
			width: rem-calc(182);
		}

		&--fossil-foundation-logo {
			width: rem-calc(242);
		}

		&--it-cosmetics-logo {
			width: rem-calc(146);
		}

		&--kate-spade-foundation-logo {
			width: rem-calc(244);
		}

		&--xilinx-logo {
			width: rem-calc(142);
		}
	}

	// Centering the last sponsor logo
	&__li:last-child {
		@include breakpoint(large) {
			margin: 0 auto;
		}
	}
}

</style>
