<template>
	<section>
		<h2 class="tw-mb-2">
			How the Kiva team expands financial access
		</h2>
		<p class="tw-mb-4">
			<!-- eslint-disable-next-line max-len -->
			Kiva's global Investments team of 30+ employees oversees all lending partner relationships to ensure fair and trustworthy lending.
		</p>
		<div class="tw-flex tw-items-center tw-gap-2 tw-mb-2">
			<div class="tw-h-10 tw-w-10">
				<img
					:src="getImage(`${regionFolder}/associate.png`)"
					alt="Manon, Investment Manager for Africa"
				>
			</div>
			<div>
				<p class="tw-text-h3">
					{{ associateNameAndTitle }}
				</p>
			</div>
		</div>
		<p class="tw-mb-4 tw-text-subhead">
			{{ associateQuote }}
		</p>
		<div id="education-photos" class="tw-mb-2">
			<div class="tw-flex tw-items-center tw-w-full tw-overflow-auto tw-gap-2.5">
				<img
					:src="getImage(`${regionFolder}/photo_1.jpg`)"
					:alt="`Borrower photo from ${loanRegion}`"
				>
				<img
					:src="getImage(`${regionFolder}/photo_2.jpg`)"
					:alt="`Borrower photo from ${loanRegion}`"
				>
			</div>
		</div>
		<div
			class="tw-flex tw-flex-col md:tw-flex-row tw-justify-center tw-gap-2
						tw-bg-brand-100 tw-rounded tw-p-2 tw-mb-2"
		>
			<img
				class="tw-w-7 tw-h-7"
				:src="leafHeartUrl"
				alt="donation line item image"
			>
			<!-- eslint-disable-next-line max-len -->
			<p>None of this work would be possible without donations from lenders like you. Thank you for continuing to support {{ splitName(associateNameAndTitle) }} and the Kiva team! </p>
		</div>
	</section>
</template>

<script>
import { metaGlobReader } from '#src/util/importHelpers';
import leafHeartUrl from '#src/assets/images/leaf_heart.svg?url';

const imageRequire = import.meta.glob('#src/assets/images/borrower-profile/education-placement/*.*', {
	eager: true,
	query: '?url',
});
const images = metaGlobReader(imageRequire, '#src/assets/images/borrower-profile/education-placement/');

export default {
	name: 'BorrowerEducationPlacement',
	data() {
		return {
			leafHeartUrl,
		};
	},
	props: {
		loanRegion: {
			type: String,
			default: ''
		}
	},
	methods: {
		getImage(path) {
			return images(path);
		},
		splitName(value) {
			return value.split(',')[0];
		},
	},
	computed: {
		associateNameAndTitle() {
			const region = this.loanRegion.toLowerCase();
			if (region === 'africa') {
				return 'Manon, Investment Manager for Africa';
			} if (region === 'north america') {
				return 'Eli, Director of Kiva U.S.';
			} if (['europe', 'asia'].includes(region)) {
				return 'Kendra, Investment Director for Europe & Asia';
			}

			return 'Patrick, Investment Manager for Latin America';
		},
		regionFolder() {
			const region = this.loanRegion.toLowerCase().replace(' ', '-');
			if (['europe', 'asia'].includes(region)) {
				return 'europe-asia';
			} if (['central-america', 'south-america'].includes(region)) {
				return 'central-south-america';
			}

			return region;
		},
		associateQuote() {
			const region = this.loanRegion.toLowerCase();
			if (region === 'africa') {
				// eslint-disable-next-line max-len
				return "“Being able to visit to the communities we serve is invaluable. It not only allows us to witness Kiva's real-world impact in people's lives, but it also deepens our relationships with our partners and helps us to better understand the realities that borrowers face so that we can better serve them.“";
			} if (region === 'north america') {
				// eslint-disable-next-line max-len
				return '“Kiva’s impact in the U.S. is built on the strong relationships we cultivate with community partners who champion borrowers and their businesses. The work we do on the Kiva US team to empower and support these partners forms the very foundation of our mission, enabling us to expand our reach and transform lives within these communities.”';
			} if (['europe', 'asia'].includes(region)) {
				// eslint-disable-next-line max-len
				return "“Part of my team's focus is evaluating and monitoring the client protection practices that our Lending Partners have in place to ensure that borrowers’ rights are prioritized. We make sure borrowers only receive loans that they have the capacity to repay and are not subject to predatory lending practices, so that the only experience they have with their loan is a positive one.”";
			}

			// eslint-disable-next-line max-len
			return '“As Investment Managers, we work on finding innovative solutions that can scale our impact to more communities. For example, working with nontraditional partners to expand our reach to Venezuelan refugees, or creating a collaboration between smallholder farmers in Peru and a European foundation leveraging blockchain tools to help them access international markets.”';
		},

	}
};
</script>

<style lang="postcss" scoped>

	#education-photos {
		@apply tw-relative tw-w-full tw-h-full;
	}

	#education-photos::before {
		content: '';
		@apply tw-absolute tw-top-0 tw-right-0 tw-w-2 tw-h-full tw-bg-gradient-to-r tw-from-transparent tw-to-secondary;
	}

	#education-photos img {
		@apply tw-rounded;

		width: 264px;
		height: 160px;

		@screen md {
			width: 363px;
			height: 220px;
		}
	}

</style>
