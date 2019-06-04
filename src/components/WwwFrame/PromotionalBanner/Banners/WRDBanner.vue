<template>
	<div class="row align-center wrd-banner">
		<router-link
			to="/lend-by-category/world-refugee-day"
			class="banner-link"
			v-kv-track-event="['TopNav','click-Promo','WRD 2019 Banner']"
		>
			<div class="content">
				<span class="call-to-action-text">Help us fund $1 million in loans to refugees</span>
				for World Refugee Day
			</div>
		</router-link>
	</div>
</template>
