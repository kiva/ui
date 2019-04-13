<template>
	<section id="section-icons">
		<h1>Icons</h1>
		<div class="social-icons">
			<kv-icon name="amex" />
			<kv-icon name="" />
			<kv-icon name="" />
		</div>
		<div class="sector-icons"></div>
		<div class="credit-card-icons"></div>
		<div class="transaction-icons"></div>
		<div class="uncategorized-icons">
			<kv-icon name="apply-circle" />
		</div>
		<kv-icon name="" />
	</section>
</template>

<script>
import KvIcon from '@/components/Kv/KvIcon';

export default {
	components: {
		KvIcon
	},
};
</script>
