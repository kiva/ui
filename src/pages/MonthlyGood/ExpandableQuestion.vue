<template>
	<div class="small-12 columns expandable-faq">
		<div class="row expandable-faq__header"
			@click="open = !open"
		>
			<div class="columns">
				<h4>
					{{ title }}
				</h4>
			</div>
			<div class="shrink columns">
				<kv-icon
					@click="open = !open"
					:class="{ flipped: open }"
					class="toggle-arrow"
					name="small-chevron"
				/>
			</div>
		</div>
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
import KvExpandable from '@/components/Kv/KvExpandable';
import KvIcon from '@/components/Kv/KvIcon';

export default {
	components: {
		KvExpandable,
		KvIcon
	},
	props: {
		title: {
			type: String,
			default: ''
		},
		content: {
			type: String,
			default: ''
		}
	},
	data() {
		return {
			open: false,
		};
	},
};

</script>

<style lang="scss" scoped>
@import 'settings';

.expandable-faq {
	border-top: 1px solid $charcoal;

	.toggle-arrow {
		height: 1rem;
		width: 1.563rem;
		position: relative;
		right: 0;
		top: 45%;
		transform: translate(-50%, -50%);
	}

	&:last-child {
		border-bottom: 1px solid $charcoal;
	}

	.expandable-faq__header {
		padding: 0.35rem 0;
	}

	.expandable-faq__content {
		padding-top: 0.55rem;
	}
}
</style>
