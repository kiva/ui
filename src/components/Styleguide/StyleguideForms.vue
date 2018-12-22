<template>
	<section id="section-form">
		<h2>Forms</h2>
		<form>
			<label class="elem-desc">Legend above radio buttons with labels</label>
			<fieldset>
				<legend>Example Legend for Radio Buttons and Checkbox</legend>
				<label>
					<input
						type="radio"
						name="radio-example"
						value="on"
					>
					On
				</label>
				<label>
					<input
						type="radio"
						name="radio-example"
						value="off"
					>
					Off
				</label>
				<label v-for="option in options" :key="option">
					{{ option }}
					<input
						type="checkbox"
					>
				</label>
			</fieldset>
			<label class="elem-desc">Select and Multiple Select</label>
			<fieldset class="small-width">
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
			<label class="elem-desc">Input Text and Textarea</label>
			<fieldset class="small-width">
				<label for="inputText">
					Input Text
					<input
						type="text"
						name="inputText"
						id="inputText"
						maxlength="40"
					>
				</label>
				<label for="inputTextarea">
					Input Text Area
					<textarea
						name="inputTextarea"
						id="inputTextarea"
						rows="4"
					></textarea>
				</label>
			</fieldset>
		</form>
	</section>
</template>

<script>
export default {
	data() {
		return {
			options: [
				'Option A',
				'Option B',
				'Option C',
				'Option D',
			],
		};
	}
};
</script>

<style lang="scss" scoped>
// @import 'settings';

#section-form {
	.small-width {
		width: rem-calc(300);
	}
}
</style>
