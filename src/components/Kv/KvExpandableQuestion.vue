<template>
	<div class="expandable-faq">
		<button class="expandable-faq__header"
			@click="toggleFaq"
		>
			<h4>{{ title }}</h4>
			<kv-icon
				@click="open = !open"
				:class="{ flipped: open }"
				class="toggle-arrow"
				name="small-chevron"
				:from-sprite="true"
			/>
		</button>
		<kv-expandable easing="ease-in-out">
			<div
				v-show="open"
				class="row expandable-faq__content"
			>
				<div class="small-12 columns">
					<div v-html="content">
					</div>
				</div>
			</div>
		</kv-expandable>
	</div>
</template>

<script>
import { paramCase } from 'change-case';

import KvExpandable from '@/components/Kv/KvExpandable';
import KvIcon from '@/components/Kv/KvIcon';

export default {
	components: {
		KvExpandable,
		KvIcon
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
		}
	},
	data() {
		return {
			open: false,
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
		}
	}
};

</script>

<style lang="scss" scoped>
@import 'settings';

.expandable-faq {
	border-top: 1px solid $charcoal;

	&:first-child {
		border-top: 0;
	}

	.toggle-arrow {
		height: 1rem;
		width: 1.563rem;
		position: absolute;
		right: 0.9375rem;
		top: 0.75rem;
	}

	.flipped {
		transform: rotate(180deg);
	}

	&:last-child {
		border-bottom: 1px solid $charcoal;
	}

	.expandable-faq__header {
		padding: 0.55rem 0.9375rem;
		width: 100%;
		text-align: left;
		position: relative;

		h4 {
			padding-right: 2.65rem;
			line-height: 1.35rem;
			text-transform: inherit;
		}
	}

	.expandable-faq__content {
		padding-top: 0.55rem;
	}
}
</style>
