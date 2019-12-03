<template>
	<div>
		<ol class="reward-list row">
			<li
				v-for="(reward, index) in rewards"
				:key="`day-${index}`"
				class="columns small-12 medium-6 large-4 xxlarge-3"
			>
				<div
					v-if="isPast(index)"
					class="reward reward--past hide-for-small-only"
					:class="rewardColorClass(index)"
				>
					<div class="folded-corner"></div>
					<component :is="numberComponent(index)" class="number" />
				</div>
				<button
					v-else-if="isPresent(index)"
					class="reward reward--present"
					:class="rewardColorClass(index)"
					@click="showReward"
				>
					<SquigglyLine class="squiggly-line" />
					<StarBig class="star-big" />
					<StarLittle class="star-little" :class="starPositionClass(index)" />
					<component :is="numberComponent(index)" class="number" />
					<router-link
						v-if="promoEnabled"
						:to="reward.url"
						class="reward-link"
					>
						<p class="body-text">
							Today: {{ reward.text }}
						</p>
						<div class="body-cta">
							{{ reward.ctaText }}
						</div>
					</router-link>
					<div
						v-else
						class="reward-link"
					>
						<p class="body-text">
							Today: {{ reward.text }}
						</p>
						<div class="body-cta">
							SOLD OUT
						</div>
					</div>
				</button>
				<div v-else class="reward" :class="rewardColorClass(index)">
					<SquigglyLine class="squiggly-line" />
					<StarLittle class="star-little" :class="starPositionClass(index)" />
					<component :is="numberComponent(index)" class="number" />
				</div>
			</li>
		</ol>

		<svg width="0" height="0">
			<defs>
				<linearGradient id="shinygold" x1="0%" y1="0%" x2="100%" y2="160%">
					<stop offset="0%" stop-color="#d1ba6e" />
					<stop offset="20%" stop-color="#ebe080" />
					<stop offset="40%" stop-color="#d1ba6e" />
					<stop offset="60%" stop-color="#ebe080" />
					<stop offset="80%" stop-color="#d1ba6e" />
					<stop offset="100%" stop-color="#ebe080" />
				</linearGradient>
			</defs>
		</svg>
	</div>
</template>

<script>
import Number1 from '@/assets/inline-svgs/12-days-of-lending/1.svg';
import Number2 from '@/assets/inline-svgs/12-days-of-lending/2.svg';
import Number3 from '@/assets/inline-svgs/12-days-of-lending/3.svg';
import Number4 from '@/assets/inline-svgs/12-days-of-lending/4.svg';
import Number5 from '@/assets/inline-svgs/12-days-of-lending/5.svg';
import Number6 from '@/assets/inline-svgs/12-days-of-lending/6.svg';
import Number7 from '@/assets/inline-svgs/12-days-of-lending/7.svg';
import Number8 from '@/assets/inline-svgs/12-days-of-lending/8.svg';
import Number9 from '@/assets/inline-svgs/12-days-of-lending/9.svg';
import Number10 from '@/assets/inline-svgs/12-days-of-lending/10.svg';
import Number11 from '@/assets/inline-svgs/12-days-of-lending/11.svg';
import Number12 from '@/assets/inline-svgs/12-days-of-lending/12.svg';
import SquigglyLine from '@/assets/inline-svgs/12-days-of-lending/squiggly_line.svg';
import StarBig from '@/assets/inline-svgs/12-days-of-lending/star_big.svg';
import StarLittle from '@/assets/inline-svgs/12-days-of-lending/star_little.svg';

export default {
	components: {
		Number1,
		Number2,
		Number3,
		Number4,
		Number5,
		Number6,
		Number7,
		Number8,
		Number9,
		Number10,
		Number11,
		Number12,
		SquigglyLine,
		StarBig,
		StarLittle,
	},
	props: {
		adventDay: {
			type: Number,
			default: 1
		},
		promoEnabled: {
			type: Boolean,
			default: false
		}
	},
	data() {
		return {
			/* eslint-disable max-len */
			rewards: [
				{
					text: 'Invite someone special to Kiva using your unique share link!',
					url: '/portfolio/invites',
					ctaText: 'Share Kiva',
					starPosition: 'top-left'
				},
				{
					text: 'Make a donation of $50 or more and get a $25 lending credit while funds last. Courtesy of Bank of America.',
					url: '/donate/supportus',
					ctaText: 'Donate now',
					starPosition: 'bottom-left'
				},
				{
					text: 'Join a lending team if you haven\'t already!',
					url: '/donate/supportus',
					ctaText: 'Join a team',
					starPosition: 'top-right'
				},
				{
					text: 'Make a matched loan to a student, while funds last!',
					url: '/lend-by-category/education',
					ctaText: 'Lend now',
					starPosition: 'bottom-left'
				},
				{
					text: 'Make a donation of $35 or more and get a $25 lending credit while funds last!',
					url: '/donate/supportus',
					ctaText: 'Donate now',
					starPosition: 'top-right'
				},
				{
					text: 'Make a donation of $150 dollars or more during December and receive exclusive beta access to our iOS app before it launches for the public in March!',
					url: '/donate/supportus',
					ctaText: 'Donate now',
					starPosition: 'top-left'
				},
				{
					text: 'Make a matched loan to US borrowers while funds last!',
					url: '/lend-by-category/kiva-u-s',
					ctaText: 'Lend now',
					starPosition: 'top-right'
				},
				{
					text: 'Make a $100 donation, get a $50 lending credit!',
					url: '/donate/supportus',
					ctaText: 'Lend now',
					starPosition: 'top-left'
				},
				{
					text: 'Give the gift of lending and buy a Kiva Card for someone special!',
					url: '/gifts/kiva-cards',
					ctaText: 'Give a Kiva Card',
					starPosition: 'bottom-left'
				},
				{
					text: 'Make a donation of $250 or more, get a tote bag and a $50 lending credit, while funds last',
					url: '/donate/supportus',
					ctaText: 'Donate now',
					starPosition: 'top-left'
				},
				{
					text: 'Make a matched loan to a refugee while funds last!',
					url: '/lend-by-category/refugees-and-i-d-ps',
					ctaText: 'Lend now',
					starPosition: 'bottom-left'
				},
				{
					text: 'Lend to a borrower in a country that is special to you!',
					url: '/lend/filter',
					ctaText: 'Lend now',
					starPosition: 'top-right'
				}
			]
		};
		/* eslint-enable max-len */
	},
	methods: {
		isPast(index) {
			return this.adventDay > index + 1;
		},
		isPresent(index) {
			return this.adventDay === index + 1;
		},
		numberComponent(index) {
			return `Number${index + 1}`;
		},
		rewardColorClass(index) {
			const colors = ['green', 'blue', 'red'];
			return `reward--${colors[index % 3]}`;
		},
		starPositionClass(index) {
			return `star-little--${this.rewards[index].starPosition}`;
		},
		showReward(e) {
			const { currentTarget } = e;
			currentTarget.classList.add('reward--showing');
			currentTarget.disabled = true;
		}
	}
};
</script>

