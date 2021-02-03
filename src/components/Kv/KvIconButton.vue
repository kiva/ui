<template>
	<kv-button class="icon-btn"
		@click.native.prevent="null"
		:style="cssVars"
	>
		<div class="icon-background">
			<div class="icon-wrapper icon icon--left">
				<slot name="icon-left"></slot>
			</div>
		</div>
		<span><slot></slot></span>
		<div class="icon-wrapper icon icon--right">
			<slot name="icon-right"></slot>
		</div>
	</kv-button>
</template>

<script>
import KvButton from '@/components/Kv/KvButton';

export default {
	components: {
		KvButton,
	},
	props: {
		theme: {
			type: String,
			default: 'ghost',
		},
	},
	computed: {
		cssVars() {
			// TODO add other button themes
			if (this.theme === 'ghost') {
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
	display: flex;
	align-items: center;
	justify-content: space-between;
	flex-wrap: wrap;

	.icon-background {
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

	.icon-wrapper ::v-deep div {
		height: 1rem;
		width: 1rem;
		max-width: 1rem;
		color: var(--kv-left-icon-color);
		fill: var(--kv-left-icon-color);
		stroke: var(--kv-left-icon-color);
		stroke-width: 2px;
	}

	.icon-wrapper.icon--right {
		margin-right: 0.5rem;
	}

	&:hover {
		.icon-wrapper.icon--right ::v-deep svg {
			color: var(--kv-color-hover);
			fill: var(--kv-color-hover);
			stroke: var(--kv-color-hover);
		}

		.icon-wrapper.icon--left ::v-deep svg {
			stroke: var(--kv-left-icon-hover);
		}

		.icon-background {
			background-color: var(--kv-color-hover);
		}
	}

	span {
		text-align: left;
		flex-grow: 2;
	}

	// Active class
	&.active:not(:hover) {
		.icon-background {
			background-color: rgba(var(--kv-left-icon-color-active), 0.3);
		}

		.icon-wrapper.icon--left ::v-deep div {
			color: rgba(var(--kv-left-icon-color-active), 1);
			fill: rgba(var(--kv-left-icon-color-active), 1);
			stroke: rgba(var(--kv-left-icon-color-active), 1);
		}
	}
}

</style>
