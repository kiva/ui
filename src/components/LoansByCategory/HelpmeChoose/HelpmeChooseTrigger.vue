<template>
	<div
		class="tw-w-full tw-flex tw-flex-col tw-bg-primary-inverse tw-rounded tw-p-1 lg:tw-p-2 tw-cursor-pointer"
		@click="$emit('click', variant)"
	>
		<img :src="imgSource" class="tw-hidden lg:tw-block tw-w-3">
		<!-- eslint-disable-next-line max-len -->
		<h3 class="tw-text-base lg:tw-text-h3 tw-py-0.5 lg:tw-py-0 tw-text-primary-inverse lg:tw-mt-5 tw-text-center lg:tw-text-left">
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
			switch (this.variant) {
				case 'amountLeft':
					str = 'Almost funded';
					break;
				case 'personalized':
					str = 'Recommended for you';
					break;
				case 'researchScore':
					str = 'Research backed impact';
					break;
				case 'popularityScore':
					str = 'Popular loans';
					break;
				default:
					str = '';
			}
			return str;
		},
		imgSource() {
			let src;
			switch (this.variant) {
				case 'amountLeft':
					src = this.progressIcon;
					break;
				case 'personalized':
					src = this.kivaIcon;
					break;
				case 'researchScore':
					src = this.appleIcon;
					break;
				case 'popularityScore':
					src = this.kivaIcon;
					break;
				default:
					src = '';
			}
			return src;
		}
	}
};
</script>