<style lang="scss" scoped>
$green: #02582e;
$dark_green: #0b2a0d;
$red:#611b15;
$dark_red: #2e0004;
$blue: #015a76;
$dark_blue: #00244e;
$gold: #ebdf7f;

@keyframes spin {
	from {
		transform: rotate(0deg);
	}

	to {
		transform: rotate(360deg);
	}
}

.folded-corner {
	$corner-size: 5rem;

	position: absolute;
	top: 0;
	left: 0;
	width: $corner-size;
	height: $corner-size;
	border-style: solid;
	border-width: $corner-size $corner-size 0 0;
	border-color: #fff #000 transparent transparent;
}

.star-big {
	width: 75%;
	position: absolute;
}

.star-little {
	$star_margin: 1.5rem;

	width: 1.5rem;
	position: absolute;

	path {
		fill: url('#shinygold');
	}

	&--top-left {
		top: $star_margin;
		left: $star_margin;
	}

	&--top-right {
		top: $star_margin;
		right: $star_margin;
	}

	&--bottom-left {
		bottom: $star_margin;
		left: $star_margin;
	}

	&--bottom-right {
		top: $star_margin;
		right: $star_margin;
	}
}

.squiggly-line {
	width: 150%;
	position: absolute;
}

.number {
	height: 7rem;
	position: absolute;
}

.body-text,
.body-cta {
	display: none;
	font-weight: bold;
	line-height: 1.35;
}

a .body-cta::after {
	content: ' »';
}

.reward-list {
	list-style: none;
	padding: 0;
	margin: 0;

	.columns {
		padding: 0.25rem;
	}
}

.reward {
	display: flex;
	width: 100%;
	align-items: center;
	justify-content: center;
	text-align: center;
	padding: 1rem;
	position: relative;
	overflow: hidden;

	&--past {
		.number {
			opacity: 0.35;
		}
	}

	&--red {
		background-color: $dark_red;

		.folded-corner {
			border-color: #fff $red transparent transparent;
		}

		.number path,
		.squiggly-line path {
			fill: $red;
		}
	}

	&--green {
		background-color: $dark_green;

		.folded-corner {
			border-color: #fff $green transparent transparent;
		}

		.number path,
		.squiggly-line path {
			fill: $green;
		}
	}

	&--blue {
		background-color: $dark_blue;

		.folded-corner {
			border-color: #fff $blue transparent transparent;
		}

		.number path,
		.squiggly-line path {
			fill: $blue;
		}
	}

	&::before { // keeps our squares square.
		content: '';
		display: inline-block;
		width: 1px;
		height: 0;
		padding-bottom: 100%;
	}
}

.reward--showing {
	pointer-events: none;
	color: #fff;

	.number {
		transition: all 0.25s;
	}

	.body-cta,
	.body-text {
		display: block;
	}

	.squiggly-line,
	.star-big,
	.star-little,
	.number {
		opacity: 0; // Strange bug on star-little with display: none so using opacity
	}

	a.reward-link {
		color: #fff;
		pointer-events: auto;

		&:hover,
		&:active,
		&:focus {
			text-decoration: none;

			.body-cta {
				text-decoration: underline;
			}
		}
	}
}

.reward--present {
	border: 0.875rem inset $gold;

	.number {
		transition: all 0.25s ease-in;

		path {
			fill: url('#shinygold');
		}
	}

	.star-big {
		animation: spin 4s infinite linear;
	}

	&.reward--red {
		background-color: $red;

		.squiggly-line path,
		.star-big path {
			fill: $dark_red;
		}
	}

	&.reward--green {
		background-color: $green;

		.squiggly-line path,
		.star-big path {
			fill: $dark_green;
		}
	}

	&.reward--blue {
		background-color: $blue;

		.squiggly-line path,
		.star-big path {
			fill: $dark_blue;
		}
	}

	&:hover,
	&:active,
	&:focus {
		.star-big {
			animation: spin 2.75s infinite linear;

			path {
				fill: url('#shinygold');
			}
		}

		.number {
			transform: scale(1.15);

			path {
				fill: #fff;
			}
		}
	}
}
</style>
