<template>
	<div
		class="tw-w-full tw-flex tw-flex-col tw-bg-primary-inverse tw-rounded tw-p-1 lg:tw-p-2 tw-cursor-pointer"
		@click="$emit('click', variant)"
	>
		<img :src="imgSource" class="tw-hidden lg:tw-block tw-w-3">
		<h3 class="tw-text-h3 tw-text-primary-inverse lg:tw-mt-5 tw-text-center lg:tw-text-left">
			{{ title }}
		</h3>
	</div>
</template>

<script>
import progressIcon from '@/assets/images/helpmechoose/progress.svg';
import kivaIcon from '@/assets/images/helpmechoose/kiva_mark.svg';
import appleIcon from '@/assets/images/helpmechoose/apple.svg';

export default {
	name: 'HelpmeChooseTrigger',
	props: {
		variant: {
			type: String,
			default: ''
		}
	},
	data() {
		return {
			progressIcon,
			kivaIcon,
			appleIcon
		};
	},
	computed: {
		title() {
			let str = '';
			if (this.variant === 'amountLeft') {
				str = 'Almost funded';
			}
			if (this.variant === 'personalized') {
				str = 'Recommended for you';
			}
			if (this.variant === 'researchScore') {
				str = 'Research backed impact';
			}
			return str;
		},
		imgSource() {
			let src;
			if (this.variant === 'amountLeft') {
				src = this.progressIcon;
			}
			if (this.variant === 'personalized') {
				src = this.kivaIcon;
			}
			if (this.variant === 'researchScore') {
				src = this.appleIcon;
			}
			return src;
		}
	}
};
</script>
