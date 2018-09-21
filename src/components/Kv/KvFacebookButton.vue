<template>
	<kv-button class="facebook">
		<kv-icon class="facebook-box-logo" name="facebook-box-logo" />
		Continue with Facebook
	</kv-button>
</template>

<script>
import KvButton from '@/components/Kv/KvButton';
import KvIcon from '@/components/Kv/KvIcon';

export default {
	components: {
		KvButton,
		KvIcon,
	}
};
</script>

<style lang="scss" scoped>
@import 'settings';

.facebook.button {
	width: 100%;
	box-shadow: 0 2px #2e5193;
	white-space: nowrap;
	background: #4267B2;
	padding-left: 0;
	padding-right: 0;
	font-size: $medium-text-font-size;

	.facebook-box-logo {
		height: rem-calc(22);
		width: rem-calc(22);
		vertical-align: bottom;
		margin-right: 0.25rem;
	}

	&:hover,
	&:focus {
		text-decoration: none;
		background: #2e5193;
	}
}

</style>
