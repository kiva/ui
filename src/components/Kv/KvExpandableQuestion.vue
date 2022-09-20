<template>
	<div>
		<button
			class="tw-w-full tw-py-2 tw-flex tw-justify-between"
			@click="toggleFaq"
		>
			<h3 class="tw-text-subhead tw-text-left">
				{{ title }}
			</h3>
			<kv-material-icon
				class="tw-w-4 tw-h-4"
				@click="open = !open"
				:icon="open ? mdiChevronUp : mdiChevronDown"
			/>
		</button>
		<kv-expandable easing="ease-in-out">
			<div v-show="open">
				<div
					class="tw-prose tw-pb-4 tw-pt-2"
					v-html="content"
				>
				</div>
			</div>
		</kv-expandable>
	</div>
</template>

<script>
import {
	mdiChevronDown,
	mdiChevronUp
} from '@mdi/js';
import { paramCase } from 'change-case';

import KvExpandable from '@/components/Kv/KvExpandable';
import KvMaterialIcon from '~/@kiva/kv-components/vue/KvMaterialIcon';

export default {
	name: 'KvExpandableQuestion',
	components: {
		KvExpandable,
		KvMaterialIcon,
	},
	props: {
		/**
		 * Question Title
		* */
		title: {
			type: String,
			default: ''
		},
		/**
		 * Question Content - can accept raw html
		* */
		content: {
			type: String,
			default: ''
		},
		/**
		 * Analytics Category
		* */
		analyticsCategory: {
			type: String,
			default: 'Faq'
		},
		active: {
			type: Boolean,
			default: false,
		}
	},
	watch: {
		active(val) {
			this.open = val;
		}
	},
	data() {
		return {
			open: this.active || false,
			mdiChevronDown,
			mdiChevronUp
		};
	},
	computed: {
		/** Returns title as a url friendly slug */
		titleSlugified() {
			return paramCase(this.title);
		}
	},
	mounted() {
		/** Allows directly linking to the question via a hash equal to slugified title */
		if (this.$route.hash === `#${this.titleSlugified}`) {
			this.open = true;
		}
	},
	methods: {
		toggleFaq() {
			if (!this.open) {
				this.$kvTrackEvent(this.analyticsCategory, 'click-faq-expand', this.title);
			}
			this.open = !this.open;
			this.$emit('toggle', { title: this.title });
		}
	}
};

</script>

<style lang="scss" scoped>
</style>
