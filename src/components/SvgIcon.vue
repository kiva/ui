<template>
	<svg class="icon" :class="iconClass">
		<use :xlink:href="iconId"/>
	</svg>
</template>

<script>
export default {
	props: {
		name: { type: String, required: true }
	},
	computed: {
		iconClass() {
			return `icon-${this.name}`;
		},
		iconId() {
			return `#icon-${this.name}`;
		},
	},
};
</script>

<style lang="scss">
@import 'settings';

svg.icon {
	fill: none;
	stroke: none;
	-webkit-backface-visibility: hidden;

	&.icon-confirmation,
	&.icon-error,
	&.icon-info,
	&.icon-warning,
	&.icon-question,
	&.icon-magnify-glass,
	&.icon-nearme,
	&.icon-triangle,
	&.icon-globe,
	&.icon-handshake,
	&.icon-sort,
	&.icon-edit,
	&.icon-refresh,
	&.icon-grid,
	&.icon-map,
	&.icon-tags-checkmark,
	&.icon-sector-agriculture,
	&.icon-sector-arts,
	&.icon-sector-clothing,
	&.icon-sector-construction,
	&.icon-sector-education,
	&.icon-sector-entertainment,
	&.icon-sector-food,
	&.icon-sector-health,
	&.icon-sector-housing,
	&.icon-sector-manufacturing,
	&.icon-sector-personal-use,
	&.icon-sector-retail,
	&.icon-sector-services,
	&.icon-sector-transportation,
	&.icon-sector-wholesale {
		fill: $kiva-text-dark;
	}

	&.icon-large-chevron,
	&.icon-large-chevron-mobile,
	&.icon-medium-chevron,
	&.icon-small-chevron,
	&.icon-small-chevron-mobile,
	&.icon-x,
	&.icon-list,
	&.icon-filter {
		stroke: $kiva-text-dark;
	}

	&.icon-distribution {
		color: $kiva-text-dark;
	}

	&.icon-star,
	&.icon-half-star {
		fill: $kiva-bg-darkgray;
		color: $kiva-text-dark;
	}

	&.icon-slideshow-dot {
		stroke: $white;
		fill: $white;
		fill-opacity: 0.3;

		&.active {
			fill-opacity: 1;
		}
	}

	&.icon-facebook,
	&.icon-pinterest,
	&.icon-twitter,
	&.icon-youtube,
	&.icon-linkedIn,
	&.icon-instagram,
	&.icon-yelp {
		color: $gray;
	}

	&.icon-facebook:hover {
		color: $facebook-hover-color;
	}

	&.icon-pinterest:hover {
		color: $pinterest-hover-color;
	}

	&.icon-twitter:hover {
		color: $twitter-hover-color;
	}

	&.icon-youtube:hover {
		color: $youtube-hover-color;
	}

	&.icon-linkedIn:hover {
		color: $linkedin-hover-color;
	}

	&.icon-instagram:hover {
		color: $instagram-hover-color;
	}

	&.icon-yelp:hover {
		color: $yelp-hover-color;
	}

	&.icon-boundaries,
	&.icon-hand-up,
	&.icon-lifting,
	&.icon-recycle,
	&.icon-impact,
	&.icon-high-five,
	&.icon-megaphone,
	&.icon-money-muscle {
		fill: #dbe3e5;
		color: $kiva-green;
	}

	&.icon-choose,
	&.icon-lend,
	&.icon-repaid,
	&.icon-repeat,
	&.icon-apply-circle,
	&.icon-fundraise,
	&.icon-invite {
		fill: $kiva-green;
		color: $kiva-icon-green;
	}

	&.icon-leaf,
	&.icon-leaves {
		fill: $kiva-green;
	}

	&.icon-match {
		fill: $white;
		color: $kiva-icon-green;
	}

	&.icon-pdf {
		fill: #C31B00;
	}

	&.icon-checkbox-bad {
		fill: $kiva-accent-red;
	}

	&.icon-checkbox-good {
		fill: $kiva-green;
	}

	&.icon-curved-arrow {
		fill: $kiva-darkgreen;
	}

	&.icon-new-kiva-logo {
		fill: $kiva-green;
	}

	&.icon-kiva-card {
		fill: $kiva-icon-green;
	}

	&.icon-woman {
		stroke: $kiva-icon-green;
	}

	&.icon-apply,
	&.icon-interview,
	&.icon-matchmaking,
	&.icon-offer,
	&.icon-screen {
		fill: black;
	}
}
</style>
