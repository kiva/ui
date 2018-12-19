<template>
	<www-page>
		<developer-secondary-menu slot="secondary" />
		<div class="row page-content">
			<div class="small-12 columns">
				<h1>Data Snapshots</h1>
				<p>
					<!-- eslint-disable-next-line max-len -->
					If you want to work with a lot of Kiva's data, making hundreds or thousands of requests to the Kiva API can be overbearing — both for you and your network. As such, we make much of our data available through snapshots which are compressed into a simple singular download. The data is archived nightly so it is most useful for apps that don't require live data, such as data analyses and visuals. However, some applications might find these handy as a way to seed local data sources, supplementing the snapshots with calls to the Kiva API for the most recent data.
				</p>
				<p>
					<!-- eslint-disable-next-line max-len -->
					A data snapshot is composed of three data files, delivered in a single compressed ZIP archive. Data snapshots are available in CSV and JSON formats. For the most part, the format of the JSON snapshots are the same as an API response, with a few exceptions.
				</p>
				<h2>Downloading Snapshots</h2>
				<p>
					<!-- eslint-disable-next-line max-len -->
					The latest data snapshots are available in the format of your choice at the following URLs:
				</p>
				<p>
					<strong class="show-for-medium-up">JSON:</strong>
					http://s3.kiva.org/snapshots/kiva_ds_json.zip<br>
					<strong class="show-for-medium-up">CSV:</strong>
					http://s3.kiva.org/snapshots/kiva_ds_csv.zip
				</p>
				<h2>Archive Structure</h2>
				<p>
					<!-- eslint-disable-next-line max-len -->
					When you decompress and extract a data snapshot you'll have a collection of documents with the following structure:
					<kv-code-block :code='fileStructure' />
				</p>
			</div>
		</div>
	</www-page>
</template>

<script>
import WwwPage from '@/components/WwwFrame/WwwPage';
import DeveloperSecondaryMenu from '@/components/WwwFrame/Menus/DeveloperSecondaryMenu';
import KvCodeBlock from '@/components/Kv/KvCodeBlock';

export default {
	components: {
		WwwPage,
		DeveloperSecondaryMenu,
		KvCodeBlock,
	},
	metaInfo: {
		title: 'Data Snapshots'
	},
	data() {
		return {
			fileStructure:
`kiva_ds_json/
	lenders.json
	loans.json
	loans_lenders.json`
		};
	}
};
</script>

<style lang="scss">

.page-content {
	padding: 1.625rem 0;
}
</style>
