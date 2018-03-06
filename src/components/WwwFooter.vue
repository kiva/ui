<template>
	<footer class="www-footer">
		<nav class="small-footer hide-for-large">
			<ul>
				<li><router-link to="">Borrow</router-link></li>
				<li><router-link to="">About</router-link></li>
				<li><router-link to="">Help</router-link></li>
				<li><router-link to="">Careers</router-link></li>
				<li><router-link to="">Site map</router-link></li>
			</ul>
			<div>
				<router-link to="">Privacy policy</router-link> | <router-link to="">Terms of use</router-link>
			</div>
			<p>
				Lending through Kiva involves risk of principal loss.
				Kiva does not guarantee repayment or offer a financial return on your loan.
				<br>
				&copy; {{ year }} Kiva. All rights reserved.
			</p>
		</nav>
		<nav class="large-footer show-for-large">
			<div class="groups">
				<div class="narrow">
					<h1>Borrow</h1>
					<p>Loans for entrepreneurs doing amazing things.</p>
					<ul>
						<li><router-link to="">Apply now</router-link></li>
					</ul>
				</div>
				<div class="narrow">
					<h1>Explore</h1>
					<ul>
						<li><router-link to="">Gifts</router-link></li>
						<li><router-link to="">Happening now</router-link></li>
						<li><router-link to="">Site map</router-link></li>
						<li><router-link to="">Developer API</router-link></li>
						<li><router-link to="">Privacy policy</router-link></li>
						<li><router-link to="">Terms of use</router-link></li>
					</ul>
				</div>
				<div class="narrow">
					<h1>Get to know us</h1>
					<ul>
						<li><router-link to="">About us</router-link></li>
						<li><router-link to="">How Kiva works</router-link></li>
						<li><router-link to="">FAQs</router-link></li>
						<li><router-link to="">Where Kiva works</router-link></li>
						<li><router-link to="">Blog</router-link></li>
						<li><router-link to="">Partner with us</router-link></li>
						<li><router-link to="">Contact us</router-link></li>
						<li><router-link to="">Help</router-link></li>
					</ul>
				</div>
				<div class="narrow">
					<h1>Community</h1>
					<ul>
						<li><router-link to="">Teams</router-link></li>
						<li><router-link to="">Students and educators</router-link></li>
					</ul>
				</div>
				<div class="wide">
					<p>
						Kiva is a 501(c)3 U.S. nonprofit fueled by passionate people.
						Founded in 2005, and based in San Francisco, with offices in Nairobi and staff around the globe.
						<router-link to="">Donate to our operating expenses.</router-link>
					</p>
				</div>
				<div class="work-with-us wide">
					<h1>Work with us</h1>
					<ul>
						<li><router-link to="">Careers</router-link></li>
						<li><router-link to="">Volunteer internships</router-link></li>
						<li><router-link to="">Kiva fellows</router-link></li>
						<li><router-link to="">Review and translation</router-link></li>
						<li><router-link to="">Trustees</router-link></li>
					</ul>
				</div>
				<div class="wide">
					<p>
						Lending through Kiva involves risk of principal loss.
						Kiva does not guarantee repayment or offer a financial return on your loan.
						<br><br>
						&copy; {{ year }} Kiva. All rights reserved.
					</p>
				</div>
			</div>
		</nav>
	</footer>
</template>

<script>
import { getYear } from 'date-fns';

export default {
	data() {
		return {
			year: getYear(new Date()),
		};
	},
};
</script>

<style lang="scss">
@import 'settings';

@mixin left-line {
	padding-left: 0.5rem;
	border-left: 1px solid $white;
	margin-left: 0.5rem;
}

@mixin no-left-line {
	padding-left: 0;
	border-left: none;
	margin-left: 0;
}

.www-footer {
	background-color: $kiva-darkgreen;
	color: $white;
	// font-size: $small-font-size;
	// line-height: $small-line-height;
	text-align: center;
	padding: 1rem;

	@include breakpoint(medium) {
		padding: rem-calc(40);
	}

	@include breakpoint(large) {
		padding: rem-calc(40) 1rem;
	}

	ul {
		list-style: none;
		margin: 0;
	}

	p {
		margin-bottom: 0;
		// font-size: $small-font-size;
		// line-height: $small-line-height;
		font-weight: normal;
	}

	a {
		color: $kiva-accent-green;
		// font-size: $small-font-size;
		// line-height: $small-line-height;

		&:visited,
		&:active {
			color: $kiva-accent-green;
		}

		@include breakpoint(medium only) {
			// font-size: $body-font-size;
			// line-height: $body-line-height;
		}
	}

	h1 {
		// color: $white;
		// font-size: $small-font-size;
		// font-weight: bold;
		// line-height: $small-line-height;
		margin: 0;
	}

	.small-footer {
		ul {
			// display: flex;
			// justify-content: space-between;
			margin: 0 0 1rem;
			border-bottom: 1px solid $kiva-stroke-gray;
		}
	}

	.groups {
		display: flex;
		flex-flow: column wrap;
		justify-content: space-between;
		height: rem-calc(360);
		text-align: left;

		.narrow {
			width: 25%;
		}

		.wide {
			width: 50%;
		}

		// a {
		// 	line-height: 2;
		// }
		//
		// p a {
		// 	line-height: $small-line-height;
		// }
	}
}
//
// 	.work-with-us {
// 		a {
// 			@include left-line;
//
// 			white-space: nowrap;
// 		}
//
// 		li {
// 			display: inline-block;
// 			float: left;
//
// 			&:first-child a {
// 				@include no-left-line;
// 			}
//
// 			&:nth-child(3) {
// 				clear: both;
//
// 				a {
// 					@include no-left-line;
// 				}
// 			}
// 		}
// 	}
// }
//
// @media #{$small-only}, #{$medium-only} {
// 	.www-footer {
// 		padding: 1rem;
// 	}
//
// 	.siteFooter-nav {
// 		.siteFooter-links {
// 			border-bottom: white 1px solid;
// 			list-style-type: none;
// 			margin-left: 0;
// 			padding-bottom: rem-calc(40);
// 			text-align: center;
//
// 			> li {
// 				float: left;
// 			}
// 		}
//
// 		li:first-of-type {
// 			text-align: left;
// 		}
//
// 		li:last-of-type {
// 			text-align: right;
// 		}
//
// 		.siteFooter-policy {
// 			text-align: center;
// 			margin-bottom: rem-calc(40);
// 		}
//
// 		.siteFooter-legal {
// 			text-align: center;
// 		}
//
// 		.siteFooter-privacy {
// 			border-right: $white 1px solid;
// 			padding-right: rem-calc(20);
// 			margin-right: rem-calc(13);
// 		}
// 	}
// }
//
// @media #{$xxlarge-up} {
// 	.www-footer .work-with-us li:nth-child(3) {
// 		clear: none;
//
// 		a {
// 			@include left-line;
// 		}
// 	}
// }
//
// @media only screen and (min-width: 681px) and (max-width: 721px) {
// 	.www-footer .work-with-us li:nth-child(5) {
// 		clear: both;
//
// 		a {
// 			@include no-left-line;
// 		}
// 	}
// }
//
// @media only screen and (min-width: 989px) and (max-width: 1015px) {
// 	.www-footer .work-with-us li:nth-child(4) {
// 		clear: both;
//
// 		a {
// 			@include no-left-line;
// 		}
// 	}
// }
//
// @media only screen and (min-width: 1015px) {
// 	.www-footer .work-with-us li:nth-child(5) {
// 		clear: both;
//
// 		a {
// 			@include no-left-line;
// 		}
// 	}
// }
</style>
