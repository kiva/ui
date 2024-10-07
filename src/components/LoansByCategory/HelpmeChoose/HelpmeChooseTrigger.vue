<template>
	<div
		class="tw-w-full tw-flex tw-flex-col tw-bg-primary-inverse tw-rounded tw-p-1 lg:tw-p-2 tw-cursor-pointer"
		@click="$emit('update', variant)"
	>
		<component v-if="imgSource" :is="imgSource" class="tw-hidden lg:tw-block tw-w-3" />
		<!-- eslint-disable-next-line max-len -->
		<h3 class="tw-text-base lg:tw-text-h3 tw-py-0.5 lg:tw-py-0 tw-text-primary-inverse lg:tw-mt-5 tw-text-center lg:tw-text-left">
			{{ title }}
		</h3>
	</div>
</template>

<script>
import { defineAsyncComponent, shallowRef } from 'vue';

const ProgressIcon = shallowRef(defineAsyncComponent(() => import('#src/assets/images/helpmechoose/progress.svg')));
const KivaIcon = shallowRef(defineAsyncComponent(() => import('#src/assets/images/helpmechoose/kiva_mark.svg')));
const AppleIcon = shallowRef(defineAsyncComponent(() => import('#src/assets/images/helpmechoose/apple.svg')));

export default {
	name: 'HelpmeChooseTrigger',
	emits: ['update'],
	props: {
		variant: {
			type: String,
			default: ''
		}
	},
	data() {
		return {
			ProgressIcon,
			KivaIcon,
			AppleIcon
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
					src = this.ProgressIcon;
					break;
				case 'personalized':
					src = this.KivaIcon;
					break;
				case 'researchScore':
					src = this.AppleIcon;
					break;
				case 'popularityScore':
					src = this.KivaIcon;
					break;
				default:
					src = '';
			}
			return src;
		}
	}
};
</script>
