<template>
	<footer class="www-footer" :style="cssVars">
		<disclaimers />
		<footer-content :theme="theme" />
	</footer>
</template>

<script>
import Disclaimers from '@/components/WwwFrame/DisclaimersContentful';
import FooterContent from '@/components/WwwFrame/FooterContent';

export default {
	name: 'TheFooter',
	components: {
		Disclaimers,
		FooterContent,
	},
	props: {
		theme: {
			type: Object,
			default: () => {}
		}
	},
	computed: {
		cssVars() {
			if (this.theme) {
				return {
					'--kv-footer-background-color': this.theme.backgroundColor || '',
					'--kv-footer-text-color': this.theme.textColor || '',
					'--kv-footer-link-color': this.theme.linkColor || '',
					'--kv-footer-separator-color': this.theme.separatorColor || '',
				};
			}
			return {};
		}
	}
};
</script>

<style lang="scss">
@import 'settings';

$footer-background-color: $kiva-bg-lightgray;
$footer-text-color: $umbreon;
$footer-link-color: $kiva-darkgreen;
$footer-separator-color: $magnemite;

.www-footer {
	background-color: $footer-background-color; // IE11 fallback
	background-color: var(--kv-footer-background-color, $footer-background-color);
	color: $footer-text-color; // IE11 fallback
	color: var(--kv-footer-text-color, $footer-text-color);
	font-size: rem-calc(14);
	font-weight: normal;
	text-align: center;
	padding: 1rem;
	min-height: 17.5rem;

	@include breakpoint(medium) {
		padding: rem-calc(24);
	}

	@include breakpoint(large) {
		padding: rem-calc(24) 1rem;
		min-height: 25rem;
	}

	@media print {
		padding: 0;
		min-height: auto;
		font-weight: 300;
	}

	ul {
		list-style: none;
		margin: 0;
	}

	p {
		margin-bottom: 0;
		line-height: $small-text-line-height;
	}

	a {
		color: $footer-link-color;
		color: var(--kv-footer-link-color, $footer-link-color);

		&:visited,
		&:active {
			color: $footer-link-color;
			color: var(--kv-footer-link-color, $footer-link-color);
		}
	}

	h2 {
		font-size: 0.875rem;
		font-weight: $global-weight-bold;
		letter-spacing: initial;
		margin: 0;
		line-height: 1.6;
	}

	.download-app-icons li {
		display: inline-block;
	}

	.download-app-android,
	.download-app-ios {
		height: rem-calc(40);
	}

	.download-app-android {
		width: rem-calc(135);
	}

	.download-app-ios {
		width: rem-calc(120);
		margin-right: 0.5rem;
	}

	.small-footer {
		text-align: left;

		ul {
			margin-bottom: 1rem;
		}

		hr {
			margin: 1rem auto 0 auto;
			border-bottom: 1px solid $footer-link-color;
		}

		.kv-accordion {
			border-bottom: 1px solid $footer-link-color;
		}

		&__social-icon-row {
			margin: 0.65rem auto 1rem auto;
		}

		&__social-icon {
			width: rem-calc(24);
			height: rem-calc(24);
			flex-shrink: 0;
			margin-right: rem-calc(26);
			fill: $footer-text-color;
		}
	}

	.large-footer {
		&__block {
			padding: 1rem 0.9375rem;
			text-align: left;
		}

		&__single-line-links--work-with-us {
			max-width: rem-calc(463);
		}
	}

	.large-footer,
	.small-footer {
		&__disclaimer {
			color: $footer-separator-color;
		}

		&__single-line-links {
			$spacing: 0.5rem;

			margin-bottom: 1rem;
			overflow: hidden;
			width: calc(100% + #{$spacing * 2} + 1px);

			li {
				display: inline-block;
				transform: translate3d(calc(-#{$spacing * 2} - 1px), 0, 0); /* stylelint-disable-line */
				a {
					padding-left: $spacing;
					border-left: 1px solid $footer-separator-color; // IE11 fallback
					border-left: 1px solid var(--kv-footer-separator-color, $footer-separator-color);
					margin-left: $spacing;
					white-space: nowrap;
				}
			}
		}

		.download-app-icons {
			margin-top: 1.65rem;
		}
	}

	@media print {
		.expand-for-print {
			width: 100%;
			max-width: 100%;
			flex: 1;
		}
	}
}
</style>
