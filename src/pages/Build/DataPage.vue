<template>
	<www-page>
		<template #secondary>
			<developer-secondary-menu />
		</template>
		<build-page-wrapper class="tw-prose">
			<h1>Data Snapshots</h1>
			<div class="tw-bg-caution tw-text-black tw-p-3 tw-my-1">
				<strong class="tw-hidden md:tw-inline">Important Note:</strong>
				<!-- eslint-disable-next-line max-len -->
				For now, snapshots are generated intermittently. We'll update this message when the snapshots are back on a regular schedule.
			</div>
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
				<strong class="tw-hidden md:tw-inline">JSON:</strong>
				<a href="http://s3.kiva.org/snapshots/kiva_ds_json.zip">
					http://s3.kiva.org/snapshots/kiva_ds_json.zip
				</a>
				<br>
				<strong class="tw-hidden md:tw-inline">CSV:</strong>
				<a href="http://s3.kiva.org/snapshots/kiva_ds_csv.zip">
					http://s3.kiva.org/snapshots/kiva_ds_csv.zip
				</a>
			</p>
			<h2>Archive Structure</h2>
			<p>
				<!-- eslint-disable-next-line max-len -->
				When you decompress and extract a data snapshot you'll have a collection of documents with the following structure (CSV files will have the .csv file format):
				<kv-code-block :code="fileStructure" />
			</p>
			<h2>File Format</h2>
			<h3>JSON snapshot</h3>
			<p>
				<!-- eslint-disable-next-line max-len -->
				As mentioned, the format of the JSON snapshot is very similar to the API format. The main difference is the loans_lenders mapping file, which maps between the loans and lenders files. The format of the loans_lenders.json might look like this:
				<kv-code-block :code="loanLenders" />
			</p>
			<p>
				<!-- eslint-disable-next-line max-len -->
				Where the loan_id field references the id of the loan and the lender_ids are the ids of the lenders to that loan.
			</p>
			<h3>CSV snapshot</h3>
			<p>
				<!-- eslint-disable-next-line max-len -->
				The CSV snapshot is a direct translation of the JSON snapshot. Fields that are reprented as arrays in the JSON snapshot are translated to comma separated lists. For instance, consider the following record in loans.json:
				<kv-code-block :code="jsonSchema" />
			</p>
			<p>
				<!-- eslint-disable-next-line max-len -->
				In the loans.csv snapshot, this would be split into three separate fields, each having its data separated by a comma and a space:
				<kv-code-block :code="csvSchema" />
			</p>
		</build-page-wrapper>
	</www-page>
</template>

<script>
import DeveloperSecondaryMenu from '#src/components/WwwFrame/Menus/DeveloperSecondaryMenu';
import KvCodeBlock from '#src/components/Kv/KvCodeBlock';
import BuildPageWrapper from '#src/components/Build/BuildPageWrapper';
import WwwPage from '#src/components/WwwFrame/WwwPage';

export default {
	name: 'DataPage',
	components: {
		DeveloperSecondaryMenu,
		KvCodeBlock,
		BuildPageWrapper,
		WwwPage,
	},
	head: {
		title: 'Data Snapshots'
	},
	data() {
		return {
			fileStructure:
`kiva_ds_json/
	lenders.json
	loans.json
	loans_lenders.json`,
			loanLenders:
`{ "loan_id": "558112",
  "lender_ids: ["muc888", "tristan7990", "shivaun4955", "sam44598568", "mike4896",
	"catherine7003", "summer7416", "jim8842", "brett5260", "roger2252", "jolanda1942",
	"anila7468", "elizabeth31676552"] }`,
			jsonSchema:
`{ "borrowers": [ {"name": "Bunsuor", "gender": "male", "pictured": true},
		{"name": "Chamroen", "gender": "male", "pictured": true}]
 }`,
			csvSchema:
`borrower_names,borrower_genders,borrower_pictured
"Bunsuor, Chamroen","male, male","true, true"`
		};
	}
};
</script>
