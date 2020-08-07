<template>
	<div class="settings-card" :class="{ obscure: disabled }">
		<div class="settings-card__icon-wrapper">
			<!-- @slot Icon of the settings card. Should not be empty. -->
			<slot name="icon"></slot>
		</div>
		<div class="settings-card__content-wrapper">
			<div class="settings-card__title">
				<h3>{{ title }}</h3>
			</div>
			<div class="settings-card__content">
				<!-- @slot Content of the settings card. Should not be empty. -->
				<slot name="content"></slot>
			</div>
		</div>
	</div>
</template>

<script>
/**
 * Settings card component. Can accomodate content of any height.
 * Should be used on a page that does not have a white background color.
 */
export default {
	props: {
		/**
		 * Title of the Settings Card.
		* */
		title: {
			type: String,
			default: ''
		},
		/**
		 * Disables the settings card.
		* */
		disabled: {
			type: Boolean,
			default: false
		},
	},
};
</script>

<style lang="scss" scoped>
@import 'settings';

.obscure {
	opacity: 0.4;
	pointer-events: none;
}

.settings-card {
	background: $white;
	padding: 1.95rem;
	display: flex;

	&__icon-wrapper {
		.icon {
			height: 2rem;
			width: 2rem;
		}
	}

	&__content-wrapper { padding: 0 0 1rem 1rem; }

	&__title {
		margin-bottom: 1rem;

		h3 {
			font-weight: $global-weight-bold;
		}
	}
}
</style>
