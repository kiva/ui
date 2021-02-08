<template>
	<kv-button class="icon-btn"
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
				// $platinum: #efefef;
				// $umbreon: #212121;
				// $white: #fff;
				// $dark-blue: #006ed3 or 0,100,211
				return {
					'--kv-left-icon-background': '#efefef',
					'--kv-left-icon-color': '#212121',
					'--kv-left-icon-hover': '#006ed3',
					'--kv-color-hover': '#fff',
					'--kv-left-icon-color-active': '0,110,211',

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
	border: rem-calc(1) solid $umbreon;
	box-shadow: none;
	border-radius: rem-calc(10);
	color: $umbreon;
	background-color: transparent;
	padding: rem-calc(24);
	font-weight: 600;
	@include medium-text();

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

	&__icon-wrapper ::v-deep div {
		display: flex;
		align-items: center;
	}

	&__icon--right {
		margin-right: 0.5rem;
	}

	&__icon--left ::v-deep svg [stroke] {
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
		border-color: $blue;
		background-color: $blue;
		box-shadow: none;
		color: $white;

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
		background-color: $white;
		border: rem-calc(1) solid $white;

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
