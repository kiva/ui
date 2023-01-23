<template>
	<div>
		<div class="tw-mb-2">
			<p>
				We're trying something new! Based on your feedback this year we've built an all-new 'Lending Home'
				that offers the Kiva community a simple way to find and support borrowers they care about. Take a
				quick look at what's new here.
			</p>
		</div>

		<div class="tw-flex tw-gap-3 tw-mb-2">
			<div><icon-heart /></div>
			<div>
				<h3 class="tw-mb-1">
					Personalized for you
				</h3>
				<p>
					Featuring recommended borrowers based on the loans you've supported before
					and suggesting new loans you may love.
				</p>
			</div>
		</div>

		<div class="tw-flex tw-gap-3 tw-mb-2">
			<div><icon-earth /></div>
			<div>
				<h3 class="tw-mb-1">
					New, simple category and country selections
				</h3>
				<p>
					Explore this new and easy way to quickly find and filter loans. Discover borrowers
					by category, gender, and country and try out our most used loan sorts like <i>ending soon</i>
					and <i>almost funded</i>.
				</p>
			</div>
		</div>

		<div class="tw-flex tw-gap-3 tw-mb-2">
			<div><icon-puzzle /></div>
			<div>
				<h3 class="tw-mb-1">
					Spotlights, new groups, and more!
				</h3>
				<p>
					Read about and support our amazing, researched-backed partners and expand your impact
					with loan matching from companies and individuals around the world!
				</p>
			</div>
		</div>
		<div class="tw-flex tw-justify-end">
			<kv-button @click="$emit('close-lightbox')">
				Let's go
			</kv-button>
		</div>
	</div>
</template>
<script>

import IconHeart from '@/assets/icons/inline/Heart.svg';
import IconEarth from '@/assets/icons/inline/Earth.svg';
import IconPuzzle from '@/assets/icons/inline/Puzzle.svg';
import KvButton from '~/@kiva/kv-components/vue/KvButton';

export default {
	name: 'WelcomeLightbox',
	components: {
		KvButton,
		IconHeart,
		IconEarth,
		IconPuzzle,
	},
};
</script>
