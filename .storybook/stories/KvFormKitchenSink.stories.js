import KvCheckbox from '@/components/Kv/KvCheckbox';
import KvDropdownRounded from '@/components/Kv/KvDropdownRounded';
import KvPillToggle from '@/components/Kv/KvPillToggle';
import KvRadio from '@/components/Kv/KvRadio';

export default { title: 'Kv | Form Elements' };

export const KitchenSink = () => ({
	components: {
		KvCheckbox,
		KvDropdownRounded,
		KvPillToggle,
		KvRadio,
	},
	data() {
		return {
			kvCheckboxModel1: true,
			kvCheckboxModel2: false,
			kvCheckboxModel3: false,
			kvDropdownRoundedModel: 'test2',
			kvPillOptions: [
				{
					title: 'Option 1',
					key: 'o1',
					disabled: true
				},
				{
					title: 'Option 2',
					key: 'o2',
				},
				{
					title: 'Option 3',
					key: 'o3',
				},
			],
			kvPillSelected: 'o2',
			kvRadioSelected: 'female',
		}
	},
	template: `
		<section id="section-form">
			<form>
				<fieldset>
					<legend>Example Legend</legend>

					<fieldset style="margin-bottom: 2rem;">
						<kv-pill-toggle
							id="pill"
							:options="kvPillOptions"
							:selected="kvPillSelected"
						/>
					</fieldset>

					<fieldset style="margin-bottom: 2rem;">
						<legend>Gender</legend>
						<kv-radio
							id="gender-radio-both"
							radio-value="both"
							v-model="kvRadioSelected"
							disabled
						>
							Everyone
						</kv-radio>
						<kv-radio
							id="gender-radio-female"
							radio-value="female"
							v-model="kvRadioSelected"
						>
							Women only
						</kv-radio>
						<kv-radio
							id="gender-radio-male"
							radio-value="male"
							v-model="kvRadioSelected"
						>
							Men only
						</kv-radio>
					</fieldset>

					<fieldset style="margin-bottom: 2rem;">
						<legend>KvCheckbox</legend>
						<kv-checkbox
							id="checkbox-1"
							v-model="kvCheckboxModel1"
							disabled
						>
							Option 1
						</kv-checkbox>
						<kv-checkbox
							id="checkbox-2"
							v-model="kvCheckboxModel2"
						>
							Option 2
						</kv-checkbox>
						<kv-checkbox
							id="checkbox-3"
							v-model="kvCheckboxModel3"
						>
							Option 3
						</kv-checkbox>
					</fieldset>

					<fieldset style="margin-bottom: 2rem;">
						<kv-dropdown-rounded v-model="kvDropdownRoundedModel">
							<option value="test">Test</option>
							<option value="test2">Test2</option>
							<option value="test3">Test3</option>
						</kv-dropdown-rounded>
					</fieldset>

				</fieldset>

				<fieldset>
					<label for="example-select">
						Select
						<select
							name="example-select"
							id="example-select"
						>
							<option
								v-for="singleOption in options"
								:key="singleOption"
								:value="singleOption"
							>
								{{ singleOption }}
							</option>
						</select>
					</label>
					<label for="example-multiple-select">
						Multiple Select
						<select
							name="example-multiple-select"
							id="example-multiple-select"
							multiple
						>
							<option
								v-for="singleOption in options"
								:key="singleOption"
								:value="singleOption"
							>
								{{ singleOption }}
							</option>
						</select>
					</label>
				</fieldset>

				<fieldset>
					<label>
						Input Text
						<input
							type="text"
							name="inputText"
							maxlength="40"
						>
					</label>
					<label>
						Input Text Area
						<textarea
							name="inputTextarea"
							rows="4"
						></textarea>
					</label>
				</fieldset>
			</form>
		</section>
	`
});
