<template>
	<span class="toggle">
		<div class="small-1">
			<label class="label-switch switch-primary">
				<input
					type="checkbox"
					class="switch switch-bootstrap status"
					name="status"
					id="status"
					value="1"
					checked="checked"
				>
				<span class="label"></span>
			</label>
		</div>
	</span>
</template>

<script>
export default {
	methods: {
		pillToggled(key) {
			this.$emit('switch-toggled', key);
		}
	},
};
</script>

<style lang="scss" scoped>
@import "settings";

.switch {
	opacity: 0;
	position: absolute;
	z-index: 1;
	width: rem-calc(18);
	height: rem-calc(18);
	cursor: pointer;
}
.switch + .label {
	position: relative;
	display: inline-block;
	margin: 0;
	line-height: rem-calc(20);
	min-height: rem-calc(18);
	min-width: rem-calc(18);
	cursor: pointer;
}
.switch + .label::before {
	cursor: pointer;
	content: "\a0";
	background-color: #FAFAFA;
	border: 1px solid #c8c8c8;
	border-radius: 0;
	display: inline-block;
	height: rem-calc(16);
	line-height: rem-calc(14);
	min-width: rem-calc(16);
	margin-right: 1px;
	position: relative;
	top: -1px;
}

.switch:checked + .label::before {
	display: inline-block;
	content: '\f00c';
	background-color: #F5F8FC;
	border-color: #adb8c0;
}

/* CSS3 on/off switches */
.switch + .label {
	margin: 0 rem-calc(4);
	min-height: rem-calc(24);
}
.switch + .label::before {
	line-height: rem-calc(17);
	height: rem-calc(20);
	overflow: hidden;
	border-radius: rem-calc(12);
	background-color: #F5F5F5;
	border: 1px solid #CCC;
	float: left;
	padding: 0;
	width: rem-calc(52);
	margin-right: 0;
	top: auto;
}
.switch.switch-bootstrap + .label::before {
	content: "";
	border-width: 0;
	background-color: $kiva-stroke-gray;
	color: #F2F2F2;
	width: rem-calc(52);
	height: rem-calc(22);
	line-height: rem-calc(21);
	-webkit-transition: background 0.1s ease;
	-o-transition: background 0.1s ease;
	transition: background 0.1s ease;
}
.switch.switch-bootstrap + .label::after {
	content: '';
	position: absolute;
	top: 2px;
	left: rem-calc(3);
	border-radius: rem-calc(12);
	width: rem-calc(18);
	height: rem-calc(18);
	background-color: $white;
	border: rem-calc(4) solid $white;
	-webkit-transition: left 0.2s ease;
	-o-transition: left 0.2s ease;
	transition: left 0.2s ease;
}

.switch-primary > .switch.switch-bootstrap:checked + .label::before {
	background-color: #9AC892;
}
.switch.switch-bootstrap:checked + .label::after {
	left: rem-calc(32);
	background-color: $white;
	border: rem-calc(4) solid $white;
}

</style>
