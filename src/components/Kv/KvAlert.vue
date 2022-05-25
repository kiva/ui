<template>
	<div>
		<transition name="kvfade">
			<div
				:class="`kv-alert kv-alert--${variant}`"
				v-if="isVisible"
			>
				<div class="kv-alert__message">
					<slot></slot>
				</div>
				<button
					v-if="canClose"
					class="kv-alert__close-btn"
					@click="onClickClose"
				>
					<kv-icon
						class="kv-alert__close-icon"
						name="small-x"
						title="close"
						:from-sprite="true"
					/>
				</button>
			</div>
		</transition>
	</div>
</template>

<script>
import KvIcon from '@/components/Kv/KvIcon';

export default {
	name: 'KvAlert',
	props: {
		/**
		 * Styling variant
		 * `'success', 'caution', 'danger'`
		* */
		variant: {
			type: String,
			default: 'success'
		},
		/**
		 * Allow user to dismiss the message
		* */
		canClose: {
			type: Boolean,
			default: false
		}
	},
	components: {
		KvIcon
	},
	data() {
		return {
			isVisible: true
		};
	},
	methods: {
		onClickClose() {
			this.isVisible = false;
		}
	}
};
</script>

<style lang="scss" scoped>
@import 'settings';

.kv-alert {
	width: 100%;
	border: 1px solid transparent;
	padding: 0.75rem 1rem;
	border-radius: $input-border-radius;
	display: flex;
	align-items: flex-start;

	&--success {
		background-color: lighten($kiva-green, 38%);
		border-color: $kiva-green;
	}

	&--caution {
		background-color: lighten($kiva-alert-yellow, 25%);
		border-color: $kiva-alert-yellow;
	}

	&--danger {
		background-color: lighten($kiva-accent-red, 38%);
		border-color: $kiva-accent-red;
	}

	&__message {
		flex: 1;
	}

	&__close-btn {
		flex-shrink: 0;
		padding: 0.25rem;
		margin-left: 1rem;
	}

	&__close-icon {
		width: 1rem;
		height: 1rem;
	}
}
</style>
