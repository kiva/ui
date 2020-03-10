<template>
	<www-page class="autolending" :gray-background="true">
		<div class="title-area">
			<div class="row column">
				<h1>Auto-lending preferences</h1>
				<h2>Make the impact you want even if you’re away from your account for a while</h2>
			</div>
		</div>
		<router-view />
	</www-page>
</template>

<script>
import WwwPage from '@/components/WwwFrame/WwwPage';

export default {
	components: {
		WwwPage,
	},
};
</script>

<style lang="scss">
@import 'settings';

$autolending-font-size: rem-calc(18.8);

.autolending {
	.title-area {
		padding: 1.625rem 0;
		margin-bottom: 2rem;
		background-color: $white;
	}

	.settings-area.obscure {
		opacity: 0.2;
		pointer-events: none;
	}

	label {
		font-size: $autolending-font-size;
	}

	.setting-group {
		position: relative;
		margin: 2rem 0;
		border-bottom: 1px solid $kiva-stroke-gray;

		&.main-settings {
			margin-top: 0;
		}
	}

	.criteria-title {
		margin-bottom: 2rem;
	}

	.setting-column {
		margin-bottom: 1.25rem;
	}

	.advanced-settings-toggle {
		color: $kiva-textlink;
		font-weight: 300;
		margin-bottom: 2rem;
	}

	.save-button-area {
		margin-bottom: 5rem;
	}

	.mobile-footer {
		position: fixed;
		left: 0;
		bottom: 0;
		width: 100%;
		background-color: $white;
		box-shadow: 0 -2px 9px 0 rgba(0, 0, 0, 0.1);

		.save-button-wrapper {
			padding: 0 1rem 0.5rem;

			.button {
				width: 100%;
			}
		}
	}

	.basket-bar {
		display: none;
	}
}
</style>
