<template>
	<section class="section sponsors tw-text-center">
		<div class="row">
			<div class="small-12 columns">
				<img
					:src="sponsorsSectionImg.file.url"
					class="sponsors__section-img"
				>
				<p
					v-html="sponsorsHeadline"
					class="sponsors__headline"
				>
				</p>
			</div>
		</div>
		<ul class="sponsors__list row">
			<li
				v-for="image in sponsorImages"
				:key="image.title"
				class="sponsors__li small-12 large-4 columns"
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
	padding: 2rem 0;

	&__section-img {
		width: rem-calc(220);
		margin: 0 2.5rem 2.5rem 2.5rem;

		@include breakpoint(large) {
			width: rem-calc(320);
		}
	}

	&__headline {
		padding: 0 rem-calc(10);
		margin-bottom: 0;
		font-size: rem-calc(22);
		font-weight: 600;

		@include breakpoint(large) {
			font-size: rem-calc(36);
			margin-bottom: 1rem;
		}
	}

	&__li {
		// Applies to all sponsor logos
		&--logo {
			margin: rem-calc(32) 0;

			@include breakpoint(large) {
				margin: rem-calc(64) 0;
			}
		}

		// styling individual sponsor logos
		&--boa-logo {
			width: rem-calc(240);

			@include breakpoint(large) {
				width: rem-calc(306);
			}
		}

		&--hitachi-logo {
			width: rem-calc(136);
		}

		&--visa-foundation-logo {
			width: rem-calc(95);
		}

		&--women-and-girls-empowerment-logo {
			width: rem-calc(100);
		}

		&--principal-foundation-logo {
			width: rem-calc(278);
		}

		&--pepsi-foundation-logo {
			width: rem-calc(134);

			@include breakpoint(large) {
				width: rem-calc(182);
			}
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
