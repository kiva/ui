<template>
	<div class="styleguide-wrap">
		<header class="top-nav">
			<div class="header-row row">
				<router-link class="header-logo header-button" to="/" v-kv-track-event="['TopNav','click-Logo']">
					<kv-icon name="new-kiva-logo" />
				</router-link>
				<a href="/lend" id="lend-header-dropdown" class="header-button"><span>Lend</span></a>
			</div>
		</header>
		<div class="page-content">
			<div class="row">
				<div class="columns small-12">
					<h1>UI Styleguide</h1>
				</div>
			</div>
			<div class="row">
				<div class="columns small-12 large-3">
					<ul>
						<li>
							<router-link to="/styleguide">Intro</router-link>
						</li>
						<li>
							<router-link to="/styleguide/typography">Typography</router-link>
						</li>
						<li>
							<router-link to="/styleguide/copy">Copy</router-link>
						</li>
						<li>
							<router-link to="/styleguide/buttons">Buttons</router-link>
						</li>
						<li>
							<router-link to="/styleguide/colors">Colors</router-link>
						</li>
						<li>
							<router-link to="/styleguide/forms">Forms</router-link>
						</li>
						<li>
							<router-link to="/styleguide/images">Images</router-link>
						</li>
					</ul>
				</div>
				<div class="small-12 large-9 columns">
					<router-view />
				</div>
			</div>
		</div>
	</div>
</template>

<script>
import KvIcon from '@/components/Kv/KvIcon';

export default {
	components: {
		KvIcon,
	},
};
</script>

<style lang="scss">
@import 'settings';

.page-content {
	padding: 1.625rem 0;
}

$top-nav-font-size: 1.125rem;
$header-color: $kiva-green;

.styleguide-wrap .top-nav {
	background-color: $header-color;
	font-size: $top-nav-font-size;
	font-weight: $global-weight-highlight;
}

.styleguide-wrap .elem-desc {
	border-bottom: 1px solid #eee;
	color: #888;
	font-size: 80%;
}
</style>
