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
							<a href="/styleguide">Intro</a>
						</li>
						<li>
							<a href="/styleguide/typography">Typography</a>
						</li>
						<li>
							<a href="/styleguide/copy">Copy</a>
						</li>
						<li>
							<a href="/styleguide/buttons">Buttons</a>
						</li>
						<li>
							<a href="/styleguide/colors">Colors</a>
						</li>
						<li>
							<a href="/styleguide/forms">Forms</a>
						</li>
						<li>
							<a href="/styleguide/images">Images</a>
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
