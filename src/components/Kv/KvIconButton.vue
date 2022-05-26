<template>
	<kv-button
		class="
		icon-btn
		tw-text-h3"
		:style="cssVars"
	>
		<div class="icon-btn__icon-background">
			<div class="icon-btn__icon-wrapper icon-btn__icon--left">
				<slot name="icon-left"></slot>
			</div>
		</div>
		<span><slot></slot></span>
		<div class="icon-btn__icon-wrapper icon-btn__icon--right">
			<slot name="icon-right"></slot>
		</div>
	</kv-button>
</template>

<script>
import KvButton from '@/components/Kv/KvButton';

/**
 * This component is a wrapper that creates a kv-button with icons on the left and/or right and a unique kvButton style.
 * IT SHOULD ONLY BE USED ON THE THANKS PAGE V2 EXPERIMENT
 * until site-wide button styling is finalized.
 */
export default {
	name: 'KvIconButton',
	components: {
		KvButton,
	},
	props: {
		theme: {
			type: String,
			default: 'default',
		},
	},
	computed: {
		cssVars() {
			// TODO possibly add other themes
			if (this.theme === 'default') {
				return {
					'--kv-left-icon-background': 'rgb(var(--bg-secondary))',
					'--kv-left-icon-color': 'rgb(var(--text-primary))',
					'--kv-left-icon-hover': 'rgb(var(--bg-action))',
					'--kv-color-hover': 'rgb(var(--bg-primary))',
					'--kv-left-icon-color-active': 'var(--bg-action)',

				};
			}
			return {};
		}
	},
};
</script>

<style lang="scss" scoped>
@import 'settings';

.icon-btn {
	// Button styles
	box-shadow: none;
	border-radius: rem-calc(10);
	color: rgb(var(--text-primary));
	background-color: rgb(var(--bg-primary));
	padding: rem-calc(24);
	border-color: rgb(var(--text-primary));

	// Positioning
	display: flex;
	align-items: center;
	justify-content: space-between;
	flex-wrap: wrap;

	&__icon-background {
		background-color: var(--kv-left-icon-background);
		border-radius: 50%;
		height: 2rem;
		width: 2rem;
		max-width: 2rem;
		display: flex;
		align-items: center;
		justify-content: center;
		margin-right: 1rem;
	}

	&__icon-wrapper {
		display: flex;
		align-items: center;
	}

	&__icon--right {
		margin-right: 0.5rem;
	}

	&__icon--left {
		stroke: var(--kv-left-icon-color);
	}

	// Default icon size.
	::v-deep .icon {
		width: 1.25rem;
		height: 1.25rem;
	}

	span {
		text-align: left;
		flex-grow: 2;
	}

	&:hover {
		box-shadow: none;
		background-color: rgb(var(--bg-action-highlight));
		color: #fff;
		border-color: rgb(var(--border-action-highlight));

		.icon-btn__icon--right ::v-deep svg {
			color: var(--kv-color-hover);
		}

		.icon-btn__icon--right ::v-deep svg [stroke] {
			stroke: var(--kv-color-hover);
		}

		.icon-btn__icon--left ::v-deep svg [stroke] {
			stroke: var(--kv-left-icon-hover);
		}

		.icon-btn__icon-background {
			background-color: var(--kv-color-hover);
		}
	}

	// Active class
	&.active:not(:hover) {
		background-color: rgb(var(--bg-primary));
		border: rem-calc(1) solid rgb(var(--bg-primary));
		color: rgb(var(--text-primary));

		.icon-btn__icon-background {
			background-color: rgba(var(--kv-left-icon-color-active), 0.3);
		}

		.icon-btn__icon--left ::v-deep svg {
			color: rgba(var(--kv-left-icon-color-active), 1);
		}

		.icon-btn__icon--left ::v-deep svg [stroke] {
			stroke: rgba(var(--kv-left-icon-color-active), 1);
		}
	}
}

</style>
