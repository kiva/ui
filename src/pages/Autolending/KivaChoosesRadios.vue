<template>
	<div class="kiva-chooses-radios">
		<kv-radio
			id="kiva-chooses-true"
			data-test="kiva-chooses-true"
			radio-value="true"
			v-model="kivaChooses"
		>
			Let Kiva select the best loans for me
		</kv-radio>
		<kv-radio
			id="kiva-chooses-false"
			data-test="kiva-chooses-false"
			radio-value="false"
			v-model="kivaChooses"
		>
			I want to set my own auto-lending criteria
		</kv-radio>
	</div>
</template>

<script>
import _get from 'lodash/get';
import { gql } from '@apollo/client';
import KvRadio from '@/components/Kv/KvRadio';

export default {
	name: 'KivaChoosesRadios',
	inject: ['apollo', 'cookieStore'],
	components: {
		KvRadio,
	},
	data() {
		return {
			kivaChooses: 'true',
		};
	},
	apollo: {
		query: gql`query autolendProfileKivaChooses {
			autolending @client {
				id
				currentProfile {
					id
					kivaChooses
				}
			}
		}`,
		preFetch: true,
		result({ data }) {
			this.kivaChooses = _get(data, 'autolending.currentProfile.kivaChooses') ? 'true' : 'false';
		},
	},
	watch: {
		kivaChooses(kivaChooses, previousKivaChooses) {
			if (kivaChooses !== previousKivaChooses) {
				this.apollo.mutate({
					mutation: gql`mutation updateKivaChooses($kivaChooses: Boolean!) {
						autolending @client {
							id
							editProfile(profile: {
								kivaChooses: $kivaChooses
							})
						}
					}`,
					variables: {
						kivaChooses: kivaChooses === 'true'
					},
				});
			}
		}
	},
};
</script>
